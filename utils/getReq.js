// get manga by UID - also gets all addition data
export const getManga = async (UID) => {
    let res = await fetch(`https://api.mangadex.org/manga/${UID}?includes%5B%5D=manga&includes%5B%5D=cover_art&includes%5B%5D=tag`)
    if (res.status === 404) {
        console.log('BAD REQUEST MAD - getManga func');
        
        return -1
    }
    let data = await res.json();
    console.log(data.data);
    return data.data;
    
}

// get manga's chapters by UID
export const getMangaChapters = async () => {

};

// get top 10 popular titles over the last month
//// TO DO - ADD ERROR HANDLING FOR A BAD REQUEST
export const getPopTitles = async () => {
    const lastMonth = new Date();
    lastMonth.setHours(0, 0, 0, 0);
    lastMonth.setDate(lastMonth.getDate());
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const midnightISO = lastMonth.toISOString().split('.')[0];
    
    let res = await fetch(`https://api.mangadex.org/manga?includes[]=cover_art&includes[]=artist&includes[]=author&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&hasAvailableChapters=true&createdAtSince=${encodeURIComponent(midnightISO)}`)
    let data = await res.json()
    
    return data.data

}


// get 64 latest chapters
//// TO DO - MAKE THIS REACT TO A USERS DESIRE FOR FLESH (ie if they wanna see 18+ content)
export const getLatestChapters = async () => {
    let res = await fetch('https://api.mangadex.org/chapter?includes[]=scanlation_group&translatedLanguage[]=en&contentRating[]=safe&contentRating[]=suggestive&order[readableAt]=desc&limit=64');
    if (res.status !== 200) {
        throw "Bad request for chapters"
    }

    let data = await res.json();
    console.log(data.data);
    return data.data
}