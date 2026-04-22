import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../frontend/src/App';

describe('App Component', () => {
  it('renders the brand name', () => {
    render(<App />);
    // Check if the brand name "B.Ed Exam Hub" is present
    const brandElement = screen.getByText(/B\.Ed Exam Hub/i);
    expect(brandElement).toBeDefined();
  });
});
