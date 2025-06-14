import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders and accepts value', () => {
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText('Type here');
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'Hello' } });
    expect((input as HTMLInputElement).value).toBe('Hello');
  });
}); 