import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  Search,
  BookOpen,
  Database,
  GraduationCap,
  Target,
  Check,
  ChevronRight,
  Layers,
  ArrowLeft,
  Minus,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";

type KnowledgeBaseItem = {
  id: number;
  name: string;
  code: string;
  subject: string;
  documents: number;
  updated: string;
  bookLinked: boolean;
  studyCreated: boolean;
  loAvailable: boolean;
};

const knowledgeBases: KnowledgeBaseItem[] = [
  {
    id: 1,
    name: "Cyber Risk",
    code: "C20",
    subject: "Risk Management",
    documents: 12,
    updated: "2 days ago",
    bookLinked: true,
    studyCreated: true,
    loAvailable: true,
  },
  {
    id: 2,
    name: "Principles and Practice of Insurance",
    code: "C11",
    subject: "Insurance",
    documents: 24,
    updated: "1 week ago",
    bookLinked: true,
    studyCreated: true,
    loAvailable: false,
  },
  {
    id: 3,
    name: "Financial Risk Assessment",
    code: "C31",
    subject: "Finance",
    documents: 9,
    updated: "3 days ago",
    bookLinked: true,
    studyCreated: false,
    loAvailable: false,
  },
  {
    id: 4,
    name: "Broadcast Journalism Fundamentals",
    code: "BJ01",
    subject: "Journalism",
    documents: 6,
    updated: "5 days ago",
    bookLinked: false,
    studyCreated: false,
    loAvailable: false,
  },
];

const ReadinessChip = ({
  label,
  ready,
}: {
  label: string;
  ready: boolean;
}) => (
  <span
    aria-label={`${label}: ${ready ? "available" : "not available"}`}
    className={`inline-flex items-center gap-1.5 rounded-md px-2 py-[3px] text-xs font-medium tracking-tight transition-colors ${
      ready
        ? "bg-blue-50 text-blue-800 ring-1 ring-inset ring-blue-200"
        : "bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-200"
    }`}
  >
    {ready ? (
      <Check className="h-3 w-3 text-blue-700" strokeWidth={3} aria-hidden="true" />
    ) : (
      <Minus className="h-3 w-3 text-slate-600" strokeWidth={3} aria-hidden="true" />
    )}
    {label}
  </span>
);

const LayerRing = ({
  layers,
  selected,
}: {
  layers: number;
  selected: boolean;
}) => {
  const pct = layers / 4;
  const r = 17;
  const c = 2 * Math.PI * r;
  return (
    <span className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center">
      <svg viewBox="0 0 40 40" className="h-10 w-10 -rotate-90" aria-hidden="true">
        <circle cx="20" cy="20" r={r} fill="none" strokeWidth="3" className="stroke-slate-200" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className={selected ? "stroke-blue-600" : "stroke-slate-400 group-hover:stroke-blue-600"}
          style={{ transition: "stroke-dashoffset 400ms ease" }}
        />
      </svg>
      <BookOpen
        className={`absolute h-4 w-4 ${selected ? "text-blue-700" : "text-slate-600 group-hover:text-blue-700"}`}
        aria-hidden="true"
      />
    </span>
  );
};



