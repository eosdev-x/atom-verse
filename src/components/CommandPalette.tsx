import { useEffect, useCallback, useState } from 'react';
import { Command } from 'cmdk';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Bookmark, Sun, Moon, ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { BOOKS_OF_THE_BIBLE } from '../constants/bible';
import { useBookmarkStore } from '../store/bookmarkStore';
import { useTheme } from '../hooks/useTheme';
import { bookToSlug } from '../utils/db';
import { parseReference } from '../utils/bibleReferences';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps): JSX.Element {
  const navigate = useNavigate();
  const { bookmarks } = useBookmarkStore();
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');

  const handleSelect = useCallback((action: () => void): void => {
    action();
    onOpenChange(false);
    setSearch('');
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => onOpenChange(false)}
            aria-hidden="true"
          />
          <motion.div
            className="fixed inset-0 z-[101] flex items-start justify-center pt-[20vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="w-full max-w-lg mx-4"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <Command
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                shouldFilter={true}
                loop
              >
                <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <Command.Input
                    value={search}
                    onValueChange={setSearch}
                    placeholder="Search books, bookmarks, or commands..."
                    className="w-full px-3 py-3 bg-transparent text-gray-900 dark:text-gray-100
                               placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm"
                    autoFocus
                  />
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono
                                  bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400
                                  rounded border border-gray-200 dark:border-gray-600 shrink-0">
                    Esc
                  </kbd>
                </div>

                <Command.List className="max-h-80 overflow-y-auto p-2">
                  <Command.Empty className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                    No results found.
                  </Command.Empty>

                  <Command.Group heading="Books" className="mb-2">
                    <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Books
                    </div>
                    {BOOKS_OF_THE_BIBLE.filter((book) =>
                      book.toLowerCase().includes(search.toLowerCase())
                    ).slice(0, 8).map((book) => (
                      <Command.Item
                        key={book}
                        value={`book ${book}`}
                        onSelect={() => handleSelect(() => {
                          navigate({ to: '/read/$book/$chapter', params: { book: bookToSlug(book), chapter: '1' } });
                        })}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                                   text-sm text-gray-700 dark:text-gray-300
                                   data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-900/30
                                   data-[selected=true]:text-blue-700 dark:data-[selected=true]:text-blue-300"
                      >
                        <BookOpen className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                        <span>{book}</span>
                        <ArrowRight className="w-3 h-3 ml-auto text-gray-300 dark:text-gray-600" />
                      </Command.Item>
                    ))}
                  </Command.Group>

                  {bookmarks.length > 0 && (
                    <Command.Group heading="Bookmarks" className="mb-2">
                      <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Bookmarks
                      </div>
                      {bookmarks.slice(0, 5).map((bookmark) => (
                        <Command.Item
                          key={bookmark.id}
                          value={`bookmark ${bookmark.reference}`}
                          onSelect={() => handleSelect(() => {
                            const reference = parseReference(bookmark.reference);
                            if (reference) {
                              navigate({
                                to: '/read/$book/$chapter',
                                params: {
                                  book: bookToSlug(reference.book),
                                  chapter: String(reference.chapter),
                                },
                              });
                            }
                          })}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                                     text-sm text-gray-700 dark:text-gray-300
                                     data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-900/30
                                     data-[selected=true]:text-blue-700 dark:data-[selected=true]:text-blue-300"
                        >
                          <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                          <span className="truncate">{bookmark.reference}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  )}

                  <Command.Group heading="Commands">
                    <div className="px-2 py-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                      Commands
                    </div>
                    <Command.Item
                      value="theme toggle dark light"
                      onSelect={() => handleSelect(toggleTheme)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                                 text-sm text-gray-700 dark:text-gray-300
                                 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-900/30
                                 data-[selected=true]:text-blue-700 dark:data-[selected=true]:text-blue-300"
                    >
                      {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                      ) : (
                        <Moon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                      )}
                      <span>Toggle {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                    </Command.Item>
                    <Command.Item
                      value="go to bookmarks"
                      onSelect={() => handleSelect(() => navigate({ to: '/bookmarks' }))}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                                 text-sm text-gray-700 dark:text-gray-300
                                 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-900/30
                                 data-[selected=true]:text-blue-700 dark:data-[selected=true]:text-blue-300"
                    >
                      <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                      <span>Go to Bookmarks</span>
                      <ArrowRight className="w-3 h-3 ml-auto text-gray-300 dark:text-gray-600" />
                    </Command.Item>
                    <Command.Item
                      value="go to about"
                      onSelect={() => handleSelect(() => navigate({ to: '/about' }))}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                                 text-sm text-gray-700 dark:text-gray-300
                                 data-[selected=true]:bg-blue-50 dark:data-[selected=true]:bg-blue-900/30
                                 data-[selected=true]:text-blue-700 dark:data-[selected=true]:text-blue-300"
                    >
                      <ArrowRight className="w-3 h-3 text-gray-400 dark:text-gray-500 shrink-0" />
                      <span>Go to About</span>
                      <ArrowRight className="w-3 h-3 ml-auto text-gray-300 dark:text-gray-600" />
                    </Command.Item>
                  </Command.Group>
                </Command.List>

                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[9px]">↵</kbd> select
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[9px]">↑↓</kbd> navigate
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[9px]">esc</kbd> close
                  </span>
                </div>
              </Command>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
