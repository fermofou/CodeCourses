import { render } from '@testing-library/react';
import LoadingSpinner from '@/components/loading';

describe('LoadingSpinner', () => {
  it('renders the loader', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });
}); 