import { Item, AnalysisRun, ItemAnalysisResult, SimilarItem, GuidelineRule, QualificationDocument, DashboardKPI, IssueCategory, TrendDataPoint, Status, ValidationParameter } from './types';

const qualifications = [
  'VTCT Level 2 Diploma in Hair & Beauty',
  'VTCT Level 3 Diploma in Barbering',
  'VTCT Level 2 Certificate in Nail Technology',
];

const units: Record<string, { code: string; name: string; topics: string[]; los: string[] }[]> = {
  'VTCT Level 2 Diploma in Hair & Beauty': [
    { code: 'UV20401', name: 'Client Care and Communication', topics: ['Communication techniques', 'Client consultation', 'Aftercare advice'], los: ['LO 1.1 Explain communication methods', 'LO 1.2 Describe consultation techniques', 'LO 2.1 Provide aftercare advice'] },
    { code: 'UV20402', name: 'Health and Safety in the Salon', topics: ['Risk assessment', 'Personal protective equipment', 'COSHH regulations'], los: ['LO 1.1 Identify workplace hazards', 'LO 1.2 Explain risk assessment', 'LO 2.1 Describe PPE requirements'] },
    { code: 'UV20405', name: 'Shampooing, Conditioning and Treating', topics: ['Scalp analysis', 'Product selection', 'Massage techniques'], los: ['LO 1.1 Analyse scalp and hair condition', 'LO 2.1 Select suitable products', 'LO 3.1 Perform effleurage and rotary'] },
  ],
  'VTCT Level 3 Diploma in Barbering': [
    { code: 'UV30410', name: 'Creative Barbering Techniques', topics: ['Cutting techniques', 'Beard design', 'Razoring'], los: ['LO 1.1 Perform graduation techniques', 'LO 2.1 Create beard designs', 'LO 3.1 Use razor safely'] },
    { code: 'UV30411', name: 'Barbering Science', topics: ['Hair growth cycle', 'Skin structure', 'Chemical processes'], los: ['LO 1.1 Describe anagen phase', 'LO 1.2 Explain skin layers', 'LO 2.1 Describe oxidation process'] },
  ],
  'VTCT Level 2 Certificate in Nail Technology': [
    { code: 'UV20430', name: 'Nail Art Application', topics: ['Freehand techniques', 'Nail embellishments', 'Colour theory'], los: ['LO 1.1 Apply freehand nail art', 'LO 2.1 Apply embellishments safely', 'LO 3.1 Select complementary colours'] },
    { code: 'UV20431', name: 'Manicure and Pedicure', topics: ['Nail shapes', 'Cuticle care', 'Hand and foot massage'], los: ['LO 1.1 Shape nails appropriately', 'LO 2.1 Perform cuticle work', 'LO 3.1 Carry out massage sequence'] },
  ],
};

const bloomsLevels = ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'];
const itemTypes = ['MCQ', 'MCQ', 'MCQ', 'Short Answer', 'True/False', 'MCQ'];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateStatus(score: number, hasAnyCritical: boolean): Status {
  if (hasAnyCritical || score < 60) return 'red';
  if (score < 85) return 'amber';
  return 'green';
}

const stemTemplates = [
  "Which of the following best describes {topic} in the context of {unit}?",
  "A client presents with concerns about {topic}. What is the most appropriate course of action?",
  "According to industry standards, what is the correct procedure for {topic}?",
  "When performing {topic}, which safety consideration is MOST important?",
  "What is the primary purpose of {topic} during a {unit} procedure?",
  "Which factor should be considered first when assessing {topic}?",
  "A trainee is learning about {topic}. Which statement is correct?",
  "In relation to {unit}, which of the following accurately describes {topic}?",
  "During a practical assessment of {topic}, what should be demonstrated?",
  "Which regulation specifically relates to {topic} in a professional setting?",
];

