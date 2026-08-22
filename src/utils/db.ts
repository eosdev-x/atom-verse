import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import Fuse, { type FuseOptionKey, type IFuseOptions } from 'fuse.js';
import { BOOKS_OF_THE_BIBLE } from '../constants/bible';
import { parseChapterReference } from './bibleReferences';

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface BibleBookPayload {
  verses: BibleVerse[];
}

interface IndexedBibleVerse extends BibleVerse {
  reference: string;
}

const FUSE_SEARCH_OPTIONS = {
  keys: ['text', 'book', 'reference'],
  threshold: 0.3,
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
} satisfies IFuseOptions<IndexedBibleVerse>;

const FUSE_INDEX_KEYS = FUSE_SEARCH_OPTIONS.keys as FuseOptionKey<IndexedBibleVerse>[];
const FUSE_BUILD_FRAME_BUDGET_MS = 45;
const BIBLE_QUERY_GC_TIME_MS = 1000 * 60 * 60;

class LocalBibleDB {
  private bookCache = new Map<string, Promise<BibleVerse[]>>();

  private allVersesPromise: Promise<IndexedBibleVerse[]> | null = null;

  private fuseIndex: Fuse<IndexedBibleVerse> | null = null;

  async getVerses(book: string): Promise<BibleVerse[]> {
    const canonicalBook = getCanonicalBook(book);

    if (!canonicalBook) {
      return [];
    }

    const cachedBook = this.bookCache.get(canonicalBook);

    if (cachedBook) {
      return cachedBook;
    }

    const bookPromise = fetchBookVerses(canonicalBook).catch((error: unknown) => {
      this.bookCache.delete(canonicalBook);
      throw error;
    });
    this.bookCache.set(canonicalBook, bookPromise);
    return bookPromise;
  }

  async getVerse(book: string, chapter: number, verse: number): Promise<BibleVerse | null> {
    const verses = await this.getVerses(book);
    return verses.find((candidateVerse) => (
      candidateVerse.chapter === chapter && candidateVerse.verse === verse
    )) ?? null;
  }

  async getChapterVerses(book: string, chapter: number): Promise<BibleVerse[]> {
    const verses = await this.getVerses(book);
    return verses.filter((candidateVerse) => candidateVerse.chapter === chapter);
  }

  async getAllVerses(): Promise<IndexedBibleVerse[]> {
    if (!this.allVersesPromise) {
      this.allVersesPromise = Promise.all(VALID_BOOKS.map((book) => this.getVerses(book)))
        .then((books) => books.flat().map(toIndexedVerse));
    }

    return this.allVersesPromise;
  }

  async searchVerses(query: string, limit = 100): Promise<BibleVerse[]> {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return [];
    }

    const chapterReference = parseChapterReference(normalizedQuery);

    if (chapterReference) {
      return this.getChapterVerses(chapterReference.book, chapterReference.chapter);
    }

    const matchingBook = VALID_BOOKS.find((book) => (
      book.toLowerCase() === normalizedQuery.toLowerCase()
    ));

    if (matchingBook) {
      return this.getVerses(matchingBook);
    }

    const fuse = await this.getFuseIndex();
    return fuse.search(normalizedQuery, { limit }).map((result) => result.item);
  }

  private async getFuseIndex(): Promise<Fuse<IndexedBibleVerse>> {
    if (!this.fuseIndex) {
      const allVerses = await this.getAllVerses();
      this.fuseIndex = await buildFuseIndexInChunks(allVerses);
    }

    return this.fuseIndex;
  }
}

export const VALID_BOOKS = [...BOOKS_OF_THE_BIBLE];

export const bibleQueryKeys = {
  all: ['bible'] as const,
  book: (book: string) => [...bibleQueryKeys.all, 'book', book] as const,
  chapter: (book: string, chapter: number) => [...bibleQueryKeys.book(book), 'chapter', chapter] as const,
  search: (query: string) => [...bibleQueryKeys.all, 'search', query] as const,
};

export const db = new LocalBibleDB();

export function useBookVersesQuery(book: string): UseQueryResult<BibleVerse[], Error> {
  return useQuery({
    queryKey: bibleQueryKeys.book(book),
    queryFn: () => db.getVerses(book),
    staleTime: Infinity,
    gcTime: BIBLE_QUERY_GC_TIME_MS,
  });
}

export function useChapterVersesQuery(
  book: string,
  chapter: number,
): UseQueryResult<BibleVerse[], Error> {
  return useQuery({
    queryKey: bibleQueryKeys.chapter(book, chapter),
    queryFn: () => db.getChapterVerses(book, chapter),
    enabled: Boolean(book) && Number.isFinite(chapter),
    staleTime: Infinity,
    gcTime: BIBLE_QUERY_GC_TIME_MS,
  });
}

export function useBibleSearchQuery(query: string): UseQueryResult<BibleVerse[], Error> {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: bibleQueryKeys.search(normalizedQuery),
    queryFn: () => db.searchVerses(normalizedQuery),
    enabled: normalizedQuery.length > 0,
    staleTime: 1000 * 60 * 30,
  });
}

export function bookToSlug(book: string): string {
  return book.toLowerCase().replace(/\s+/g, '-');
}

export function bookFromSlug(slug: string): string | null {
  const normalizedSlug = slug.toLowerCase();
  return VALID_BOOKS.find((book) => bookToSlug(book) === normalizedSlug) ?? null;
}

function getCanonicalBook(book: string): string | null {
  return VALID_BOOKS.find((candidateBook) => (
    candidateBook.toLowerCase() === book.toLowerCase()
  )) ?? bookFromSlug(book);
}

async function fetchBookVerses(book: string): Promise<BibleVerse[]> {
  const response = await fetch(`/data/processed/${bookToSlug(book)}.json`);

  if (!response.ok) {
    throw new Error(`Failed to load verses for ${book}`);
  }

  const data = (await response.json()) as BibleBookPayload;
  return data.verses;
}

function toIndexedVerse(verse: BibleVerse): IndexedBibleVerse {
  return {
    ...verse,
    reference: `${verse.book} ${verse.chapter}:${verse.verse}`,
  };
}

async function buildFuseIndexInChunks(
  allVerses: IndexedBibleVerse[],
): Promise<Fuse<IndexedBibleVerse>> {
  const index = Fuse.createIndex<IndexedBibleVerse>(FUSE_INDEX_KEYS, []);
  let chunkStartedAt = getCurrentTime();

  for (let indexPosition = 0; indexPosition < allVerses.length; indexPosition += 1) {
    index.add(allVerses[indexPosition], indexPosition);

    if (getCurrentTime() - chunkStartedAt >= FUSE_BUILD_FRAME_BUDGET_MS) {
      await yieldToEventLoop();
      chunkStartedAt = getCurrentTime();
    }
  }

  return new Fuse(allVerses, FUSE_SEARCH_OPTIONS, index);
}

function getCurrentTime(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
}

function yieldToEventLoop(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => resolve());
      return;
    }

    setTimeout(resolve, 0);
  });
}
