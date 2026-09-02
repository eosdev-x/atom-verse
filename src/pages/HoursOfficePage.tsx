import { Link, useParams } from '@tanstack/react-router';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { AnimatedPage } from '../components/AnimatedPage';
import { EmptyState } from '../components/EmptyState';
import { useTranslationStore } from '../store/translationStore';
import type { OfficeRole, OfficeSection, PsalmReference } from '../types/hours';
import { useHoursOfficeQuery } from '../utils/hours';

const ROLE_LABELS: Record<OfficeRole, string> = {
  rubric: 'Rubric',
  priest: 'Priest',
  deacon: 'Deacon',
  reader: 'Reader',
  choir: 'Choir',
  people: 'People',
};

export function HoursOfficePage(): JSX.Element {
  const { office: officeId } = useParams({ from: '/hours/$office' });
  const officeQuery = useHoursOfficeQuery(officeId);

  if (officeQuery.isPending) {
    return (
      <AnimatedPage>
        <div className="flex justify-center py-20" aria-label="Loading office">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </AnimatedPage>
    );
  }

  if (officeQuery.isError || !officeQuery.data) {
    return (
      <AnimatedPage>
        <EmptyState
          icon="book"
          title="Office unavailable"
          description="This office could not be loaded. The local Hours file may be missing."
          action={{ label: 'Back to Hours', to: '/hours' }}
        />
      </AnimatedPage>
    );
  }

  const office = officeQuery.data;

  return (
    <AnimatedPage>
      <article>
        <Link
          to="/hours"
          className="inline-flex items-center gap-2 min-h-[44px] text-sm text-gray-600
                     dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400
                     rounded-lg focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-blue-500 focus-visible:ring-offset-2
                     dark:focus-visible:ring-offset-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          All Hours
        </Link>

        <header className="mt-3 mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            Book of Hours
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">{office.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Isabel Florence Hapgood, 1922 · Public domain
          </p>
        </header>

        <div className="space-y-6">
          {office.sections.map((section, index) => (
            <OfficeSectionView key={`${section.role}-${index}`} section={section} />
          ))}
        </div>

        <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          <cite>{office.source.work}</cite>, translated by {office.source.translator},
          {' '}{office.source.publisher}, {office.source.year}. {office.source.license}.
        </footer>
      </article>
    </AnimatedPage>
  );
}

function OfficeSectionView({ section }: { section: OfficeSection }): JSX.Element {
  const psalmReferences = section.psalms ?? (section.psalm ? [section.psalm] : []);
  const isRubric = section.role === 'rubric';

  return (
    <section className={isRubric ? 'border-l-2 border-blue-200 dark:border-blue-900 pl-4' : ''}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${
          isRubric
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-400 dark:text-gray-500'
        }`}>
          {ROLE_LABELS[section.role]}
        </span>
        {psalmReferences.map((reference) => (
          <PsalmLink key={`${reference.raw}-${reference.number}`} reference={reference} />
        ))}
        {section.heading && psalmReferences.length === 0 && (
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{section.heading}</span>
        )}
      </div>
      <p className={isRubric
        ? 'text-sm italic text-gray-600 dark:text-gray-400 leading-relaxed'
        : 'font-serif text-lg text-gray-800 dark:text-gray-200 leading-8 whitespace-pre-line'
      }>
        {section.text}
      </p>
    </section>
  );
}

function PsalmLink({ reference }: { reference: PsalmReference }): JSX.Element {
  const setTranslation = useTranslationStore((state) => state.setTranslation);

  return (
    <Link
      to="/read/$book/$chapter"
      params={{ book: 'psalms', chapter: String(reference.number) }}
      onClick={() => setTranslation('kjv')}
      className="inline-flex items-center min-h-[44px] -my-3 px-2 rounded-md text-sm font-semibold
                 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      title={`${reference.raw} in the bundled KJV`}
    >
      {reference.raw}
    </Link>
  );
}
