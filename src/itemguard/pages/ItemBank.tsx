import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { mockItems, mockAnalysisResults } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, PlayCircle, Folder, ArrowLeft, ChevronRight, FolderPlus, Plus, FileDown, FileText, FileArchive } from 'lucide-react';
import { Trash2, Copy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ItemBank() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [qualFilter, setQualFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<string>('item_id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [view, setView] = useState<'items' | 'folders'>('items');
  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const [qtiVersion, setQtiVersion] = useState('1.2');
  const [importMode, setImportMode] = useState<'upload' | 'name'>('upload');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importFileName, setImportFileName] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [folderActionTarget, setFolderActionTarget] = useState<string | null>(null);
  const [folderDeleteOpen, setFolderDeleteOpen] = useState(false);

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

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleSelectAll = () => {
    if (selectedItems.length === filtered.length) setSelectedItems([]);
    else setSelectedItems(filtered.map(i => i.item_id));
  };
  const handleDeleteSelected = () => {
    toast({ title: 'Items deleted', description: `${selectedItems.length} item${selectedItems.length === 1 ? '' : 's'} removed from "${selectedFolder}".` });
    setSelectedItems([]);
    setDeleteConfirmOpen(false);
  };

  const handleRunAnalysis = (folderName: string) => {
    toast({ title: 'Analysis started', description: `Running analysis on "${folderName}".` });
    navigate(`/item-validation/analysis-running?folder=${encodeURIComponent(folderName)}`);
  };
  const handleDuplicateFolder = (folderName: string) => {
    const base = `${folderName} (Copy)`;
    let name = base;
    let i = 2;
    while (folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      name = `${base} ${i++}`;
    }
    setCustomFolders(prev => [...prev, name]);
    toast({ title: 'Folder duplicated', description: `Created "${name}".` });
  };
  const handleDeleteFolder = () => {
    if (!folderActionTarget) return;
    setCustomFolders(prev => prev.filter(n => n !== folderActionTarget));
    toast({ title: 'Folder deleted', description: `"${folderActionTarget}" was removed.` });
    setFolderDeleteOpen(false);
    setFolderActionTarget(null);
  };

  if (!selectedFolder) {
    return (
      <div className="animate-fade-in">
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-1.5 text-xs text-slate-500">
            <li>
              <button
                type="button"
                onClick={() => navigate('/item-validation')}
                className="hover:text-blue-600 hover:underline font-medium transition-colors"
              >
                Item Validation
              </button>
            </li>
            <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 text-slate-400" /></li>
            <li className="text-slate-700 font-medium">Item Bank</li>
          </ol>
        </nav>
        <PageHeader
          title="Item Bank"
          subtitle={view === 'folders' ? `${folders.length} folders · ${mockItems.length} items total` : `${mockItems.length} items across ${folders.length} folders`}
          actions={
            <div className="flex gap-2">
              {view === 'folders' ? (
                <Button size="sm" onClick={() => setNewFolderOpen(true)}>
                  <FolderPlus className="w-3.5 h-3.5 mr-1.5" />New Folder
                </Button>
              ) : (
                <Button size="sm" onClick={() => setImportOpen(true)}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" />Add Items
                </Button>
              )}
              <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" />Export</Button>
              <Button variant="outline" size="sm"><PlayCircle className="w-3.5 h-3.5 mr-1.5" />Run Analysis</Button>
            </div>
          }
        />

        {/* iOS-style segmented tabs */}
        <div className="mb-5 flex justify-center sm:justify-start">
          <div
            role="tablist"
            aria-label="Item Bank view"
            className="relative inline-flex items-center p-1 rounded-full bg-slate-100/80 border border-slate-200/80 backdrop-blur-sm"
          >
            <span
              aria-hidden="true"
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.08),0_1px_1px_rgba(15,23,42,0.04)] ring-1 ring-slate-200/70 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                view === 'items' ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{ left: 4 }}
            />
            {([
              { key: 'items', label: 'Items', icon: FileText },
              { key: 'folders', label: 'Folders', icon: Folder },
            ] as const).map(t => {
              const Icon = t.icon;
              const active = view === t.key;
              return (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setView(t.key)}
                  className={`relative z-10 inline-flex items-center gap-1.5 px-5 sm:px-7 h-8 rounded-full text-xs font-semibold tracking-tight transition-colors duration-200 ${
                    active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                  <span className={`ml-1 inline-flex items-center justify-center min-w-[20px] h-[18px] px-1.5 rounded-full text-[10px] font-semibold transition-colors ${
                    active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {t.key === 'items' ? mockItems.length : folders.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {view === 'folders' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {folders.map(f => (
            <div
              key={f.name}
              className="group bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-sm transition-all flex flex-col"
            >
              <button
                type="button"
                onClick={() => setSelectedFolder(f.name)}
                className="text-left p-4 flex items-start gap-3 w-full"
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
              <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-gray-100 bg-slate-50/60 rounded-b-lg">
                <Button
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); handleRunAnalysis(f.name); }}
                  className="h-8 px-3 text-xs"
                >
                  <PlayCircle className="w-3.5 h-3.5 mr-1.5" />Run Analysis
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); handleDuplicateFolder(f.name); }}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                    title="Duplicate folder"
                    aria-label={`Duplicate ${f.name}`}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setFolderActionTarget(f.name); setFolderDeleteOpen(true); }}
                    className="h-8 w-8 p-0 text-slate-500 hover:text-red-600 hover:bg-red-50"
                    title="Delete folder"
                    aria-label={`Delete ${f.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="animate-fade-in">
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
                <option value="all">All Folders</option>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
        <AlertDialog open={folderDeleteOpen} onOpenChange={setFolderDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete folder?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove "{folderActionTarget}" and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteFolder} className="bg-red-600 hover:bg-red-700">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
      <nav aria-label="Breadcrumb" className="mb-3">
        <ol className="flex items-center gap-1.5 text-xs text-slate-500">
          <li>
            <button
              type="button"
              onClick={() => navigate('/item-validation')}
              className="hover:text-blue-600 hover:underline font-medium transition-colors"
            >
              Item Validation
            </button>
          </li>
          <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 text-slate-400" /></li>
          <li>
            <button
              type="button"
              onClick={() => setSelectedFolder(null)}
              className="hover:text-blue-600 hover:underline font-medium transition-colors"
            >
              Item Bank
            </button>
          </li>
          <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 text-slate-400" /></li>
          <li className="text-slate-700 font-medium truncate max-w-[320px]" title={selectedFolder}>
            {selectedFolder}
          </li>
        </ol>
      </nav>
      <PageHeader
        title={selectedFolder}
        subtitle={`Item Bank · Showing ${filtered.length} of ${itemsWithResults.filter(i => i.qualification === selectedFolder).length} items`}
        actions={
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setImportOpen(true)}>
              <Plus className="w-3.5 h-3.5 mr-1.5" />Add Items
            </Button>
            <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" />Export</Button>
            <Button variant="outline" size="sm"><PlayCircle className="w-3.5 h-3.5 mr-1.5" />Run Analysis</Button>
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
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-slate-600">{selectedItems.length} selected</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />Delete
            </Button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-muted border-b border-gray-300 hover:bg-muted">
                <TableHead className="w-10">
                  <Checkbox
                    checked={filtered.length > 0 && selectedItems.length === filtered.length}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all items"
                    className="rounded-none"
                  />
                </TableHead>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(item => (
                <TableRow
                  key={item.item_id}
                  className="cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  onClick={() => navigate(`/item-validation/item-reports/${item.item_id}`)}
                >
                  <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedItems.includes(item.item_id)}
                      onCheckedChange={() => toggleSelectItem(item.item_id)}
                      aria-label={`Select ${item.item_id}`}
                      className="rounded-none"
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs font-medium" title={item.item_id}>{item.item_id}</TableCell>
                  <TableCell className="text-xs max-w-[180px] truncate" title={item.qualification}>{item.qualification.replace('VTCT ', '')}</TableCell>
                  <TableCell className="text-xs font-mono" title={item.unit_code}>{item.unit_code}</TableCell>
                  <TableCell className="text-xs max-w-[140px] truncate" title={item.topic}>{item.topic}</TableCell>
                  <TableCell className="text-xs max-w-[160px] truncate" title={item.intended_learning_outcome}>{item.intended_learning_outcome}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap" title={String(item.qualification_level)}>{item.qualification_level}</TableCell>
                  <TableCell className="text-xs whitespace-nowrap" title={item.item_type}>{item.item_type}</TableCell>
                  <TableCell className="text-xs max-w-[260px] truncate" title={item.stem}>{item.stem}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the selected item{selectedItems.length === 1 ? '' : 's'} from "{selectedFolder}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSelected} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="sm:rounded-2xl sm:max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-5 border-b border-slate-200 bg-slate-50/60">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 p-1 flex-shrink-0">
                <div className="h-full w-full rounded-md bg-blue-600 flex items-center justify-center">
                  <FileDown className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-left">
                <DialogTitle className="text-base font-semibold text-slate-900">Import Items</DialogTitle>
                <DialogDescription className="text-xs text-slate-500 mt-0.5">
                  Upload a QTI package or Word template to bring items into this folder.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* QTI Version + Import mode in two-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 p-3.5">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">QTI Version</Label>
                <RadioGroup value={qtiVersion} onValueChange={setQtiVersion} className="flex items-center gap-5 mt-3">
                  {['1.2', '2.0', '3.0'].map(v => (
                    <div key={v} className="flex items-center gap-2">
                      <RadioGroupItem value={v} id={`qti-${v}`} />
                      <Label htmlFor={`qti-${v}`} className="text-sm font-normal cursor-pointer text-slate-700">{v}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="rounded-lg border border-slate-200 p-3.5">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Import Using</Label>
                <RadioGroup value={importMode} onValueChange={(v) => setImportMode(v as 'upload' | 'name')} className="flex items-center gap-5 mt-3">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="upload" id="mode-upload" />
                    <Label htmlFor="mode-upload" className="text-sm font-normal cursor-pointer text-slate-700">File Upload</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="name" id="mode-name" />
                    <Label htmlFor="mode-name" className="text-sm font-normal cursor-pointer text-slate-700">File Name</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* File input area */}
            {importMode === 'upload' ? (
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Select File</Label>
                <label
                  htmlFor="import-file-input"
                  className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-2">
                    <FileDown className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {importFile ? importFile.name : 'Click to choose a file'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {importFile ? `${(importFile.size / 1024).toFixed(1)} KB` : 'QTI .zip or Word .docx'}
                  </p>
                  <input
                    id="import-file-input"
                    type="file"
                    className="hidden"
                    onChange={e => setImportFile(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="import-file-name" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">File Name</Label>
                <Select value={importFileName} onValueChange={setImportFileName}>
                  <SelectTrigger id="import-file-name" className="w-full">
                    <SelectValue placeholder="Select a file..." />
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
                    <SelectItem value="items-sample-qti12.zip">items-sample-qti12.zip</SelectItem>
                    <SelectItem value="items-sample-qti30.zip">items-sample-qti30.zip</SelectItem>
                    <SelectItem value="items-word-template.docx">items-word-template.docx</SelectItem>
                    <SelectItem value="pilot-2025-level3.zip">pilot-2025-level3.zip</SelectItem>
                    <SelectItem value="vtct-bank-export.zip">vtct-bank-export.zip</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Templates */}
            {importMode === 'upload' && (
            <div className="rounded-lg bg-blue-50/60 border border-blue-100 p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Need a starting point?</p>
                  <p className="text-xs text-slate-600 mt-0.5">Download a template that matches the selected QTI version.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-700">
                  <FileText className="w-3.5 h-3.5 mr-1.5" />Word Template
                </Button>
                <Button variant="outline" size="sm" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-700">
                  <FileArchive className="w-3.5 h-3.5 mr-1.5" />QTI 1.2 Zip
                </Button>
                <Button variant="outline" size="sm" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-700">
                  <FileArchive className="w-3.5 h-3.5 mr-1.5" />QTI 3.0 Zip
                </Button>
              </div>
            </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t border-slate-200 bg-slate-50/60">
            <Button variant="outline" size="sm" onClick={() => setImportOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={handleImport}>
              <FileDown className="w-3.5 h-3.5 mr-1.5" />Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
