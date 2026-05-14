import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { mockDashboardKPI, mockIssueCategories, mockTrendData, mockItems, mockAnalysisResults } from '../lib/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';
import { AlertTriangle, ShieldAlert, FileWarning, Users, CheckCircle2, XCircle, AlertCircle, Hash, BarChart3, PieChart as PieIcon, ShieldCheck, Pin } from 'lucide-react';

const kpi = mockDashboardKPI;

const donutData = [
  { name: 'Pass', value: kpi.green_count, color: 'hsl(142, 71%, 45%)' },
  { name: 'Needs Review', value: kpi.amber_count, color: 'hsl(38, 92%, 50%)' },
  { name: 'Fail', value: kpi.red_count, color: 'hsl(0, 72%, 51%)' },
];

const topRiskItems = mockAnalysisResults
  .slice()
  .sort((a, b) => a.overall_score - b.overall_score)
  .slice(0, 20)
  .map(r => {
    const item = mockItems.find(i => i.item_id === r.item_id);
    return { ...r, item };
  });

const problematicUnits = [
  { unit: 'UV20402 - Health and Safety in the Salon', items: 2340, avgScore: 68, redCount: 187 },
  { unit: 'UV30411 - Barbering Science', items: 1850, avgScore: 71, redCount: 142 },
  { unit: 'UV20431 - Manicure and Pedicure', items: 1200, avgScore: 73, redCount: 98 },
  { unit: 'UV20401 - Client Care and Communication', items: 1980, avgScore: 75, redCount: 84 },
  { unit: 'UV30410 - Creative Barbering Techniques', items: 2100, avgScore: 79, redCount: 63 },
];

const coveragePct = Math.round((kpi.items_analysed / kpi.total_items) * 100);
const pendingItems = kpi.total_items - kpi.items_analysed;

type VolumeTone = 'lavender' | 'sky' | 'mint';
const VOLUME_TONES: Record<VolumeTone, { bg: string; ink: string; fill: string }> = {
  lavender: { bg: 'bg-pastel-lavender', ink: 'text-pastel-lavender-ink', fill: 'bg-pastel-lavender-ink' },
  sky:      { bg: 'bg-pastel-sky',      ink: 'text-pastel-sky-ink',      fill: 'bg-pastel-sky-ink' },
  mint:     { bg: 'bg-pastel-mint',     ink: 'text-pastel-mint-ink',     fill: 'bg-pastel-mint-ink' },
};

const volumeStats: {
  tone: VolumeTone;
  icon: typeof Hash;
  label: string;
  value: number;
  total: number;
  caption: string;
}[] = [
  { tone: 'lavender', icon: Hash,       label: 'Total Items',    value: kpi.total_items,    total: kpi.total_items, caption: 'In bank' },
  { tone: 'sky',      icon: BarChart3,  label: 'Items Analysed', value: kpi.items_analysed, total: kpi.total_items, caption: 'Processed' },
  { tone: 'mint',     icon: ShieldCheck,label: 'Coverage',       value: kpi.items_analysed, total: kpi.total_items, caption: `${pendingItems.toLocaleString()} pending` },
];

const qualityTotal = kpi.green_count + kpi.amber_count + kpi.red_count;
const qualityStats = [
  { key: 'pass',   label: 'Pass',         value: kpi.green_count, icon: CheckCircle2, color: 'hsl(142, 71%, 45%)', bg: 'bg-pastel-mint',   ink: 'text-pastel-mint-ink',   fill: 'bg-pastel-mint-ink' },
  { key: 'review', label: 'Needs Review', value: kpi.amber_count, icon: AlertCircle,  color: 'hsl(38, 92%, 50%)',  bg: 'bg-pastel-peach',  ink: 'text-pastel-peach-ink',  fill: 'bg-pastel-peach-ink' },
  { key: 'fail',   label: 'Fail',         value: kpi.red_count,   icon: XCircle,      color: 'hsl(0, 72%, 51%)',   bg: 'bg-pastel-rose',   ink: 'text-pastel-rose-ink',   fill: 'bg-pastel-rose-ink' },
];
const qualityPieData = qualityStats.map(s => ({ name: s.label, value: s.value, color: s.color }));

