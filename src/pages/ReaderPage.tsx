import { Link, useParams } from '@tanstack/react-router';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { VerseCard } from '../components/VerseCard';
import { AnimatedPage } from '../components/AnimatedPage';
import { bookFromSlug, useChapterVersesQuery } from '../utils/db';

export function ReaderPage(): JSX.Element {
  const { book: bookSlug, chapter: chapterParam } = useParams({ from: '/read/$book/$chapter' });
  const book = bookFromSlug(bookSlug);
  const chapter = Number.parseInt(chapterParam, 10);
  const chapterQuery = useChapterVersesQuery(book ?? '', chapter);
  const verses = chapterQuery.data ?? [];

  if (!book || Number.isNaN(chapter)) {
    return (
      <AnimatedPage>
        <PageMessage title="Chapter not found" message="The requested Bible chapter could not be matched." />
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400
                     hover:text-blue-700 dark:hover:text-blue-300 mb-6
                     min-h-[44px]"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Search
        </Link>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {book} {chapter}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            King James Version
          </p>
        </div>

        {chapterQuery.isFetching ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : verses.length > 0 ? (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {verses.map((verse, index) => (
                <motion.div
                  key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: Math.min(index * 0.03, 0.4),
                    ease: 'easeOut',
                  }}
                >
                  <VerseCard
                    book={verse.book}
                    chapter={verse.chapter}
                    verse={verse.verse}
                    text={verse.text}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <PageMessage title="No verses found" message="This chapter is not available in the local KJV data." />
        )}
      </div>
    </AnimatedPage>
  );
}

interface PageMessageProps {
  title: string;
  message: string;
}

function PageMessage({ title, message }: PageMessageProps): JSX.Element {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        {message}
      </p>
    </div>
  );
}