const optionSets = [
  { a: 'To ensure client safety and comply with legal requirements', b: 'To reduce the cost of materials used', c: 'To speed up the service delivery time', d: "To improve the salon's aesthetic appearance" },
  { a: 'Consult with the client and document findings', b: 'Proceed with the treatment immediately', c: 'Refer to another practitioner without assessment', d: 'Apply a generic product without testing' },
  { a: 'Review manufacturer instructions and perform a patch test', b: 'Apply product directly to the affected area', c: 'Use any available product from the shelf', d: 'Skip safety checks if client is a regular' },
  { a: 'Cross-contamination prevention and hygiene protocols', b: 'Speed of service completion', c: 'Client entertainment during the process', d: 'Personal preference of the stylist' },
  { a: 'Perform a thorough consultation before beginning', b: 'Start the treatment based on visual assessment only', c: 'Follow the same procedure for every client', d: 'Ignore client preferences to save time' },
];

function generateItems(count: number): Item[] {
  const items: Item[] = [];
  for (let i = 0; i < count; i++) {
    const qual = randomFrom(qualifications);
    const unitList = units[qual];
    const unit = randomFrom(unitList);
    const topic = randomFrom(unit.topics);
    const lo = randomFrom(unit.los);
    const blooms = randomFrom(bloomsLevels);
    const type = randomFrom(itemTypes);
    const opts = randomFrom(optionSets);
    const stem = randomFrom(stemTemplates).replace('{topic}', topic).replace('{unit}', unit.name);
    const score = randomInt(35, 100);
    const hasCritical = Math.random() < 0.08;
    const status = generateStatus(score, hasCritical);
    const daysAgo = randomInt(1, 90);

    items.push({
      item_id: `ITM-${String(i + 1).padStart(5, '0')}`,
      qualification: qual,
      qualification_level: qual.includes('Level 3') ? 'Level 3' : 'Level 2',
      unit_code: unit.code,
      unit_name: unit.name,
      topic,
      intended_learning_outcome: lo,
      intended_blooms_level: blooms,
      item_type: type,
      stem,
      option_a: opts.a,
      option_b: opts.b,
      option_c: opts.c,
      option_d: opts.d,
      correct_answer: randomFrom(['A', 'B', 'C', 'D']),
      explanation: `This item tests the candidate's understanding of ${topic} as specified in ${lo}.`,
      tags: [topic.split(' ')[0], unit.code],
      status,
      created_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
      updated_at: new Date(Date.now() - randomInt(0, daysAgo) * 86400000).toISOString(),
    });
  }
  return items;
}

