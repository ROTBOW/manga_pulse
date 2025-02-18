


// get cover art return -1 if it doesn't exist
const getCoverFileName = (mangaData) => {
    for (let i = 0; i < mangaData.relationships.length; i++) {
        if (mangaData.relationships[i].type == 'cover_art') {
            return mangaData.relationships[i].attributes.fileName;
        }
    }

    return -1
};


// get cover art url returns "wut" image on bad load
export const getCoverUrl = (mangaData) => {
    let coverFileName = getCoverFileName(mangaData);
    if (coverFileName == -1) {
        return '' // add "wut" image here
    }

    return `https://mangadex.org/covers/${mangaData.id}/${coverFileName}`;
}


// get the en title for a manga
export const getENTitle = (mangaData) => {
    return mangaData.attributes.title.en;
}

// get the Desc for a manga
export const getDesc = (mangaData) => {
    const text = mangaData.attributes.description.en;
    
    if (typeof(text) !== 'string') {
        return 'No Desc - Letter do something!'
    }

    return text;
}