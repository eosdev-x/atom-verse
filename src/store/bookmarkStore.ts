import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Bookmark {
  id: string;
  verse: string;
  reference: string;
  timestamp: number;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (verse: string, reference: string) => void;
  removeBookmark: (id: string) => void;
  searchBookmarks: (query: string) => Bookmark[];
  getRecentBookmarks: (limit?: number) => Bookmark[];
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (verse, reference) =>
        set((state) => {
          // Check for duplicates
          if (state.bookmarks.some((b) => b.reference === reference)) {
            return state;
          }
          return {
            bookmarks: [
              {
                id: crypto.randomUUID(),
                verse,
                reference,
                timestamp: Date.now(),
              },
              ...state.bookmarks,
            ],
          };
        }),
      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((bookmark) => bookmark.id !== id),
        })),
      searchBookmarks: (query: string) => {
        const state = get();
        const searchTerms = query.toLowerCase().trim().split(/\s+/);
        return state.bookmarks.filter((bookmark) => {
          const content = `${bookmark.reference} ${bookmark.verse}`.toLowerCase();
          return searchTerms.every((term) => content.includes(term));
        });
      },
      getRecentBookmarks: (limit = 10) => {
        const state = get();
        return [...state.bookmarks]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, limit);
      },
    }),
    {
      name: 'bookmark-storage',
      version: 1,
    }
  )
);