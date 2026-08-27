# FRD Implementation Checklist — Flexible KB / Book / Study / LO Workflow

Source: `FRD_Item_Generator_Workflow.docx`. Modules are implemented only when assigned.

## 1. Sidebar / Navigation Revamp
- [x] Group nav into sections: Overview, Manage Content, Generate, Evaluate, Workspace
- [x] Manage Content = Knowledge Base, Book Details, Image Repository, Guidelines
- [x] Placeholder `Image Repository` page + `/image-repository` route
- [x] Collapsed rail: icon-only with section dividers; clicking a group expands the sidebar
- [x] Active-route group auto-opens on navigation
- [x] Optional count badges supported on nav items and children
- [ ] Wire real counts into badges (e.g. Books, Feedback queue) once data sources are confirmed

## 2. Dashboard Revamp
- [ ] Readiness indicators per KB: KB uploaded / Book linked / Study created / LO available
- [ ] Entry cards aligned with the new Manage Content grouping

## 3. KB Selection & Item Generator Entry
- [ ] No Study/LO validation at KB selection
- [ ] Two visible paths after KB selection: General Generation (KB only) vs Curriculum-Aligned

## 4. Missing Study / LO Behaviour
- [ ] Replace blocking popup with non-blocking "Curriculum Data Not Available" message
- [ ] Primary CTA: Continue with KB Only
- [ ] Secondary CTA: Add Study / LO (deep-link to Book Details)
- [ ] Remove "Go To Dashboard" CTA

## 5. Book Details Enhancements
- [ ] Separate Learning Objectives column
- [ ] Create / Edit LO actions; retain Delete for Book
- [ ] Download template option inside Create LO
- [ ] Drag-and-drop upload for Study LO documents (CSV, max 30MB)

## 6. Image Repository Module
- [ ] Upload, listing, tagging, reuse across books and generated items

## Out of scope
- AI generation logic changes
