import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { useTranslationStore } from '../store/translationStore';
import { TranslationUnavailable } from './TranslationUnavailable';

describe('TranslationUnavailable', () => {
  beforeEach(() => {
    useTranslationStore.setState({ translationId: 'eob' });
  });

  it('explains that EOB is withheld and switches back to KJV', async () => {
    const user = userEvent.setup();
    render(<TranslationUnavailable />);

    expect(screen.getByText('EOB is not bundled')).toBeInTheDocument();
    expect(screen.getByText(/until we have permission to host it/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Switch back to KJV' }));

    expect(useTranslationStore.getState().translationId).toBe('kjv');
  });
});
