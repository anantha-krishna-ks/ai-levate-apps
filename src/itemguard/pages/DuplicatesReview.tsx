import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { mockSimilarItems, mockItems } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { ReviewDecision } from '../lib/types';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal } from 'lucide-react';

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
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Similarity Threshold</div>
              <div className="text-xs text-slate-500 mt-0.5">Show pairs at or above this match score</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: 'Loose', value: 60 },
              { label: 'Balanced', value: 75 },
              { label: 'Strict', value: 90 },
            ].map(p => (
              <button
                key={p.value}
                onClick={() => setThreshold(p.value)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  threshold === p.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-200 text-slate-600 hover:border-blue-600 hover:text-blue-600'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative pt-10 pb-2">
          {/* Floating value bubble — positioned along an inset track that matches the thumb center */}
          <div className="pointer-events-none absolute left-3 right-3 top-0 h-7">
            <div
              className="absolute top-0 -translate-x-1/2 transition-[left] duration-150 ease-out"
              style={{ left: `${((threshold - 50) / 50) * 100}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-semibold tabular-nums">
                  {threshold}%
                </div>
                <div className="h-1.5 w-1.5 bg-slate-900 rotate-45 -mt-[3px]" />
              </div>
            </div>
          </div>

          <Slider
            value={[threshold]}
            onValueChange={v => setThreshold(v[0])}
            min={50}
            max={100}
            step={1}
            className="[&_[role=slider]]:h-6 [&_[role=slider]]:w-6 [&_[role=slider]]:border-[3px] [&_[role=slider]]:border-white [&_[role=slider]]:bg-blue-600 [&_[role=slider]]:shadow-[0_2px_8px_rgba(37,99,235,0.4)] [&_[role=slider]]:ring-1 [&_[role=slider]]:ring-blue-600/30 [&_[role=slider]]:transition-transform hover:[&_[role=slider]]:scale-110 [&_[role=slider]:focus-visible]:ring-4 [&_[role=slider]:focus-visible]:ring-blue-600/30 [&>span:first-child]:h-2.5 [&>span:first-child]:bg-slate-100 [&_.bg-primary]:bg-blue-600"
          />

          {/* Ticks */}
          <div className="flex justify-between mt-4 text-[11px] font-medium text-slate-400 tabular-nums">
            {[50, 60, 70, 80, 90, 100].map(t => (
              <button
                key={t}
                onClick={() => setThreshold(t)}
                className={`relative flex flex-col items-center gap-1 transition-colors hover:text-blue-600 ${
                  threshold >= t ? 'text-blue-600' : ''
                }`}
              >
                <span className={`h-1 w-px ${threshold >= t ? 'bg-blue-600' : 'bg-slate-300'}`} />
                {t}
              </button>
            ))}
          </div>
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