const riskSignals = [
  { label: 'Duplicate Count', value: kpi.duplicate_count.toLocaleString(), priority: 'Low priority', icon: Users, tone: 'text-slate-600', priorityClass: 'bg-slate-100 text-slate-600' },
  { label: 'Technical Risk', value: kpi.technical_accuracy_risk.toLocaleString(), priority: 'High priority', icon: ShieldAlert, tone: 'text-red-600', priorityClass: 'bg-red-50 text-red-700' },
  { label: 'Bias / Fairness Flags', value: kpi.bias_fairness_flags.toLocaleString(), priority: 'Medium priority', icon: AlertTriangle, tone: 'text-amber-600', priorityClass: 'bg-amber-50 text-amber-700' },
  { label: 'Answer Key Risk', value: kpi.answer_key_risk.toLocaleString(), priority: 'Medium priority', icon: FileWarning, tone: 'text-amber-600', priorityClass: 'bg-amber-50 text-amber-700' },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Dashboard" subtitle="Executive overview of item bank quality and analysis health" />

      {/* Volume & Coverage */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3 px-1">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Volume & Coverage</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {volumeStats.map((s) => {
            const styles = VOLUME_TONES[s.tone];
            const pct = Math.max(0, Math.min(100, Math.round((s.value / s.total) * 100)));
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className={`relative overflow-hidden rounded-3xl border border-border/70 p-5 ${styles.bg} ${styles.ink}`}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-7 w-7 rounded-full bg-white/85 flex items-center justify-center shrink-0 ring-1 ring-black/5">
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[15px] font-medium tracking-tight">{s.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[40px] leading-none font-medium tracking-tight">{s.value.toLocaleString()}</span>
                  <span className="text-base font-medium opacity-75">/ {s.total.toLocaleString()}</span>
                </div>
                <p className="text-sm opacity-90 mt-1.5 mb-4">{s.caption}</p>
                <div className="flex items-center gap-3">
                  <div className="relative h-2.5 flex-1 rounded-full bg-white/60 ring-1 ring-inset ring-black/5 overflow-hidden">
                    <div className={`h-full rounded-full ${styles.fill}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-sm font-medium tabular-nums">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quality Outcome */}
      <section className="mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quality Outcome</h3>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              {qualityTotal.toLocaleString()} items analysed
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8 items-center">
            {/* Donut with centered avg score */}
            <div className="relative mx-auto w-full max-w-[260px] h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityPieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="#ffffff"
                    strokeWidth={3}
                    cornerRadius={6}
                    isAnimationActive
                    animationDuration={800}
                  >
                    {qualityPieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => val.toLocaleString()}
                    contentStyle={{
                      background: 'rgba(255,255,255,0.98)',
                      border: '1px solid hsl(220, 13%, 91%)',
                      borderRadius: 10,
                      fontSize: 11,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                role="img"
                aria-label={`Average quality score ${kpi.average_quality_score.toFixed(1)} out of 100`}
              >
                <span className="text-[11px] uppercase tracking-wider text-slate-700 font-semibold">Avg Score</span>
                <span className="text-3xl font-bold text-slate-900 tabular-nums leading-none mt-1">
                  {kpi.average_quality_score.toFixed(1)}
                </span>
                <span className="text-[11px] text-slate-600 mt-1 font-medium">out of 100</span>
              </div>
            </div>

            {/* Soft pastel stat cards */}
            <div className="flex flex-col gap-3">
              {qualityStats.map((s) => {
                const pct = Math.round((s.value / qualityTotal) * 100);
                const Icon = s.icon;
                return (
                  <div
                    key={s.key}
                    className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 border border-slate-200 ${s.bg} ${s.ink}`}
                  >
                    <span className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-semibold uppercase tracking-wider opacity-90">
                        {s.label}
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xl font-semibold tabular-nums leading-none">
                          {s.value.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-medium opacity-75">items</span>
                      </div>
                    </div>
                    <div
                      className="shrink-0 text-right"
                      role="progressbar"
                      aria-valuenow={pct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${s.label} ${pct}%`}
                    >
                      <div className="text-xl font-semibold tabular-nums leading-none">
                        {pct}
                        <span className="text-sm font-medium ml-0.5">%</span>
                      </div>
                      <div className="text-[10px] font-semibold uppercase tracking-wider mt-1 opacity-75">
                        share
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Risk Signals */}
      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Risk Signals</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {riskSignals.map(s => (
            <div key={s.label} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <s.icon className={`w-3.5 h-3.5 ${s.tone}`} />
                <span className="text-xs font-medium text-slate-600">{s.label}</span>
              </div>
              <div className="text-2xl font-semibold text-slate-900 mb-2">{s.value}</div>
              <span className={`inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${s.priorityClass}`}>
                {s.priority}
              </span>
            </div>
          ))}
        </div>

        {/* Priority Summary */}
        <div className="mt-5 pt-5 border-t border-dashed border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <Pin className="w-3.5 h-3.5 text-rose-500" />
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Priority Summary</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="flex items-baseline justify-between flex-1 gap-2">
                <span className="text-xs font-medium text-emerald-800">Pass Rate</span>
                <span className="text-lg font-semibold text-emerald-900">{Math.round((kpi.green_count / (kpi.green_count + kpi.amber_count + kpi.red_count)) * 100)}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="flex items-baseline justify-between flex-1 gap-2">
                <span className="text-xs font-medium text-amber-800">Needs Review</span>
                <span className="text-lg font-semibold text-amber-900">{Math.round((kpi.amber_count / (kpi.green_count + kpi.amber_count + kpi.red_count)) * 100)}%</span>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <div className="flex items-baseline justify-between flex-1 gap-2">
                <span className="text-xs font-medium text-red-800">Total Risk Flags</span>
                <span className="text-lg font-semibold text-red-900">{(kpi.technical_accuracy_risk + kpi.bias_fairness_flags + kpi.answer_key_risk).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="ig-kpi-card">
          <h3 className="text-sm font-semibold mb-4">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockIssueCategories} layout="vertical" margin={{ left: 100 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="category" tick={{ fontSize: 11 }} width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(220,60%,45%)" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ig-kpi-card mb-8">
        <h3 className="text-sm font-semibold mb-4">Analysis Results Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={mockTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" />
            <XAxis dataKey="run_name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="green" stackId="1" fill="hsl(142,71%,45%)" stroke="hsl(142,71%,45%)" fillOpacity={0.6} name="Pass" />
            <Area type="monotone" dataKey="amber" stackId="1" fill="hsl(38,92%,50%)" stroke="hsl(38,92%,50%)" fillOpacity={0.6} name="Needs Review" />
            <Area type="monotone" dataKey="red" stackId="1" fill="hsl(0,72%,51%)" stroke="hsl(0,72%,51%)" fillOpacity={0.6} name="Fail" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="ig-kpi-card overflow-hidden">
          <h3 className="text-sm font-semibold mb-4">Most Problematic Units</h3>
          <div className="overflow-x-auto">
            <table className="ig-data-table">
              <thead>
                <tr><th>Unit</th><th>Items</th><th>Avg Score</th><th>Red</th></tr>
              </thead>
              <tbody>
                {problematicUnits.map(u => (
                  <tr key={u.unit}>
                    <td className="text-xs max-w-[200px] truncate">{u.unit}</td>
                    <td>{u.items.toLocaleString()}</td>
                    <td><ScoreDisplay score={u.avgScore} /></td>
                    <td className="ig-text-status-red font-medium">{u.redCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="ig-kpi-card overflow-hidden">
          <h3 className="text-sm font-semibold mb-4">Top 20 Highest-Risk Items</h3>
          <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
            <table className="ig-data-table">
              <thead>
                <tr><th>Item ID</th><th>Score</th><th>Status</th><th>Unit</th></tr>
              </thead>
              <tbody>
                {topRiskItems.map(r => (
                  <tr key={r.result_id}>
                    <td className="font-mono text-xs">{r.item_id}</td>
                    <td><ScoreDisplay score={r.overall_score} /></td>
                    <td><StatusBadge status={r.overall_status} /></td>
                    <td className="text-xs max-w-[140px] truncate">{r.item?.unit_code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
