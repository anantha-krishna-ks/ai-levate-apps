import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { mockItems, mockAnalysisResults } from '../lib/mockData';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function ItemReports() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const itemsWithResults = useMemo(() => {
    return mockItems.map(item => {
      const result = mockAnalysisResults.find(r => r.item_id === item.item_id);
      return { ...item, result };
    }).filter(i => i.result);
  }, []);

  const filtered = useMemo(() => {
    let list = itemsWithResults;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(i => i.item_id.toLowerCase().includes(s) || i.stem.toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') list = list.filter(i => i.result?.overall_status === statusFilter);
    return list;
  }, [search, statusFilter, itemsWithResults]);

  return (
    <div className="animate-fade-in">
      <PageHeader title="Item Reports" subtitle="Browse analysis report cards for all items" />

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search items..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground">
          <option value="all">All Statuses</option>
          <option value="green">Pass</option>
          <option value="amber">Needs Review</option>
          <option value="red">Fail</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.slice(0, 30).map(item => (
          <div
            key={item.item_id}
            onClick={() => navigate(`/item-validation/item-reports/${item.item_id}`)}
            className="ig-kpi-card cursor-pointer hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-medium">{item.item_id}</span>
              <StatusBadge status={item.result!.overall_status} />
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{item.stem}</p>
            <div className="flex items-center justify-between">
              <ScoreDisplay score={item.result!.overall_score} />
              <div className="text-xs text-muted-foreground">
                {item.unit_code} · {item.item_type}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
