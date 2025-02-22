import { getCoverUrl, getENTitle, getMangaUID } from "./dataManipulation";
import Bottleneck from "bottleneck";

// a rate limiter so we don't made the api made at us 😭
const limiter = new Bottleneck({
    minTime: 200, // caps us around 5 req per second
    maxConcurrent: 1 // only 1 req at a time
})

// Function to fetch with rate limiting & retry on 429 (rate limit exceeded)
const limitedFetch = async (url, revalidate=10) => {
    return limiter.schedule(async () => {
        let res = await fetch(url, {
            next: {revalidate: revalidate}
        });

        // Handle Rate Limit (429) and retry
        if (res.status === 429) {
            let retryAfter = res.headers.get("X-RateLimit-Retry-After");
            let waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 5000;
            console.warn(`Rate limit exceeded. Retrying in ${waitTime}ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            return limitedFetch(url);
        }

        return res;
    });
};


// get manga by UID - also gets all addition data
export const getManga = async (UID) => {
    let res = await limitedFetch(`https://api.mangadex.org/manga/${UID}?includes%5B%5D=manga&includes%5B%5D=cover_art&includes%5B%5D=tag&includes%5B%5D=author&includes%5B%5D=artist`)
    if (res.status === 404) {
        console.log('BAD REQUEST MAD - getManga func');
        
        return -1
    }
    let data = await res.json();
    
    return data.data;

}

// gets the vol and chapters of a manga by its UID
export const getMangaChapters = async (UID) => {
    let res = await limitedFetch(`https://api.mangadex.org/manga/${UID}/feed?limit=100&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&includeFutureUpdates=1&order%5BcreatedAt%5D=asc&order%5BupdatedAt%5D=asc&order%5BpublishAt%5D=asc&order%5BreadableAt%5D=asc&order%5Bvolume%5D=asc&order%5Bchapter%5D=asc&includes%5B%5D=scanlation_group`);
    let data = await res.json()
    
    return data.data;
};

// get top 10 popular titles over the last month
//// TO DO - ADD ERROR HANDLING FOR A BAD REQUEST
export const getPopTitles = async () => {
    const lastMonth = new Date();
    lastMonth.setHours(0, 0, 0, 0);
    lastMonth.setDate(lastMonth.getDate());
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const midnightISO = lastMonth.toISOString().split('.')[0];
    
    let res = await limitedFetch(`https://api.mangadex.org/manga?includes[]=cover_art&includes[]=artist&includes[]=author&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&hasAvailableChapters=true&createdAtSince=${encodeURIComponent(midnightISO)}`)
    let data = await res.json()
    
    return data.data

}


// gets the dev's (me!) recommendations
export const getDevRec = async () => {
    let idRes = await limitedFetch('https://api.mangadex.org/list/d23e31f6-4d5f-4650-8113-20e380b3e79d', 3600);
    let idData = await idRes.json();
    idData = idData.data

    let url = 'https://api.mangadex.org/manga?limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includes[]=cover_art';
    for (let i = 0; i < idData.relationships.length; i++) {
        let mangaUID = idData.relationships[i].id;
        url += `&ids[]=${mangaUID}`;
    }

    let res = await limitedFetch(url);
    let data = await res.json();
    data = data.data;
    
    return data
}


// get 30 latest chapters with their cover art and titles
/// Will def need to be optimized in the future but this is the path of least resistance rn
/// This is def not best practice, and I can't do it again, but my God it was painful to get it working and I'm not touching it.
//// TO DO - MAKE THIS REACT TO A USER'S DESIRE FOR FLESH (ie if they wanna see 18+ content or not)
export const getLatestChapters = async () => {
    let res = await limitedFetch('https://api.mangadex.org/chapter?includes[]=scanlation_group&translatedLanguage[]=en&contentRating[]=safe&contentRating[]=suggestive&order[readableAt]=desc&limit=100');
    if (res.status !== 200) {
        throw "Bad request for chapters"
    }

    let data = await res.json();
    data = data.data;
    let uids = new Set();
    let forwardData = [];
    let url = 'https://api.mangadex.org/manga?limit=100&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic&includes[]=cover_art';

    for (let i = 0; i < data.length; i++) {
        let mangaUID = getMangaUID(data[i])
        if (uids.size >= 30) {
            break
        } else if (!uids.has(mangaUID)) {
            url += `&ids[]=${mangaUID}`;
            uids.add(mangaUID);
            forwardData.push(data[i]);
        }

        
    }

    let res2 = await limitedFetch(url);
    let eData = await res2.json();
    
    let extraData = {}; // I wish I could use dict comp here ;-;
    for (let i = 0; i < eData.data.length; i++) {
        extraData[eData.data[i].id] = eData.data[i];
    }
    
    for (let i = 0; i < forwardData.length; i++) {
        let slice = forwardData[i];
        slice.title = getENTitle(extraData[getMangaUID(slice)]);
        slice.cover_art = getCoverUrl(extraData[getMangaUID(slice)]);
    };


    return forwardData;
}