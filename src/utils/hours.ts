import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { HoursIndex, HoursOffice, OfficeRole, OfficeSummary } from '../types/hours';

const OFFICE_ROLES = new Set<OfficeRole>([
  'rubric',
  'priest',
  'deacon',
  'reader',
  'choir',
  'people',
]);

export const hoursQueryKeys = {
  all: ['hours'] as const,
  index: () => [...hoursQueryKeys.all, 'index'] as const,
  office: (officeId: string) => [...hoursQueryKeys.all, 'office', officeId] as const,
};

export async function fetchHoursIndex(): Promise<HoursIndex> {
  const payload = await fetchJson('/data/hours/index.json');

  if (!isHoursIndex(payload)) {
    throw new Error('The Hours index has an unexpected format.');
  }

  return payload;
}

export async function fetchHoursOffice(officeId: string): Promise<HoursOffice> {
  const payload = await fetchJson(`/data/hours/${officeId}.json`);

  if (!isHoursOffice(payload)) {
    throw new Error('The requested office has an unexpected format.');
  }

  return payload;
}

export function useHoursIndexQuery(): UseQueryResult<HoursIndex, Error> {
  return useQuery({
    queryKey: hoursQueryKeys.index(),
    queryFn: fetchHoursIndex,
    staleTime: Infinity,
  });
}

export function useHoursOfficeQuery(officeId: string): UseQueryResult<HoursOffice, Error> {
  return useQuery({
    queryKey: hoursQueryKeys.office(officeId),
    queryFn: () => fetchHoursOffice(officeId),
    enabled: officeId.length > 0,
    staleTime: Infinity,
  });
}

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(path);

  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }

  return response.json() as Promise<unknown>;
}

function isHoursIndex(value: unknown): value is HoursIndex {
  return isRecord(value)
    && typeof value.title === 'string'
    && typeof value.description === 'string'
    && isHoursSource(value.source)
    && Array.isArray(value.offices)
    && value.offices.every(isOfficeSummary);
}

function isHoursOffice(value: unknown): value is HoursOffice {
  return isOfficeSummary(value)
    && isHoursSource(value.source)
    && Array.isArray(value.sections)
    && value.sections.every(isOfficeSection);
}

function isHoursSource(value: unknown): boolean {
  return isRecord(value)
    && typeof value.work === 'string'
    && typeof value.translator === 'string'
    && typeof value.year === 'number'
    && typeof value.publisher === 'string'
    && typeof value.license === 'string';
}

function isOfficeSummary(value: unknown): value is OfficeSummary {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.title === 'string'
    && typeof value.description === 'string';
}

function isOfficeSection(value: unknown): boolean {
  return isRecord(value)
    && typeof value.role === 'string'
    && OFFICE_ROLES.has(value.role as OfficeRole)
    && typeof value.text === 'string';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
