import React, { useState, useRef, useLayoutEffect } from "react"
import { Search, Sparkle, ArrowRight, BarChart, Clock, Star, Users, FileText, Brain, Database, BookOpen, RefreshCw, GitCompare, Image, MessageSquare, ScanLine, PenTool, BarChart3, Bot, Mic, Menu, X, User, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AppSidebar } from "@/components/AppSidebar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed"
import { Link, useNavigate } from "react-router-dom"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Import tool images
import itemGenerationImage from "@/assets/item-generation.png"
import itemWriterImage from "@/assets/item-writer.png"
import itemMetadataImage from "@/assets/item-metadata.png"
import courseGeneratorImage from "@/assets/course-generator.png"
import itemRewriterImage from "@/assets/item-rewriter.png"
import itemSimilarityImage from "@/assets/item-similarity.png"
import docChatImage from "@/assets/doc-chat-ncert.png"
import ocrImage from "@/assets/ocr.png"
import comingSoonImage from "@/assets/coming-soon.png"
import speechEvaluationImage from "@/assets/speech-evaluation-hero.jpg"
import essayEvaluationImage from "@/assets/essay-evaluation-hero.jpg"
import essayEvaluationZeroShotImage from "@/assets/essay-evaluation-zero-shot.jpg"
import ocrEvaluationImage from "@/assets/ocr-evaluation.png"

type SubscriptionPillToggleProps = {
  categories: string[];
  value: string;
  onChange: (v: string) => void;
};

