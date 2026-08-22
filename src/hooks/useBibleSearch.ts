import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { bibleQueryKeys, bibleService } from '../services/bibleService';
import type { SearchResult } from '../types/bible';

async function searchVerses(query: string): Promise<SearchResult[]> {
  return bibleService.searchVerses(query);
}

export function useBibleSearch(query: string): UseQueryResult<SearchResult[], Error> {
  const normalizedQuery = query.trim();

  return useQuery<SearchResult[]>({
    queryKey: bibleQueryKeys.search(normalizedQuery),
    queryFn: () => searchVerses(normalizedQuery),
    enabled: normalizedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
