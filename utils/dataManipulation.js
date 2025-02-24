/* -- Misc functions -- */

export const timeSince = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 52) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;

    const years = Math.floor(weeks / 52);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
}

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

// get uploader from chapter return -1 if it doesn't exist
export const getChapterUploader = (chapterData) => {
    for (let i = 0; i < chapterData.relationships.length; i++) {
        if (chapterData.relationships[i].type == 'user') {
            return chapterData.relationships[i].attributes.username;
        }
    }

    return -1;
};

// get uploader ID from chapter return -1 if it doesn't exist
export const getChapterUploaderUID = (chapterData) => {
    for (let i = 0; i < chapterData.relationships.length; i++) {
        if (chapterData.relationships[i].type == 'user') {
            return chapterData.relationships[i].id;
        }
    }

    return -1;
};

// get chapter number
export const getChapterNumber = (chapterData) => {
    return chapterData.attributes.chapter;
}

// get chapter translated lang
export const getChapterLang = (chapterData) => {
    return chapterData.attributes.translatedLanguage;
}

// get chapter title or null if it doesn't have one
export const getChapterTitle = (chapterData) => {
    return chapterData.attributes.title;
}



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

// get content rating manga 
export const getContentRating = (mangaData) => {
    return mangaData.attributes.contentRating;
}

// get year manga was published
export const getPubYear = (mangaData) => {
    return mangaData.attributes.year;
}

// get pub status of manga
export const getPubStatus = (mangaData) => {
    return mangaData.attributes.status;
}

// get pub state of manga
export const getPubState = (mangaData) => {
    return mangaData.attributes.state;
}

// get target demographic of manga
export const getDemographic = (mangaData) => {
    return mangaData.attributes.publicationDemographic;
}

// get Author of manga - needs a manga dataslice that has the author included
export const getAuthor = (mangaData) => {
    for (let i = 0; i < mangaData.relationships.length; i++) {
        if (mangaData.relationships[i].type == 'author') {
            return mangaData.relationships[i].attributes.name;
        }
    }

    return -1
}

// get Artist of manga - needs a manga dataslice that has the artist included
export const getArtist = (mangaData) => {
    for (let i = 0; i < mangaData.relationships.length; i++) {
        if (mangaData.relationships[i].type == 'artist') {
            return mangaData.relationships[i].attributes.name;
        }
    }

    return -1
}

// get alt titles for a manga
export const getAltTitles = (mangaData) => {
    return mangaData.attributes.altTitles;
}

// get tags for a manga - need a manga dataslice that has tags included
export const getTags = (mangaData) => {
    let tags = [];

    
    for (let i = 0; i < mangaData.attributes.tags.length; i++) {
        let tag = mangaData.attributes.tags[i];
        
        tags.push({
            id: tag.id,
            name: tag.attributes.name.en,
            group: tag.attributes.group
        })
    }

    return tags;
}