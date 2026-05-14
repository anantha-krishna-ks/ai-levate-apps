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

const volumeStats = [
  { label: 'Total Items', value: kpi.total_items.toLocaleString(), icon: Hash },
  { label: 'Items Analysed', value: kpi.items_analysed.toLocaleString(), icon: BarChart3 },
  { label: 'Coverage', value: `${coveragePct}%`, icon: ShieldCheck },
];

const qualityStats = [
  { label: 'Pass', value: kpi.green_count.toLocaleString(), icon: CheckCircle2, dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { label: 'Needs Review', value: kpi.amber_count.toLocaleString(), icon: AlertCircle, dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
  { label: 'Fail', value: kpi.red_count.toLocaleString(), icon: XCircle, dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100' },
];

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
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Volume & Coverage</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {volumeStats.map(s => (
            <div key={s.label} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
              <div className="flex items-center gap-2 mb-1.5 text-slate-500">
                <s.icon className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">{s.label}</span>
              </div>
              <div className="text-2xl font-semibold text-slate-900">{s.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>Analysis coverage</span>
            <span className="font-medium text-slate-700">{coveragePct}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${coveragePct}%` }} />
          </div>
        </div>
      </section>

      {/* Quality Outcome */}
      <section className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <PieIcon className="w-4 h-4 text-emerald-600" />
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Quality Outcome</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
          <div className="lg:col-span-2 relative">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={88} paddingAngle={3} dataKey="value">
                  {donutData.map((entry, i) => (<Cell key={i} fill={entry.color} />))}
                </Pie>
                <Tooltip formatter={(val: number) => val.toLocaleString()} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Avg Score</span>
              <span className="text-3xl font-semibold text-slate-900">{kpi.average_quality_score.toFixed(1)}</span>
            </div>
          </div>
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {qualityStats.map(s => (
              <div key={s.label} className={`rounded-lg border ${s.border} ${s.bg} p-4`}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                  <span className={`text-xs font-medium ${s.text}`}>{s.label}</span>
                </div>
                <div className="text-2xl font-semibold text-slate-900">{s.value}</div>
              </div>
            ))}
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
