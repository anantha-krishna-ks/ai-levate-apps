import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { mockDashboardKPI, mockIssueCategories, mockTrendData, mockItems, mockAnalysisResults } from '../lib/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';
import { TrendingUp, AlertTriangle, ShieldAlert, FileWarning, Users, CheckCircle2, XCircle, AlertCircle, Hash, BarChart3 } from 'lucide-react';

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

const kpiCards = [
  { label: 'Total Items', value: kpi.total_items.toLocaleString(), icon: Hash, accent: 'text-primary' },
  { label: 'Items Analysed', value: kpi.items_analysed.toLocaleString(), icon: BarChart3, accent: 'text-primary' },
  { label: 'Pass (Green)', value: kpi.green_count.toLocaleString(), icon: CheckCircle2, accent: 'ig-text-status-green' },
  { label: 'Needs Review', value: kpi.amber_count.toLocaleString(), icon: AlertCircle, accent: 'ig-text-status-amber' },
  { label: 'Fail (Red)', value: kpi.red_count.toLocaleString(), icon: XCircle, accent: 'ig-text-status-red' },
  { label: 'Avg Quality Score', value: kpi.average_quality_score.toFixed(1), icon: TrendingUp, accent: 'text-primary' },
  { label: 'Duplicate Count', value: kpi.duplicate_count.toLocaleString(), icon: Users, accent: 'ig-text-chart-purple' },
  { label: 'Technical Risk', value: kpi.technical_accuracy_risk.toLocaleString(), icon: ShieldAlert, accent: 'ig-text-status-red' },
  { label: 'Bias/Fairness Flags', value: kpi.bias_fairness_flags.toLocaleString(), icon: AlertTriangle, accent: 'ig-text-status-amber' },
  { label: 'Answer Key Risk', value: kpi.answer_key_risk.toLocaleString(), icon: FileWarning, accent: 'ig-text-status-red' },
];

export default function Dashboard() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Dashboard" subtitle="Executive overview of item bank quality and analysis health" />

      <div className="flex flex-wrap gap-2 mb-6">
        {['Qualification', 'Unit', 'Topic', 'Learning Outcome', 'Level', 'Item Type', 'Status'].map(f => (
          <select key={f} className="text-xs border border-border rounded-md px-3 py-1.5 bg-card text-foreground">
            <option>{f}</option>
          </select>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {kpiCards.map(card => (
          <div key={card.label} className="ig-kpi-card">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.accent}`} />
              <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="ig-kpi-card">
          <h3 className="text-sm font-semibold mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={donutData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {donutData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => val.toLocaleString()} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="ig-kpi-card lg:col-span-2">
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
