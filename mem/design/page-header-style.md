---
name: Page Header Style (KnowledgeBase pattern)
description: Standard page-title header used on KnowledgeBase — white bg, slate border, blue rounded icon tile, title + subtitle, right-side action buttons.
type: design
---
Reference: src/pages/KnowledgeBase.tsx lines 152-200.

Structure:
- Wrapper: `<div className="relative bg-white border-b border-slate-200">`
  - Inner: `<div className="relative px-4 sm:px-6 py-3">`
    - Row: `flex items-center justify-between gap-4`
      - Left group: `flex items-center gap-3 min-w-0`
        - Optional back button (ghost, h-8 w-8, ArrowLeft icon, slate colors) shown in sub-views.
        - Icon tile: `h-10 w-10 rounded-xl bg-blue-100 p-1` containing inner `h-full w-full rounded-sm bg-blue-600 flex items-center justify-center` with white lucide icon `h-4 w-4`.
        - Text column `flex flex-col min-w-0`:
          - Title `h1`: `text-base sm:text-lg font-medium text-slate-900 leading-tight tracking-tight truncate` (dynamic per sub-view).
          - Subtitle `p`: `text-xs text-slate-500 truncate` (dynamic per sub-view).
      - Right group: `flex items-center gap-2 flex-shrink-0` containing primary actions as `rounded-full text-xs h-8` buttons (blue-600 primary, optional yellow secondary).

Apply this same header pattern wherever the user requests "similar style" header.
