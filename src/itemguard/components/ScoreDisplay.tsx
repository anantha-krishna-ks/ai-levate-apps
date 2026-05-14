import { Status } from '../lib/types';

interface ScoreDisplayProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

function getScoreStatus(score: number): Status {
  if (score >= 85) return 'green';
  if (score >= 60) return 'amber';
  return 'red';
}

const colorMap: Record<Status, string> = {
  green: 'ig-text-statusfg-green ig-border-status-green ig-bg-status-green-bg',
  amber: 'ig-text-statusfg-amber ig-border-status-amber ig-bg-status-amber-bg',
  red:   'ig-text-statusfg-red   ig-border-status-red   ig-bg-status-red-bg',
};

const sizeMap = {
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
};

export function ScoreDisplay({ score, size = 'sm' }: ScoreDisplayProps) {
  const status = getScoreStatus(score);
  return (
    <div
      role="img"
      aria-label={`Score ${score} out of 100`}
      className={`ig-score-circle border-2 font-semibold tabular-nums ${colorMap[status]} ${sizeMap[size]}`}
    >
      {score}
    </div>
  );
}
