import React from 'react';
import { Bookmark, Share2, BookmarkCheck, Copy } from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';
import toast from 'react-hot-toast';

interface VerseCardProps {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export function VerseCard({ book, chapter, verse, text }: VerseCardProps) {
  const reference = `${book} ${chapter}:${verse}`;
  const { bookmarks, addBookmark, removeBookmark } = useBookmarkStore();
  const isBookmarked = bookmarks.some((b) => b.reference === reference);

  const handleShare = async () => {
    const shareText = `${reference} - ${text}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: reference,
          text: shareText,
        });
        toast.success('Verse shared successfully');
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success('Verse copied to clipboard');
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // User cancelled share
        return;
      }
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast.success('Verse copied to clipboard');
      } catch {
        toast.error('Unable to share or copy verse');
      }
    }
  };

  const toggleBookmark = () => {
    if (isBookmarked) {
      const bookmark = bookmarks.find((b) => b.reference === reference);
      if (bookmark) {
        removeBookmark(bookmark.id);
        toast.success('Bookmark removed');
      }
    } else {
      addBookmark(text, reference);
      toast.success('Verse bookmarked');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 
                    transform hover:scale-102 transition-all duration-200">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
        {reference}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {text}
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={toggleBookmark}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                     transition-colors duration-200"
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-blue-500" />
          ) : (
            <Bookmark className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
        <button
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                     transition-colors duration-200"
          title={navigator.share ? 'Share verse' : 'Copy verse'}
        >
          {navigator.share ? (
            <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <Copy className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>
      </div>
    </div>
  );
}