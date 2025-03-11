import { getCoverUrl, getENTitle } from "./dataManipulation/manga";
import { getMangaUID } from './dataManipulation/chapter';
import Bottleneck from "bottleneck";

// url param builter - should give easier control of the params in each url
const urlBuilder = (url, params) => {
    if (!url.endsWith('?')) url += '?';

    for (let [k, v] of Object.entries(params)) {

        // If our value is a string or int
        if (!Array.isArray(v) && typeof(v) !== 'object') {
            url += `${k}=${v}&`;
            continue;
        };

        // If we got an array
        if (Array.isArray(v)) {
            for (let item of v) {
                url += `${k}=${item}&`
            }
            continue;
        };

        // Finally it has to be an object
        for (let [innerK, innerV] of Object.entries(v)) {
            url += `${k}[${innerK}]=${innerV}&`
        };
    };

    return url;
};

// a rate limiter so we don't made the api mad at us 😭
const limiter = new Bottleneck({
    minTime: 200, // caps us around 5 req per second
    maxConcurrent: 1 // only 1 req at a time
});

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
    let url = `https://api.mangadex.org/manga/${UID}?`;
    let params = {
        'includes[]': ['manga', 'cover_art', 'tag', 'author', 'artist']
    };

    let res = await limitedFetch(urlBuilder(url, params))
    if (res.status === 404) {
        console.log('BAD REQUEST MAD - getManga func');
        
        return -1
    }
    let data = await res.json();
    
    return data.data;

}

// gets the vol and chapters of a manga by its UID
export const getMangaChapters = async (UID, order='desc', langs=[]) => {
    let url = `https://api.mangadex.org/manga/${UID}/feed?`;
    let params = { // going to also want to include cookie for user prefered lang
        limit: 100,
        includeFutureUpdates: 1,
        'includes[]': ['scanlation_group', 'user'],
        'translatedLanguage[]': langs,
        order: {
            volume: order,
            chapter: order
        },
    }

    return await limitedFetch(urlBuilder(url, params));
};

// get top 10 popular titles over the last month
//// TO DO - ADD ERROR HANDLING FOR A BAD REQUEST
export const getTopTitles = async (contentPref=['safe', 'suggestive']) => {
    const lastMonth = new Date();
    lastMonth.setHours(0, 0, 0, 0);
    lastMonth.setDate(lastMonth.getDate());
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const midnightISO = lastMonth.toISOString().split('.')[0];
    let url = 'https://api.mangadex.org/manga?'
    let params = {
        'includes[]': ['cover_art', 'artist', 'author'],
        order: {
            followedCount: 'desc'
        },
        'contentRating[]': contentPref,
        hasAvailableChapters: 'true',
        createdAtSince: midnightISO
    }
    
    return await limitedFetch(urlBuilder(url, params));
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
export const getLatestChapters = async (contentPref=['safe', 'suggestive'], langs=[]) => { 
    let url1 = 'https://api.mangadex.org/chapter?';
    let params1 = {
        limit: 100,
        order: {readableAt: 'desc'},
        'contentRating[]': contentPref,
        'translatedLanguage[]': langs,
        'includes[]': 'scanlation_group'
    };
    let res = await limitedFetch(urlBuilder(url1, params1));
    if (res.status !== 200) {
        throw "Bad request for chapters"
    }

    let data = await res.json();
    data = data.data;
    let uids = new Set();
    let forwardData = [];
    let url2 = 'https://api.mangadex.org/manga?';

    for (let i = 0; i < data.length; i++) {
        let mangaUID = getMangaUID(data[i])
        if (uids.size >= 30) {
            break
        } else if (!uids.has(mangaUID)) {
            uids.add(mangaUID);
            forwardData.push(data[i]);
        }
    }

    let params2 = {
        limit: 100,
        'contentRating[]': contentPref,
        'includes[]': ['cover_art'],
        'ids[]': [...uids]
    }

    let res2 = await limitedFetch(urlBuilder(url2, params2));
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


    return JSON.stringify(forwardData);
}