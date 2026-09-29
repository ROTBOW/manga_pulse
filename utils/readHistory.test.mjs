import test from 'node:test';
import assert from 'node:assert/strict';
import { getReadHistory, getReadHistoryByManga, getResumePage, saveReadProgress } from './readHistory.mjs';

const chapterOne = '12345678-1234-4321-8765-123456789abc';
const chapterTwo = 'abcdefab-1234-4321-8765-123456789abc';
const mangaOne = '00000001-1234-4321-8765-123456789abc';
const mangaTwo = '00000002-1234-4321-8765-123456789abc';

const withStorage = (run) => {
    const values = new Map();
    let cookie = '';
    let blocked = false;

    globalThis.localStorage = {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => {
            if (blocked) throw new Error('Storage full');
            values.set(key, value);
        }
    };
    globalThis.document = {
        get cookie() { return cookie; },
        set cookie(value) { cookie = value; }
    };

    try {
        run({values, block: () => { blocked = true; }});
    } finally {
        delete globalThis.localStorage;
        delete globalThis.document;
    }
};

test('saves page zero and backwards progress without duplicating chapters', () => {
    withStorage(() => {
        assert.equal(saveReadProgress(chapterOne, mangaOne, 0), true);
        saveReadProgress(chapterOne, mangaOne, 20);
        saveReadProgress(chapterOne, mangaOne, 3);

        const history = getReadHistory();
        assert.equal(history.length, 1);
        assert.equal(history[0].pageIndex, 3);
        assert.equal(history[0].mangaId, mangaOne);
        assert.ok(history[0].lastReadAt > 0);
    });
});

test('groups chapters by manga with the most recently read chapter first', () => {
    withStorage(() => {
        saveReadProgress(chapterOne, mangaOne, 4);
        saveReadProgress(chapterTwo, mangaOne, 2);

        let groups = getReadHistoryByManga();
        assert.equal(groups.length, 1);
        assert.equal(groups[0].chapters.length, 2);
        assert.equal(groups[0].lastChapterId, chapterTwo);
        assert.equal(groups[0].lastPageIndex, 2);

        saveReadProgress(chapterTwo, mangaTwo, 5);
        groups = getReadHistoryByManga();
        assert.equal(groups.length, 2);
        assert.equal(groups[0].mangaId, mangaTwo);
    });
});

test('migrates cookies without inventing manga IDs or overwriting newer progress', () => {
    withStorage(() => {
        const bytes = Buffer.from(chapterOne.replaceAll('-', ''), 'hex');
        document.cookie = `readHistory=1~${bytes.toString('base64url')}.a`;

        const imported = getReadHistory()[0];
        assert.equal(imported.pageIndex, 10);
        assert.equal(imported.mangaId, null);
        assert.equal(imported.lastReadAt, null);
        assert.match(document.cookie, /Max-Age=0/);
        assert.deepEqual(getReadHistoryByManga(), []);

        saveReadProgress(chapterOne, mangaOne, 7);
        document.cookie = `readHistory=1~${bytes.toString('base64url')}.a`;
        assert.equal(getReadHistory()[0].pageIndex, 7);
        assert.equal(getReadHistoryByManga()[0].mangaId, mangaOne);
    });
});

test('prunes old records and retains more chapters than the cookie allowed', () => {
    withStorage(({values}) => {
        values.set('readHistory', JSON.stringify({version: 2, chapters: [{
            chapterId: chapterOne,
            mangaId: mangaOne,
            pageIndex: 1,
            lastReadAt: Date.now() - 4 * 365 * 24 * 60 * 60 * 1000
        }]}));
        assert.deepEqual(getReadHistory(), []);

        for (let i = 0; i < 200; i++) {
            saveReadProgress(`${i.toString(16).padStart(8, '0')}-1234-4321-8765-123456789abc`, mangaOne, i);
        }
        assert.equal(getReadHistory().length, 200);
    });
});

test('invalid input and failed writes preserve existing data and the migration cookie', () => {
    withStorage(({values, block}) => {
        assert.equal(saveReadProgress(chapterOne, mangaOne, -1), false);
        assert.equal(saveReadProgress(chapterOne, 'invalid', 0), false);
        values.set('readHistory', 'damaged');
        assert.equal(saveReadProgress(chapterOne, mangaOne, 0), false);
        assert.equal(values.get('readHistory'), 'damaged');
        values.delete('readHistory');

        const encodedId = Buffer.from(chapterOne.replaceAll('-', ''), 'hex').toString('base64url');
        const cookie = `readHistory=1~${encodedId}.0`;
        document.cookie = cookie;
        block();
        assert.equal(saveReadProgress(chapterOne, mangaOne, 0), false);
        assert.equal(document.cookie, cookie);
    });
});


test('resumes saved progress while explicit page links take priority', () => {
    withStorage(() => {
        saveReadProgress(chapterOne, mangaOne, 12);
        assert.equal(getResumePage(chapterOne, null, 30), 12);
        assert.equal(getResumePage(chapterOne, '0', 30), 0);
        assert.equal(getResumePage(chapterOne, '5', 30), 5);
        assert.equal(getResumePage(chapterOne, null, 8), 7);
        assert.equal(getResumePage(chapterTwo, null, 30), 0);
        assert.equal(getResumePage(chapterOne, 'invalid', 30), 0);
        assert.equal(getResumePage(chapterOne, '-1', 30), 0);
    });
});
