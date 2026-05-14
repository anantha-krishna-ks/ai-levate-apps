export type Status = 'green' | 'amber' | 'red';
export type RunStatus = 'draft' | 'running' | 'completed' | 'failed';
export type ReviewDecision = 'keep_both' | 'merge' | 'retire_a' | 'retire_b' | 'manual_review' | 'pending';

export interface Item {
  item_id: string;
  qualification: string;
  qualification_level: string;
  unit_code: string;
  unit_name: string;
  topic: string;
  intended_learning_outcome: string;
  intended_blooms_level: string;
  item_type: string;
  stem: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  tags: string[];
  status: Status;
  created_at: string;
  updated_at: string;
}

export interface GuidelineRule {
  rule_id: string;
  category: string;
  rule_name: string;
  rule_description: string;
  qualification_scope: string;
  level_scope: string;
  enabled: boolean;
  weight: number;
  pass_threshold: number;
  amber_threshold: number;
}

export interface QualificationDocument {
  document_id: string;
  title: string;
  qualification: string;
  level: string;
  unit: string;
  document_type: string;
  version: string;
  effective_date: string;
  upload_date: string;
  extraction_status: 'pending' | 'processing' | 'completed' | 'failed';
  linked_los: string[];
  assessment_criteria: string[];
}

export interface AnalysisRun {
  run_id: string;
  run_name: string;
  scope: string;
  ruleset_used: string;
  knowledge_base_used: string;
  initiated_by: string;
  run_status: RunStatus;
  created_at: string;
  completed_at: string | null;
  items_processed: number;
  total_items: number;
  average_score: number;
  green_count: number;
  amber_count: number;
  red_count: number;
}

export interface ValidationParameter {
  name: string;
  key: string;
  score: number;
  status: Status;
  observation: string;
  recommendation: string;
  confidence: number;
}

export interface ItemAnalysisResult {
  result_id: string;
  item_id: string;
  run_id: string;
  overall_score: number;
  overall_status: Status;
  summary: string;
  parameters: ValidationParameter[];
  recommendations: string[];
  confidence: number;
  reviewer_status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  reviewer_notes: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface SimilarItem {
  id: string;
  item_id: string;
  similar_item_id: string;
  similarity_score: number;
  rationale: string;
  shared_lo: string;
  shared_topic: string;
  review_decision: ReviewDecision;
}

export interface DashboardKPI {
  total_items: number;
  items_analysed: number;
  green_count: number;
  amber_count: number;
  red_count: number;
  average_quality_score: number;
  duplicate_count: number;
  technical_accuracy_risk: number;
  bias_fairness_flags: number;
  answer_key_risk: number;
}

export interface IssueCategory {
  category: string;
  count: number;
}

export interface TrendDataPoint {
  run_name: string;
  date: string;
  green: number;
  amber: number;
  red: number;
}
