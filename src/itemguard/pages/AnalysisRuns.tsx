import { PageHeader } from '../components/PageHeader';
import { mockRuns } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { PlayCircle, RotateCcw, Eye, Download, GitCompare } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const statusColors: Record<string, string> = {
  draft: 'text-muted-foreground bg-muted',
  running: 'text-blue-700 bg-blue-50',
  completed: 'ig-status-green',
  failed: 'ig-status-red',
};

export default function AnalysisRuns() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Analysis Runs"
        subtitle="Manage and monitor AI-driven analysis jobs"
        actions={<Button size="sm"><PlayCircle className="w-3.5 h-3.5 mr-1.5" />New Analysis Run</Button>}
      />

      <div className="space-y-4">
        {mockRuns.map(run => {
          const progress = run.total_items > 0 ? Math.round((run.items_processed / run.total_items) * 100) : 0;
          return (
            <div key={run.run_id} className="ig-kpi-card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-semibold">{run.run_name}</h3>
                    <span className={`ig-status-badge text-xs ${statusColors[run.run_status] || ''}`}>
                      {run.run_status.charAt(0).toUpperCase() + run.run_status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {run.run_id} · Scope: {run.scope} · Ruleset: {run.ruleset_used}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Initiated by {run.initiated_by} · {new Date(run.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {run.run_status === 'completed' && (
                    <>
                      <Button variant="ghost" size="sm"><Eye className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm"><Download className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="sm"><GitCompare className="w-3.5 h-3.5" /></Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm"><RotateCcw className="w-3.5 h-3.5" /></Button>
                </div>
              </div>

              {run.run_status === 'running' && (
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Processing {run.items_processed} of {run.total_items} items</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {run.run_status === 'completed' && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-3 border-t border-border">
                  <div><div className="text-xs text-muted-foreground">Items</div><div className="text-sm font-semibold">{run.items_processed.toLocaleString()}</div></div>
                  <div><div className="text-xs text-muted-foreground">Avg Score</div><div className="text-sm font-semibold">{run.average_score}</div></div>
                  <div><div className="text-xs text-muted-foreground">Pass</div><div className="text-sm font-semibold ig-text-status-green">{run.green_count.toLocaleString()}</div></div>
                  <div><div className="text-xs text-muted-foreground">Review</div><div className="text-sm font-semibold ig-text-status-amber">{run.amber_count.toLocaleString()}</div></div>
                  <div><div className="text-xs text-muted-foreground">Fail</div><div className="text-sm font-semibold ig-text-status-red">{run.red_count.toLocaleString()}</div></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
