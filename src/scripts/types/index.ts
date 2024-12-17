export interface RawVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface ImportStats {
  totalVerses: number;
  successfulImports: number;
  failedImports: number;
  errors: string[];
}

export interface BibleTranslation {
  id: string;
  name: string;
  language: string;
  year: number;
  copyright: string;
  verses: RawVerse[];
}

export interface CrossReference {
  sourceReference: string;
  targetReference: string;
  connectionType: 'parallel' | 'quotation' | 'allusion' | 'thematic';
  confidence: number;
}