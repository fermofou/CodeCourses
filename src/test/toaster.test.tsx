import { render, screen } from '@testing-library/react';
import { Toaster } from '@/components/ui/toaster';
import { describe, it, expect } from 'vitest';

describe('Toaster', () => {
  it('renders toaster component', () => {
    render(<Toaster />);
    expect(screen.getByRole('region', { name: 'Notifications (F8)' })).toBeInTheDocument();
  });
}); 