function generateValidationParams(overallScore: number): ValidationParameter[] {
  const paramDefs = [
    { name: 'Cognitive Alignment', key: 'cognitive_alignment' },
    { name: 'Language & Readability', key: 'language' },
    { name: 'Answer Key Validity', key: 'answer_key' },
    { name: 'Distractor Quality', key: 'distractor' },
    { name: 'Curriculum / Syllabus Mapping', key: 'syllabus_mapping' },
    { name: 'Bias & Fairness', key: 'bias_fairness' },
    { name: 'Duplication / Near-Duplication', key: 'duplication' },
    { name: 'Technical Accuracy', key: 'technical_accuracy' },
    { name: 'Item Difficulty Estimate', key: 'difficulty' },
    { name: 'House Style Compliance', key: 'house_style' },
    { name: 'Knowledge base', key: 'knowledge_base' },
    { name: 'Guidelines', key: 'guidelines' },
  ];

  const observations: Record<string, string[]> = {
    cognitive_alignment: ["Bloom's level matches intended LO", 'Item tests recall but LO requires application', 'Good alignment with higher-order thinking skills'],
    language: ['Clear and concise language at appropriate level', 'Contains a double negative that may confuse candidates', 'Reading level appropriate for Level 2 learners'],
    answer_key: ['Keyed answer is defensibly correct', 'Option B could also be considered correct', 'Answer aligns well with the stem'],
    distractor: ['All distractors are plausible and well-constructed', 'Distractor C is significantly shorter than others', 'Good grammatical consistency across options'],
    syllabus_mapping: ['Correctly maps to stated unit and LO', 'Content extends beyond the stated topic scope', 'Well-aligned with qualification specification'],
    bias_fairness: ['No cultural or gender bias detected', 'Contains UK-specific idiom that may disadvantage international learners', 'Language is inclusive and accessible'],
    duplication: ['No near-duplicates found in the bank', 'Similar to ITM-00234 (82% similarity)', 'Unique item with no significant overlap'],
    technical_accuracy: ['Factually correct per current industry standards', 'References outdated regulation version', 'Accurate within the qualification context'],
    difficulty: ['Moderate difficulty appropriate for target level', 'May be too easy for the intended cohort', 'Challenging but within the expected range'],
    house_style: ['Fully compliant with house style rules', 'Stem exceeds maximum recommended length', 'Minor punctuation inconsistency in option D'],
    knowledge_base: ['Aligned with the selected knowledge base sources', 'Partially covered by the linked specification', 'Strong match with referenced knowledge base content'],
    guidelines: ['Adheres to the configured item-writing guidelines', 'Minor deviation from style guideline 3.2', 'Fully compliant with the selected guidelines'],
  };

  const recommendations: Record<string, string[]> = {
    cognitive_alignment: ['None', 'Rewrite to test application rather than recall', 'Consider adding a scenario-based context'],
    language: ['None', 'Remove the double negative for clarity', 'Simplify vocabulary for target audience'],
    answer_key: ['None', 'Revise Option B to be clearly incorrect', 'Add justification notes for marking guide'],
    distractor: ['None', 'Extend Distractor C to match other option lengths', 'Ensure all distractors are equally plausible'],
    syllabus_mapping: ['None', 'Narrow scope to match stated LO', 'Verify topic coverage with specification'],
    bias_fairness: ['None', 'Replace UK-specific idiom with neutral phrasing', 'No changes needed'],
    duplication: ['None', 'Review alongside ITM-00234 for potential merge', 'No action required'],
    technical_accuracy: ['None', 'Update regulation reference to current version', 'Verify with subject matter expert'],
    difficulty: ['None', 'Increase complexity to match level expectations', 'No adjustment needed'],
    house_style: ['None', 'Shorten stem to within 40-word limit', 'Correct punctuation in Option D'],
  };

  return paramDefs.map(def => {
    const score = Math.max(0, Math.min(100, overallScore + randomInt(-20, 20)));
    const status: Status = score >= 85 ? 'green' : score >= 60 ? 'amber' : 'red';
    const obsArr = observations[def.key] || ['Analysis complete'];
    const recArr = recommendations[def.key] || ['None'];
    const obsIdx = status === 'green' ? 0 : status === 'amber' ? 1 : randomInt(1, 2);

    return {
      name: def.name,
      key: def.key,
      score,
      status,
      observation: obsArr[Math.min(obsIdx, obsArr.length - 1)],
      recommendation: recArr[Math.min(obsIdx, recArr.length - 1)],
      confidence: randomInt(72, 98),
    };
  });
}

export const mockItems = generateItems(50);

export const mockAnalysisResults: ItemAnalysisResult[] = mockItems.map((item, idx) => {
  const score = randomInt(40, 100);
  const hasCritical = Math.random() < 0.08;
  const status = generateStatus(score, hasCritical);

  return {
    result_id: `RES-${String(idx + 1).padStart(5, '0')}`,
    item_id: item.item_id,
    run_id: 'RUN-001',
    overall_score: score,
    overall_status: status,
    summary: status === 'green'
      ? 'This item meets all quality standards and is ready for use.'
      : status === 'amber'
      ? 'This item has minor issues that should be addressed before use in a live assessment.'
      : 'This item has significant quality concerns and requires revision before deployment.',
    parameters: generateValidationParams(score),
    recommendations: status === 'green' ? ['No action required'] : ['Review flagged parameters', 'Consider revision based on AI observations'],
    confidence: randomInt(75, 96),
    reviewer_status: randomFrom(['pending', 'approved', 'rejected', 'needs_revision']),
    reviewer_notes: '',
    reviewed_at: Math.random() > 0.5 ? new Date(Date.now() - randomInt(1, 30) * 86400000).toISOString() : null,
    reviewed_by: Math.random() > 0.5 ? randomFrom(['Dr. Sarah Chen', 'James Morrison', 'Emily Watson']) : null,
  };
});

