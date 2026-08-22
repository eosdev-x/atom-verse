import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('submits typed queries', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/search by reference/i), 'John 3:16');
    await user.keyboard('{Enter}');

    expect(onSearch).toHaveBeenCalledWith('John 3:16');
  });

  it('shows suggestions and submits the selected suggestion', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/search by reference/i), 'rom');
    await user.click(screen.getByRole('button', { name: 'Romans' }));

    expect(onSearch).toHaveBeenCalledWith('Romans');
  });

  it('clears the query', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/search by reference/i), 'love');
    await user.click(screen.getByRole('button', { name: 'Clear search' }));

    expect(screen.getByPlaceholderText(/search by reference/i)).toHaveValue('');
    expect(onSearch).toHaveBeenCalledWith('');
  });
});
