import { beforeEach, describe, expect, it } from 'vitest';
import { useTranslationStore } from './translationStore';

describe('useTranslationStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useTranslationStore.setState({ translationId: 'kjv' });
  });

  it('defaults to the bundled KJV translation', () => {
    expect(useTranslationStore.getState().translationId).toBe('kjv');
  });

  it('selects and persists EOB without adding a verse corpus', () => {
    useTranslationStore.getState().setTranslation('eob');

    expect(useTranslationStore.getState().translationId).toBe('eob');
    expect(localStorage.getItem('rhema-translation')).toContain('"translationId":"eob"');
  });
});
