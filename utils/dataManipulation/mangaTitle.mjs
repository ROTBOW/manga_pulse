const hasText = (value) => {
    return typeof value === 'string' && value.trim().length > 0;
};

// MangaDex titles are language maps; an English primary title is not guaranteed.
// Reference: https://api.mangadex.org/docs/03-manga/
export const getENTitle = (mangaData) => {
    const attributes = mangaData?.attributes;
    const titles = attributes?.title || {};
    const alternateTitles = Array.isArray(attributes?.altTitles) ? attributes.altTitles : [];

    if (hasText(titles.en)) return titles.en;

    for (const title of alternateTitles) {
        if (hasText(title?.en)) return title.en;
    }

    for (const title of Object.values(titles)) {
        if (hasText(title)) return title;
    }

    for (const titles of alternateTitles) {
        for (const title of Object.values(titles || {})) {
            if (hasText(title)) return title;
        }
    }

    return 'Untitled manga';
};
