/* -- Manga functions -- */

import blankCard from '@/public/skeletonImgs/blankCard.webp';

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
        return blankCard;
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

// get links from a manga
export const getMangaLinks = (mangaData) => {
    return  mangaData.attributes.links;
}