export const mockRuns: AnalysisRun[] = [
  { run_id: 'RUN-001', run_name: 'Full Bank Analysis Q1 2026', scope: 'All Items', ruleset_used: 'Standard v2.1', knowledge_base_used: 'QS 2025-26', initiated_by: 'Dr. Sarah Chen', run_status: 'completed', created_at: '2026-03-15T09:00:00Z', completed_at: '2026-03-15T11:24:00Z', items_processed: 20000, total_items: 20000, average_score: 78, green_count: 12400, amber_count: 5200, red_count: 2400 },
  { run_id: 'RUN-002', run_name: 'Hair & Beauty Focus Review', scope: 'VTCT Level 2 Diploma in Hair & Beauty', ruleset_used: 'Standard v2.1', knowledge_base_used: 'QS 2025-26', initiated_by: 'James Morrison', run_status: 'completed', created_at: '2026-03-10T14:00:00Z', completed_at: '2026-03-10T15:12:00Z', items_processed: 8500, total_items: 8500, average_score: 81, green_count: 5800, amber_count: 1900, red_count: 800 },
  { run_id: 'RUN-003', run_name: 'Bias & Fairness Audit', scope: 'All Items', ruleset_used: 'Bias-Focused v1.0', knowledge_base_used: 'QS 2025-26 + Equality Policy', initiated_by: 'Emily Watson', run_status: 'completed', created_at: '2026-03-01T10:00:00Z', completed_at: '2026-03-01T13:45:00Z', items_processed: 20000, total_items: 20000, average_score: 84, green_count: 14200, amber_count: 4100, red_count: 1700 },
  { run_id: 'RUN-004', run_name: 'New Items Batch - March 2026', scope: 'Selected Items (45)', ruleset_used: 'Standard v2.1', knowledge_base_used: 'QS 2025-26', initiated_by: 'Dr. Sarah Chen', run_status: 'running', created_at: '2026-03-27T08:30:00Z', completed_at: null, items_processed: 28, total_items: 45, average_score: 0, green_count: 0, amber_count: 0, red_count: 0 },
  { run_id: 'RUN-005', run_name: 'Draft: Barbering Re-analysis', scope: 'VTCT Level 3 Diploma in Barbering', ruleset_used: 'Standard v2.1', knowledge_base_used: 'QS 2025-26', initiated_by: 'James Morrison', run_status: 'draft', created_at: '2026-03-26T16:00:00Z', completed_at: null, items_processed: 0, total_items: 4200, average_score: 0, green_count: 0, amber_count: 0, red_count: 0 },
];

export const mockSimilarItems: SimilarItem[] = [
  { id: 'SIM-001', item_id: 'ITM-00001', similar_item_id: 'ITM-00023', similarity_score: 92, rationale: 'Nearly identical stems with same topic and unit coverage', shared_lo: 'LO 1.1 Explain communication methods', shared_topic: 'Communication techniques', review_decision: 'pending' },
  { id: 'SIM-002', item_id: 'ITM-00005', similar_item_id: 'ITM-00041', similarity_score: 87, rationale: 'Paraphrased version of the same question with reordered options', shared_lo: 'LO 1.2 Explain risk assessment', shared_topic: 'Risk assessment', review_decision: 'pending' },
  { id: 'SIM-003', item_id: 'ITM-00012', similar_item_id: 'ITM-00034', similarity_score: 78, rationale: 'Same topic tested with very similar distractor set', shared_lo: 'LO 2.1 Select suitable products', shared_topic: 'Product selection', review_decision: 'keep_both' },
  { id: 'SIM-004', item_id: 'ITM-00008', similar_item_id: 'ITM-00019', similarity_score: 85, rationale: 'Identical correct answer and very similar stem structure', shared_lo: 'LO 1.1 Identify workplace hazards', shared_topic: 'Risk assessment', review_decision: 'pending' },
  { id: 'SIM-005', item_id: 'ITM-00003', similar_item_id: 'ITM-00048', similarity_score: 74, rationale: 'Related topic coverage with overlapping content', shared_lo: 'LO 1.1 Apply freehand nail art', shared_topic: 'Freehand techniques', review_decision: 'manual_review' },
  { id: 'SIM-006', item_id: 'ITM-00015', similar_item_id: 'ITM-00027', similarity_score: 91, rationale: 'Duplicate item with minor wording changes', shared_lo: 'LO 3.1 Perform effleurage and rotary', shared_topic: 'Massage techniques', review_decision: 'pending' },
  { id: 'SIM-007', item_id: 'ITM-00022', similar_item_id: 'ITM-00044', similarity_score: 80, rationale: 'Same stem structure applied to the same learning outcome', shared_lo: 'LO 1.1 Describe anagen phase', shared_topic: 'Hair growth cycle', review_decision: 'pending' },
  { id: 'SIM-008', item_id: 'ITM-00009', similar_item_id: 'ITM-00031', similarity_score: 76, rationale: 'Semantically similar distractors and overlapping content', shared_lo: 'LO 2.1 Describe PPE requirements', shared_topic: 'Personal protective equipment', review_decision: 'retire_b' },
];

