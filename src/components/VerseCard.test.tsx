import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { VerseCard } from './VerseCard';
import { useBookmarkStore } from '../store/bookmarkStore';

interface LinkMockProps {
  children: ReactNode;
  className?: string;
  params: {
    book: string;
    chapter: string;
  };
}

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, className, params }: LinkMockProps) => (
    <a className={className} href={`/read/${params.book}/${params.chapter}`}>
      {children}
    </a>
  ),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('VerseCard', () => {
  const writeTextMock = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    writeTextMock.mockReset();
    writeTextMock.mockResolvedValue(undefined);
    useBookmarkStore.setState({ bookmarks: [] });
    vi.spyOn(crypto, 'randomUUID').mockReturnValue('bookmark-1' as ReturnType<Crypto['randomUUID']>);
    vi.stubGlobal('navigator', {
      ...window.navigator,
      clipboard: {
        writeText: writeTextMock,
      },
      share: undefined,
    } as unknown as Navigator);
  });

  it('renders the verse reference and text', () => {
    render(<VerseCard book="John" chapter={3} verse={16} text="For God so loved the world" />);

    expect(screen.getByText('John 3:16')).toBeInTheDocument();
    expect(screen.getByText('For God so loved the world')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'John 3:16' })).toHaveAttribute('href', '/read/john/3');
  });

  it('toggles a bookmark', async () => {
    const user = userEvent.setup();
    render(<VerseCard book="John" chapter={3} verse={16} text="For God so loved the world" />);

    await user.click(screen.getByRole('button', { name: 'Add bookmark' }));

    expect(useBookmarkStore.getState().bookmarks).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Remove bookmark' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove bookmark' }));

    expect(useBookmarkStore.getState().bookmarks).toHaveLength(0);
  });

  it('copies the verse when Web Share is unavailable', async () => {
    render(<VerseCard book="John" chapter={3} verse={16} text="For God so loved the world" />);

    fireEvent.click(screen.getByRole('button', { name: 'Copy verse' }));

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledWith(
        'John 3:16 - For God so loved the world',
      );
    });
  });
});
