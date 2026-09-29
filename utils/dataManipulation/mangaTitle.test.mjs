import test from 'node:test';
import assert from 'node:assert/strict';
import { getENTitle } from './mangaTitle.mjs';

test('prefers the English primary title', () => {
    assert.equal(getENTitle({attributes: {
        title: {en: 'Primary title'},
        altTitles: [{en: 'Alternate title'}]
    }}), 'Primary title');
});

test('uses English alternate titles when the primary title is romanized', () => {
    assert.equal(getENTitle({attributes: {
        title: {'ja-ro': 'Ryuu no Mukosagashi'},
        altTitles: [{ja: '竜の婿探し'}, {en: "The Dragon's Husband Hunt"}]
    }}), "The Dragon's Husband Hunt");
});

test('uses an available primary title when there is no English title', () => {
    assert.equal(getENTitle({attributes: {
        title: {'ja-ro': 'Kyo, Watashi wa Pan o Kai ni Iku'},
        altTitles: [{ja: '今日、私はパンを買いに行く'}]
    }}), 'Kyo, Watashi wa Pan o Kai ni Iku');
});

test('handles missing metadata and skips empty titles', () => {
    assert.equal(getENTitle(undefined), 'Untitled manga');
    assert.equal(getENTitle({id: 'unexpanded-relationship'}), 'Untitled manga');
    assert.equal(getENTitle({attributes: {
        title: {en: '   '},
        altTitles: [{en: ''}, {ja: '日本語のタイトル'}]
    }}), '日本語のタイトル');
});
