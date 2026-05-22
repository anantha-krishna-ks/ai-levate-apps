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
      <div className="mb-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-semibold text-foreground">Similarity Threshold</div>
            <div className="text-xs text-muted-foreground mt-0.5">Show pairs at or above this match score</div>
          </div>
          <div className="flex items-baseline gap-1 rounded-full bg-primary/10 px-3 py-1.5">
            <span className="text-2xl font-bold text-primary tabular-nums leading-none">{threshold}</span>
            <span className="text-xs font-medium text-primary">%</span>
          </div>
        </div>
        <div className="relative pt-2 pb-1">
          {/* Track */}
          <div className="relative h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary/70 to-primary transition-all"
              style={{ width: `${((threshold - 50) / 50) * 100}%` }}
            />
          </div>
          {/* Native range overlay */}
          <input
            type="range"
            min={50}
            max={100}
            value={threshold}
            onChange={e => setThreshold(Number(e.target.value))}
            className="absolute inset-x-0 top-1 w-full h-4 appearance-none bg-transparent cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-background
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary
              [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform
              [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:active:scale-95
              [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full
              [&::-moz-range-thumb]:bg-background [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary
              [&::-moz-range-thumb]:shadow-md"
          />
          {/* Ticks */}
          <div className="flex justify-between mt-3 px-0.5 text-[10px] font-medium text-muted-foreground tabular-nums">
            {[50, 60, 70, 80, 90, 100].map(t => (
              <button
                key={t}
                onClick={() => setThreshold(t)}
                className={`transition-colors hover:text-primary ${threshold === t ? 'text-primary font-semibold' : ''}`}
              >
                {t}%
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground mr-1">Quick presets:</span>
          {[
            { label: 'Loose', value: 60 },
            { label: 'Balanced', value: 75 },
            { label: 'Strict', value: 90 },
          ].map(p => (
            <button
              key={p.value}
              onClick={() => setThreshold(p.value)}
              className={`text-xs px-3 py-1 rounded-full border transition-all ${
                threshold === p.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-foreground hover:border-primary hover:text-primary'
              }`}
            >
              {p.label} · {p.value}%
            </button>
          ))}
        </div>
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
