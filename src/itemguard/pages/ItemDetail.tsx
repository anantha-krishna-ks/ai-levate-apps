import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { mockItems, mockAnalysisResults, getSimilarItemsFor } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlayCircle, Download, GitCompare, CheckSquare, Info, CheckCircle2, BookOpen, ClipboardList, Sparkles, Lightbulb } from 'lucide-react';
import { useState } from 'react';

export default function ItemDetail() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [reviewerNotes, setReviewerNotes] = useState('');

  const item = mockItems.find(i => i.item_id === itemId);
  const result = mockAnalysisResults.find(r => r.item_id === itemId);
  const similarItems = getSimilarItemsFor(itemId || '');

  if (!item || !result) {
    return (
      <div className="animate-fade-in">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ChevronLeft className="w-4 h-4 mr-1" />Back
        </Button>
        <div className="text-center py-20 text-muted-foreground">Item not found</div>
      </div>
    );
  }

  const optionLabels = ['A', 'B', 'C', 'D'];
  const options = [item.option_a, item.option_b, item.option_c, item.option_d];
  const [activeParamKey, setActiveParamKey] = useState(result.parameters[0]?.key);
  const activeParam = result.parameters.find(p => p.key === activeParamKey) ?? result.parameters[0];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
        <button onClick={() => navigate('/item-validation/item-bank')} className="hover:text-foreground">Item Bank</button>
        <span>/</span>
        <span className="text-foreground font-medium">{item.item_id}</span>
      </div>

      <PageHeader
        title={`Item Report: ${item.item_id}`}
        subtitle={`${item.qualification} · ${item.unit_code}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><PlayCircle className="w-3.5 h-3.5 mr-1.5" />Re-run Analysis</Button>
            <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-1.5" />PDF Report</Button>
            <Button variant="outline" size="sm"><GitCompare className="w-3.5 h-3.5 mr-1.5" />Compare</Button>
            <Button size="sm"><CheckSquare className="w-3.5 h-3.5 mr-1.5" />Mark Reviewed</Button>
          </div>
        }
      />

      <div className="ig-kpi-card mb-6 flex items-center gap-6">
        <ScoreDisplay score={result.overall_score} size="lg" />
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-lg font-bold">Overall Quality</span>
            <StatusBadge status={result.overall_status} size="md" />
          </div>
          <p className="text-sm text-muted-foreground">{result.summary}</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
            <span>Confidence: {result.confidence}%</span>
            <span>Reviewer: {result.reviewer_status}</span>
            {result.reviewed_by && <span>Reviewed by: {result.reviewed_by}</span>}
          </div>
        </div>
      </div>

      {/* Row 1: Question Stem + Qualification Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Question Stem</h3>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{item.stem}</p>

          {item.item_type === 'MCQ' && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {options.map((opt, i) => {
                const isCorrect = optionLabels[i] === item.correct_answer;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl text-sm border transition-colors ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/60'
                        : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`flex items-center justify-center h-6 w-6 rounded-md text-xs font-semibold shrink-0 ${
                      isCorrect ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600'
                    }`}>
                      {optionLabels[i]}
                    </span>
                    <span className="text-slate-700 flex-1">{opt}</span>
                    {isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />}
                  </div>
                );
              })}
            </div>
          )}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Correct Answer: {item.correct_answer}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <ClipboardList className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Qualification Metadata</h3>
          </div>
          <dl className="divide-y divide-slate-100">
            {[
              ['Qualification', item.qualification],
              ['Unit', `${item.unit_code} — ${item.unit_name}`],
              ['Topic', item.topic],
              ['ILO', item.intended_learning_outcome],
              ['Level', item.qualification_level],
              ["Bloom's Level", item.intended_blooms_level],
              ['Item Type', item.item_type],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-start justify-between gap-3 py-2.5">
                <dt className="text-xs text-slate-500 shrink-0">{label}</dt>
                <dd className="text-xs font-medium text-slate-800 text-right">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Row 2: Quality Report Card with master/detail layout */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden mb-6">
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Quality Report Card</h3>
              <p className="text-xs text-slate-500">{result.parameters.length} parameters evaluated</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left parameter menu */}
          <nav className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/40 max-h-[520px] overflow-y-auto">
            <ul className="p-2 space-y-1">
              {result.parameters.map(p => {
                const isActive = p.key === activeParam.key;
                const dot = p.status === 'green' ? 'bg-emerald-500' : p.status === 'amber' ? 'bg-amber-500' : 'bg-rose-500';
                return (
                  <li key={p.key}>
                    <button
                      onClick={() => setActiveParamKey(p.key)}
                      className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-white border border-slate-200 shadow-sm'
                          : 'border border-transparent hover:bg-white'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full shrink-0 ${dot}`} />
                      <span className={`text-xs flex-1 truncate ${isActive ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>
                        {p.name}
                      </span>
                      <span className={`text-xs tabular-nums font-semibold ${
                        p.status === 'green' ? 'text-emerald-600' : p.status === 'amber' ? 'text-amber-600' : 'text-rose-600'
                      }`}>
                        {p.score}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right detail */}
          <div className="lg:col-span-8 xl:col-span-9 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <div>
                <h4 className="text-base font-semibold text-slate-900">{activeParam.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Confidence {activeParam.confidence}%</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={activeParam.status} size="md" />
                <ScoreDisplay score={activeParam.score} size="md" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                  <Info className="w-3.5 h-3.5" /> AI Observation
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{activeParam.observation}</p>
              </div>
              <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                  <Lightbulb className="w-3.5 h-3.5" /> Recommendation
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{activeParam.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Similar Items + Reviewer Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {similarItems.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Similar Items ({similarItems.length})</h3>
            <div className="space-y-2">
              {similarItems.slice(0, 5).map(sim => (
                <div key={sim.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 text-xs">
                  <div className="min-w-0">
                    <span className="font-mono font-medium text-slate-800">{sim.item_id === itemId ? sim.similar_item_id : sim.item_id}</span>
                    <span className="text-slate-500 ml-2">{sim.rationale.slice(0, 50)}…</span>
                  </div>
                  <span className={`font-bold ${sim.similarity_score >= 85 ? 'text-rose-600' : sim.similarity_score >= 70 ? 'text-amber-600' : 'text-slate-500'}`}>
                    {sim.similarity_score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={`rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 ${similarItems.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <h3 className="text-sm font-semibold mb-3">Reviewer Notes</h3>
            <textarea
              value={reviewerNotes}
              onChange={e => setReviewerNotes(e.target.value)}
              placeholder="Add reviewer notes or override recommendations..."
              className="w-full border border-slate-200 rounded-lg p-3 text-sm bg-white text-slate-800 placeholder:text-slate-400 resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            />
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">Override: Approve</Button>
                <Button size="sm" variant="outline">Override: Reject</Button>
              </div>
              <Button size="sm">Save Notes</Button>
            </div>
        </div>
      </div>
    </div>
  );
}
