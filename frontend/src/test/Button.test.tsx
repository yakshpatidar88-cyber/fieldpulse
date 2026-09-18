import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Button } from '../../components/ui/Button';

describe('Button Component', () => {
  it('renders button children with primary styling by default', () => {
    render(<Button>Confirm Dispatch</Button>);
    const button = screen.getByRole('button', { name: /confirm dispatch/i });
    expect(button).toBeInTheDocument();
    expect(button.className).toContain('bg-teal-600');
  });

  it('renders loading spinner when isLoading is true and disables button', () => {
    render(<Button isLoading>Confirm Dispatch</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('applies danger variant styling correctly', () => {
    render(<Button variant="danger">Cancel Job</Button>);
    const button = screen.getByRole('button', { name: /cancel job/i });
    expect(button.className).toContain('bg-rose-600');
  });
});
