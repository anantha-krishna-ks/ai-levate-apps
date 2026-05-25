import { useRef, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { mockRules } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, ArrowLeft, FileText, HelpCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';

const GUIDELINE_TYPE_OPTIONS = [
  { value: 'Content', label: 'Content' },
  { value: 'Validation', label: 'Validation' },
];

const GUIDELINE_SUBTYPE_MAP: Record<string, string[]> = {
  Content: ['GENERAL_RULES', 'STEM_GUIDELINES', 'OPTION_GUIDELINES'],
  Validation: ['BIAS_CHECK', 'READABILITY_CHECK', 'DUPLICATE_CHECK'],
};

export default function Guidelines() {
  const [activeTab, setActiveTab] = useState('house-style');
  const [view, setView] = useState<'list' | 'add'>('list');
  const houseStyleRules = mockRules.filter(r => r.category === 'House Style');
  const qualRules = mockRules.filter(r => r.category === 'Qualification Rules');
  const rubricRules = mockRules.filter(r => r.category === 'Validation Rubric');

  if (view === 'add') {
    return <AddGuidelineView onBack={() => setView('list')} />;
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title="Guidelines" subtitle="Define and manage the validation framework"
        actions={<Button size="sm" onClick={() => setView('add')}><Plus className="w-3.5 h-3.5 mr-1.5" />Add Rule</Button>} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="house-style">House Style Rules</TabsTrigger>
          <TabsTrigger value="qualification">Qualification Rules</TabsTrigger>
          <TabsTrigger value="rubric">Validation Rubric</TabsTrigger>
          <TabsTrigger value="ai-settings">AI Prompt / Judge Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="house-style"><RuleTable rules={houseStyleRules} /></TabsContent>
        <TabsContent value="qualification"><RuleTable rules={qualRules} /></TabsContent>
        <TabsContent value="rubric"><RuleTable rules={rubricRules} /></TabsContent>
        <TabsContent value="ai-settings">
          <div className="ig-kpi-card space-y-6">
            <h3 className="text-sm font-semibold">AI Judge Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Analysis Strictness', value: 'Moderate', desc: 'Controls how strictly the AI judges against rules' },
                { label: 'Confidence Threshold', value: '75%', desc: 'Minimum confidence before flagging for human review' },
                { label: 'Similarity Threshold', value: '70%', desc: 'Threshold for duplicate detection' },
                { label: 'Readability Target', value: 'CEFR B1', desc: 'Default readability band for Level 2 items' },
                { label: 'Bias Sensitivity', value: 'High', desc: 'How sensitively the AI scans for potential bias' },
              ].map(setting => (
                <div key={setting.label} className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">{setting.label}</label>
                  <input defaultValue={setting.value}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                  <p className="text-xs text-muted-foreground">{setting.desc}</p>
                </div>
              ))}
            </div>
            <Button size="sm">Save Settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddGuidelineView({ onBack }: { onBack: () => void }) {
  const [guidelineType, setGuidelineType] = useState<string>('');
  const [guidelineSubType, setGuidelineSubType] = useState<string>('');
  const [guidelineName, setGuidelineName] = useState('');
  const [guidelinesText, setGuidelinesText] = useState('');
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
    if (!guidelinesText.trim() && !guidelineFile) {
      missing.push('Guideline to follow or Guideline Document');
    }
    if (missing.length) {
      toast({ title: 'Validation Error', description: 'Missing: ' + missing.join(', '), variant: 'destructive' });
      return;
    }
    toast({ title: 'Guideline Uploaded', description: 'Your guideline has been added successfully.' });
    onBack();
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-2">
        <Button variant="ghost" size="sm" className="h-8 -ml-2 text-slate-600" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1.5" />Back
        </Button>
      </div>
      <PageHeader title="Add New Guideline" subtitle="Define a new validation or content guideline" />
      <Card className="border-2 border-slate-200 bg-slate-50 mt-4">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Add New Guideline</h3>
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
                disabled={!isTypeSelected}
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
                disabled={Boolean(guidelineSubType) && !(guidelineType === 'Content' && guidelineSubType === 'GENERAL_RULES')}
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
              Upload Guideline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RuleTable({ rules }: { rules: typeof mockRules }) {
  return (
    <div className="ig-kpi-card overflow-hidden p-0">
      <table className="ig-data-table">
        <thead>
          <tr><th>Rule</th><th>Description</th><th>Scope</th><th>Level</th><th>Weight</th><th>Pass / Amber</th><th>Enabled</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {rules.map(rule => (
            <tr key={rule.rule_id}>
              <td className="font-medium text-xs">{rule.rule_name}</td>
              <td className="text-xs max-w-[200px] text-muted-foreground">{rule.rule_description}</td>
              <td className="text-xs">{rule.qualification_scope}</td>
              <td className="text-xs">{rule.level_scope}</td>
              <td className="text-xs font-mono">{rule.weight}</td>
              <td className="text-xs font-mono">{rule.pass_threshold} / {rule.amber_threshold}</td>
              <td><Switch defaultChecked={rule.enabled} /></td>
              <td>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm"><Edit className="w-3.5 h-3.5" /></Button>
                  <Button variant="ghost" size="sm"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
