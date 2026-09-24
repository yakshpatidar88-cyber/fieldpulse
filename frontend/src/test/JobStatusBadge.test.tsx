import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { JobStatusBadge } from '../components/jobs/JobStatusBadge';

describe('JobStatusBadge Component', () => {
  it('renders IN_PROGRESS status correctly with pulse animation', () => {
    const { container } = render(<JobStatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders COMPLETED status badge', () => {
    render(<JobStatusBadge status="COMPLETED" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders CANCELLED status badge', () => {
    render(<JobStatusBadge status="CANCELLED" />);
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });
});
