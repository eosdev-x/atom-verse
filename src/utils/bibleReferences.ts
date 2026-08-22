import { BOOKS_OF_THE_BIBLE } from '../constants/bible';

export interface ParsedReference {
  book: string;
  chapter: number;
  verse: number;
}

function normalizeReferenceInput(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

function compareBookLengthDescending(firstBook: string, secondBook: string): number {
  return secondBook.length - firstBook.length;
}

const BOOKS_BY_SPECIFICITY = [...BOOKS_OF_THE_BIBLE].sort(compareBookLengthDescending);

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function parseReference(input: string): ParsedReference | null {
  const normalizedInput = normalizeReferenceInput(input);

  for (const candidateBook of BOOKS_BY_SPECIFICITY) {
    const referencePattern = new RegExp(`^${escapeRegExp(candidateBook)}\\s*(\\d+):(\\d+)$`, 'i');
    const match = normalizedInput.match(referencePattern);

    if (!match) {
      continue;
    }

    const chapterNum = Number.parseInt(match[1], 10);
    const verseNum = Number.parseInt(match[2], 10);

    if (Number.isNaN(chapterNum) || Number.isNaN(verseNum)) {
      return null;
    }

    return {
      book: candidateBook,
      chapter: chapterNum,
      verse: verseNum,
    };
  }

  return null;
}

export function parseChapterReference(input: string): Omit<ParsedReference, 'verse'> | null {
  const normalizedInput = normalizeReferenceInput(input);

  for (const candidateBook of BOOKS_BY_SPECIFICITY) {
    const referencePattern = new RegExp(`^${escapeRegExp(candidateBook)}\\s*(\\d+)$`, 'i');
    const match = normalizedInput.match(referencePattern);

    if (!match) {
      continue;
    }

    const chapterNum = Number.parseInt(match[1], 10);

    if (Number.isNaN(chapterNum)) {
      return null;
    }

    return {
      book: candidateBook,
      chapter: chapterNum,
    };
  }

  return null;
}
