// The manga feed is ordered by volume and chapter, ascending.
const findAdjacentChapter = (chapters, currentChapter, direction) => {
    const currentIndex = chapters.findIndex(chapter => chapter.id === currentChapter.id);
    if (currentIndex === -1) return null;

    for (let i = currentIndex + direction; i >= 0 && i < chapters.length; i += direction) {
        const chapter = chapters[i];
        const attributes = chapter.attributes;
        const current = currentChapter.attributes;
        const isSameChapter = attributes.chapter === current.chapter
            && attributes.volume === current.volume;

        if (isSameChapter) continue;
        if (attributes.translatedLanguage !== current.translatedLanguage) continue;
        if (attributes.pages <= 0 || attributes.externalUrl) continue;
        if (attributes.readableAt && new Date(attributes.readableAt).getTime() > Date.now()) continue;

        return chapter;
    }

    return null;
};

export const findNextChapter = (chapters, currentChapter) => {
    return findAdjacentChapter(chapters, currentChapter, 1);
};

export const findPreviousChapter = (chapters, currentChapter) => {
    return findAdjacentChapter(chapters, currentChapter, -1);
};
