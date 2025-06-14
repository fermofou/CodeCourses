import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/label';
import { describe, it, expect } from 'vitest';

describe('Label', () => {
  it('renders label with text', () => {
    render(<Label>Username</Label>);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders label with htmlFor attribute', () => {
    render(<Label htmlFor="username">Username</Label>);
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'username');
  });
}); 