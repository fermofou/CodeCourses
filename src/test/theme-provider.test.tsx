import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/components/theme-provider';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';

describe('ThemeProvider', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  it('renders children', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
}); 