import { Status } from '../lib/types';

interface StatusBadgeProps {
  status: Status;
  label?: string;
  size?: 'sm' | 'md';
}

const labels: Record<Status, string> = {
  green: 'Pass',
  amber: 'Needs Review',
  red: 'Fail',
};

export function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const text = label || labels[status];
  const cls = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`ig-status-badge ${cls} ig-status-${status}`}>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${
        status === 'green' ? 'ig-bg-status-green' : status === 'amber' ? 'ig-bg-status-amber' : 'ig-bg-status-red'
      }`} />
      {text}
    </span>
  );
}
