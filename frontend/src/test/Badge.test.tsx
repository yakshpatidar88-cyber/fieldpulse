import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../components/ui/Badge';

describe('Badge Component', () => {
  it('renders default badge text', () => {
    render(<Badge>HEALTHY</Badge>);
    expect(screen.getByText('HEALTHY')).toBeInTheDocument();
  });

  it('renders danger variant for CRITICAL status with pulse dot', () => {
    const { container } = render(
      <Badge variant="danger" dot>
        CRITICAL
      </Badge>
    );
    const badge = screen.getByText('CRITICAL');
    expect(badge).toBeInTheDocument();
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
