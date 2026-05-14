import { PageHeader } from '../components/PageHeader';
import { mockDocuments } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { Upload, FileText, ExternalLink, Search } from 'lucide-react';
import { useState } from 'react';

const statusColors: Record<string, string> = {
  completed: 'ig-status-green',
  processing: 'ig-status-amber',
  pending: 'ig-status-amber',
  failed: 'ig-status-red',
};

export default function QualificationSpecs() {
  const [search, setSearch] = useState('');
  const filtered = mockDocuments.filter(d =>
    !search || d.title.toLowerCase().includes(search.toLowerCase()) || d.qualification.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title="Qualification Specs" subtitle="Knowledge base for AI-grounded validation"
        actions={<Button size="sm"><Upload className="w-3.5 h-3.5 mr-1.5" />Upload Document</Button>} />
      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filtered.map(doc => (
          <div key={doc.document_id} className="ig-kpi-card">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted"><FileText className="w-5 h-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{doc.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{doc.qualification}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                  <span>Type: {doc.document_type}</span><span>Version: {doc.version}</span><span>Level: {doc.level}</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`ig-status-badge ${statusColors[doc.extraction_status]}`}>
                    {doc.extraction_status === 'completed' ? 'Extracted' : doc.extraction_status === 'processing' ? 'Processing' : doc.extraction_status}
                  </span>
                  {doc.linked_los.length > 0 && (
                    <span className="text-xs text-muted-foreground">{doc.linked_los.length} linked LOs</span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="sm"><ExternalLink className="w-3.5 h-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
      <div className="ig-kpi-card">
        <h3 className="text-sm font-semibold mb-4">RAG Knowledge Base Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Documents Indexed', value: '6' },
            { label: 'Total Chunks', value: '2,847' },
            { label: 'Learning Outcomes', value: '342' },
            { label: 'Assessment Criteria', value: '1,205' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="text-xl font-bold">{stat.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">How this works</p>
          <p>Documents are ingested, chunked, and embedded into a vector store. During analysis, the AI retrieves relevant specification excerpts to ground its validation against official qualification standards.</p>
        </div>
      </div>
    </div>
  );
}
