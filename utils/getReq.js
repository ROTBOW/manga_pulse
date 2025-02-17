


// get top 10 popular titles
export const getPopTitles = async () => {
    let res = await fetch('https://api.mangadex.org/manga?includes[]=cover_art&includes[]=artist&includes[]=author&order[followedCount]=desc&contentRating[]=safe&contentRating[]=suggestive&hasAvailableChapters=true&createdAtSince=2025-01-18T08%3A00%3A00')
    let data = await res.json()
    console.log(data.data);
    return data.data

}