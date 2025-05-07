/* -- Manga functions -- */

import blankCard from '@/public/skeletonImgs/blankCard.webp';

/**
 * Retrieves the cover file name for a manga.
 * Returns -1 if no cover art is found.
 *
 * @param {object} mangaData The manga data object.
 * @returns {number|string} The cover file name or -1 if not found.
 */
const getCoverFileName = (mangaData) => {
    for (let i = 0; i < mangaData.relationships.length; i++) {
        if (mangaData.relationships[i].type == 'cover_art') {
            return mangaData.relationships[i].attributes.fileName;
        }
    }

    return -1
};

/**
 * Retrieves the cover URL for a manga.
 * Returns a blank image URL if no cover is found or if there's an error loading the cover.
 *
 * @param {object} mangaData The manga data object.
 * @returns {string} The cover URL.
 */
export const getCoverUrl = (mangaData) => {
    let coverFileName = getCoverFileName(mangaData);
    if (coverFileName == -1) {
        return blankCard;
    }

    return `https://mangadex.org/covers/${mangaData.id}/${coverFileName}`;
};

/**
 * Retrieves the English title for a manga.
 *
 * @param {object} mangaData The manga data object.
 * @returns {string} The English title.
 */
export const getENTitle = (mangaData) => {
    return mangaData.attributes.title.en;
};

/**
 * Retrieves the description for a manga.
 * Returns -1 if no description is found.
 *
 * @param {object} mangaData The manga data object.
 * @returns {string|number} The description or -1 if not found.
 */
export const getDesc = (mangaData) => {
    const text = mangaData.attributes.description.en;
    
    if (typeof(text) !== 'string') {
        return -1
    }

    return text;
};

/**
 * Retrieves the content rating for a manga.
 *
 * @param {object} mangaData The manga data object.
 * @returns {string} The content rating.
 */
export const getContentRating = (mangaData) => {
    return mangaData.attributes.contentRating;
};

/**
 * Retrieves the publication year for a manga.
 *
 * @param {object} mangaData The manga data object.
 * @returns {number} The publication year.
 */
export const getPubYear = (mangaData) => {
    return mangaData.attributes.year;
};

/**
 * Retrieves the publication status for a manga.
 *
 * @param {object} mangaData The manga data object.
 * @returns {string} The publication status.
 */
export const getPubStatus = (mangaData) => {
    return mangaData.attributes.status;
};

/**
 * Retrieves the publication state for a manga.
 *
 * @param {object} mangaData The manga data object.
 * @returns {string} The publication state.
 */
export const getPubState = (mangaData) => {
    return mangaData.attributes.state;
};

/**
 * Retrieves the target demographic for a manga.
 *
 * @param {object} mangaData The manga data object.
 * @returns {string} The target demographic.
 */
export const getDemographic = (mangaData) => {
    return mangaData.attributes.publicationDemographic;
};

/**
 * Retrieves the author of a manga.
 * Requires a manga data slice that includes author information.
 * Returns -1 if no author is found.
 *
 * @param {object} mangaData The manga data object.
 * @returns {string|number} The author's name or -1 if not found.
 */
export const getAuthor = (mangaData) => {
    for (let i = 0; i < mangaData.relationships.length; i++) {
        if (mangaData.relationships[i].type == 'author') {
            return mangaData.relationships[i].attributes.name;
        }
    }

    return -1
};

/**
 * Retrieves the artist of a manga.
 * Requires a manga data slice that includes artist information.
 * Returns -1 if no artist is found.
 *
 * @param {object} mangaData The manga data object.
 * @returns {string|number} The artist's name or -1 if not found.
 */
export const getArtist = (mangaData) => {
    for (let i = 0; i < mangaData.relationships.length; i++) {
        if (mangaData.relationships[i].type == 'artist') {
            return mangaData.relationships[i].attributes.name;
        }
    }

    return -1
};

/**
 * Retrieves alternative titles for a manga.
 *
 * @param {object} mangaData The manga data object.
 * @returns {array} An array of alternative title objects.
 */
export const getAltTitles = (mangaData) => {
    return mangaData.attributes.altTitles;
};

/**
 * Retrieves tags for a manga.
 * Requires a manga data slice that includes tag information.
 * Returns an array of tag objects, each containing:
 *   - id: The tag ID
 *   - name: The tag name in English
 *   - group: The tag group
 *
 * @param {object} mangaData The manga data object.
 * @returns {array} An array of tag objects.
 */
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
};

/**
 * Retrieves external links for a manga.
 *
 * @param {object} mangaData The manga data object.
 * @returns {array} An array of link objects.
 */
export const getMangaLinks = (mangaData) => {
    return  mangaData.attributes.links;
};