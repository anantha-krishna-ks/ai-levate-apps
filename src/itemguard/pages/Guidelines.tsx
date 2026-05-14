import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { mockRules } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function Guidelines() {
  const [activeTab, setActiveTab] = useState('house-style');
  const houseStyleRules = mockRules.filter(r => r.category === 'House Style');
  const qualRules = mockRules.filter(r => r.category === 'Qualification Rules');
  const rubricRules = mockRules.filter(r => r.category === 'Validation Rubric');

  return (
    <div className="animate-fade-in">
      <PageHeader title="Guidelines & Rules" subtitle="Define and manage the validation framework"
        actions={<Button size="sm"><Plus className="w-3.5 h-3.5 mr-1.5" />Add Rule</Button>} />
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
