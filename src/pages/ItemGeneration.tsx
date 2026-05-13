import { ArrowLeft, Users, FileText, Bookmark, ChevronRight, Zap, CheckCircle, Clock, Shield, TrendingUp, Info, Sparkle, User, Settings, LogOut, Coins, ArrowDownRight, ArrowUpRight, ListChecks, CheckSquare, ToggleLeft, TextCursorInput, PenLine, Grid3x3, type LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
      label: "Generated",
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
      label: "Saved",
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
            <Popover>
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <PopoverTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="View token usage"
                        className="rounded-full border-primary text-primary hover:bg-primary/5 h-9 w-9"
                      >
                        <Coins className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                  </PopoverTrigger>
                  <TooltipContent side="bottom">
                    <p>Token usage</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <PopoverContent
                className="w-[340px] p-0 overflow-hidden rounded-2xl border border-border/70 shadow-xl"
                align="end"
                sideOffset={10}
              >
                {/* Header */}
                <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-5 pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                      <Coins className="h-[18px] w-[18px] text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Token Usage</span>
                      <span className="text-sm font-semibold text-foreground">This course</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[28px] font-bold text-foreground tabular-nums">
                        {(5349).toLocaleString()}<span className="text-[20px] font-medium opacity-60">/ {(10000).toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="mt-2.5 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                        style={{ width: `${Math.max(0, Math.min(100, Math.round((5349 / 10000) * 100)))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {Math.max(0, Math.min(100, Math.round((5349 / 10000) * 100)))}% of daily quota
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {(10000 - 5349).toLocaleString()} left
                      </span>
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="px-5 py-4 border-t border-border/60 space-y-2.5">
                  {[
                    { label: "Used today", value: "5,349" },
                    { label: "Balance", value: "4,651" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-orange-100' : 'bg-primary/10'}`}>
                        {idx === 0 ? (
                          <Zap className="h-3.5 w-3.5 text-orange-600" />
                        ) : (
                          <Coins className="h-3.5 w-3.5 text-primary" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-medium text-foreground">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {idx === 0 ? 'Tokens consumed today' : 'Remaining available'}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-foreground tabular-nums">{item.value}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-border/60 bg-muted/30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Updated just now</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2.5 rounded-full text-primary hover:bg-primary/10 text-xs"
                  >
                    View details
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

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
      <div className="pt-16 p-6 max-w-7xl mx-auto">
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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
              <div
                key={index}
                className={`relative overflow-hidden rounded-3xl border border-border/70 shadow-soft-xs p-5 ${s.bg} ${s.ink}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-white/85 flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_10px_-2px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[15px] font-medium tracking-tight">{stat.label}</span>
                  </div>
                  <span className="text-xs font-medium opacity-80 tabular-nums">{pct}%</span>
                </div>

                {/* Big value */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[32px] leading-none font-medium tracking-tight tabular-nums">
                    {stat.value.toLocaleString()}
                  </span>
                  <span className="text-base font-medium opacity-75">/ {stat.total.toLocaleString()}</span>
                </div>
                <p className="text-xs font-medium opacity-90 mt-1.5 mb-4">{stat.caption}</p>

                {/* Breakdown - 2 col grid with icon + label + value */}
                <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                  {stat.items.map((item, idx) => {
                    const QIcon = QTYPE_ICON[item.label] ?? FileText;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 rounded-xl bg-white/95 ring-1 ring-black/5 px-2.5 py-2 min-w-0"
                      >
                        <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center shrink-0 ring-1 ring-black/5">
                          <QIcon className={`h-3.5 w-3.5 ${s.ink}`} />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className={`text-[11px] font-medium leading-tight truncate ${s.ink} opacity-80`}>
                            {item.label}
                          </span>
                          <span className={`text-sm font-semibold tabular-nums leading-tight ${s.ink}`}>
                            {item.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

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