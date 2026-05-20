import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { mockItems, mockAnalysisResults } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, PlayCircle, Folder, ArrowLeft, ChevronRight, ChevronLeft, FolderPlus, Plus, FileDown, FileText, FileArchive, Lock, Sparkles, Info, FolderInput, FlaskConical, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Trash2, Copy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
  const [customFolderItems, setCustomFolderItems] = useState<Record<string, string[]>>({});
  const [addToSetOpen, setAddToSetOpen] = useState(false);
  const [newSetName, setNewSetName] = useState('');
  const [highlightFolder, setHighlightFolder] = useState<string | null>(null);
  const [blockedDeleteOpen, setBlockedDeleteOpen] = useState(false);
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [itemsLoaded, setItemsLoaded] = useState(false);

  // Deterministic field-test lock flag (~25% of items locked)
  const isInFieldTest = (id: string) => {
    const n = parseInt(id.replace(/\D/g, ''), 10) || 0;
    return n % 4 === 0;
  };

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
      if (!map.has(name)) {
        const ids = customFolderItems[name] ?? [];
        const members = itemsWithResults.filter(i => ids.includes(i.item_id));
        map.set(name, {
          name,
          count: members.length,
          pass: members.filter(m => m.overall_status === 'green').length,
          review: members.filter(m => m.overall_status === 'amber').length,
          fail: members.filter(m => m.overall_status === 'red').length,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [itemsWithResults, customFolders, customFolderItems]);

  const filtered = useMemo(() => {
    let list = itemsWithResults;
    if (selectedFolder) {
      if (customFolderItems[selectedFolder]) {
        const ids = customFolderItems[selectedFolder];
        list = itemsWithResults.filter(i => ids.includes(i.item_id));
      } else {
        list = itemsWithResults.filter(i => i.qualification === selectedFolder);
      }
    }
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
  }, [search, statusFilter, qualFilter, sortField, sortDir, itemsWithResults, selectedFolder, customFolderItems]);

  const qualifications = [...new Set(mockItems.map(i => i.qualification))];

  // Reset to first page when filters/search change
  useEffect(() => { setPage(1); }, [search, statusFilter, qualFilter, pageSize, view, selectedFolder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * pageSize;
  const paged = filtered.slice(pageStart, pageStart + pageSize);

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
    setItemsLoaded(true);
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
    setCustomFolderItems(prev => {
      const { [folderActionTarget]: _, ...rest } = prev;
      return rest;
    });
    toast({ title: 'Folder deleted', description: `"${folderActionTarget}" was removed.` });
    setFolderDeleteOpen(false);
    setFolderActionTarget(null);
  };

  // ===== Selection-based bulk actions for the Items tab =====
  const selectedLockedIds = selectedItems.filter(isInFieldTest);
  const canBulkDelete = selectedItems.length > 0 && selectedLockedIds.length === 0;
  const canAddToSet = selectedItems.length >= 20;

  const handleConfirmAddToSet = () => {
    const name = newSetName.trim();
    if (!name) return;
    if (folders.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      toast({ title: 'Folder already exists', description: `"${name}" is already a folder.`, variant: 'destructive' });
      return;
    }
    const ids = [...selectedItems];
    setCustomFolders(prev => [...prev, name]);
    setCustomFolderItems(prev => ({ ...prev, [name]: ids }));
    setNewSetName('');
    setAddToSetOpen(false);
    setSelectedItems([]);
    toast({ title: 'Item set created', description: `${ids.length} items added to "${name}".` });
    // Switch to Folders tab and highlight the new card
    setHighlightFolder(name);
    setTimeout(() => setView('folders'), 250);
    setTimeout(() => setHighlightFolder(null), 3200);
  };

  const handleBulkDeleteClick = () => {
    if (selectedLockedIds.length > 0) {
      setBlockedDeleteOpen(true);
      return;
    }
    setDeleteConfirmOpen(true);
  };

  const handleSingleDelete = (id: string) => {
    if (isInFieldTest(id)) {
      setBlockedDeleteOpen(true);
      return;
    }
    toast({ title: 'Item deleted', description: `${id} has been removed.` });
  };

  const importDialog = (
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
                Upload a QTI package or Word template to bring items into the Item Bank.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 p-3.5">
              <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">QTI Version</Label>
              <RadioGroup value={qtiVersion} onValueChange={setQtiVersion} className="flex items-center gap-5 mt-3">
                {['1.2', '2.0', '3.0'].map(v => (
                  <div key={v} className="flex items-center gap-2">
                    <RadioGroupItem value={v} id={`qti2-${v}`} />
                    <Label htmlFor={`qti2-${v}`} className="text-sm font-normal cursor-pointer text-slate-700">{v}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="rounded-lg border border-slate-200 p-3.5">
              <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Import Using</Label>
              <RadioGroup value={importMode} onValueChange={(v) => setImportMode(v as 'upload' | 'name')} className="flex items-center gap-5 mt-3">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="upload" id="mode2-upload" />
                  <Label htmlFor="mode2-upload" className="text-sm font-normal cursor-pointer text-slate-700">File Upload</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="name" id="mode2-name" />
                  <Label htmlFor="mode2-name" className="text-sm font-normal cursor-pointer text-slate-700">File Name</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          {importMode === 'upload' ? (
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Select File</Label>
              <label
                htmlFor="import-file-input-2"
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
                  id="import-file-input-2"
                  type="file"
                  className="hidden"
                  onChange={e => setImportFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="import-file-name-2" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">File Name</Label>
              <Select value={importFileName} onValueChange={setImportFileName}>
                <SelectTrigger id="import-file-name-2" className="w-full">
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
          {importMode === 'upload' && (
            <div className="rounded-lg bg-blue-50/60 border border-blue-100 p-4">
              <div className="mb-3">
                <p className="text-sm font-semibold text-slate-900">Need a starting point?</p>
                <p className="text-xs text-slate-600 mt-0.5">Download a template that matches the selected QTI version.</p>
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
  );

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
        <div className="mb-6 flex justify-center">
          <div
            role="tablist"
            aria-label="Item Bank view"
            className="relative inline-flex items-center p-1.5 rounded-full bg-slate-100/80 border border-slate-200/80 backdrop-blur-sm"
          >
            <span
              aria-hidden="true"
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.1),0_1px_2px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                view === 'items' ? 'translate-x-0' : 'translate-x-full'
              }`}
              style={{ left: 6 }}
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
                  className={`relative z-10 inline-flex items-center gap-2 px-7 sm:px-10 h-11 rounded-full text-sm font-semibold tracking-tight transition-colors duration-200 ${
                    active ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t.label}
                  <span className={`ml-1 inline-flex items-center justify-center min-w-[22px] h-[20px] px-1.5 rounded-full text-[11px] font-semibold transition-colors ${
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
              className={`group bg-white rounded-lg border transition-all flex flex-col ${
                highlightFolder === f.name
                  ? 'border-blue-500 ring-4 ring-blue-200/70 animate-scale-in shadow-lg'
                  : 'border-gray-200 hover:border-blue-400 hover:shadow-sm'
              }`}
            >
              {highlightFolder === f.name && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border-b border-blue-100 text-blue-700 text-[11px] font-semibold rounded-t-lg">
                  <Sparkles className="w-3 h-3" />
                  Newly created
                </div>
              )}
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
          !itemsLoaded ? (
            <div className="animate-fade-in bg-white rounded-2xl border border-gray-200 px-6 py-14 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 mb-5">
                <svg viewBox="0 0 200 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <defs>
                    <linearGradient id="emptyBg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#eff6ff" />
                      <stop offset="100%" stopColor="#dbeafe" />
                    </linearGradient>
                  </defs>
                  <circle cx="100" cy="100" r="78" fill="url(#emptyBg)" />
                  {/* floating shapes */}
                  <g style={{ transformOrigin: '60px 60px', animation: 'float-a 4s ease-in-out infinite' }}>
                    <rect x="42" y="44" width="34" height="34" rx="8" fill="#bfdbfe" opacity="0.85" />
                  </g>
                  <g style={{ transformOrigin: '150px 70px', animation: 'float-b 5s ease-in-out infinite' }}>
                    <circle cx="150" cy="70" r="14" fill="#93c5fd" opacity="0.9" />
                  </g>
                  <g style={{ transformOrigin: '150px 145px', animation: 'float-a 6s ease-in-out infinite reverse' }}>
                    <rect x="138" y="132" width="26" height="26" rx="6" fill="#bfdbfe" opacity="0.7" />
                  </g>
                  {/* main folder/document card */}
                  <g style={{ transformOrigin: '100px 110px', animation: 'float-main 5s ease-in-out infinite' }}>
                    <rect x="60" y="78" width="80" height="64" rx="10" fill="#ffffff" stroke="#3b82f6" strokeWidth="2.5" />
                    <rect x="70" y="92" width="44" height="5" rx="2.5" fill="#bfdbfe" />
                    <rect x="70" y="104" width="60" height="5" rx="2.5" fill="#dbeafe" />
                    <rect x="70" y="116" width="36" height="5" rx="2.5" fill="#dbeafe" />
                    <circle cx="128" cy="84" r="10" fill="#3b82f6" />
                    <path d="M124 84 L127 87 L132 81" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </svg>
                <style>{`
                  @keyframes float-main { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
                  @keyframes float-a { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-4px) rotate(2deg)} }
                  @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }
                `}</style>
              </div>
              <h3 className="text-base font-semibold text-slate-900">No items yet</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Your Item Bank is empty. Import a QTI package or Word template to start curating, analyzing, and grouping items.
              </p>
              <Button size="sm" onClick={() => setImportOpen(true)} className="mt-5 h-9 rounded-full px-5 gap-1.5">
                <Plus className="w-3.5 h-3.5" />Add Items
              </Button>
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

            {/* Selection action bar */}
            {selectedItems.length > 0 && (
              <TooltipProvider delayDuration={150}>
                <div className="mb-4 flex flex-wrap items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 animate-fade-in">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center justify-center min-w-[26px] h-[22px] px-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold">
                      {selectedItems.length}
                    </span>
                    <span className="font-medium text-slate-800">selected</span>
                    {selectedLockedIds.length > 0 && (
                      <span className="ml-1 inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        <Lock className="w-3 h-3" /> {selectedLockedIds.length} locked
                      </span>
                    )}
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            size="sm"
                            onClick={() => setAddToSetOpen(true)}
                            disabled={!canAddToSet}
                            className="h-9 rounded-full px-4 gap-1.5"
                          >
                            <FolderInput className="w-3.5 h-3.5" />
                            Add to Item Set
                            {!canAddToSet && (
                              <span className="ml-1 text-[10px] font-medium opacity-90">
                                ({selectedItems.length}/20)
                              </span>
                            )}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!canAddToSet && (
                        <TooltipContent side="bottom">
                          Minimum 20 items required ({20 - selectedItems.length} more to go)
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleBulkDeleteClick}
                            disabled={!canBulkDelete}
                            className={`h-9 rounded-full px-4 gap-1.5 ${
                              canBulkDelete
                                ? 'text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300'
                                : 'text-slate-400 border-slate-200'
                            }`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </Button>
                        </span>
                      </TooltipTrigger>
                      {!canBulkDelete && (
                        <TooltipContent side="bottom">
                          {selectedLockedIds.length} selected item{selectedLockedIds.length === 1 ? ' is' : 's are'} in a field test run and cannot be deleted
                        </TooltipContent>
                      )}
                    </Tooltip>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItems([])}
                      className="h-9 rounded-full px-3 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </TooltipProvider>
            )}

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-muted border-b border-gray-300 hover:bg-muted">
                      <TableHead className="w-10">
                        <Checkbox
                          checked={filtered.length > 0 && filtered.every(i => selectedItems.includes(i.item_id))}
                          onCheckedChange={(c) => {
                            if (c) setSelectedItems(prev => Array.from(new Set([...prev, ...filtered.map(i => i.item_id)])));
                            else setSelectedItems(prev => prev.filter(id => !filtered.some(i => i.item_id === id)));
                          }}
                          aria-label="Select all"
                          className="rounded-none border-slate-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
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
                      <TableHead className="w-12 text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TooltipProvider delayDuration={150}>
                      {paged.map(item => {
                        const locked = isInFieldTest(item.item_id);
                        const isSelected = selectedItems.includes(item.item_id);
                        return (
                          <TableRow
                            key={item.item_id}
                            className={`cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                              isSelected ? 'bg-blue-50/60 hover:bg-blue-50' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => navigate(`/item-validation/item-reports/${item.item_id}`)}
                          >
                            <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleSelectItem(item.item_id)}
                                aria-label={`Select ${item.item_id}`}
                                className="rounded-none border-slate-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                            </TableCell>
                            <TableCell className="font-mono text-xs font-medium" title={item.item_id}>
                              <div className="flex items-center gap-2">
                                <span>{item.item_id}</span>
                                {locked && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span className="inline-flex items-center gap-1 pl-1 pr-2 py-[3px] rounded-full bg-amber-50 ring-1 ring-amber-200/80 text-amber-800 text-[10px] font-semibold tracking-wide leading-none transition-colors hover:bg-amber-100">
                                        <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-amber-500/15">
                                          <FlaskConical className="w-2.5 h-2.5 text-amber-700" />
                                        </span>
                                        Field Test
                                      </span>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="max-w-xs">
                                      Live in an active field test run — locked from deletion until the test concludes.
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-xs max-w-[180px] truncate" title={item.qualification}>{item.qualification.replace('VTCT ', '')}</TableCell>
                            <TableCell className="text-xs font-mono" title={item.unit_code}>{item.unit_code}</TableCell>
                            <TableCell className="text-xs max-w-[140px] truncate" title={item.topic}>{item.topic}</TableCell>
                            <TableCell className="text-xs max-w-[160px] truncate" title={item.intended_learning_outcome}>{item.intended_learning_outcome}</TableCell>
                            <TableCell className="text-xs whitespace-nowrap" title={String(item.qualification_level)}>{item.qualification_level}</TableCell>
                            <TableCell className="text-xs whitespace-nowrap" title={item.item_type}>{item.item_type}</TableCell>
                            <TableCell className="text-xs max-w-[260px] truncate" title={item.stem}>{item.stem}</TableCell>
                            <TableCell className="w-12 text-right" onClick={(e) => e.stopPropagation()}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleSingleDelete(item.item_id)}
                                      disabled={locked}
                                      className={`h-7 w-7 p-0 ${
                                        locked
                                          ? 'text-slate-300 cursor-not-allowed'
                                          : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                                      }`}
                                      aria-label={`Delete ${item.item_id}`}
                                    >
                                      {locked ? <Lock className="w-3.5 h-3.5" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="left">
                                  {locked
                                    ? 'Locked: item is in a field test run'
                                    : 'Delete item'}
                                </TooltipContent>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TooltipProvider>
                  </TableBody>
                </Table>
              </div>
              {filtered.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-gray-200 bg-slate-50/60">
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span>
                      Showing <span className="font-semibold text-slate-900">{pageStart + 1}</span>
                      –<span className="font-semibold text-slate-900">{Math.min(pageStart + pageSize, filtered.length)}</span>
                      {' '}of <span className="font-semibold text-slate-900">{filtered.length}</span>
                    </span>
                    <span className="hidden sm:inline h-3 w-px bg-slate-300" />
                    <div className="hidden sm:flex items-center gap-1.5">
                      <span>Rows</span>
                      <select
                        value={pageSize}
                        onChange={e => setPageSize(Number(e.target.value))}
                        className="h-7 rounded-md border border-slate-200 bg-white px-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      >
                        {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => setPage(1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 disabled:opacity-30"
                      aria-label="First page"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 disabled:opacity-30"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {(() => {
                      const pages: (number | 'gap')[] = [];
                      const add = (n: number) => pages.push(n);
                      if (totalPages <= 7) {
                        for (let i = 1; i <= totalPages; i++) add(i);
                      } else {
                        add(1);
                        if (currentPage > 4) pages.push('gap');
                        const start = Math.max(2, currentPage - 1);
                        const end = Math.min(totalPages - 1, currentPage + 1);
                        for (let i = start; i <= end; i++) add(i);
                        if (currentPage < totalPages - 3) pages.push('gap');
                        add(totalPages);
                      }
                      return pages.map((p, idx) =>
                        p === 'gap' ? (
                          <span key={`gap-${idx}`} className="px-1 text-slate-400 text-xs">…</span>
                        ) : (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setPage(p)}
                            aria-current={currentPage === p ? 'page' : undefined}
                            className={`min-w-[32px] h-8 px-2 rounded-full text-xs font-semibold tracking-tight transition-all ${
                              currentPage === p
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:ring-1 hover:ring-slate-200'
                            }`}
                          >
                            {p}
                          </button>
                        )
                      );
                    })()}
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 disabled:opacity-30"
                      aria-label="Next page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost" size="sm"
                      onClick={() => setPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0 rounded-full text-slate-500 hover:text-slate-900 disabled:opacity-30"
                      aria-label="Last page"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
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

        {/* Add to Item Set dialog */}
        <Dialog open={addToSetOpen} onOpenChange={setAddToSetOpen}>
          <DialogContent className="sm:rounded-xl">
            <DialogHeader>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 p-1 flex-shrink-0">
                  <div className="h-full w-full rounded-md bg-blue-600 flex items-center justify-center">
                    <FolderInput className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <DialogTitle>Create Item Set</DialogTitle>
                  <DialogDescription>
                    Group the {selectedItems.length} selected items into a new folder set.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="set-name">Folder set name</Label>
              <Input
                id="set-name"
                value={newSetName}
                onChange={e => setNewSetName(e.target.value)}
                placeholder="e.g. Pilot Batch — Spring 2026"
                onKeyDown={e => { if (e.key === 'Enter') handleConfirmAddToSet(); }}
                autoFocus
              />
              <p className="text-[11px] text-slate-500">
                The new folder set will appear in the Folders tab immediately.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setAddToSetOpen(false)}>Cancel</Button>
              <Button size="sm" onClick={handleConfirmAddToSet} disabled={!newSetName.trim()}>
                <FolderInput className="w-3.5 h-3.5 mr-1.5" />Create Set
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Blocked delete explanation */}
        <AlertDialog open={blockedDeleteOpen} onOpenChange={setBlockedDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-100 flex-shrink-0 flex items-center justify-center">
                  <Lock className="h-4 w-4 text-amber-700" />
                </div>
                <div>
                  <AlertDialogTitle>Some items can't be deleted</AlertDialogTitle>
                  <AlertDialogDescription className="mt-1">
                    {selectedLockedIds.length > 0
                      ? `${selectedLockedIds.length} of your selected item${selectedLockedIds.length === 1 ? ' is' : 's are'} currently part of an active field test run and are locked from deletion.`
                      : 'This item is currently part of an active field test run and is locked from deletion.'}
                  </AlertDialogDescription>
                </div>
              </div>
            </AlertDialogHeader>
            {selectedLockedIds.length > 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 max-h-40 overflow-y-auto">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800 mb-2">Locked items</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLockedIds.map(id => (
                    <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-amber-200 text-[11px] font-mono text-amber-800">
                      <Lock className="w-2.5 h-2.5" />{id}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 text-[12px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <Info className="w-3.5 h-3.5 mt-0.5 text-blue-600 flex-shrink-0" />
              <span>
                Items used in a field test must stay intact to preserve the integrity of the run. Once the field test concludes, the lock will be released automatically.
              </span>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Close</AlertDialogCancel>
              {selectedItems.length - selectedLockedIds.length > 0 && (
                <AlertDialogAction
                  onClick={() => {
                    setSelectedItems(prev => prev.filter(id => !isInFieldTest(id)));
                    setBlockedDeleteOpen(false);
                    setTimeout(() => setDeleteConfirmOpen(true), 150);
                  }}
                >
                  Skip locked & delete {selectedItems.length - selectedLockedIds.length}
                </AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk delete confirm (items tab) */}
        <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete {selectedItems.length} item{selectedItems.length === 1 ? '' : 's'}?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the selected item{selectedItems.length === 1 ? '' : 's'} from the Item Bank. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  toast({ title: 'Items deleted', description: `${selectedItems.length} item${selectedItems.length === 1 ? '' : 's'} removed.` });
                  setSelectedItems([]);
                  setDeleteConfirmOpen(false);
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
