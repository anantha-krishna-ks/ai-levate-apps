import ManageKnowledgeBase from '@/pages/ManageKnowledgeBase';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export default function QualificationSpecs() {
  const navigate = useNavigate();
  return (
    <div className="animate-fade-in">
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm">
          <li>
            <button
              type="button"
              onClick={() => navigate('/item-validation')}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-blue-700 font-medium transition-colors"
            >
              <Home className="w-4 h-4" />
              Item Validation
            </button>
          </li>
          <li aria-hidden="true" className="text-slate-300">/</li>
          <li className="text-slate-900 font-semibold" aria-current="page">Knowledge Base</li>
        </ol>
      </nav>

      <PageHeader title="Knowledge Base" />

      <ManageKnowledgeBase embedded />
    </div>
  );
}
