import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchHoursIndex, fetchHoursOffice } from './hours';

const source = {
  work: 'Service Book',
  translator: 'Isabel Florence Hapgood',
  year: 1922,
  publisher: 'Association Press, New York',
  license: 'Public domain (US)',
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Hours data loading', () => {
  it('loads and validates the office index', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      title: 'Book of Hours',
      description: 'Daily offices',
      source,
      offices: [{ id: 'first-hour', title: 'The First Hour', description: 'Morning prayer' }],
    })));
    vi.stubGlobal('fetch', fetchMock);

    const index = await fetchHoursIndex();

    expect(index.offices[0].id).toBe('first-hour');
    expect(fetchMock).toHaveBeenCalledWith('/data/hours/index.json');
  });

  it('loads an office with role and Psalm metadata', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      id: 'first-hour',
      title: 'The First Hour',
      description: 'Morning prayer',
      source,
      sections: [{
        role: 'reader',
        heading: 'Psalm v.',
        text: 'Ponder my words, O Lord.',
        psalm: { raw: 'Psalm v.', number: 5 },
      }],
    })));
    vi.stubGlobal('fetch', fetchMock);

    const office = await fetchHoursOffice('first-hour');

    expect(office.sections[0].psalm?.number).toBe(5);
    expect(fetchMock).toHaveBeenCalledWith('/data/hours/first-hour.json');
  });

  it('rejects a failed office response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 404 })));

    await expect(fetchHoursOffice('missing')).rejects.toThrow('Failed to load');
  });
});
