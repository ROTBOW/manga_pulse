const COOKIE_NAME = 'readHistory';
const MAX_VALUE_LENGTH = 3800;
const STORAGE_KEY = 'readHistory';
const RETENTION_MS = 3 * 365 * 24 * 60 * 60 * 1000;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const encodeChapterId = (chapterId) => {
    const hex = chapterId.replaceAll('-', '');
    let bytes = '';

    for (let i = 0; i < hex.length; i += 2) {
        bytes += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
    }

    return btoa(bytes).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
};

const decodeChapterId = (encodedId) => {
    const bytes = atob(encodedId.replaceAll('-', '+').replaceAll('_', '/') + '==');
    let hex = '';

    for (let i = 0; i < bytes.length; i++) {
        hex += bytes.charCodeAt(i).toString(16).padStart(2, '0');
    }

    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

// Version 1: newest first, with base64url UUIDs and zero-based pages in base 36.
// Example shape: 1~chapterId.page~chapterId.page (no titles or duplicate IDs).
export const decodeReadHistory = (value) => {
    if (!value || value.length > MAX_VALUE_LENGTH) return [];

    const [version, ...records] = value.split('~');
    if (version !== '1') return [];

    const history = [];
    const seenChapters = new Set();

    for (const record of records) {
        const match = record.match(/^([A-Za-z0-9_-]{22})\.([0-9a-z]+)$/);
        if (!match) continue;

        try {
            const chapterId = decodeChapterId(match[1]);
            const pageIndex = parseInt(match[2], 36);

            if (!Number.isSafeInteger(pageIndex)) continue;
            if (encodeChapterId(chapterId) !== match[1]) continue;
            if (seenChapters.has(chapterId)) continue;

            history.push({chapterId, pageIndex});
            seenChapters.add(chapterId);
        } catch {
            // A damaged record should not discard the rest of the history.
        }
    }

    return history;
};

const readStoredHistory = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const data = JSON.parse(stored);

    // Do not overwrite an unreadable or newer storage format.
    if (data.version !== 2 || !Array.isArray(data.chapters)) {
        throw new Error('Unsupported reading history format.');
    }

    return data.chapters.filter(entry => {
        const savedAt = entry.lastReadAt ?? entry.importedAt;

        return UUID_PATTERN.test(entry.chapterId)
            && (entry.mangaId === null || UUID_PATTERN.test(entry.mangaId))
            && Number.isSafeInteger(entry.pageIndex)
            && entry.pageIndex >= 0
            && Number.isFinite(savedAt)
            && savedAt > Date.now() - RETENTION_MS;
    });
};

const writeStoredHistory = (chapters) => {
    const value = JSON.stringify({version: 2, chapters});
    localStorage.setItem(STORAGE_KEY, value);

    if (localStorage.getItem(STORAGE_KEY) !== value) {
        throw new Error('Reading history was not saved.');
    }
};

const loadHistory = () => {
    const chapters = readStoredHistory();
    let legacyCookie = '';

    try {
        const prefix = `${COOKIE_NAME}=`;
        const cookie = document.cookie.split(';').find(cookie => cookie.trim().startsWith(prefix));
        legacyCookie = cookie ? cookie.trim().slice(prefix.length) : '';
    } catch {
        // Local storage can still work when cookie access is blocked.
    }

    const importedChapters = decodeReadHistory(legacyCookie);

    for (const entry of importedChapters) {
        if (chapters.some(chapter => chapter.chapterId === entry.chapterId)) continue;

        // The old cookie did not record manga IDs or read timestamps.
        chapters.push({
            ...entry,
            mangaId: null,
            lastReadAt: null,
            importedAt: Date.now()
        });
    }

    writeStoredHistory(chapters);

    // Only remove the old cookie after its history has been saved successfully.
    if (importedChapters.length > 0) {
        try {
            document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`;
        } catch {
            // Importing again is safe: existing entries take precedence.
        }
    }

    return chapters;
};

export const getReadHistory = () => {
    if (typeof localStorage === 'undefined') return [];

    try {
        return loadHistory().sort((first, second) => {
            return (second.lastReadAt || 0) - (first.lastReadAt || 0);
        });
    } catch {
        return [];
    }
};

export const getResumePage = (chapterId, requestedPage, pageCount) => {
    const savedChapter = getReadHistory().find(chapter => chapter.chapterId === chapterId.toLowerCase());
    const pageIndex = requestedPage !== null ? Number(requestedPage) : (savedChapter?.pageIndex ?? 0);

    if (!Number.isSafeInteger(pageIndex) || pageIndex < 0) return 0;

    return Math.min(pageIndex, Math.max(0, pageCount - 1));
};

export const saveReadProgress = (chapterId, mangaId, pageIndex) => {
    if (!UUID_PATTERN.test(chapterId) || !UUID_PATTERN.test(mangaId)) return false;
    if (!Number.isSafeInteger(pageIndex) || pageIndex < 0) return false;

    try {
        const normalizedChapterId = chapterId.toLowerCase();
        const chapters = loadHistory().filter(chapter => {
            return chapter.chapterId !== normalizedChapterId;
        });

        chapters.unshift({
            chapterId: normalizedChapterId,
            mangaId: mangaId.toLowerCase(),
            pageIndex,
            lastReadAt: Date.now()
        });

        writeStoredHistory(chapters);
        return true;
    } catch {
        // Unavailable or full storage must not interrupt reading.
        return false;
    }
};

// Derived rather than stored twice, so chapter and manga progress cannot diverge.
export const getReadHistoryByManga = () => {
    const groups = new Map();

    for (const chapter of getReadHistory()) {
        if (!chapter.mangaId) continue;

        if (!groups.has(chapter.mangaId)) {
            groups.set(chapter.mangaId, {
                mangaId: chapter.mangaId,
                lastReadAt: chapter.lastReadAt,
                lastChapterId: chapter.chapterId,
                lastPageIndex: chapter.pageIndex,
                chapters: []
            });
        }

        groups.get(chapter.mangaId).chapters.push(chapter);
    }

    return [...groups.values()];
};

