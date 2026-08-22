import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBookmarkStore } from './bookmarkStore';

describe('useBookmarkStore', () => {
  beforeEach(() => {
    let id = 0;
    localStorage.clear();
    useBookmarkStore.setState({ bookmarks: [] });
    vi.spyOn(crypto, 'randomUUID').mockImplementation(() => (
      `bookmark-${id += 1}` as ReturnType<Crypto['randomUUID']>
    ));
  });

  it('adds and removes bookmarks', () => {
    useBookmarkStore.getState().addBookmark('For God so loved the world', 'John 3:16');

    expect(useBookmarkStore.getState().bookmarks).toHaveLength(1);
    expect(useBookmarkStore.getState().bookmarks[0]).toMatchObject({
      id: 'bookmark-1',
      reference: 'John 3:16',
      verse: 'For God so loved the world',
    });

    useBookmarkStore.getState().removeBookmark('bookmark-1');

    expect(useBookmarkStore.getState().bookmarks).toHaveLength(0);
  });

  it('does not add duplicate references', () => {
    useBookmarkStore.getState().addBookmark('Verse text', 'Romans 8:28');
    useBookmarkStore.getState().addBookmark('Verse text again', 'Romans 8:28');

    expect(useBookmarkStore.getState().bookmarks).toHaveLength(1);
  });

  it('searches bookmarks by reference and verse text', () => {
    useBookmarkStore.getState().addBookmark('Charity suffereth long', '1 Corinthians 13:4');
    useBookmarkStore.getState().addBookmark('The Lord is my shepherd', 'Psalms 23:1');

    expect(useBookmarkStore.getState().searchBookmarks('charity')).toHaveLength(1);
    expect(useBookmarkStore.getState().searchBookmarks('psalms shepherd')).toHaveLength(1);
  });
});
