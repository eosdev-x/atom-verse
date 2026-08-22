import { describe, expect, it } from 'vitest';
import { parseChapterReference, parseReference } from './bibleReferences';

describe('parseReference', () => {
  it('parses a single-word book reference', () => {
    expect(parseReference('John 3:16')).toEqual({
      book: 'John',
      chapter: 3,
      verse: 16,
    });
  });

  it('parses numbered and multi-word books', () => {
    expect(parseReference('1 John 2:3')).toEqual({
      book: '1 John',
      chapter: 2,
      verse: 3,
    });
    expect(parseReference('Song of Solomon 1:1')).toEqual({
      book: 'Song of Solomon',
      chapter: 1,
      verse: 1,
    });
  });

  it('returns null for invalid references', () => {
    expect(parseReference('Unknown 1:1')).toBeNull();
    expect(parseReference('John chapter three')).toBeNull();
  });
});

describe('parseChapterReference', () => {
  it('parses a book and chapter without a verse', () => {
    expect(parseChapterReference('Romans 8')).toEqual({
      book: 'Romans',
      chapter: 8,
    });
  });
});
