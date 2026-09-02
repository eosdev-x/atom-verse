import { Link } from '@tanstack/react-router';
import { ArrowRight, Clock3, Loader2 } from 'lucide-react';
import { AnimatedPage } from '../components/AnimatedPage';
import { EmptyState } from '../components/EmptyState';
import { useHoursIndexQuery } from '../utils/hours';

export function HoursIndexPage(): JSX.Element {
  const hoursQuery = useHoursIndexQuery();

  if (hoursQuery.isPending) {
    return <LoadingHours />;
  }

  if (hoursQuery.isError || !hoursQuery.data) {
    return (
      <AnimatedPage>
        <EmptyState
          icon="book"
          title="Hours unavailable"
          description="The Book of Hours index could not be loaded from this device."
        />
      </AnimatedPage>
    );
  }

  const index = hoursQuery.data;

  return (
    <AnimatedPage>
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
              <Clock3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{index.title}</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hapgood, 1922 · Public domain</p>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
            {index.description} Rubrics and wording are preserved from the source edition,
            with conservative cleanup of obvious OCR artifacts.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {index.offices.map((office) => (
            <Link
              key={office.id}
              to="/hours/$office"
              params={{ office: office.id }}
              className="group min-h-[44px] rounded-xl border border-gray-200 dark:border-gray-800
                         bg-white dark:bg-gray-800 p-5 transition-colors duration-200
                         hover:border-blue-300 dark:hover:border-blue-700 focus-visible:outline-none
                         focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                         dark:focus-visible:ring-offset-gray-900"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{office.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {office.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 mt-1 text-gray-400 group-hover:text-blue-500" />
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Source: <cite>{index.source.work}</cite>, translated by {index.source.translator},
          {' '}{index.source.publisher}, {index.source.year}. {index.source.license}.
        </p>
      </div>
    </AnimatedPage>
  );
}

function LoadingHours(): JSX.Element {
  return (
    <AnimatedPage>
      <div className="flex justify-center py-20" aria-label="Loading Hours">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    </AnimatedPage>
  );
}
