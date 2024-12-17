import React, { useState } from 'react';
import { X, Search, Trash2 } from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';

interface BookmarksPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookmarksPanel({ isOpen, onClose }: BookmarksPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { bookmarks, removeBookmark, searchBookmarks } = useBookmarkStore();

  const filteredBookmarks = searchQuery
    ? searchBookmarks(searchQuery)
    : bookmarks;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-lg 
                    flex flex-col z-50 transform transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-semibold dark:text-white">Bookmarked Verses</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          title="Close bookmarks"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="p-4 border-b dark:border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 
                           w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 
                     bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredBookmarks.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            {searchQuery ? 'No matching bookmarks found' : 'No bookmarks yet'}
          </div>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 relative group"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {bookmark.reference}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                {bookmark.verse}
              </p>
              <button
                onClick={() => removeBookmark(bookmark.id)}
                className="absolute top-2 right-2 p-2 rounded-full
                         bg-gray-100 dark:bg-gray-600 opacity-0 group-hover:opacity-100
                         hover:bg-red-100 dark:hover:bg-red-900
                         transition-opacity duration-200"
                title="Remove bookmark"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
