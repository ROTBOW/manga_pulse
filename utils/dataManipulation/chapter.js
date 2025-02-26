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