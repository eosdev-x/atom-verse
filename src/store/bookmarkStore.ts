import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Bookmark {
  id: string;
  verse: string;
  reference: string;
  timestamp: number;
}

interface RemovedBookmark {
  bookmark: Bookmark;
  removedAt: number;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  removedBookmarks: RemovedBookmark[];
  addBookmark: (verse: string, reference: string) => void;
  removeBookmark: (id: string) => void;
  undoRemove: (id: string) => void;
  clearExpiredRemovals: () => void;
  searchBookmarks: (query: string) => Bookmark[];
  getRecentBookmarks: (limit?: number) => Bookmark[];
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      removedBookmarks: [],
      addBookmark: (verse, reference) =>
        set((state) => {
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
      removeBookmark: (id) => {
        get().clearExpiredRemovals();
        set((state) => {
          const bookmark = state.bookmarks.find((b) => b.id === id);
          const newRemoved = bookmark
            ? [{ bookmark, removedAt: Date.now() }, ...state.removedBookmarks].slice(0, 10)
            : state.removedBookmarks;
          return {
            bookmarks: state.bookmarks.filter((b) => b.id !== id),
            removedBookmarks: newRemoved,
          };
        });
      },
      undoRemove: (id) =>
        set((state) => {
          const removed = state.removedBookmarks.find((r) => r.bookmark.id === id);
          if (!removed) return state;
          return {
            bookmarks: [removed.bookmark, ...state.bookmarks],
            removedBookmarks: state.removedBookmarks.filter((r) => r.bookmark.id !== id),
          };
        }),
      clearExpiredRemovals: () =>
        set((state) => ({
          removedBookmarks: state.removedBookmarks.filter(
            (r) => Date.now() - r.removedAt < 5000
          ),
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
