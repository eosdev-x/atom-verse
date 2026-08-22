import { useNavigate, useParams } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedPage } from '../components/AnimatedPage';
import { BOOKS_OF_THE_BIBLE } from '../constants/bible';
import { bookFromSlug, bookToSlug, useChapterVersesQuery } from '../utils/db';
import { easing } from '../utils/animations';

const CHAPTER_COUNTS: Record<string, number> = {
  Genesis: 50,
  Exodus: 40,
  Leviticus: 27,
  Numbers: 36,
  Deuteronomy: 34,
  Joshua: 24,
  Judges: 21,
  Ruth: 4,
  '1 Samuel': 31,
  '2 Samuel': 24,
  '1 Kings': 22,
  '2 Kings': 25,
  '1 Chronicles': 29,
  '2 Chronicles': 36,
  Ezra: 10,
  Nehemiah: 13,
  Esther: 10,
  Job: 42,
  Psalms: 150,
  Proverbs: 31,
  Ecclesiastes: 12,
  'Song of Solomon': 8,
  Isaiah: 66,
  Jeremiah: 52,
  Lamentations: 5,
  Ezekiel: 48,
  Daniel: 12,
  Hosea: 14,
  Joel: 3,
  Amos: 9,
  Obadiah: 1,
  Jonah: 4,
  Micah: 7,
  Nahum: 3,
  Habakkuk: 3,
  Zephaniah: 3,
  Haggai: 2,
  Zechariah: 14,
  Malachi: 4,
  Matthew: 28,
  Mark: 16,
  Luke: 24,
  John: 21,
  Acts: 28,
  Romans: 16,
  '1 Corinthians': 16,
  '2 Corinthians': 13,
  Galatians: 6,
  Ephesians: 6,
  Philippians: 4,
  Colossians: 4,
  '1 Thessalonians': 5,
  '2 Thessalonians': 3,
  '1 Timothy': 6,
  '2 Timothy': 4,
  Titus: 3,
  Philemon: 1,
  Hebrews: 13,
  James: 5,
  '1 Peter': 5,
  '2 Peter': 3,
  '1 John': 5,
  '2 John': 1,
  '3 John': 1,
  Jude: 1,
  Revelation: 22,
};

interface ChapterTarget {
  book: string;
  chapter: number;
}

export function ReaderPage(): JSX.Element {
  const { book: bookSlug, chapter: chapterParam } = useParams({ from: '/read/$book/$chapter' });
  const navigate = useNavigate();
  const book = bookFromSlug(bookSlug);
  const chapter = Number.parseInt(chapterParam, 10);
  const chapterQuery = useChapterVersesQuery(book ?? '', chapter);
  const verses = chapterQuery.data ?? [];
  const previousChapter = book ? getAdjacentChapter(book, chapter, 'previous') : null;
  const nextChapter = book ? getAdjacentChapter(book, chapter, 'next') : null;

  const navigateToChapter = (target: ChapterTarget | null): void => {
    if (!target) return;

    navigate({
      to: '/read/$book/$chapter',
      params: { book: bookToSlug(target.book), chapter: String(target.chapter) },
    });
  };

  if (!book || Number.isNaN(chapter)) {
    return (
      <AnimatedPage>
        <PageMessage title="Chapter not found" message="The requested Bible chapter could not be matched." />
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div>
        <div
          className="sticky top-16 z-20 bg-gray-50/95 dark:bg-gray-900/95 backdrop-blur-sm
                     -mx-4 px-4 py-3 mb-6 border-b border-gray-200 dark:border-gray-800
                     flex items-center justify-between"
        >
          <motion.button
            type="button"
            onClick={() => navigateToChapter(previousChapter)}
            disabled={!previousChapter}
            aria-label="Previous chapter"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full
                       text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                       focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1 }}
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <div className="text-center">
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {book} {chapter}
            </h1>
            <motion.button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="text-xs text-gray-400 hover:text-blue-600 dark:hover:text-blue-400
                         transition-colors duration-200 rounded
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                         focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.1 }}
            >
              Change chapter
            </motion.button>
          </div>
          <motion.button
            type="button"
            onClick={() => navigateToChapter(nextChapter)}
            disabled={!nextChapter}
            aria-label="Next chapter"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full
                       text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                       focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.1 }}
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {chapterQuery.isFetching ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : verses.length > 0 ? (
          <>
            <div className="space-y-1" aria-label={`${book} chapter ${chapter}`}>
              {verses.map((verse, index) => (
                <motion.p
                  key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(index * 0.03, 0.4),
                    ease: easing.out,
                  }}
                  className="py-2 px-3 rounded-lg hover:bg-white dark:hover:bg-gray-800
                             transition-colors duration-150 cursor-pointer
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                             focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                  tabIndex={0}
                >
                  <span className="text-xs font-semibold text-gray-400 align-super mr-1.5">
                    {verse.verse}
                  </span>
                  <span className="font-serif text-lg text-gray-800 dark:text-gray-200 leading-relaxed">
                    {verse.text}
                  </span>
                </motion.p>
              ))}
            </div>

            <div className="flex items-center justify-between gap-3 mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
              <motion.button
                type="button"
                onClick={() => navigateToChapter(previousChapter)}
                disabled={!previousChapter}
                className="inline-flex items-center justify-center gap-2 font-medium rounded-lg
                           bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100
                           hover:bg-gray-200 dark:hover:bg-gray-700
                           disabled:opacity-50 disabled:cursor-not-allowed
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                           focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
                           transition-colors duration-200 px-4 py-2 text-sm min-h-[44px]"
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.1 }}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous chapter
              </motion.button>
              <motion.button
                type="button"
                onClick={() => navigateToChapter(nextChapter)}
                disabled={!nextChapter}
                className="inline-flex items-center justify-center gap-2 font-medium rounded-lg
                           bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100
                           hover:bg-gray-200 dark:hover:bg-gray-700
                           disabled:opacity-50 disabled:cursor-not-allowed
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                           focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900
                           transition-colors duration-200 px-4 py-2 text-sm min-h-[44px]"
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.1 }}
              >
                Next chapter
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </>
        ) : (
          <PageMessage title="No verses found" message="This chapter is not available in the local KJV data." />
        )}
      </div>
    </AnimatedPage>
  );
}

function getAdjacentChapter(
  book: string,
  chapter: number,
  direction: 'previous' | 'next',
): ChapterTarget | null {
  const bookIndex = BOOKS_OF_THE_BIBLE.findIndex((candidateBook) => candidateBook === book);

  if (bookIndex < 0) {
    return null;
  }

  if (direction === 'previous') {
    if (chapter > 1) {
      return { book, chapter: chapter - 1 };
    }

    const previousBook = BOOKS_OF_THE_BIBLE[bookIndex - 1];
    return previousBook ? { book: previousBook, chapter: CHAPTER_COUNTS[previousBook] } : null;
  }

  const chapterCount = CHAPTER_COUNTS[book];

  if (chapter < chapterCount) {
    return { book, chapter: chapter + 1 };
  }

  const nextBook = BOOKS_OF_THE_BIBLE[bookIndex + 1];
  return nextBook ? { book: nextBook, chapter: 1 } : null;
}

interface PageMessageProps {
  title: string;
  message: string;
}

function PageMessage({ title, message }: PageMessageProps): JSX.Element {
  return (
    <div className="py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
}
