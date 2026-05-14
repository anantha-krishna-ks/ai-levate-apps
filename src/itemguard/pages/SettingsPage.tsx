import { PageHeader } from '../components/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const roles = [
  { name: 'Dr. Sarah Chen', email: 'sarah.chen@org.edu', role: 'Admin' },
  { name: 'James Morrison', email: 'j.morrison@org.edu', role: 'Reviewer' },
  { name: 'Emily Watson', email: 'e.watson@org.edu', role: 'Item Writer' },
  { name: 'David Thompson', email: 'd.thompson@org.edu', role: 'Read-only Executive' },
];

export default function SettingsPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader title="Settings" subtitle="Application configuration and user management" />
      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="thresholds">Analysis Thresholds</TabsTrigger>
          <TabsTrigger value="reports">Report Templates</TabsTrigger>
          <TabsTrigger value="organisation">Organisation</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <div className="ig-kpi-card overflow-hidden p-0">
            <table className="ig-data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
              <tbody>
                {roles.map(u => (
                  <tr key={u.email}>
                    <td className="font-medium text-sm">{u.name}</td>
                    <td className="text-sm text-muted-foreground">{u.email}</td>
                    <td><span className="ig-status-badge bg-muted text-muted-foreground">{u.role}</span></td>
                    <td><Button variant="ghost" size="sm">Edit</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        <TabsContent value="thresholds">
          <div className="ig-kpi-card space-y-6">
            <h3 className="text-sm font-semibold">Default Scoring Thresholds</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Green (Pass) Threshold', value: '85' },
                { label: 'Amber (Review) Threshold', value: '60' },
                { label: 'Red (Fail) Threshold', value: 'Below 60' },
              ].map(t => (
                <div key={t.label}>
                  <label className="text-sm font-medium">{t.label}</label>
                  <input defaultValue={t.value} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground mt-1 focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              ))}
            </div>
            <h3 className="text-sm font-semibold mt-6">Critical Failure Rules</h3>
            <div className="space-y-3">
              {['Incorrect answer key', 'Strong mismatch to intended LO', 'Serious technical inaccuracy', 'Severe fairness/bias issue'].map(rule => (
                <div key={rule} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <span className="text-sm">{rule}</span>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
            <Button size="sm">Save Thresholds</Button>
          </div>
        </TabsContent>
        <TabsContent value="reports">
          <div className="ig-kpi-card space-y-4">
            <h3 className="text-sm font-semibold">PDF Report Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Report Title</label>
                <input defaultValue="Item Quality Analysis Report" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground mt-1 focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <div><label className="text-sm font-medium">Footer Text</label>
                <input defaultValue="Confidential — For Internal Use Only" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground mt-1 focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            </div>
            <Button size="sm">Save Template</Button>
          </div>
        </TabsContent>
        <TabsContent value="organisation">
          <div className="ig-kpi-card space-y-4">
            <h3 className="text-sm font-semibold">Organisation Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Organisation Name</label>
                <input defaultValue="VTCT Assessment Quality Team" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground mt-1 focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <div><label className="text-sm font-medium">Logo URL</label>
                <input defaultValue="" placeholder="Upload or paste logo URL" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card text-foreground mt-1 focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            </div>
            <Button size="sm">Save Organisation</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
