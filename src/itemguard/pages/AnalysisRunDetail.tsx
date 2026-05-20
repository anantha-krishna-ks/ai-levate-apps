import { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { mockItems, mockAnalysisResults, mockRuns } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Search, Download, Eye, Layers, User, Calendar, FileText } from 'lucide-react';

export default function AnalysisRunDetail() {
  const navigate = useNavigate();
  const { runId } = useParams();
  const [params] = useSearchParams();
  const scopeParam = params.get('scope');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const run = useMemo(() => {
    const found = mockRuns.find(r => r.run_id === runId);
    if (found) return found;
    if (scopeParam) {
      return {
        run_id: runId || 'RUN-000',
        run_name: `${scopeParam} — Analysis`,
        scope: scopeParam,
        ruleset_used: 'Standard v2.1',
        knowledge_base_used: 'QS 2025-26',
        initiated_by: 'You',
        run_status: 'completed' as const,
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        items_processed: 0,
        total_items: 0,
        average_score: 0,
        green_count: 0,
        amber_count: 0,
        red_count: 0,
      };
    }
    return null;
  }, [runId, scopeParam]);

  const items = useMemo(() => {
    if (!run) return [];
    const scoped = mockItems.filter(i => i.qualification === run.scope);
    return scoped.map(item => {
      const result = mockAnalysisResults.find(r => r.item_id === item.item_id);
      return {
        ...item,
        overall_score: result?.overall_score ?? 0,
        overall_status: result?.overall_status ?? item.status,
      };
    });
  }, [run]);

  const filtered = useMemo(() => {
    let list = items;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(i =>
        i.item_id.toLowerCase().includes(s) ||
        i.stem.toLowerCase().includes(s) ||
        i.unit_code.toLowerCase().includes(s)
      );
    }
    if (statusFilter !== 'all') list = list.filter(i => i.overall_status === statusFilter);
    return list;
  }, [items, search, statusFilter]);

  if (!run) {
    return (
      <div className="animate-fade-in">
        <PageHeader title="Analysis Run Not Found" subtitle="The requested analysis run could not be located" />
        <Button variant="outline" size="sm" onClick={() => navigate('/item-validation/analysis-runs')}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Analysis Runs
        </Button>
      </div>
    );
  }

  const total = items.length;
  const green = items.filter(i => i.overall_status === 'green').length;
  const amber = items.filter(i => i.overall_status === 'amber').length;
  const red = items.filter(i => i.overall_status === 'red').length;
  const avg = total > 0 ? Math.round(items.reduce((s, i) => s + i.overall_score, 0) / total) : 0;

  return (
    <div className="animate-fade-in">
      <div className="mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/item-validation/analysis-runs')}
          className="h-8 px-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Analysis Runs
        </Button>
      </div>

      <PageHeader
        title={run.run_name}
        subtitle={`Items analysed in run ${run.run_id}`}
        actions={
          <Button size="sm" variant="outline" className="rounded-full">
            <Download className="w-3.5 h-3.5 mr-1.5" /> Export
          </Button>
        }
      />

      {/* Run summary */}
      <div className="bg-white rounded-xl border border-slate-200 mb-5">
        <div className="px-5 py-3 flex flex-wrap items-center text-[13px] text-slate-600 border-b border-slate-100 gap-y-1">
          <MetaChip icon={<Layers className="w-3.5 h-3.5" />} value={run.scope} />
          <Dot />
          <MetaChip icon={<FileText className="w-3.5 h-3.5" />} value={run.ruleset_used} />
          <Dot />
          <MetaChip icon={<User className="w-3.5 h-3.5" />} value={run.initiated_by} />
          <Dot />
          <MetaChip icon={<Calendar className="w-3.5 h-3.5" />} value={new Date(run.created_at).toLocaleDateString()} />
        </div>
        <div className="px-5 py-3 grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-200/70 bg-slate-50/60 rounded-b-xl">
          <Stat label="Items" value={total.toLocaleString()} />
          <Stat label="Avg Score" value={String(avg)} />
          <Stat label="Pass" value={green.toLocaleString()} accent="text-green-600" dot="bg-green-500" />
          <Stat label="Review" value={amber.toLocaleString()} accent="text-amber-600" dot="bg-amber-500" />
          <Stat label="Fail" value={red.toLocaleString()} accent="text-red-600" dot="bg-red-500" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-full bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-full px-4 py-2 bg-white text-slate-700"
        >
          <option value="all">All Statuses</option>
          <option value="green">Pass</option>
          <option value="amber">Needs Review</option>
          <option value="red">Fail</option>
        </select>
      </div>

      {/* Items table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/60 hover:bg-slate-50/60">
              <TableHead className="w-[120px]">Item ID</TableHead>
              <TableHead>Stem</TableHead>
              <TableHead className="w-[140px]">Unit</TableHead>
              <TableHead className="w-[110px]">Type</TableHead>
              <TableHead className="w-[110px]">Score</TableHead>
              <TableHead className="w-[130px]">Status</TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-sm text-slate-500">
                  No items match the current filters.
                </TableCell>
              </TableRow>
            )}
            {filtered.map(item => (
              <TableRow
                key={item.item_id}
                className="cursor-pointer"
                onClick={() => navigate(`/item-validation/item-reports/${item.item_id}`)}
              >
                <TableCell className="font-mono text-xs text-slate-700">{item.item_id}</TableCell>
                <TableCell className="text-sm text-slate-700 max-w-[420px] truncate" title={item.stem}>
                  {item.stem}
                </TableCell>
                <TableCell className="text-xs text-slate-600">{item.unit_code}</TableCell>
                <TableCell className="text-xs text-slate-600">{item.item_type}</TableCell>
                <TableCell><ScoreDisplay score={item.overall_score} /></TableCell>
                <TableCell><StatusBadge status={item.overall_status} /></TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/item-validation/item-reports/${item.item_id}`);
                    }}
                    title="View item"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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

function MetaChip({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <span className="text-slate-400 flex-shrink-0">{icon}</span>
      <span className="truncate text-slate-700" title={value}>{value}</span>
    </span>
  );
}

function Dot() {
  return <span className="text-slate-300 select-none mx-2">·</span>;
}