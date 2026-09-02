import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { bibleQueryKeys, bibleService } from '../services/bibleService';
import type { SearchResult } from '../types/bible';
import type { TranslationId } from '../constants/translations';

async function searchVerses(query: string): Promise<SearchResult[]> {
  return bibleService.searchVerses(query);
}

export function useBibleSearch(
  query: string,
  translationId: TranslationId,
): UseQueryResult<SearchResult[], Error> {
  const normalizedQuery = query.trim();

  return useQuery<SearchResult[]>({
    queryKey: bibleQueryKeys.search(translationId, normalizedQuery),
    queryFn: () => searchVerses(normalizedQuery),
    enabled: translationId === 'kjv' && normalizedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