const ItemGenerator = () => {
  const sidebarCollapsed = useSidebarCollapsed();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return knowledgeBases;
    return knowledgeBases.filter(
      (kb) =>
        kb.name.toLowerCase().includes(q) ||
        kb.code.toLowerCase().includes(q) ||
        kb.subject.toLowerCase().includes(q)
    );
  }, [search]);

  const selected = knowledgeBases.find((kb) => kb.id === selectedId) ?? null;
  const curriculumReady = !!selected?.studyCreated && !!selected?.loAvailable;

  const startGeneration = (mode: "kb" | "curriculum") => {
    if (!selected) return;
    navigate(`/question-generator/${selected.code.toLowerCase()}?mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FC]">
      <AppHeader onMenuClick={() => setMobileMenuOpen(true)} />

      <div
        className={`fixed left-0 top-16 h-[calc(100%-4rem)] z-[60] hidden lg:block transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-52"
        }`}
      >
        <AppSidebar />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AppSidebar
            forceExpanded
            hideToggle
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div
        className={`ml-0 pt-16 min-h-screen flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-60"
        }`}
      >
        {/* Page header */}
        <div className="relative bg-white border-b border-slate-200">
          <div className="relative px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 p-1">
                <div className="h-full w-full rounded-sm bg-blue-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-slate-900 truncate">
                  Item Generator
                </h1>
                <p className="text-xs text-slate-600 truncate">
                  Select a knowledge base, then choose how you want to generate items
                </p>
              </div>
            </div>
            {selected && (
              <Button
                variant="outline"
                className="rounded-full border-gray-200 text-slate-700 hover:bg-slate-50"
                onClick={() => setSelectedId(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Change knowledge base
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6 space-y-5">
          {/* Step 1 — KB selection */}
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200/70 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-1 h-6 rounded-full bg-blue-600" />
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Step 1 · Select Knowledge Base
                  </h2>
                  <p className="text-xs text-slate-600">
                    A knowledge base is all you need to start. Book, Study and Learning
                    Objectives are optional layers.
                  </p>
                </div>
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search knowledge bases"
                  className="pl-9 h-9 rounded-full border-gray-200 focus-visible:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-5">
              {filtered.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-600">
                  No knowledge bases match your search.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filtered.map((kb) => {
                    const isSelected = kb.id === selectedId;
                    const layers = [
                      true,
                      kb.bookLinked,
                      kb.studyCreated,
                      kb.loAvailable,
                    ].filter(Boolean).length;
                    return (
                      <button
                        key={kb.id}
                        type="button"
                        onClick={() => setSelectedId(kb.id)}
                        className={`group relative text-left rounded-2xl bg-white p-4 pt-[18px] overflow-hidden transition-all duration-200 border ${
                          isSelected
                            ? "border-blue-500 shadow-[0_6px_20px_-10px_rgba(37,99,235,0.45)]"
                            : "border-slate-200 shadow-[0_2px_8px_-4px_rgba(15,23,42,0.12)] hover:border-slate-300 hover:shadow-[0_8px_24px_-16px_rgba(15,23,42,0.35)] hover:-translate-y-0.5"
                        }`}
                      >
                        {/* top accent rail */}
                        <span
                          className={`absolute inset-x-0 top-0 h-[3px] transition-opacity duration-200 ${
                            isSelected
                              ? "bg-blue-600 opacity-100"
                              : "bg-slate-300 opacity-0 group-hover:opacity-100"
                          }`}
                        />

                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 min-w-0">
                            <LayerRing layers={layers} selected={isSelected} />
                            <div className="min-w-0">
                              <h3 className="text-sm font-semibold text-slate-900 truncate leading-5">
                                {kb.name}
                              </h3>
                              <p className="text-xs text-slate-600 truncate mt-0.5">
                                {kb.subject}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`relative h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                              isSelected
                                ? "border-2 border-blue-600"
                                : "border-2 border-slate-300 group-hover:border-slate-400"
                            }`}
                            aria-hidden="true"
                          >
                            <span
                              className={`rounded-full bg-blue-600 transition-all duration-200 ${
                                isSelected ? "h-2.5 w-2.5 scale-100 opacity-100" : "h-2.5 w-2.5 scale-50 opacity-0"
                              }`}
                            />
                          </span>
                        </div>

                        <div className="mt-3.5 flex flex-wrap gap-1.5">
                          <ReadinessChip label="Knowledge base" ready />
                          <ReadinessChip label="Book" ready={kb.bookLinked} />
                          <ReadinessChip label="Study" ready={kb.studyCreated} />
                          <ReadinessChip label="Learning objectives" ready={kb.loAvailable} />
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between text-xs text-slate-600">
                          <span className="inline-flex items-center gap-1.5">
                            <Database className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                            {kb.documents} documents
                          </span>
                          <span className="tabular-nums">
                            {layers}/4 layers · {kb.updated}
                          </span>
                        </div>

                      </button>
                    );
                  })}

                </div>
              )}
            </div>
          </div>

          {/* Step 2 — generation path */}
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200/70 flex items-center gap-2.5">
              <span className="w-1 h-6 rounded-full bg-blue-600" />
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Step 2 · Choose Generation Path
                </h2>
                <p className="text-xs text-slate-600">
                  {selected
                    ? `Generating from “${selected.name}”`
                    : "Select a knowledge base above to see the available paths."}
                </p>
              </div>
            </div>

            <div className="p-5">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${
                  selected ? "" : "opacity-60 pointer-events-none"
                }`}
              >
                {/* General generation */}
                <div className="rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <Layers className="h-4.5 w-4.5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        General Generation
                      </h3>
                      <p className="text-xs text-slate-600">Knowledge base only</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Generate items directly from the knowledge base content. No Book,
                    Study or Learning Objective mapping required.
                  </p>
                  <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-blue-600" /> Always available
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-blue-600" /> Fastest way to start
                    </li>
                  </ul>
                  <div className="mt-auto" />
                  <Button
                    onClick={() => startGeneration("kb")}
                    className="mt-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white self-start"
                  >
                    Continue with KB only
                    <ChevronRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </div>

                {/* Curriculum aligned */}
                <div className="rounded-2xl border border-gray-200/70 bg-white p-5 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <GraduationCap className="h-4.5 w-4.5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Curriculum-Aligned Generation
                      </h3>
                      <p className="text-xs text-slate-600">
                        Knowledge base + Study / Learning Objectives
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    Map generated items to Study units and Learning Objectives for
                    curriculum coverage and reporting.
                  </p>

                  {selected && !curriculumReady ? (
                    <div className="mt-3 rounded-xl border border-gray-200 bg-slate-50 p-3">
                      <p className="text-xs font-semibold text-slate-800">
                        Curriculum data not available
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {!selected.studyCreated
                          ? "No Study has been created for this knowledge base."
                          : "No Learning Objectives are available for this Study."}{" "}
                        You can still continue with KB only.
                      </p>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          onClick={() => startGeneration("kb")}
                          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Continue with KB Only
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="rounded-full border-gray-200 text-slate-700 hover:bg-white"
                        >
                          <Link to="/manage-book-details">Add Study / LO</Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-blue-600" /> Study units
                          detected
                        </li>
                        <li className="flex items-center gap-2">
                          <Check className="h-3.5 w-3.5 text-blue-600" /> Learning
                          Objectives available
                        </li>
                      </ul>
                      <div className="mt-auto" />
                      <Button
                        onClick={() => startGeneration("curriculum")}
                        className="mt-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white self-start"
                      >
                        Continue curriculum-aligned
                        <ChevronRight className="h-4 w-4 ml-1.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemGenerator;
