export type OfficeRole = 'rubric' | 'priest' | 'deacon' | 'reader' | 'choir' | 'people';

export interface HoursSource {
  work: string;
  translator: string;
  year: number;
  publisher: string;
  license: string;
}

export interface PsalmReference {
  raw: string;
  number: number;
}

export interface OfficeSection {
  role: OfficeRole;
  heading?: string;
  text: string;
  psalm?: PsalmReference;
  psalms?: PsalmReference[];
}

export interface OfficeSummary {
  id: string;
  title: string;
  description: string;
}

export interface HoursIndex {
  title: string;
  description: string;
  source: HoursSource;
  offices: OfficeSummary[];
}

export interface HoursOffice extends OfficeSummary {
  source: HoursSource;
  sections: OfficeSection[];
}
