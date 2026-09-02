import { BookOpen } from 'lucide-react';
import { useTranslationStore } from '../store/translationStore';

export function TranslationUnavailable(): JSX.Element {
  const setTranslation = useTranslationStore((state) => state.setTranslation);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <BookOpen className="w-6 h-6 text-gray-400 dark:text-gray-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        EOB is not bundled
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mb-6">
        The Eastern Orthodox Bible is withheld until we have permission to host it.
        Rhema will never substitute KJV text while EOB is selected.
      </p>
      <button
        type="button"
        onClick={() => setTranslation('kjv')}
        className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg
                   text-sm font-medium bg-blue-500 text-white hover:bg-blue-600
                   transition-colors duration-200 focus-visible:outline-none
                   focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                   dark:focus-visible:ring-offset-gray-900"
      >
        Switch back to KJV
      </button>
    </div>
  );
}
