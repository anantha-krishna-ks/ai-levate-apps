import { useMemo, useRef, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ArrowLeft, FileText, HelpCircle, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const GUIDELINE_TYPE_OPTIONS = [
  { value: 'Content', label: 'Content' },
  { value: 'Validation', label: 'Validation' },
];

const GUIDELINE_SUBTYPE_MAP: Record<string, string[]> = {
  Content: ['GENERAL_RULES', 'STEM_GUIDELINES', 'OPTION_GUIDELINES'],
  Validation: ['BIAS_CHECK', 'READABILITY_CHECK', 'DUPLICATE_CHECK'],
};

type GuidelineRow = {
  guidelineid: string;
  guidelinename: string;
  guidelinetype: string;
  guidelinesubtype?: string;
  guidelinetext?: string;
};

const INITIAL_GUIDELINES: GuidelineRow[] = [
  { guidelineid: 'g1', guidelinename: 'Maximum Stem Length', guidelinetype: 'Content', guidelinesubtype: 'STEM_GUIDELINES', guidelinetext: 'Question stems should not exceed 40 words.' },
  { guidelineid: 'g2', guidelinename: 'Maximum Options', guidelinetype: 'Content', guidelinesubtype: 'OPTION_GUIDELINES', guidelinetext: 'MCQ items should have exactly 4 options.' },
  { guidelineid: 'g3', guidelinename: 'Avoid Negative Phrasing', guidelinetype: 'Content', guidelinesubtype: 'GENERAL_RULES', guidelinetext: 'Avoid NOT/EXCEPT unless testing negative knowledge.' },
  { guidelineid: 'g4', guidelinename: 'BIAS_CHECK', guidelinetype: 'Validation', guidelinesubtype: 'BIAS_CHECK', guidelinetext: 'Flag biased language across protected groups.' },
  { guidelineid: 'g5', guidelinename: 'READABILITY_CHECK', guidelinetype: 'Validation', guidelinesubtype: 'READABILITY_CHECK', guidelinetext: 'Ensure items match the CEFR B1 readability band.' },
  { guidelineid: 'g6', guidelinename: 'Question Stem Generation', guidelinetype: 'Question Generation', guidelinetext: 'Default prompt for stem generation.' },
];

export default function Guidelines() {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [guidelines, setGuidelines] = useState<GuidelineRow[]>(INITIAL_GUIDELINES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [editing, setEditing] = useState<GuidelineRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<GuidelineRow | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return guidelines.filter(g => {
      const matchesType = typeFilter === 'All' || g.guidelinetype === typeFilter;
      const matchesSearch = !q || g.guidelinename.toLowerCase().includes(q) || g.guidelinetype.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [guidelines, searchQuery, typeFilter]);

  const handleSave = (row: GuidelineRow) => {
    setGuidelines(prev => {
      const exists = prev.some(g => g.guidelineid === row.guidelineid);
      return exists ? prev.map(g => g.guidelineid === row.guidelineid ? row : g) : [row, ...prev];
    });
    setView('list');
    setEditing(null);
  };

  if (view === 'add') {
    return (
      <AddGuidelineView
        initial={editing}
        onBack={() => { setView('list'); setEditing(null); }}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Guidelines" subtitle="Define and manage the validation framework" />

      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">All Guidelines</h2>
          <Button
            onClick={() => { setEditing(null); setView('add'); }}
            className="px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Guideline
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
            <Input
              placeholder="Search guidelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-48 bg-white border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50 min-w-48">
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Content">Content</SelectItem>
              <SelectItem value="Validation">Validation</SelectItem>
              <SelectItem value="Question Generation">Question Generation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[150px]">
          {filtered.length === 0 ? (
            <div className="p-6 text-center">
              <div className="flex flex-col items-center justify-center py-4">
                <Search className="h-10 w-10 text-gray-400 mb-3" />
                <h3 className="text-md font-medium text-gray-900 mb-1">
                  {searchQuery ? 'No Guidelines match your search.' : 'No guidelines available.'}
                </h3>
                {searchQuery && <p className="text-gray-500 text-sm">Try a different search term</p>}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted border-b border-gray-300 hover:bg-muted">
                    <TableHead className="w-[45%]">Guideline Name</TableHead>
                    <TableHead className="w-[30%]">Guideline Type</TableHead>
                    <TableHead className="w-[25%] text-right pr-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(g => {
                    const isQG = g.guidelinetype === 'Question Generation';
                    const isValidation = g.guidelinetype === 'Validation';
                    const deleteDisabled = isQG || isValidation;
                    return (
                      <TableRow key={g.guidelineid} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                        <TableCell className="font-medium text-gray-900 py-4 truncate">{g.guidelinename}</TableCell>
                        <TableCell className="py-4 truncate">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
                            {g.guidelinetype}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              title={isQG ? 'View' : 'Edit'}
                              className="h-9 w-9 hover:bg-blue-100"
                              onClick={() => { setEditing(g); setView('add'); }}
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                              className="h-9 w-9 hover:bg-red-100"
                              disabled={deleteDisabled}
                              style={{ opacity: deleteDisabled ? 0.5 : 1, cursor: deleteDisabled ? 'not-allowed' : 'pointer' }}
                              onClick={() => setPendingDelete(g)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Guideline</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <span className="font-semibold">{pendingDelete?.guidelinename}</span>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (pendingDelete) {
                  setGuidelines(prev => prev.filter(g => g.guidelineid !== pendingDelete.guidelineid));
                  toast({ title: 'Guideline deleted', description: `${pendingDelete.guidelinename} has been removed.` });
                }
                setPendingDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function AddGuidelineView({
  onBack,
  onSave,
  initial,
}: {
  onBack: () => void;
  onSave: (row: GuidelineRow) => void;
  initial: GuidelineRow | null;
}) {
  const isEditing = !!initial;
  const [guidelineType, setGuidelineType] = useState<string>(initial?.guidelinetype || '');
  const [guidelineSubType, setGuidelineSubType] = useState<string>(initial?.guidelinesubtype || '');
  const [guidelineName, setGuidelineName] = useState(initial?.guidelinename || '');
  const [guidelinesText, setGuidelinesText] = useState(initial?.guidelinetext || '');
  const [guidelineFile, setGuidelineFile] = useState<File | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isTypeSelected = guidelineType === 'Content' || guidelineType === 'Validation';
  const subtypeOptions = guidelineType ? (GUIDELINE_SUBTYPE_MAP[guidelineType] || []) : [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isValid = /\.(txt|pdf)$/i.test(file.name);
    if (!isValid) {
      toast({ title: 'Invalid file', description: 'Only .txt or .pdf files are allowed.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max file size is 5MB.', variant: 'destructive' });
      return;
    }
    setGuidelineFile(file);
  };

  const handleUpload = () => {
    const missing: string[] = [];
    if (!guidelineType) missing.push('Guideline Type');
    const isContentGeneralRules = guidelineType === 'Content' && guidelineSubType === 'GENERAL_RULES';
    if (isContentGeneralRules) {
      if (!guidelineName.trim()) missing.push('Guideline Name');
    } else if (!guidelineSubType && !guidelineName.trim()) {
      missing.push('Guideline Name or Subtype');
    }
    if (!guidelinesText.trim() && !guidelineFile && !isEditing) {
      missing.push('Guideline to follow or Guideline Document');
    }
    if (missing.length) {
      toast({ title: 'Validation Error', description: 'Missing: ' + missing.join(', '), variant: 'destructive' });
      return;
    }
    const useName = (guidelineSubType && !(guidelineType === 'Content' && guidelineSubType === 'GENERAL_RULES'))
      ? guidelineSubType
      : guidelineName.trim();
    onSave({
      guidelineid: initial?.guidelineid || `g_${Date.now()}`,
      guidelinename: useName,
      guidelinetype: guidelineType,
      guidelinesubtype: guidelineSubType || undefined,
      guidelinetext: guidelinesText,
    });
    toast({
      title: isEditing ? 'Guideline Updated' : 'Guideline Uploaded',
      description: `${useName} has been ${isEditing ? 'updated' : 'added'} successfully.`,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-2">
        <Button variant="ghost" size="sm" className="h-8 -ml-2 text-slate-600" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />Back
        </Button>
      </div>
      <PageHeader
        title={isEditing ? 'Edit Guideline' : 'Add New Guideline'}
        subtitle={isEditing ? 'Update an existing guideline' : 'Define a new validation or content guideline'}
      />
      <Card className="border-2 border-slate-200 bg-slate-50 mt-4">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{isEditing ? 'Edit Guideline' : 'Add New Guideline'}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-700 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="max-w-md bg-white text-black border-gray-200 px-4 py-3 rounded-lg shadow-lg">
                  <div className="space-y-2 text-sm leading-relaxed">
                    <p>Guideline Type can be selected from the Guideline Type dropdown.</p>
                    <p>Guideline Subtype is optional. If unused, enter any custom name in Guideline Name.</p>
                    <p>In <span className="font-semibold">Guideline to follow</span> you can type text or upload a TXT/PDF file (max 5MB).</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                Guideline Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={guidelineType}
                onValueChange={(value) => {
                  setGuidelineType(value);
                  setGuidelineSubType('');
                  setGuidelineName('');
                }}
                disabled={isEditing}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select guideline type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {GUIDELINE_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">Guideline Subtype</Label>
              <Select
                value={guidelineSubType}
                onValueChange={(val) => {
                  setGuidelineSubType(val);
                  const isContentGeneralRules = guidelineType === 'Content' && val === 'GENERAL_RULES';
                  if (val && !isContentGeneralRules) setGuidelineName(val);
                }}
                disabled={!isTypeSelected || isEditing}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select subtype" />
                </SelectTrigger>
                <SelectContent className="bg-white max-h-60 overflow-y-auto">
                  {subtypeOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-900">
                Guideline Name <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter guideline name"
                className="bg-white border-gray-300"
                value={guidelineName}
                onChange={(e) => setGuidelineName(e.target.value)}
                disabled={isEditing || (Boolean(guidelineSubType) && !(guidelineType === 'Content' && guidelineSubType === 'GENERAL_RULES'))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Guideline to follow</Label>
            <Textarea
              placeholder="Enter guidelines here..."
              value={guidelinesText}
              onChange={(e) => setGuidelinesText(e.target.value)}
              className="bg-white border-gray-300 min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-900">Guideline Document (TXT / PDF)</Label>
            <input
              type="file"
              accept=".txt,.pdf"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div
              className={`bg-white border-2 border-dashed ${isDraggingOver ? 'border-blue-500' : 'border-gray-300'} rounded-lg p-8 text-center space-y-3 hover:border-gray-400 transition-colors cursor-pointer`}
              onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDraggingOver(false); }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFileChange({ target: { files: e.dataTransfer.files } } as any);
                  e.dataTransfer.clearData();
                }
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex justify-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <FileText className="h-8 w-8 text-blue-700" />
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {guidelineFile ? guidelineFile.name : 'Drag guideline file here or click to select'}
                </p>
                <p className="text-sm text-gray-600 mt-1">.txt or .pdf, max 5MB</p>
              </div>
              {guidelineFile && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); setGuidelineFile(null); }}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onBack}>Cancel</Button>
            <Button
              className="bg-blue-600 hover:bg-blue-600 text-white"
              disabled={!isTypeSelected}
              onClick={handleUpload}
            >
              {isEditing ? 'Update Guideline' : 'Upload Guideline'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

