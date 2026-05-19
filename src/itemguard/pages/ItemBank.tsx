import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { mockItems, mockAnalysisResults } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, PlayCircle, Folder, ArrowLeft, ChevronRight, FolderPlus, Plus, FileDown, FileText, FileArchive } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function ItemBank() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [qualFilter, setQualFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('item_id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [qtiVersion, setQtiVersion] = useState('1.2');
  const [importMode, setImportMode] = useState<'upload' | 'name'>('upload');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importFileName, setImportFileName] = useState('');

  const itemsWithResults = useMemo(() => {
    return mockItems.map(item => {
      const result = mockAnalysisResults.find(r => r.item_id === item.item_id);
      return { ...item, overall_score: result?.overall_score ?? 0, overall_status: result?.overall_status ?? item.status };
    });
  }, []);

  const folders = useMemo(() => {
    const map = new Map<string, { name: string; count: number; pass: number; review: number; fail: number }>();
    itemsWithResults.forEach(i => {
      const key = i.qualification;
      const entry = map.get(key) ?? { name: key, count: 0, pass: 0, review: 0, fail: 0 };
      entry.count += 1;
      if (i.overall_status === 'green') entry.pass += 1;
      else if (i.overall_status === 'amber') entry.review += 1;
      else if (i.overall_status === 'red') entry.fail += 1;
      map.set(key, entry);
    });
    customFolders.forEach(name => {
      if (!map.has(name)) map.set(name, { name, count: 0, pass: 0, review: 0, fail: 0 });
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [itemsWithResults, customFolders]);

  const filtered = useMemo(() => {
    let list = selectedFolder ? itemsWithResults.filter(i => i.qualification === selectedFolder) : itemsWithResults;
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
  }, [search, statusFilter, qualFilter, sortField, sortDir, itemsWithResults, selectedFolder]);

  const qualifications = [...new Set(mockItems.map(i => i.qualification))];

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) return;
    if (folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      toast({ title: 'Folder already exists', description: `"${name}" is already a folder.`, variant: 'destructive' });
      return;
    }
    setCustomFolders(prev => [...prev, name]);
    toast({ title: 'Folder created', description: `"${name}" was added to Item Bank.` });
    setNewFolderName('');
    setNewFolderOpen(false);
  };

  const handleImport = () => {
    const ok = importMode === 'upload' ? !!importFile : !!importFileName.trim();
    if (!ok) {
      toast({ title: 'Missing input', description: importMode === 'upload' ? 'Please choose a file.' : 'Please enter a file name.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Items imported', description: `QTI ${qtiVersion} · ${importMode === 'upload' ? importFile?.name : importFileName}` });
    setImportFile(null);
    setImportFileName('');
    setImportOpen(false);
  };

  if (!selectedFolder) {
    return (
      <div className="animate-fade-in">
        <PageHeader
          title="Item Bank"
          subtitle={`${folders.length} folders · ${mockItems.length} items total`}
          actions={
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setNewFolderOpen(true)}>
                <FolderPlus className="w-3.5 h-3.5 mr-1.5" />New Folder
              </Button>
              <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" />Export</Button>
              <Button variant="outline" size="sm"><PlayCircle className="w-3.5 h-3.5 mr-1.5" />Run Analysis</Button>
            </div>
          }
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map(f => (
            <button
              key={f.name}
              type="button"
              onClick={() => setSelectedFolder(f.name)}
              className="group text-left bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all p-4 flex items-start gap-3"
            >
              <div className="h-10 w-10 rounded-xl bg-blue-100 p-1 flex-shrink-0">
                <div className="h-full w-full rounded-sm bg-blue-600 flex items-center justify-center">
                  <Folder className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-slate-900 truncate" title={f.name}>{f.name}</h3>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{f.count} items</p>
                <div className="flex items-center gap-2 mt-2 text-[11px]">
                  <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700">Pass {f.pass}</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">Review {f.review}</span>
                  <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700">Fail {f.fail}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        <Dialog open={newFolderOpen} onOpenChange={setNewFolderOpen}>
          <DialogContent className="sm:rounded-lg">
            <DialogHeader>
              <DialogTitle>Create Item Bank Folder</DialogTitle>
              <DialogDescription>Group items under a new folder. You can move items into it from the table view.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="e.g. Pilot 2025 — Level 3"
                onKeyDown={e => { if (e.key === 'Enter') handleCreateFolder(); }}
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setNewFolderOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleCreateFolder} disabled={!newFolderName.trim()}>Create Folder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={selectedFolder}
        subtitle={`Item Bank · Showing ${filtered.length} of ${itemsWithResults.filter(i => i.qualification === selectedFolder).length} items`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSelectedFolder(null)}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />Back to Folders
            </Button>
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
                  <TableCell className="font-mono text-xs font-medium" title={item.item_id}>{item.item_id}</TableCell>
                  <TableCell className="text-xs max-w-[180px] truncate" title={item.qualification}>{item.qualification.replace('VTCT ', '')}</TableCell>
                  <TableCell className="text-xs font-mono" title={item.unit_code}>{item.unit_code}</TableCell>
                  <TableCell className="text-xs max-w-[140px] truncate" title={item.topic}>{item.topic}</TableCell>
                  <TableCell className="text-xs max-w-[160px] truncate" title={item.intended_learning_outcome}>{item.intended_learning_outcome}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap" title={String(item.qualification_level)}>{item.qualification_level}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap" title={item.item_type}>{item.item_type}</TableCell>
                  <TableCell className="text-xs max-w-[260px] truncate" title={item.stem}>{item.stem}</TableCell>
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
