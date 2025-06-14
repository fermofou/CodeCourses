import { render, screen } from '@testing-library/react';
import Privacy from '@/components/privacy';
import { describe, it, expect } from 'vitest';

describe('Privacy', () => {
  it('renders privacy policy title', () => {
    render(<Privacy />);
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('renders privacy policy content', () => {
    render(<Privacy />);
    expect(screen.getByText('1. Information Collection')).toBeInTheDocument();
    expect(screen.getByText('2. Use of Information')).toBeInTheDocument();
  });
}); 