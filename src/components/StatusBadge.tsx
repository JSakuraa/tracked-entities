import type { EntityStatus } from '../../shared/types';

interface StatusBadgeProps {
  status: EntityStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-badge--${status}`}>{status}</span>;
}
