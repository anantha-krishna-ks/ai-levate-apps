import { PageHeader } from '../components/PageHeader';
import { mockRuns } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { PlayCircle, RotateCcw, Eye, Download, GitCompare, User, Calendar, Layers, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const statusStyles: Record<string, { badge: string; rail: string; dot: string; label: string }> = {
  draft:     { badge: 'text-slate-600 bg-slate-100 border-slate-200',  rail: 'bg-slate-300',  dot: 'bg-slate-400',  label: 'Draft' },
  running:   { badge: 'text-blue-700 bg-blue-50 border-blue-200',      rail: 'bg-blue-500',   dot: 'bg-blue-500',   label: 'Running' },
  completed: { badge: 'text-green-700 bg-green-50 border-green-200',   rail: 'bg-green-500',  dot: 'bg-green-500',  label: 'Completed' },
  failed:    { badge: 'text-red-700 bg-red-50 border-red-200',         rail: 'bg-red-500',    dot: 'bg-red-500',    label: 'Failed' },
};

export default function AnalysisRuns() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Analysis Runs"
        subtitle="Manage and monitor AI-driven analysis jobs"
        actions={<Button size="sm"><PlayCircle className="w-3.5 h-3.5 mr-1.5" />New Analysis Run</Button>}
      />

      <div className="space-y-3">
        {mockRuns.map(run => {
          const progress = run.total_items > 0 ? Math.round((run.items_processed / run.total_items) * 100) : 0;
          const style = statusStyles[run.run_status] ?? statusStyles.draft;
          return (
            <div
              key={run.run_id}
              className="group relative bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors overflow-hidden"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.rail}`} aria-hidden="true" />

              <div className="pl-5 pr-4 py-4">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight truncate">
                        {run.run_name}
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${run.run_status === 'running' ? 'animate-pulse' : ''}`} />
                        {style.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{run.run_id}</span>
                    </div>

                    <div className="flex items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 flex-wrap">
                      <span className="inline-flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-600 truncate max-w-[280px]" title={run.scope}>{run.scope}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-600">{run.ruleset_used}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-600">{run.initiated_by}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-slate-600">{new Date(run.created_at).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    {run.run_status === 'completed' && (
                      <>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50" title="View report">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50" title="Download">
                          <Download className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50" title="Compare">
                          <GitCompare className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50" title="Re-run">
                      <RotateCcw className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Running progress */}
                {run.run_status === 'running' && (
                  <div className="mt-4">
                    <div className="flex justify-between items-baseline text-xs mb-1.5">
                      <span className="text-slate-600">
                        Processing <span className="font-semibold text-slate-900 tabular-nums">{run.items_processed.toLocaleString()}</span>
                        <span className="text-slate-400"> of </span>
                        <span className="font-semibold text-slate-900 tabular-nums">{run.total_items.toLocaleString()}</span> items
                      </span>
                      <span className="font-semibold text-blue-600 tabular-nums">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                  </div>
                )}

                {/* Completed stats */}
                {run.run_status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-100">
                    <Stat label="Items" value={run.items_processed.toLocaleString()} />
                    <Stat label="Avg Score" value={String(run.average_score)} accent="text-slate-900" />
                    <Stat label="Pass" value={run.green_count.toLocaleString()} accent="text-green-600" dot="bg-green-500" />
                    <Stat label="Review" value={run.amber_count.toLocaleString()} accent="text-amber-600" dot="bg-amber-500" />
                    <Stat label="Fail" value={run.red_count.toLocaleString()} accent="text-red-600" dot="bg-red-500" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, accent = 'text-slate-900', dot }: { label: string; value: string; accent?: string; dot?: string }) {
  return (
    <div className="px-4 first:pl-0 last:pr-0">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />}
        {label}
      </div>
      <div className={`text-base font-semibold tabular-nums mt-0.5 ${accent}`}>{value}</div>
    </div>
  );
}
