import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { mockItems, mockAnalysisResults } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, PlayCircle } from 'lucide-react';

export default function ItemBank() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [qualFilter, setQualFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('item_id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const itemsWithResults = useMemo(() => {
    return mockItems.map(item => {
      const result = mockAnalysisResults.find(r => r.item_id === item.item_id);
      return { ...item, overall_score: result?.overall_score ?? 0, overall_status: result?.overall_status ?? item.status };
    });
  }, []);

  const filtered = useMemo(() => {
    let list = itemsWithResults;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(i => i.item_id.toLowerCase().includes(s) || i.stem.toLowerCase().includes(s) || i.unit_code.toLowerCase().includes(s));
    }
    if (statusFilter !== 'all') list = list.filter(i => i.overall_status === statusFilter);
    if (qualFilter !== 'all') list = list.filter(i => i.qualification === qualFilter);

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'overall_score') cmp = a.overall_score - b.overall_score;
      else if (sortField === 'item_id') cmp = a.item_id.localeCompare(b.item_id);
      else if (sortField === 'qualification') cmp = a.qualification.localeCompare(b.qualification);
      return sortDir === 'desc' ? -cmp : cmp;
    });
    return list;
  }, [search, statusFilter, qualFilter, sortField, sortDir, itemsWithResults]);

  const qualifications = [...new Set(mockItems.map(i => i.qualification))];

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Item Bank"
        subtitle={`${mockItems.length} items loaded · Showing ${filtered.length} results`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" />Export</Button>
            <Button size="sm"><PlayCircle className="w-3.5 h-3.5 mr-1.5" />Run Analysis</Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, stem, or unit code..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground">
          <option value="all">All Statuses</option>
          <option value="green">Pass</option>
          <option value="amber">Needs Review</option>
          <option value="red">Fail</option>
        </select>
        <select value={qualFilter} onChange={e => setQualFilter(e.target.value)}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-card text-foreground">
          <option value="all">All Qualifications</option>
          {qualifications.map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-muted border-b border-gray-300 hover:bg-muted">
                <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => toggleSort('item_id')}>
                  Item ID {sortField === 'item_id' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </TableHead>
                <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => toggleSort('qualification')}>Qualification</TableHead>
                <TableHead className="whitespace-nowrap">Unit</TableHead>
                <TableHead className="whitespace-nowrap">Topic</TableHead>
                <TableHead className="whitespace-nowrap">ILO</TableHead>
                <TableHead className="whitespace-nowrap">Level</TableHead>
                <TableHead className="whitespace-nowrap">Type</TableHead>
                <TableHead className="whitespace-nowrap">Stem Preview</TableHead>
                <TableHead className="cursor-pointer whitespace-nowrap" onClick={() => toggleSort('overall_score')}>
                  Score {sortField === 'overall_score' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => (
                <TableRow
                  key={item.item_id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={() => navigate(`/item-validation/item-reports/${item.item_id}`)}
                >
                  <TableCell className="font-mono text-xs font-medium">{item.item_id}</TableCell>
                  <TableCell className="text-xs max-w-[180px] truncate">{item.qualification.replace('VTCT ', '')}</TableCell>
                  <TableCell className="text-xs font-mono">{item.unit_code}</TableCell>
                  <TableCell className="text-xs max-w-[140px] truncate">{item.topic}</TableCell>
                  <TableCell className="text-xs max-w-[160px] truncate">{item.intended_learning_outcome}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{item.qualification_level}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap">{item.item_type}</TableCell>
                  <TableCell className="text-xs max-w-[260px] truncate">{item.stem}</TableCell>
                  <TableCell><ScoreDisplay score={item.overall_score} /></TableCell>
                  <TableCell><StatusBadge status={item.overall_status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
