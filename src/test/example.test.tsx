import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// Example test for a component
describe('Example Component Test', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <div>Test Component</div>
      </BrowserRouter>
    )
    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })
}) 