const SubscriptionPillToggle: React.FC<SubscriptionPillToggleProps> = ({ categories, value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState({ left: 4, width: 0 });

  useLayoutEffect(() => {
    const idx = categories.indexOf(value);
    const btn = buttonRefs.current[idx];
    const container = containerRef.current;
    if (!btn || !container) return;
    const update = () => {
      const cRect = container.getBoundingClientRect();
      const bRect = btn.getBoundingClientRect();
      setIndicator({ left: bRect.left - cRect.left, width: bRect.width });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    buttonRefs.current.forEach((b) => b && ro.observe(b));
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [value, categories]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Subscription filter"
      className="relative inline-flex items-center bg-foreground/[0.06] border border-border/50 rounded-full p-[4px]"
    >
      <span
        aria-hidden="true"
        className="absolute top-[4px] bottom-[4px] rounded-full bg-background shadow-[0_1px_3px_0_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {categories.map((category, i) => {
        const isActive = value === category;
        return (
          <button
            key={category}
            ref={(el) => (buttonRefs.current[i] = el)}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(category)}
            className={`relative z-10 flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 whitespace-nowrap ${
              isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate()
  const sidebarCollapsed = useSidebarCollapsed()
  const [activeTab, setActiveTab] = useState("All")
  const [subscriptionFilter, setSubscriptionFilter] = useState("All")
  const [hoveredTool, setHoveredTool] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const tabs = [
    "All", "AI Generation", "Content Creation", "Education", 
    "Assessment", "Analytics", "AI Tools", "AI Interaction"
  ]

  const subscriptionCategories = ["All", "Active Subscriptions", "Yet to Subscribe"]

  const getIconForTool = (toolId: string) => {
    const iconMap = {
      "item-generation": Brain,
      "item-writer": PenTool,
      "item-metadata": Database,
      "course-generator": BookOpen,
      "item-rewriter": RefreshCw,
      "item-similarity": GitCompare,
      "course-generator-2": BookOpen,
      "scenario-and": FileText,
      "doc-chat-ncert": MessageSquare,
      "doc-chat-moby": MessageSquare,
      "ocr": ScanLine,
      "essay-evaluation": BarChart3,
      "essay-evaluation-zero": BarChart3,
      "test-forensics": BarChart,
      "image-generator": Image,
      "ai-persona": Bot,
      "speech-evaluation": Mic
    }
    return iconMap[toolId] || Sparkle
  }

  const aiTools = [
    {
      id: "item-generation",
      title: "Item Generation",
      description: "Subjective and objective questions are generated by the items th...",
      path: "/item-generation",
      image: itemGenerationImage,
      category: "AI Generation",
      badge: "New",
      badgeColor: "bg-blue-500",
      icon: Brain,
      subscriptionStatus: "active"
    },
    {
      id: "item-writer",
      title: "Item Writer",
      description: "Objective questions are generated by the items th...",
      path: "/item-writer",
      image: itemWriterImage,
      category: "Content Creation",
      icon: PenTool,
      subscriptionStatus: "active"
    },
    {
      id: "item-metadata",
      title: "Item Metadata",
      description: "AI powered tool knowledge generator helps you...",
      path: "/item-metadata",
      image: itemMetadataImage,
      category: "Analytics",
      icon: Database,
      subscriptionStatus: "pending"
    },
    {
      id: "course-generator",
      title: "Course Generator",
      description: "AI assistant course generator that will help yo...",
      path: "/course-generator",
      image: courseGeneratorImage,
      category: "Education",
      badge: "Popular",
      badgeColor: "bg-green-500",
      icon: BookOpen,
      subscriptionStatus: "active"
    },
    {
      id: "item-rewriter",
      title: "Item Rewriter",
      description: "Easily from old rewritten making the item better an...",
      path: "/item-rewriter",
      image: itemRewriterImage,
      category: "Content Creation",
      icon: RefreshCw,
      subscriptionStatus: "active"
    },
    {
      id: "item-similarity",
      title: "Item Similarity",
      description: "An AI powered tool helps compare questions and...",
      path: "/item-similarity",
      image: itemSimilarityImage,
      category: "Analytics",
      icon: GitCompare,
      subscriptionStatus: "pending"
    },
    {
      id: "course-generator-2",
      title: "Course Generator",
      description: "AI assistant course generator that will help yo...",
      path: "/course-generator-2",
      image: courseGeneratorImage,
      category: "Content Creation",
      badge: "Popular",
      badgeColor: "bg-green-500",
      icon: BookOpen,
      subscriptionStatus: "active"
    },
    {
      id: "scenario-and",
      title: "Scenario and...",
      description: "Generate a variety of scenario and various...",
      path: "/scenario",
      image: comingSoonImage,
      category: "Content Creation",
      icon: FileText,
      subscriptionStatus: "pending"
    },
    {
      id: "doc-chat-ncert",
      title: "Doc Chat - NCERT",
      description: "NCERT textbook by asking query, This textbo...",
      path: "/doc-chat-ncert",
      image: docChatImage,
      category: "Education",
      icon: MessageSquare,
      subscriptionStatus: "active"
    },
    {
      id: "doc-chat-moby",
      title: "Doc Chat - Moby-click",
      description: "Verify SAS textbook by asking query, This textbo...",
      path: "/doc-chat-moby",
      image: docChatImage,
      category: "Education",
      icon: MessageSquare,
      subscriptionStatus: "active"
    },
    {
      id: "ocr",
      title: "OCR",
      description: "Optical Character Recognition - Images from...",
      path: "/ocr",
      image: ocrImage,
      category: "AI Tools",
      badge: "New",
      badgeColor: "bg-blue-500",
      icon: ScanLine,
      subscriptionStatus: "active"
    },
    {
      id: "ocr-evaluation",
      title: "OCR Evaluation",
      description: "AI-powered OCR evaluation tool that analyzes and scores text extraction accuracy from documents and images.",
      path: "/ocr-evaluation",
      image: ocrEvaluationImage,
      category: "Assessment",
      badge: "New",
      badgeColor: "bg-blue-500",
      icon: ScanLine,
      subscriptionStatus: "active"
    },
    {
      id: "essay-evaluation",
      title: "Essay Evaluation - Fine tuned",
      description: "Subjective questions are evaluated for predefined books, using AI to get score and feedbacks for answer responses.",
      path: "/essay-evaluation",
      image: essayEvaluationImage,
      category: "Assessment",
      icon: BarChart3,
      subscriptionStatus: "pending"
    },
    {
      id: "essay-evaluation-zero",
      title: "Essay Evaluation - Zero Shot",
      description: "A paperless questions are evaluated using SBA and...",
      path: "/essay-evaluation-zero",
      image: essayEvaluationZeroShotImage,
      category: "Assessment",
      icon: BarChart3,
      subscriptionStatus: "pending"
    },
    {
      id: "test-forensics",
      title: "Test Forensics",
      description: "Find and leverage the power of analytics in online or...",
      path: "/test-forensics",
      image: comingSoonImage,
      category: "Analytics",
      icon: BarChart,
      subscriptionStatus: "pending"
    },
    {
      id: "image-generator",
      title: "Image Generator",
      description: "Stable Diffusion - AI image generator your thoughts...",
      path: "/image-generator",
      image: comingSoonImage,
      category: "AI Generation",
      badge: "Popular",
      badgeColor: "bg-green-500",
      icon: Image,
      subscriptionStatus: "active"
    },
    {
      id: "ai-persona",
      title: "AI Persona",
      description: "AI Persona for famous intellectual dialogues in...",
      path: "/ai-persona",
      image: comingSoonImage,
      category: "AI Interaction",
      icon: Bot,
      subscriptionStatus: "pending"
    },
    {
      id: "speech-evaluation",
      title: "Speech Evaluation",
      description: "AI-powered speech assessment tool for reading and speaking evaluation...",
      path: "/speech-evaluation",
      image: speechEvaluationImage,
      category: "Assessment",
      badge: "New",
      badgeColor: "bg-blue-500",
      icon: Mic,
      subscriptionStatus: "active"
    }
  ]

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = activeTab === "All" || tool.category === activeTab
    const matchesSubscription = 
      subscriptionFilter === "All" || 
      (subscriptionFilter === "Active Subscriptions" && tool.subscriptionStatus === "active") ||
      (subscriptionFilter === "Yet to Subscribe" && tool.subscriptionStatus === "pending")
    
    const matchesSearch = searchQuery.trim() === "" || 
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesCategory && matchesSubscription && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div
        className={`fixed left-0 top-16 h-[calc(100%-4rem)] z-40 hidden lg:block transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-52"
        }`}
      >
        <AppSidebar />
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AppSidebar
            forceExpanded
            hideToggle
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Mobile Search Sheet */}
      <Sheet open={mobileSearchOpen} onOpenChange={setMobileSearchOpen}>
        <SheetContent side="top" className="h-auto max-h-[80vh] flex flex-col">
          <div className="space-y-4 pt-6 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Search AI Tools</h2>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="h-8 text-xs"
                >
                  Clear
                </Button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by name, description, or category..." 
                className="pl-10 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                {filteredTools.length} {filteredTools.length === 1 ? 'result' : 'results'} found
              </p>
            )}
          </div>
          
          {/* Search Results Preview */}
          {searchQuery && (
            <div className="mt-4 flex-1 overflow-y-auto">
              {filteredTools.length > 0 ? (
                <div className="space-y-2">
                  {filteredTools.slice(0, 5).map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => {
                        setMobileSearchOpen(false)
                        navigate(tool.path)
                      }}
                      className="p-3 rounded-lg border bg-card hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                          {React.createElement(getIconForTool(tool.id), {
                            className: "h-5 w-5 text-primary"
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm mb-1">{tool.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredTools.length > 5 && (
                    <p className="text-xs text-center text-muted-foreground py-2">
                      +{filteredTools.length - 5} more results
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tools found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
      
      {/* Header - frosted glass, full width */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-card/95 border-b border-border">
        <div className="flex h-16 items-center px-3 sm:px-6 gap-3 sm:gap-4">
          {/* Left: Logo + mobile menu */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link to="/dashboard" className="flex-shrink-0">
              <img
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png"
                alt="AI-Levate"
                className="h-8 w-auto"
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden flex-shrink-0"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Center: Search */}
          <div className="flex-1 flex justify-center">
            <div className="relative hidden lg:block w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
              <Input
                placeholder="Search AI tools..."
                className="pl-10 pr-9 h-10 w-full bg-slate-100 border-slate-200 placeholder:text-slate-600 focus-visible:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden ml-auto"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Right: Tokens + separator + profile */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 h-9 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-colors">
              <Sparkle className="h-2 w-2 text-primary fill-primary" />
              <span className="text-xs font-medium text-foreground whitespace-nowrap">932,679</span>
              <span className="text-xs text-muted-foreground">tokens</span>
            </div>

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

      <div
        className={`ml-0 pt-16 min-h-screen flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-52"
        }`}
      >
        {/* Page Title */}
        <div className="p-2">
          
          
        </div>

        {/* Subscription Filter + Welcome */}
        <div className="px-6 pb-4 pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-base sm:text-lg font-medium text-gray-900 truncate">Welcome Back, Robert Jones!</h1>
          <section className="px-3 pt-3 pb-2">
            <SubscriptionPillToggle
              categories={subscriptionCategories}
              value={subscriptionFilter}
              onChange={setSubscriptionFilter}
            />
          </section>
        </div>

        {/* Stats Cards */}
        <div className="px-3 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            <Card className="p-3 sm:p-6 bg-blue-50 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <Sparkle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
                <span className="font-medium text-xs sm:text-base text-gray-700 leading-tight">Available Tools</span>
              </div>
              <div className="text-lg sm:text-2xl font-medium text-gray-900 mb-0.5 sm:mb-1">16</div>
              <div className="text-[10px] sm:text-sm font-medium text-blue-600 leading-tight">AI-Powered</div>
            </Card>

            <Card className="p-3 sm:p-6 bg-green-50 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                </div>
                <span className="font-medium text-xs sm:text-base text-gray-700 leading-tight">Active Access</span>
              </div>
              <div className="text-lg sm:text-2xl font-medium text-gray-900 mb-0.5 sm:mb-1">12</div>
              <div className="text-[10px] sm:text-sm font-medium text-green-600 leading-tight">Subscribed</div>
            </Card>

            <Card className="p-3 sm:p-6 bg-purple-50 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                </div>
                <span className="font-medium text-xs sm:text-base text-gray-700 leading-tight">Explore More</span>
              </div>
              <div className="text-lg sm:text-2xl font-medium text-gray-900 mb-0.5 sm:mb-1">4</div>
              <div className="text-[10px] sm:text-sm font-medium text-purple-600 leading-tight">Features</div>
            </Card>

            <Card className="p-3 sm:p-6 bg-orange-50 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                </div>
                <span className="font-medium text-xs sm:text-base text-gray-700 leading-tight">Today's Usage</span>
              </div>
              <div className="text-lg sm:text-2xl font-medium text-gray-900 mb-0.5 sm:mb-1">847</div>
              <div className="text-[10px] sm:text-sm font-medium text-orange-600 leading-tight">Tokens</div>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-6 pb-6">

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "outline"}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm transition-all ${
                  activeTab === tab 
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" 
                    : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground hover:border-accent"
                }`}
              >
                {tab}
              </Button>
            ))}
          </div>

          {/* Search Results Info */}
          {searchQuery && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Found {filteredTools.length} {filteredTools.length === 1 ? 'result' : 'results'} for "{searchQuery}"
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Clear search
              </Button>
            </div>
          )}

          {/* AI Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <div 
                  key={tool.id}
                  className="relative"
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    setMousePosition({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top
                    })
                  }}
                >
                  <Card className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                    <div className="relative">
                      <img 
                        src={tool.image} 
                        alt={tool.title}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      {/* Tool Icon Overlay */}
                      <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
                        <IconComponent className="h-4 w-4 text-gray-700" />
                      </div>
                      {tool.badge && (
                        <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs text-white font-medium ${tool.badgeColor} shadow-sm`}>
                          {tool.badge}
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-xs font-medium text-gray-700 bg-white/90 backdrop-blur-sm shadow-sm">
                        {tool.category}
                      </div>
                    </div>
                    
                    <CardContent className="p-6">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">{tool.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tool.description}</p>
                      
                      <Link to={tool.path}>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-[1.02]"
                          size="sm"
                        >
                          <Sparkle className="h-4 w-4 mr-2" />
                          Launch App
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                  
                  {/* Custom cursor-following tooltip */}
                  {hoveredTool === tool.id && (
                    <div 
                      className="absolute z-50 pointer-events-none"
                      style={{
                        left: `${mousePosition.x + 15}px`,
                        top: `${mousePosition.y + 15}px`,
                      }}
                    >
                      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                        {tool.title}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No tools found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any tools matching your search
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              © 2025 Excelsoftt Technologies Ltd. All rights reserved. | 
              <span className="ml-2">Help Center</span> | 
              <span className="ml-2">Privacy Policy</span> | 
              <span className="ml-2">Terms of Service</span> | 
              <span className="ml-4">Version 1.0.0</span> | 
              <span className="ml-2 flex items-center gap-1">Powered by 
                <img 
                  src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
                  alt="AI-Levate" 
                  className="h-4 w-auto"
                />
              </span>
            </p>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default Dashboard