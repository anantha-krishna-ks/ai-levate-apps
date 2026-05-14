import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { mockItems, mockAnalysisResults, getSimilarItemsFor } from '../lib/mockData';
import { Button } from '@/components/ui/button';
import { ChevronLeft, PlayCircle, Download, GitCompare, CheckSquare, Info } from 'lucide-react';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="ig-kpi-card">
            <h3 className="text-sm font-semibold mb-3">Question Stem</h3>
            <p className="text-sm leading-relaxed">{item.stem}</p>

            {item.item_type === 'MCQ' && (
              <div className="mt-4 space-y-2">
                {options.map((opt, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-2 p-2.5 rounded-md text-sm border ${
                      optionLabels[i] === item.correct_answer
                        ? 'ig-border-status-green ig-bg-status-green-bg'
                        : 'border-border'
                    }`}
                  >
                    <span className="font-semibold text-xs mt-0.5">{optionLabels[i]}.</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-3">
              Correct Answer: <span className="font-semibold text-foreground">{item.correct_answer}</span>
            </p>
          </div>

          <div className="ig-kpi-card">
            <h3 className="text-sm font-semibold mb-3">Qualification Metadata</h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              {[
                ['Qualification', item.qualification],
                ['Unit', `${item.unit_code} - ${item.unit_name}`],
                ['Topic', item.topic],
                ['ILO', item.intended_learning_outcome],
                ['Level', item.qualification_level],
                ["Bloom's Level", item.intended_blooms_level],
                ['Item Type', item.item_type],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-medium text-foreground mt-0.5">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {similarItems.length > 0 && (
            <div className="ig-kpi-card">
              <h3 className="text-sm font-semibold mb-3">Similar Items ({similarItems.length})</h3>
              <div className="space-y-2">
                {similarItems.slice(0, 5).map(sim => (
                  <div key={sim.id} className="flex items-center justify-between p-2 rounded-md border border-border text-xs">
                    <div>
                      <span className="font-mono font-medium">{sim.item_id === itemId ? sim.similar_item_id : sim.item_id}</span>
                      <span className="text-muted-foreground ml-2">{sim.rationale.slice(0, 50)}…</span>
                    </div>
                    <span className={`font-bold ${sim.similarity_score >= 85 ? 'ig-text-status-red' : sim.similarity_score >= 70 ? 'ig-text-status-amber' : 'text-muted-foreground'}`}>
                      {sim.similarity_score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-3 space-y-3">
          <div className="ig-kpi-card">
            <h3 className="text-sm font-semibold mb-4">Quality Report Card</h3>

            <div className="overflow-x-auto mb-4">
              <table className="ig-data-table">
                <thead>
                  <tr><th>Parameter</th><th>Score</th><th>Status</th><th>Confidence</th></tr>
                </thead>
                <tbody>
                  {result.parameters.map(p => (
                    <tr key={p.key}>
                      <td className="font-medium text-xs">{p.name}</td>
                      <td><ScoreDisplay score={p.score} /></td>
                      <td><StatusBadge status={p.status} /></td>
                      <td className="text-xs text-muted-foreground">{p.confidence}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Accordion type="multiple" className="space-y-1">
              {result.parameters.map(p => (
                <AccordionItem key={p.key} value={p.key} className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm py-3 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={p.status} />
                      <span className="font-medium">{p.name}</span>
                      <span className="text-muted-foreground text-xs ml-auto mr-4">{p.score}/100</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1">
                          <Info className="w-3 h-3" /> AI Observation
                        </div>
                        <p className="text-foreground">{p.observation}</p>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">Recommendation</div>
                        <p className="text-foreground">{p.recommendation}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Confidence: {p.confidence}% · Weight: applied per validation rubric
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="ig-kpi-card">
            <h3 className="text-sm font-semibold mb-3">Reviewer Notes</h3>
            <textarea
              value={reviewerNotes}
              onChange={e => setReviewerNotes(e.target.value)}
              placeholder="Add reviewer notes or override recommendations..."
              className="w-full border border-border rounded-lg p-3 text-sm bg-card text-foreground placeholder:text-muted-foreground resize-none h-24 focus:outline-none focus:ring-2 focus:ring-ring"
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
    </div>
  );
}