export const mockRules: GuidelineRule[] = [
  { rule_id: 'R-001', category: 'House Style', rule_name: 'Maximum Stem Length', rule_description: 'Question stems should not exceed 40 words', qualification_scope: 'All', level_scope: 'All', enabled: true, weight: 10, pass_threshold: 85, amber_threshold: 60 },
  { rule_id: 'R-002', category: 'House Style', rule_name: 'Maximum Options', rule_description: 'MCQ items should have exactly 4 options', qualification_scope: 'All', level_scope: 'All', enabled: true, weight: 10, pass_threshold: 100, amber_threshold: 100 },
  { rule_id: 'R-003', category: 'House Style', rule_name: 'Avoid Negative Phrasing', rule_description: 'Avoid NOT/EXCEPT unless specifically testing negative knowledge', qualification_scope: 'All', level_scope: 'Level 2', enabled: true, weight: 8, pass_threshold: 85, amber_threshold: 60 },
  { rule_id: 'R-004', category: 'House Style', rule_name: 'Sentence Case', rule_description: 'All options should use sentence case capitalisation', qualification_scope: 'All', level_scope: 'All', enabled: true, weight: 5, pass_threshold: 90, amber_threshold: 70 },
  { rule_id: 'R-005', category: 'Qualification Rules', rule_name: 'Level 2 Vocabulary', rule_description: 'Vocabulary must be appropriate for Level 2 learners (CEFR B1)', qualification_scope: 'All', level_scope: 'Level 2', enabled: true, weight: 12, pass_threshold: 85, amber_threshold: 60 },
  { rule_id: 'R-006', category: 'Qualification Rules', rule_name: 'Level 3 Cognitive Demand', rule_description: "Level 3 items must test at Apply level or above on Bloom's", qualification_scope: 'All', level_scope: 'Level 3', enabled: true, weight: 15, pass_threshold: 85, amber_threshold: 60 },
  { rule_id: 'R-007', category: 'Validation Rubric', rule_name: 'Distractor Plausibility', rule_description: 'All distractors must be plausible to a learner who has not fully mastered the LO', qualification_scope: 'All', level_scope: 'All', enabled: true, weight: 10, pass_threshold: 80, amber_threshold: 55 },
  { rule_id: 'R-008', category: 'Validation Rubric', rule_name: 'Answer Key Accuracy', rule_description: 'The keyed answer must be the only defensibly correct option', qualification_scope: 'All', level_scope: 'All', enabled: true, weight: 15, pass_threshold: 95, amber_threshold: 80 },
];

