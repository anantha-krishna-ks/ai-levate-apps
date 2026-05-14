import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { mockSimilarItems, mockItems } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { ReviewDecision } from '../lib/types';

const decisionLabels: Record<ReviewDecision, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'ig-status-amber' },
  keep_both: { label: 'Keep Both', cls: 'ig-status-green' },
  merge: { label: 'Merge', cls: 'bg-primary text-primary-foreground' },
  retire_a: { label: 'Retire A', cls: 'ig-status-red' },
  retire_b: { label: 'Retire B', cls: 'ig-status-red' },
  manual_review: { label: 'Manual Review', cls: 'ig-status-amber' },
};

export default function DuplicatesReview() {
  const [threshold, setThreshold] = useState(70);
  const filtered = mockSimilarItems.filter(s => s.similarity_score >= threshold);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Duplicates Review" subtitle={`${filtered.length} duplicate pairs above ${threshold}% threshold`} />
      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm text-muted-foreground">Similarity Threshold:</label>
        <input type="range" min={50} max={100} value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="w-48 accent-primary" />
        <span className="text-sm font-semibold">{threshold}%</span>
      </div>
      <div className="space-y-4">
        {filtered.map(pair => {
          const itemA = mockItems.find(i => i.item_id === pair.item_id);
          const itemB = mockItems.find(i => i.item_id === pair.similar_item_id);
          const decision = decisionLabels[pair.review_decision];
          return (
            <div key={pair.id} className="ig-kpi-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold ${pair.similarity_score >= 85 ? 'ig-text-status-red' : pair.similarity_score >= 70 ? 'ig-text-status-amber' : 'text-muted-foreground'}`}>{pair.similarity_score}%</span>
                  <span className="text-xs text-muted-foreground">similarity</span>
                </div>
                <span className={`ig-status-badge ${decision.cls}`}>{decision.label}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="text-xs font-mono font-medium text-primary mb-1">Item A: {pair.item_id}</div>
                  <p className="text-sm">{itemA?.stem.slice(0, 120)}…</p>
                  <p className="text-xs text-muted-foreground mt-1">{itemA?.unit_code} · {itemA?.topic}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="text-xs font-mono font-medium text-primary mb-1">Item B: {pair.similar_item_id}</div>
                  <p className="text-sm">{itemB?.stem.slice(0, 120)}…</p>
                  <p className="text-xs text-muted-foreground mt-1">{itemB?.unit_code} · {itemB?.topic}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3"><span className="font-medium">Reason:</span> {pair.rationale} · Shared LO: {pair.shared_lo}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">Keep Both</Button>
                <Button variant="outline" size="sm">Merge</Button>
                <Button variant="outline" size="sm">Retire A</Button>
                <Button variant="outline" size="sm">Retire B</Button>
                <Button variant="outline" size="sm">Needs Manual Review</Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
