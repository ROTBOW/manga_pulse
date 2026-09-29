import test from 'node:test';
import assert from 'node:assert/strict';
import { findNextChapter, findPreviousChapter } from './chapterNavigation.mjs';

const chapter = (id, number, overrides = {}) => ({
    id,
    attributes: {
        chapter: number,
        volume: '1',
        translatedLanguage: 'en',
        pages: 20,
        ...overrides
    }
});

test('finds the next readable chapter, skipping alternate releases and other languages', () => {
    const current = chapter('current', '1');
    const next = chapter('next', '2.5');
    const feed = [
        current,
        chapter('duplicate', '1'),
        chapter('other-language', '2', {translatedLanguage: 'fr'}),
        chapter('external', '2', {externalUrl: 'https://example.com'}),
        chapter('empty', '2', {pages: 0}),
        chapter('future', '2', {readableAt: '2999-01-01T00:00:00Z'}),
        next
    ];

    assert.equal(findNextChapter(feed, current), next);
    assert.equal(findNextChapter(feed.slice(0, -1), current), null);
});

test('does not guess when the current chapter is absent or final', () => {
    const current = chapter('current', '1');
    assert.equal(findNextChapter([], current), null);
    assert.equal(findNextChapter([current], current), null);
    assert.equal(findNextChapter([chapter('other', '2')], current), null);
});


test('finds the previous readable chapter and skips duplicate releases', () => {
    const previous = chapter('previous', '1');
    const current = chapter('current', '2');
    const feed = [
        previous,
        chapter('external', '1.5', {externalUrl: 'https://example.com'}),
        chapter('other-language', '1.5', {translatedLanguage: 'fr'}),
        chapter('duplicate', '2'),
        current
    ];

    assert.equal(findPreviousChapter(feed, current), previous);
    assert.equal(findPreviousChapter(feed, previous), null);
    assert.equal(findPreviousChapter([], current), null);
});
