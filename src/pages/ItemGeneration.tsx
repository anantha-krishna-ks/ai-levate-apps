import { ArrowLeft, FileText, Bookmark, ChevronRight, Zap, CheckCircle, Clock, Info, User, Settings, LogOut, ListChecks, CheckSquare, ToggleLeft, TextCursorInput, PenLine, Grid3x3, BarChart3, type LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TokenUsagePopover from "@/components/TokenUsagePopover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ItemGeneration = () => {
  const stats = [
    {
      tone: "lavender" as const,
      icon: FileText,
      label: "Questions Generated",
      value: 1118,
      total: 1500,
      caption: "Total questions generated",
      items: [
        { label: "Multiple Choice", value: "932" },
        { label: "Multiple Response", value: "5" },
        { label: "True False", value: "4" },
        { label: "Fill In the Blank", value: "0" },
        { label: "Written Response", value: "174" },
        { label: "Matrix", value: "3" },
      ],
    },
    {
      tone: "mint" as const,
      icon: Bookmark,
      label: "Questions Saved",
      value: 34,
      total: 1118,
      caption: "Total questions saved",
      items: [
        { label: "Multiple Choice", value: "21" },
        { label: "Multiple Response", value: "5" },
        { label: "True False", value: "5" },
        { label: "Fill In the Blank", value: "0" },
        { label: "Written Response", value: "0" },
        { label: "Matrix", value: "3" },
      ],
    }
  ];

  const knowledgeBases = [
    {
      id: 1,
      year: "2024",
      level: "Advanced",
      category: "Risk Management",
      title: "Cyber Risk",
      description: "Comprehensive cybersecurity and risk management materials",
      questions: 11,
      image: "/lovable-uploads/a13547e7-af5f-49b0-bb15-9b344d6cd72e.png",
      status: "Active",
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      year: "2023",
      level: "Intermediate",
      category: "Insurance",
      title: "Principles and Practice of Insurance",
      description: "Fundamental principles and practical applications of insurance",
      questions: 17,
      image: "/lovable-uploads/b401ff6b-c99f-41b0-8578-92b80ce62cd0.png",
      status: "Active",
      lastUpdated: "1 week ago"
    },
    {
      id: 3,
      year: "2024",
      level: "Advanced",
      category: "Finance",
      title: "Financial Risk Assessment",
      description: "Modern approaches to financial risk analysis and management",
      questions: 23,
      image: "/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png",
      status: "Active",
      lastUpdated: "3 days ago"
    }
  ];

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - frosted glass, full width */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-card/95 border-b border-border">
        <div className="flex h-16 items-center px-6 gap-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link to="/dashboard" className="flex-shrink-0">
              <img
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png"
                alt="AI-Levate"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          {/* Right: Tokens + separator + profile */}
          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
            <TokenUsagePopover used={5349} total={10000} scopeLabel="This course" />

            <Separator orientation="vertical" className="hidden sm:block h-8" />

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-11 h-11 p-0 rounded-full border-2 border-primary/30 hover:border-primary/50 hover:bg-transparent"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">A</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 p-2">
                <div className="flex flex-col min-w-0 px-2 py-2">
                  <span className="text-sm font-semibold text-foreground truncate">Anil Kumar</span>
                  <span className="text-xs text-muted-foreground truncate">anil.kumar@ailevate.com</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 text-sm text-foreground/80 transition-colors focus:bg-primary/10 focus:text-primary [&>svg]:text-muted-foreground focus:[&>svg]:text-primary">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 text-sm text-foreground/80 transition-colors focus:bg-primary/10 focus:text-primary [&>svg]:text-muted-foreground focus:[&>svg]:text-primary">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-md px-2 py-2 text-sm text-destructive transition-colors focus:bg-destructive/10 focus:text-destructive [&>svg]:text-destructive/70 focus:[&>svg]:text-destructive"
                  onClick={() => navigate("/")}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16 p-6 max-w-[1440px] mx-auto">
        {/* Page Title */}
        <div className="pt-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link to="/dashboard" aria-label="Back to dashboard">
              <Button
                variant="outline"
                size="sm"
                className="h-9 rounded-full pl-2.5 pr-3.5 gap-1.5 border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </Button>
            </Link>
            <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
            <h1 className="text-2xl font-medium text-gray-900">Select Knowledge Base</h1>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 w-7 h-7 rounded-full bg-blue-50 text-blue-400 hover:text-blue-600 hover:bg-blue-100 ring-1 ring-blue-200/60 hover:ring-blue-300 transition-all duration-200 flex items-center justify-center shadow-sm">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>Choose a knowledge base to start generating intelligent questions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Statistics Cards — Accordion */}
        <Accordion type="multiple" defaultValue={[]} className="grid grid-cols-1 gap-4 mb-8">
          {stats.map((stat, index) => {
            const TONE: Record<string, { bg: string; ink: string; fill: string }> = {
              lavender: { bg: "bg-pastel-lavender", ink: "text-pastel-lavender-ink", fill: "bg-pastel-lavender-ink" },
              mint:     { bg: "bg-pastel-mint",     ink: "text-pastel-mint-ink",     fill: "bg-pastel-mint-ink" },
              peach:    { bg: "bg-pastel-peach",    ink: "text-pastel-peach-ink",    fill: "bg-pastel-peach-ink" },
              sky:      { bg: "bg-pastel-sky",      ink: "text-pastel-sky-ink",      fill: "bg-pastel-sky-ink" },
            };
            const s = TONE[stat.tone];
            const Icon = stat.icon;
            const pct = Math.max(0, Math.min(100, Math.round((stat.value / stat.total) * 100)));
            const QTYPE_ICON: Record<string, LucideIcon> = {
              "Multiple Choice": ListChecks,
              "Multiple Response": CheckSquare,
              "True False": ToggleLeft,
              "Fill In the Blank": TextCursorInput,
              "Written Response": PenLine,
              "Matrix": Grid3x3,
            };
            return (
              <AccordionItem
                key={index}
                value={`stat-${index}`}
                className={`relative overflow-hidden rounded-3xl border border-border/60 shadow-soft-xs ${s.bg} ${s.ink} data-[state=open]:shadow-soft-md transition-shadow duration-300`}
              >
                {/* Trigger — header + big value */}
                <AccordionTrigger className="w-full px-5 pt-5 pb-0 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-0 rounded-t-3xl [&>div:last-child]:hidden">
                  <div className="flex flex-col w-full text-left">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_10px_-2px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-base font-medium tracking-tight">{stat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium opacity-80 tabular-nums">{pct}%</span>
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/80 ring-1 ring-black/[0.08] shadow-[0_2px_6px_rgba(0,0,0,0.06)] transition-transform duration-300 group-data-[state=open]:rotate-180">
                          <ChevronRight className="h-5 w-5 opacity-70 -rotate-90 group-data-[state=open]:rotate-90" />
                        </div>
                      </div>
                    </div>

                    {/* Big value row */}
                    <div className="flex items-end justify-between gap-3 mb-5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[36px] leading-none font-medium tracking-tight tabular-nums">
                          {stat.value.toLocaleString()}
                        </span>
                        <span className="text-base font-medium opacity-70">/ {stat.total.toLocaleString()}</span>
                      </div>
                      <p className="text-[11px] font-medium opacity-80 leading-tight pb-1 text-right max-w-[120px]">
                        {stat.caption}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>

                {/* Content — breakdown grid */}
                <AccordionContent className="px-5 pb-5">
                  <div className="grid grid-cols-2 gap-2.5">
                    {stat.items.map((item, idx) => {
                      const QIcon = QTYPE_ICON[item.label] ?? FileText;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2.5 rounded-2xl bg-white/95 ring-1 ring-black/[0.06] px-3 py-2.5 min-w-0 hover:shadow-soft-xs hover:ring-black/[0.08] transition-all duration-200"
                        >
                          <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shrink-0 ring-1 ring-black/[0.06]">
                            <QIcon className={`h-4 w-4 ${s.ink}`} />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className={`text-[12px] font-medium leading-tight truncate ${s.ink} opacity-80`}>
                              {item.label}
                            </span>
                            <span className={`text-sm font-semibold tabular-nums leading-tight mt-0.5 ${s.ink}`}>
                              {item.value}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Knowledge Base Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeBases.map((base) => {
            const levelStyle =
              base.level === "Advanced"
                ? "bg-rose-50 text-rose-700 ring-rose-200"
                : base.level === "Intermediate"
                  ? "bg-amber-50 text-amber-700 ring-amber-200"
                  : "bg-emerald-50 text-emerald-700 ring-emerald-200";
            return (
              <Card
                key={base.id}
                className="group relative overflow-hidden bg-white border border-slate-300 rounded-3xl shadow-soft-xs transition-[box-shadow,border-color] duration-300 ease-out hover:shadow-soft-md hover:border-slate-400"
              >
                {/* Image Section */}
                <div className="relative h-44 overflow-hidden rounded-t-3xl">
                  <img
                    src={base.image}
                    alt={base.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-black/0" />

                  {/* Level badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 backdrop-blur ${levelStyle}`}>
                      {base.level}
                    </span>
                  </div>

                  {/* Bottom: year */}
                  <div className="absolute bottom-3 left-3">
                    <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur text-white px-2 py-0.5 rounded-md text-[11px] font-medium tracking-wide">
                      {base.year}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 leading-snug tracking-tight line-clamp-1">
                    {base.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                    {base.description}
                  </p>

                  {/* Meta row */}
                  <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 ring-1 ring-slate-200">
                      <FileText className="w-3 h-3 text-blue-600" />
                      <span className="font-semibold text-slate-700 tabular-nums">{base.questions}</span>
                      <span>questions</span>
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-50 ring-1 ring-slate-200">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {base.lastUpdated}
                    </span>
                    <span className="inline-flex items-center gap-1 ml-auto text-emerald-600 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {base.status}
                    </span>
                  </div>

                  <Link to={`/question-generator/${base.title.toLowerCase().replace(/\s+/g, "-")}`} className="block mt-5">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 shadow-soft-sm group/btn transition-colors">
                      <Zap className="w-4 h-4 mr-1.5" />
                      Start Generating
                      <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs">⚡</span>
            </div>
            <span>Powered by advanced AI technology</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemGeneration;