

/* -- Chapter functions -- */

// get mangaUID return -1 if it doesn't exist
/// this is for chapter idk if it will need its own file yet
export const getMangaUID = (chapterData) => {
    
    for (let i = 0; i < chapterData.relationships.length; i++) {
        if (chapterData.relationships[i].type == 'manga') {
            return chapterData.relationships[i].id;
        }
    }

    return -1
};

// get scans group from chapter return -1 if it doesn't exist
export const getChapterScansGroup = (chapterData) => {
    for (let i = 0; i < chapterData.relationships.length; i++) {
        if (chapterData.relationships[i].type == 'scanlation_group') {
            return chapterData.relationships[i].attributes.name;
        }
    }

    return 'No Group';
};

/* -- Manga functions -- */

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
        return -1
    }

    return text;
}