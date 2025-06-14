import { render, screen } from '@testing-library/react';
import Terms from '@/components/terms';

describe('Terms', () => {
  it('renders the terms title and sections', () => {
    render(<Terms />);
    expect(screen.getByText('Terms and conditions')).toBeInTheDocument();
    expect(screen.getByText(/Acceptance of Terms/)).toBeInTheDocument();
    expect(screen.getByText(/Use of the Platform/)).toBeInTheDocument();
    expect(screen.getByText(/Intellectual Property/)).toBeInTheDocument();
  });
}); 