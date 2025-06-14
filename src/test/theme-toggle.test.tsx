import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeToggle } from '@/components/theme-toggle';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/theme-provider', () => ({
  useTheme: () => ({ theme: 'light', setTheme: vi.fn() })
}));

describe('ThemeToggle', () => {
  it('renders the toggle button', () => {
    render(
      <MemoryRouter initialEntries={['/']}> <ThemeToggle /> </MemoryRouter>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Toggle theme')).toBeInTheDocument();
  });
}); 