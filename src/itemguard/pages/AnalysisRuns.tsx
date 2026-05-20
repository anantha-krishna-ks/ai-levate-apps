import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { mockRuns, mockItems, mockRules, mockDocuments } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { PlayCircle, RotateCcw, Eye, Download, GitCompare, User, Calendar, Layers, FileText, Folder, BookOpen, ScrollText, ShieldCheck, ArrowLeft, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import type { AnalysisRun } from '../lib/types';
import { toast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const statusStyles: Record<string, { badge: string; dot: string; label: string; iconBg: string; iconFg: string }> = {
  draft:     { badge: 'text-slate-600 bg-slate-100 border-slate-200', dot: 'bg-slate-400', label: 'Draft',     iconBg: 'bg-slate-100', iconFg: 'text-slate-500' },
  running:   { badge: 'text-blue-700 bg-blue-50 border-blue-200',     dot: 'bg-blue-500',  label: 'Running',   iconBg: 'bg-blue-50',   iconFg: 'text-blue-600' },
  completed: { badge: 'text-green-700 bg-green-50 border-green-200',  dot: 'bg-green-500', label: 'Completed', iconBg: 'bg-slate-100', iconFg: 'text-slate-600' },
  failed:    { badge: 'text-red-700 bg-red-50 border-red-200',        dot: 'bg-red-500',   label: 'Failed',    iconBg: 'bg-red-50',    iconFg: 'text-red-600' },
};

export default function AnalysisRuns() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const folderParam = params.get('folder');
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<'list' | 'setup'>('list');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedGuidelines, setSelectedGuidelines] = useState<string[]>([]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);

  const runs = useMemo<AnalysisRun[]>(() => {
    if (!folderParam) return mockRuns;
    const exists = mockRuns.some(r => r.scope === folderParam);
    if (exists) return mockRuns;
    const now = new Date().toISOString();
    const total = 120 + Math.floor(Math.random() * 80);
    const green = Math.floor(total * 0.62);
    const amber = Math.floor(total * 0.25);
    const red = total - green - amber;
    const synthetic: AnalysisRun = {
      run_id: `RUN-${String(900 + Math.floor(Math.random() * 99))}`,
      run_name: `${folderParam} — Analysis`,
      scope: folderParam,
      ruleset_used: 'Standard v2.1',
      knowledge_base_used: 'QS 2025-26',
      initiated_by: 'You',
      run_status: 'completed',
      created_at: now,
      completed_at: now,
      items_processed: total,
      total_items: total,
      average_score: 82,
      green_count: green,
      amber_count: amber,
      red_count: red,
    };
    return [synthetic, ...mockRuns];
  }, [folderParam]);

  const highlightId = useMemo(() => {
    if (!folderParam) return null;
    return runs.find(r => r.scope === folderParam)?.run_id ?? null;
  }, [runs, folderParam]);

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightId]);

  const folders = useMemo(() => {
    const map = new Map<string, number>();
    mockItems.forEach(i => map.set(i.qualification, (map.get(i.qualification) ?? 0) + 1));
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, []);

  const guidelines = useMemo(() => mockDocuments.filter(d => d.document_type === 'Item Writing Guidelines' || d.document_type === 'Style Guide' || d.document_type === 'Policy Document'), []);
  const specs = useMemo(() => mockDocuments.filter(d => d.document_type === 'Qualification Specification'), []);

  const toggle = (id: string, list: string[], setter: (v: string[]) => void) => {
    setter(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
  };

  const canRun = !!selectedFolder && (selectedGuidelines.length + selectedRules.length + selectedSpecs.length > 0);

  const startAnalysis = () => {
    toast({ title: 'Analysis started', description: `Running analysis on "${selectedFolder}".` });
    setMode('list');
    setSelectedFolder(null);
    setSelectedGuidelines([]);
    setSelectedRules([]);
    setSelectedSpecs([]);
  };

  if (mode === 'setup') {
    return (
      <div className="animate-fade-in">
        <PageHeader
          title="New Analysis Run"
          subtitle="Pick an item set and the references to validate against"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setMode('list')}>
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />Back
              </Button>
              <Button size="sm" disabled={!canRun} onClick={startAnalysis}>
                <PlayCircle className="w-3.5 h-3.5 mr-1.5" />Run Analysis
              </Button>
            </div>
          }
        />

        {/* Step 1: Folder */}
        <SetupSection
          step={1}
          title="Select Item Set Folder"
          description="Choose the folder of items you want to analyse."
        >
          <div className="max-w-xl">
            <Select value={selectedFolder ?? undefined} onValueChange={(v) => setSelectedFolder(v)}>
              <SelectTrigger className="h-11 rounded-full bg-white">
                <div className="flex items-center gap-2 min-w-0">
                  <Folder className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <SelectValue placeholder="Choose an item set folder…" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {folders.map(f => (
                  <SelectItem key={f.name} value={f.name}>
                    <span className="flex items-center justify-between gap-3 w-full">
                      <span className="truncate">{f.name}</span>
                      <span className="text-xs text-slate-500">{f.count} items</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </SetupSection>

        {/* Step 2: References — disabled until folder picked */}
        <div className={`mt-6 transition-opacity ${selectedFolder ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <SetupSection
            step={2}
            title="Select References"
            description="Pick the Guidelines, Rules and Qualification Specs to run the analysis against. Select at least one."
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <RefColumn
                icon={<BookOpen className="w-4 h-4" />}
                title="Guidelines"
                count={selectedGuidelines.length}
              >
                {guidelines.map(d => (
                  <CheckRow
                    key={d.document_id}
                    checked={selectedGuidelines.includes(d.document_id)}
                    onChange={() => toggle(d.document_id, selectedGuidelines, setSelectedGuidelines)}
                    title={d.title}
                    meta={`v${d.version}`}
                  />
                ))}
              </RefColumn>

              <RefColumn
                icon={<ShieldCheck className="w-4 h-4" />}
                title="Rules"
                count={selectedRules.length}
              >
                {mockRules.map(r => (
                  <CheckRow
                    key={r.rule_id}
                    checked={selectedRules.includes(r.rule_id)}
                    onChange={() => toggle(r.rule_id, selectedRules, setSelectedRules)}
                    title={r.rule_name}
                    meta={r.category}
                  />
                ))}
              </RefColumn>

              <RefColumn
                icon={<ScrollText className="w-4 h-4" />}
                title="Qualification Specs"
                count={selectedSpecs.length}
              >
                {specs.map(d => (
                  <CheckRow
                    key={d.document_id}
                    checked={selectedSpecs.includes(d.document_id)}
                    onChange={() => toggle(d.document_id, selectedSpecs, setSelectedSpecs)}
                    title={d.title}
                    meta={`${d.level} · v${d.version}`}
                  />
                ))}
              </RefColumn>
            </div>
          </SetupSection>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Analysis Runs"
        subtitle="Manage and monitor AI-driven analysis jobs"
        actions={<Button size="sm" onClick={() => setMode('setup')}><PlayCircle className="w-3.5 h-3.5 mr-1.5" />New Analysis Run</Button>}
      />

      <div className="space-y-3">
        {runs.map(run => {
          const progress = run.total_items > 0 ? Math.round((run.items_processed / run.total_items) * 100) : 0;
          const style = statusStyles[run.run_status] ?? statusStyles.draft;
          const isHighlighted = run.run_id === highlightId;
          return (
            <div
              key={run.run_id}
              ref={isHighlighted ? highlightRef : undefined}
              className={`group bg-white rounded-xl border transition-colors ${
                isHighlighted
                  ? 'border-blue-400 ring-2 ring-blue-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header band */}
              <div className="flex items-start justify-between gap-4 px-5 pt-4 pb-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${style.iconBg}`}>
                    <PlayCircle className={`w-5 h-5 ${style.iconFg}`} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => navigate(`/item-validation/analysis-runs/${run.run_id}?scope=${encodeURIComponent(run.scope)}`)}
                        className="text-left text-[15px] font-semibold text-slate-900 tracking-tight truncate hover:text-blue-600 transition-colors"
                      >
                        {run.run_name}
                      </button>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        title="View items"
                        onClick={() => navigate(`/item-validation/analysis-runs/${run.run_id}?scope=${encodeURIComponent(run.scope)}`)}
                      >
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
                  <div className="flex items-center gap-2 text-xs">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                    </span>
                    <span className="font-medium text-slate-700">Analysis in progress</span>
                  </div>
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

function Meta({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
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

function SetupSection({ step, title, description, children }: { step: number; title: string; description: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start gap-3 mb-4">
        <span className="h-7 w-7 rounded-full bg-blue-600 text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">{step}</span>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function RefColumn({ icon, title, count, children }: { icon: ReactNode; title: string; count: number; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/40 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 bg-white rounded-t-lg">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
          <span className="text-slate-500">{icon}</span>
          {title}
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>{count} selected</span>
      </div>
      <div className="max-h-72 overflow-y-auto p-2 space-y-1">{children}</div>
    </div>
  );
}

function CheckRow({ checked, onChange, title, meta }: { checked: boolean; onChange: () => void; title: string; meta?: string }) {
  return (
    <label className={`flex items-start gap-2.5 px-2.5 py-2 rounded-md cursor-pointer transition-colors ${checked ? 'bg-blue-50' : 'hover:bg-white'}`}>
      <span className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${checked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
        {checked && <Check className="w-3 h-3" strokeWidth={3} />}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-slate-800 leading-snug">{title}</span>
        {meta && <span className="block text-[11px] text-slate-500 mt-0.5">{meta}</span>}
      </span>
    </label>
  );
}
