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
- [x] `/item-generator` rebuilt as KB-centric selection page (shell matches Manage Content pages)
- [x] No Study/LO validation at KB selection — every KB is selectable
- [x] Readiness chips per KB (KB / Book / Study / LO)
- [x] Two visible paths after KB selection: General Generation (KB only) vs Curriculum-Aligned
- [x] Path choice passes `?mode=kb|curriculum` to the question generator
- [x] Inline non-blocking "Curriculum data not available" note with KB-only + Add Study/LO CTAs (full Module 4 pending)

## 4. Missing Study / LO Behaviour
- [x] Replace blocking popup with non-blocking "Curriculum Data Not Available" message
- [x] Primary CTA: Continue with KB Only
- [x] Secondary CTA: Add Study / LO (deep-link to Book Details with `?kb=` context)
- [x] Remove "Go To Dashboard" CTA
- [x] Message reports the first missing layer in the Book → Study → LO chain

## 5. Book Details Enhancements
- [x] Separate Learning Objectives column (LO availability chip)
- [x] Create / Edit LO actions in the LO column; Actions column keeps Delete for Book
- [x] Download template option inside Create LO
- [x] Drag-and-drop upload for Study LO documents (CSV, max 30MB)

## 6. Image Repository Module
- [ ] Upload, listing, tagging, reuse across books and generated items

## Out of scope
- AI generation logic changes
