import { getCoverUrl, getENTitle } from "./dataManipulation/manga";
import { getMangaUID } from './dataManipulation/chapter';
import Bottleneck from "bottleneck";

/**
 * URL parameter builder - provides easier control over parameters in each URL.
 *
 * @param {string} url The base URL to build upon.
 * @param {object} params An object containing the parameters to add to the URL.
 *                       Each key-value pair will be added as a query parameter.
 *                       If a value is an array, each element of the array will be
 *                       added as a separate parameter with the same name.
 * @returns {string} The complete URL with all parameters appended.
 */
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

/**
 * Rate limiter to prevent overloading the API - limits requests to around 5 per second with only one concurrent request.
 */
const limiter = new Bottleneck({
    minTime: 200, // caps us around 5 req per second
    maxConcurrent: 1 // only 1 req at a time
});

/**
 * Fetches data from a URL with rate limiting and automatic retries on 429 errors.
 * @param {string} url - The URL to fetch data from
 * @param {number} revalidate - Time in seconds for Next.js caching (default: 10)
 * @returns {Promise<Response>} A promise that resolves with the response object
 */
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

/**
 * Get manga details by its unique ID.
 *
 * @param {string} UID The unique identifier for the manga.
 * @returns {object|number} Manga data if found, or -1 if not found.
 */
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


/**
 * Get manga details with limited data by its unique ID.
 * This function retrieves a minimal set of manga information to improve performance.
 * currently not used, may be removed.
 *
 * @param {string} UID The unique identifier for the manga.
 * @returns {Promise<Response>} A promise that resolves with the response object containing the manga data.
 */
export const getMangaLimitedData = async (UID) => {
    let url = `https://api.mangadex.org/manga/${UID}?`;
    let params = {
        'includes[]': ['manga']
    };

    return limitedFetch(urlBuilder(url, params));
}

/**
 * Gets the volume and chapter information for a manga by its UID.
 * @param {string} UID - The unique identifier of the manga.
 * @param {string} order - Sorting order ('asc' or 'desc'). Defaults to 'desc'.
 * @param {string[]} langs - Array of language codes to include. Defaults to [].
 * @param {number} offset - Offset for pagination. Defaults to 0.
 * @returns {Promise<object>} Promise that resolves with the manga chapters data.
 */
export const getMangaChapters = async (UID, order='desc', langs=[], offset=0) => {
    let url = `https://api.mangadex.org/manga/${UID}/feed?`;
    let params = {
        limit: 100,
        offset: offset,
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

/**
 * Gets the top 10 most popular manga titles in the last month.
 * @param {string[]} contentPref - Array of preferred content ratings (e.g., ['safe', 'suggestive']). Defaults to ['safe', 'suggestive'].
 * @returns {Promise<object>} Promise that resolves with the top manga titles data.
 */
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


/**
 * Gets the developer's(me!) recommended manga titles.
 * @returns {Promise<object>} Promise that resolves with the developer's recommendation data.
 */
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


/**
 * Get 30 latest chapters with their cover art and titles.
 * 
 * This function retrieves the 30 most recent manga chapters based on various criteria, including content preferences and languages.
 * It fetches chapter data from the MangaDex API and enriches it with additional information like title and cover URL.
 * 
 * Will def need to be optimized in the future but this is the path of least resistance rn
 * This is def not best practice, and I can't do it again, but my God it was painful to get it working and I'm not touching it.
 * 
 * @param {string[]} contentPref - Array of content rating preferences (e.g., ['safe', 'suggestive'])
 * @param {string[]} langs - Array of language codes to include (e.g., ['en', 'es'])
 * @returns {string} JSON string containing the chapter data
 * 
 */
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

    for (let i = 0; i < Math.min(30, data.length); i++) {
        let mangaUID = getMangaUID(data[i]);
        uids.add(mangaUID);
        forwardData.push(data[i]);
    }

    if (forwardData.length === 0) return JSON.stringify([]);

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


/**
 * Retrieves chapter pages for a specific manga chapter.
 *
 * @param {string} UID The unique identifier of the chapter.
 * @returns {Promise<object>} A promise that resolves with the chapter page data, including URLs for each page.
 */
export const getChapterPages = async (UID) => {
    const res = await limitedFetch(`https://api.mangadex.org/at-home/server/${UID}`);
    return await res.json();
}

/**
 * Fetch chapter details from MangaDex API by Chapter UID.
 * @param {string} UID - Chapter UID to fetch
 * @returns {Promise<object>} JSON response containing chapter data with related manga, scanlation group, and user information
 */
export const getChapter = async (UID) => {
    const url = `https://api.mangadex.org/chapter/${UID}?`
    const params = {
        'includes[]': ['manga', 'scanlation_group', 'user']
    }

    const res = await limitedFetch(urlBuilder(url, params));

    return res.json();
}
