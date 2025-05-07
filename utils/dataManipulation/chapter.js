/* -- Chapter functions -- */

import blankCard from '@/public/skeletonImgs/blankCard.webp';

/**
 * Get mangaUID from chapterData.
 * Returns -1 if it doesn't exist.
 */
export const getMangaUID = (chapterData) => {
    for (let i = 0; i < chapterData.relationships.length; i++) {
        if (chapterData.relationships[i].type == 'manga') {
            return chapterData.relationships[i].id;
        }
    }
    return -1;
};

/**
 * Get scanlation group name from chapterData.
 * Returns 'No Group' if it doesn't exist.
 */
export const getChapterScansGroup = (chapterData) => {
    for (let i = 0; i < chapterData.relationships.length; i++) {
        if (chapterData.relationships[i].type == 'scanlation_group') {
            return chapterData.relationships[i].attributes.name;
        }
    }
    return 'No Group';
};

/**
 * Get uploader's username from chapterData.
 * Returns -1 if it doesn't exist.
 */
export const getChapterUploader = (chapterData) => {
    for (let i = 0; i < chapterData.relationships.length; i++) {
        if (chapterData.relationships[i].type == 'user') {
            return chapterData.relationships[i].attributes.username;
        }
    }
    return -1;
};

/**
 * Get uploader's UID from chapterData.
 * Returns -1 if it doesn't exist.
 */
export const getChapterUploaderUID = (chapterData) => {
    for (let i = 0; i < chapterData.relationships.length; i++) {
        if (chapterData.relationships[i].type == 'user') {
            return chapterData.relationships[i].id;
        }
    }
    return -1;
};

/**
 * Get cover art URL from chapterData.
 * Returns a blank image if the cover URL is empty.
 */
export const getChapterCoverUrl = (chapterData) => {
    let coverUrl = chapterData.cover_art;
    if (coverUrl == '') {
        return blankCard;
    }
    return coverUrl;
}

/**
 * Get chapter number from chapterData.
 */
export const getChapterNumber = (chapterData) => {
    return chapterData.attributes.chapter;
}

/**
 * Get translated language of the chapter from chapterData.
 */
export const getChapterLang = (chapterData) => {
    return chapterData.attributes.translatedLanguage;
}

/**
 * Get chapter title from chapterData.
 * Returns null if it doesn't have one.
 */
export const getChapterTitle = (chapterData) => {
    return chapterData.attributes.title;
}