export const mockDocuments: QualificationDocument[] = [
  { document_id: 'DOC-001', title: 'Level 2 Diploma in Hair & Beauty - Qualification Specification', qualification: 'VTCT Level 2 Diploma in Hair & Beauty', level: 'Level 2', unit: 'All Units', document_type: 'Qualification Specification', version: '3.1', effective_date: '2025-09-01', upload_date: '2025-08-15', extraction_status: 'completed', linked_los: ['LO 1.1', 'LO 1.2', 'LO 2.1', 'LO 3.1'], assessment_criteria: ['AC 1.1.1', 'AC 1.1.2', 'AC 2.1.1'] },
  { document_id: 'DOC-002', title: 'Item Writing Manual - Multiple Choice Questions', qualification: 'All', level: 'All', unit: 'All Units', document_type: 'Item Writing Guidelines', version: '2.0', effective_date: '2025-01-01', upload_date: '2025-01-10', extraction_status: 'completed', linked_los: [], assessment_criteria: [] },
  { document_id: 'DOC-003', title: 'Level 3 Diploma in Barbering - Qualification Specification', qualification: 'VTCT Level 3 Diploma in Barbering', level: 'Level 3', unit: 'All Units', document_type: 'Qualification Specification', version: '2.4', effective_date: '2025-09-01', upload_date: '2025-08-20', extraction_status: 'completed', linked_los: ['LO 1.1', 'LO 2.1', 'LO 3.1'], assessment_criteria: ['AC 1.1.1', 'AC 2.1.1', 'AC 3.1.1'] },
  { document_id: 'DOC-004', title: 'Equality, Diversity and Inclusion Policy', qualification: 'All', level: 'All', unit: 'All Units', document_type: 'Policy Document', version: '1.5', effective_date: '2024-09-01', upload_date: '2024-09-05', extraction_status: 'completed', linked_los: [], assessment_criteria: [] },
  { document_id: 'DOC-005', title: 'Level 2 Certificate in Nail Technology - Qualification Specification', qualification: 'VTCT Level 2 Certificate in Nail Technology', level: 'Level 2', unit: 'All Units', document_type: 'Qualification Specification', version: '1.8', effective_date: '2025-09-01', upload_date: '2025-08-18', extraction_status: 'processing', linked_los: ['LO 1.1', 'LO 2.1'], assessment_criteria: ['AC 1.1.1'] },
  { document_id: 'DOC-006', title: 'House Style Guide for Assessment Materials', qualification: 'All', level: 'All', unit: 'All Units', document_type: 'Style Guide', version: '4.0', effective_date: '2025-06-01', upload_date: '2025-06-03', extraction_status: 'completed', linked_los: [], assessment_criteria: [] },
];

export const mockDashboardKPI: DashboardKPI = {
  total_items: 20000,
  items_analysed: 18450,
  green_count: 12400,
  amber_count: 4250,
  red_count: 1800,
  average_quality_score: 78.4,
  duplicate_count: 342,
  technical_accuracy_risk: 156,
  bias_fairness_flags: 89,
  answer_key_risk: 67,
};

export const mockIssueCategories: IssueCategory[] = [
  { category: 'Syllabus Mapping', count: 234 },
  { category: 'Cognitive Alignment', count: 312 },
  { category: 'Language & Readability', count: 189 },
  { category: 'Answer Key Validity', count: 67 },
  { category: 'Distractor Quality', count: 445 },
  { category: 'Curriculum Mapping', count: 198 },
  { category: 'Bias & Fairness', count: 89 },
  { category: 'Duplication', count: 342 },
  { category: 'Technical Accuracy', count: 156 },
  { category: 'Difficulty Estimate', count: 127 },
  { category: 'House Style', count: 523 },
];

export const mockTrendData: TrendDataPoint[] = [
  { run_name: 'Sep 2025', date: '2025-09-15', green: 10200, amber: 5800, red: 4000 },
  { run_name: 'Oct 2025', date: '2025-10-15', green: 10800, amber: 5500, red: 3700 },
  { run_name: 'Nov 2025', date: '2025-11-15', green: 11200, amber: 5200, red: 3600 },
  { run_name: 'Dec 2025', date: '2025-12-15', green: 11600, amber: 5000, red: 3400 },
  { run_name: 'Jan 2026', date: '2026-01-15', green: 11900, amber: 4800, red: 3300 },
  { run_name: 'Feb 2026', date: '2026-02-15', green: 12100, amber: 4500, red: 3400 },
  { run_name: 'Mar 2026', date: '2026-03-15', green: 12400, amber: 4250, red: 1800 },
];

export function getResultForItem(itemId: string): ItemAnalysisResult | undefined {
  return mockAnalysisResults.find(r => r.item_id === itemId);
}

export function getSimilarItemsFor(itemId: string): SimilarItem[] {
  return mockSimilarItems.filter(s => s.item_id === itemId || s.similar_item_id === itemId);
}
