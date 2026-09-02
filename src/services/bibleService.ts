import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { bibleQueryKeys, db, type BibleVerse } from '../utils/db';
import type { CrossReference, SearchResult } from '../types/bible';
import { parseReference } from '../utils/bibleReferences';
import type { TranslationId } from '../constants/translations';

export { bibleQueryKeys };

export const bibleServiceQueryKeys = {
  all: ['bibleService'] as const,
  search: (translationId: TranslationId, query: string) => (
    bibleQueryKeys.search(translationId, query)
  ),
  crossReferences: (reference: string) => (
    [...bibleServiceQueryKeys.all, 'crossReferences', reference] as const
  ),
};

export const bibleService = {
  async searchVerses(query: string): Promise<SearchResult[]> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return [];
    }

    const reference = parseReference(trimmedQuery);

    if (reference) {
      const verse = await db.getVerse(reference.book, reference.chapter, reference.verse);
      return verse ? [toSearchResult(verse)] : [];
    }

    const verses = await db.searchVerses(trimmedQuery);
    return verses.map(toSearchResult);
  },

  async getChapterVerses(book: string, chapter: number): Promise<SearchResult[]> {
    const verses = await db.getChapterVerses(book, chapter);
    return verses.map(toSearchResult);
  },

  async getCrossReferences(reference: string): Promise<CrossReference[]> {
    void reference;
    return [];
  },
};

export function useSearchVersesQuery(
  translationId: TranslationId,
  query: string,
): UseQueryResult<SearchResult[], Error> {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: bibleServiceQueryKeys.search(translationId, normalizedQuery),
    queryFn: () => bibleService.searchVerses(normalizedQuery),
    enabled: translationId === 'kjv' && normalizedQuery.length > 0,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCrossReferencesQuery(
  reference: string,
): UseQueryResult<CrossReference[], Error> {
  return useQuery({
    queryKey: bibleServiceQueryKeys.crossReferences(reference),
    queryFn: () => bibleService.getCrossReferences(reference),
    enabled: reference.trim().length > 0,
    staleTime: Infinity,
  });
}

function toSearchResult(verse: BibleVerse): SearchResult {
  return {
    book: verse.book,
    chapter: verse.chapter,
    verse: verse.verse,
    text: verse.text,
  };
}
