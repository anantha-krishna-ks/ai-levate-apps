import { PageHeader } from '../components/PageHeader';
import { mockRuns } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { PlayCircle, RotateCcw, Eye, Download, GitCompare, User, Calendar, Layers, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const statusStyles: Record<string, { badge: string; dot: string; label: string; iconBg: string; iconFg: string }> = {
  draft:     { badge: 'text-slate-600 bg-slate-100 border-slate-200', dot: 'bg-slate-400', label: 'Draft',     iconBg: 'bg-slate-100', iconFg: 'text-slate-500' },
  running:   { badge: 'text-blue-700 bg-blue-50 border-blue-200',     dot: 'bg-blue-500',  label: 'Running',   iconBg: 'bg-blue-50',   iconFg: 'text-blue-600' },
  completed: { badge: 'text-green-700 bg-green-50 border-green-200',  dot: 'bg-green-500', label: 'Completed', iconBg: 'bg-slate-100', iconFg: 'text-slate-600' },
  failed:    { badge: 'text-red-700 bg-red-50 border-red-200',        dot: 'bg-red-500',   label: 'Failed',    iconBg: 'bg-red-50',    iconFg: 'text-red-600' },
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
              className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
            >
              {/* Header band */}
              <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${style.iconBg}`}>
                    <PlayCircle className={`w-4.5 h-4.5 ${style.iconFg}`} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight truncate">
                        {run.run_name}
                      </h3>
                      <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} ${run.run_status === 'running' ? 'animate-pulse' : ''}`} />
                        {style.label}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 mt-0.5">{run.run_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
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

              {/* Metadata grid */}
              <div className="px-5 pb-4 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2.5">
                <Meta icon={<Layers className="w-3.5 h-3.5" />} label="Scope" value={run.scope} />
                <Meta icon={<FileText className="w-3.5 h-3.5" />} label="Ruleset" value={run.ruleset_used} />
                <Meta icon={<User className="w-3.5 h-3.5" />} label="Initiated by" value={run.initiated_by} />
                <Meta icon={<Calendar className="w-3.5 h-3.5" />} label="Created" value={new Date(run.created_at).toLocaleDateString()} />
              </div>

              {/* Running progress */}
              {run.run_status === 'running' && (
                <div className="px-5 pt-3 pb-4 border-t border-slate-100 bg-slate-50/60 rounded-b-xl">
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
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 rounded-b-xl grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-200/70">
                  <Stat label="Items" value={run.items_processed.toLocaleString()} />
                  <Stat label="Avg Score" value={String(run.average_score)} />
                  <Stat label="Pass" value={run.green_count.toLocaleString()} accent="text-green-600" dot="bg-green-500" />
                  <Stat label="Review" value={run.amber_count.toLocaleString()} accent="text-amber-600" dot="bg-amber-500" />
                  <Stat label="Fail" value={run.red_count.toLocaleString()} accent="text-red-600" dot="bg-red-500" />
                </div>
              )}
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

function Meta({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <span className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">{label}</div>
        <div className="text-xs text-slate-700 truncate" title={value}>{value}</div>
      </div>
    </div>
  );
}
