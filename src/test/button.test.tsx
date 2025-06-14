import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { describe, it, expect, vi } from 'vitest';

describe('Button', () => {
  it('renders with text and responds to click', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalled();
  });

  it('renders with variant', () => {
    render(<Button variant="destructive">Danger</Button>);
    expect(screen.getByText('Danger')).toBeInTheDocument();
  });
}); 