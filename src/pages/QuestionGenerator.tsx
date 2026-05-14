import { useState, useRef, useLayoutEffect } from "react"
import { Link, useParams, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { 
  ArrowLeft, 
  Sparkle,
  Brain,
  Target,
  Globe,
  Hash,
  MessageSquare,
  ChevronDown,
  Zap,
  Settings2,
  FileText,
  FileSpreadsheet,
  Save,
  Database,
  BookOpen,
  Clock,
  Eye,
  Edit3,
  Trash2,
  User,
  MoreVertical,
  Star,
  GitCompare,
  ThumbsUp,
  ThumbsDown,
  X,
  Search,
  Settings,
  LogOut,
  CheckCircle2,
  Circle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import TokenUsagePopover from "@/components/TokenUsagePopover"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const formSchema = z.object({
  studyDomain: z.string().min(1, "Study domain is required"),
  taxonomyFramework: z.string().min(1, "Taxonomy framework is required"),
  questionQuantity: z.string().min(1, "Question quantity is required"),
  learningObjectives: z.string().min(1, "Learning objectives is required"),
  questionFormat: z.string().min(1, "Question format is required"),
  pointValue: z.string().min(1, "Point value is required"),
  additionalInstructions: z.string().min(1, "Additional instructions are required"),
  knowledgeBaseName: z.string().min(1, "Knowledge base is required"),
  generalGuidelines: z.array(z.string()).default([]),
})

type QuestionPillOption = { key: string; label: string; icon: React.ComponentType<{ className?: string }> };

type QuestionPillToggleProps = {
  options: QuestionPillOption[];
  value: string;
  onChange: (v: string) => void;
};

const QuestionPillToggle: React.FC<QuestionPillToggleProps> = ({ options, value, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [indicator, setIndicator] = useState({ left: 4, width: 0 });

  useLayoutEffect(() => {
    const idx = options.findIndex((o) => o.key === value);
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
  }, [value, options]);

  return (
    <div
      ref={containerRef}
      role="tablist"
      className="relative inline-flex items-center bg-foreground/[0.06] border border-border/50 rounded-full p-[4px]"
    >
      <span
        aria-hidden="true"
        className="absolute top-[4px] bottom-[4px] rounded-full bg-background shadow-[0_1px_3px_0_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.05)] transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        style={{ left: indicator.left, width: indicator.width }}
      />
      {options.map((option, i) => {
        const isActive = value === option.key;
        const Icon = option.icon;
        return (
          <button
            key={option.key}
            ref={(el) => (buttonRefs.current[i] = el)}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.key)}
            className={`relative z-10 flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-medium rounded-full transition-colors duration-300 whitespace-nowrap ${
              isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

const QuestionGenerator = () => {
  const { bookCode } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<string>(
    (location.state as any)?.activeTab ?? "generate"
  )
  const [generationMode, setGenerationMode] = useState(true) // true for LLM, false for Knowledge Base
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string>("")
  const [selectedRating, setSelectedRating] = useState<"up" | "down" | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [refinementDialogOpen, setRefinementDialogOpen] = useState(false)
  const [refinementType, setRefinementType] = useState("Rewrite")
  const [refinementQuestionType, setRefinementQuestionType] = useState("multiple-choice")
  const [refinementNumQuestions, setRefinementNumQuestions] = useState("1")
  const [refinementTaxonomy, setRefinementTaxonomy] = useState("apply")
  const [refinementCreativity, setRefinementCreativity] = useState("moderate")
  const [refinementNumOptions, setRefinementNumOptions] = useState("4")
  const [refinementSourceType, setRefinementSourceType] = useState("Book")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studyDomain: "defining-risk",
      taxonomyFramework: "",
      questionQuantity: "1",
      learningObjectives: "explain-pure-risk", 
      questionFormat: "multiple-choice",
      pointValue: "1",
      additionalInstructions: "",
      knowledgeBaseName: "",
      generalGuidelines: [],
    },
  })

  const handleGenerateQuestions = (values: z.infer<typeof formSchema>) => {
    // This function only runs if validation passes
    console.log("Form submitted with values:", values)
    navigate("/question-generation-loading")
  }

  const handleRateQuestion = (questionText: string) => {
    setSelectedQuestion(questionText)
    setSelectedRating(null)
    setFeedbackText("")
    setRatingDialogOpen(true)
  }

  const handleSubmitFeedback = () => {
    console.log("Submitting feedback:", { question: selectedQuestion, rating: selectedRating, feedback: feedbackText })
    setRatingDialogOpen(false)
  }

  const handleOpenRefinement = (questionText: string) => {
    setSelectedQuestion(questionText)
    setRefinementDialogOpen(true)
  }

  const handleRewriteQuestion = () => {
    console.log("Rewriting question with params:", {
      question: selectedQuestion,
      type: refinementType,
      questionType: refinementQuestionType,
      numQuestions: refinementNumQuestions,
      taxonomy: refinementTaxonomy,
      creativity: refinementCreativity,
      numOptions: refinementNumOptions,
      sourceType: refinementSourceType
    })
    setRefinementDialogOpen(false)
  }

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
            <TokenUsagePopover used={2238} total={10000} scopeLabel="Cyber Risk" />

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
        {/* Breadcrumb */}
        <Breadcrumb className="pt-6 mb-3">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/item-generation">Item Generation</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Cyber Risk</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title + Pill Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Link to="/item-generation" aria-label="Back to knowledge base">
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
              <h1 className="text-2xl font-medium text-gray-900">Cyber Risk</h1>
            </div>

            <QuestionPillToggle
              options={[
                { key: "generate", label: "Generate Questions", icon: Sparkle },
                { key: "repository", label: "Question Repository", icon: FileText },
              ]}
              value={activeTab}
              onChange={setActiveTab}
            />
          </div>
        </div>

        {activeTab === "generate" && (
          <div className="space-y-6">
            {/* Main Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Column - Source Material */}
              <div className="lg:col-span-1 space-y-6">
                {/* Source Material */}
                <Card className="p-6 bg-white border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Source Material</h3>
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <img 
                      src="/lovable-uploads/a13547e7-af5f-49b0-bb15-9b344d6cd72e.png" 
                      alt="Cyber Risk Management"
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-gray-900 text-sm mb-1">Cyber Risk Management</h4>
                    <p className="text-xs text-gray-500">Source material loaded successfully</p>
                  </div>
                </Card>
              </div>

              {/* Right Column - AI Question Generator */}
              <div className="lg:col-span-3">
                <Card className="border-border/60 shadow-sm rounded-2xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <span aria-hidden="true" className="block w-1 h-6 rounded-full bg-blue-600" />
                      <CardTitle className="text-xl font-semibold text-gray-900">AI Question Generator</CardTitle>
                    </div>
                    <CardDescription className="text-sm text-gray-500 mt-1.5 ml-4">
                      Configure your question generation settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleGenerateQuestions)} className="space-y-6">
                      {/* Generation Source */}
                      <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Sparkle className="h-3.5 w-3.5 text-primary" />
                            <span className="text-sm font-semibold text-gray-900">Generation Source</span>
                          </div>
                          <span className="text-[11px] text-gray-500">Choose where answers come from</span>
                        </div>
                        <div
                          role="radiogroup"
                          aria-label="AI Generation Mode"
                          className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                        >
                          {[
                            { key: false, label: "Knowledge Base", desc: "Use uploaded source material", icon: BookOpen },
                            { key: true, label: "LLM", desc: "Use the model's own knowledge", icon: Brain },
                          ].map((opt) => {
                            const Icon = opt.icon;
                            const selected = generationMode === opt.key;
                            return (
                              <button
                                key={String(opt.key)}
                                type="button"
                                role="radio"
                                aria-checked={selected}
                                onClick={() => setGenerationMode(opt.key)}
                                className={`group relative flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                                  selected
                                    ? "border-primary bg-primary/5"
                                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                                }`}
                              >
                                <span
                                  className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 transition-colors ${
                                    selected ? "bg-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                  }`}
                                >
                                  <Icon className="h-[18px] w-[18px]" />
                                </span>
                                <span className="flex flex-col leading-tight flex-1 min-w-0">
                                  <span className={`text-sm font-semibold ${selected ? "text-primary" : "text-gray-900"}`}>
                                    {opt.label}
                                  </span>
                                  <span className="text-xs text-gray-500 mt-0.5">{opt.desc}</span>
                                </span>
                                <span
                                  aria-hidden="true"
                                  className={`relative flex h-5 w-5 items-center justify-center rounded-full shrink-0 transition-all duration-200 ring-1 ${
                                    selected
                                      ? "bg-primary ring-primary"
                                      : "bg-white ring-gray-300 group-hover:ring-gray-400"
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full bg-white transition-all duration-200 ${
                                      selected ? "opacity-100 scale-100" : "opacity-0 scale-50"
                                    }`}
                                  />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Knowledge Base Name */}
                      <FormField
                        control={form.control}
                        name="knowledgeBaseName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-gray-900">
                              Knowledge Base Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="w-full h-11 bg-gray-50/60 border-gray-200 rounded-full">
                                  <SelectValue placeholder="Select knowledge base" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cyber-risk">Cyber Risk</SelectItem>
                                  <SelectItem value="principles-insurance">Principles and Practice of Insurance</SelectItem>
                                  <SelectItem value="financial-risk">Financial Risk Assessment</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* General Guidelines */}
                      <FormField
                        control={form.control}
                        name="generalGuidelines"
                        render={({ field }) => {
                          const options = [
                            { value: "multiple_choice", label: "MULTIPLE_CHOICE" },
                            { value: "remember", label: "REMEMBER" },
                            { value: "moderate", label: "MODERATE" },
                            { value: "apply", label: "APPLY" },
                            { value: "understand", label: "UNDERSTAND" },
                          ];
                          const selected: string[] = field.value || [];
                          const addItem = (val: string) => {
                            if (!selected.includes(val)) field.onChange([...selected, val]);
                          };
                          const removeItem = (val: string) => {
                            field.onChange(selected.filter((v) => v !== val));
                          };
                          return (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-gray-900">
                                General Guidelines
                              </FormLabel>
                              <FormControl>
                                <Select onValueChange={addItem} value="">
                                  <SelectTrigger className="w-full h-11 bg-gray-50/60 border-gray-200 rounded-full">
                                    <SelectValue placeholder="Select General Guidelines" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {options
                                      .filter((o) => !selected.includes(o.value))
                                      .map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                          {o.label}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              {selected.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2 rounded-2xl bg-emerald-50/60 border border-emerald-100 p-2.5">
                                  {selected.map((val) => {
                                    const opt = options.find((o) => o.value === val);
                                    return (
                                      <span
                                        key={val}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-emerald-700 text-[11px] font-semibold ring-1 ring-emerald-200"
                                      >
                                        {opt?.label ?? val}
                                        <button
                                          type="button"
                                          onClick={() => removeItem(val)}
                                          className="text-emerald-500 hover:text-emerald-700 transition-colors"
                                          aria-label={`Remove ${opt?.label ?? val}`}
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                        {/* Left side form */}
                        <div className="space-y-5">
                          {/* Study Domain */}
                          <FormField
                            control={form.control}
                            name="studyDomain"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-900">
                                  Study Domain <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full h-11 bg-gray-50/60 border-gray-200 rounded-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="defining-risk">Defining Risk and Cyber</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Taxonomy Framework */}
                          <FormField
                            control={form.control}
                            name="taxonomyFramework"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-900">
                                  Taxonomy Framework <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full h-11 bg-gray-50/60 border-gray-200 rounded-full">
                                      <SelectValue placeholder="Select framework" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="remember">Remember</SelectItem>
                                      <SelectItem value="understand">Understand</SelectItem>
                                      <SelectItem value="apply">Apply</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Question Quantity */}
                          <FormField
                            control={form.control}
                            name="questionQuantity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-900">
                                  Question Quantity <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full h-11 bg-gray-50/60 border-gray-200 rounded-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1</SelectItem>
                                      <SelectItem value="5">5</SelectItem>
                                      <SelectItem value="10">10</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Right side form */}
                        <div className="space-y-5">
                          {/* Learning Objectives */}
                          <FormField
                            control={form.control}
                            name="learningObjectives"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-900">
                                  Learning Objectives <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full h-11 bg-gray-50/60 border-gray-200 rounded-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="explain-pure-risk">Explain why pure risk is</SelectItem>
                                      <SelectItem value="define-cyber-risk">Define cyber risk fundamentals</SelectItem>
                                      <SelectItem value="analyze-threats">Analyze security threats</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Question Format */}
                          <FormField
                            control={form.control}
                            name="questionFormat"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-900">
                                  Question Format <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full h-11 bg-gray-50/60 border-gray-200 rounded-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                      <SelectItem value="written-response">Written Response</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Point Value */}
                          <FormField
                            control={form.control}
                            name="pointValue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-gray-900">
                                  Point Value <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger className="w-full h-11 bg-gray-50/60 border-gray-200 rounded-full">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1</SelectItem>
                                      <SelectItem value="2">2</SelectItem>
                                      <SelectItem value="5">5</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Additional Instructions - Full Width */}
                      <FormField
                        control={form.control}
                        name="additionalInstructions"
                        render={({ field }) => (
                          <FormItem className="mt-5">
                            <FormLabel className="text-sm font-medium text-gray-900">
                              Additional Instructions
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Provide any extra guidance for AI generation..."
                                className="min-h-[110px] bg-gray-50/60 border-gray-200 rounded-xl"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Buttons */}
                      <div className="flex justify-end mt-6">
                        <Button
                          type="submit"
                          className="rounded-full"
                        >
                          <Sparkle className="w-4 h-4 mr-2" />
                          Generate Questions
                        </Button>
                      </div>
                    </form>
                  </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === "repository" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Total Questions</p>
                      <p className="text-2xl font-medium" style={{ color: "#1c398e", fontSize: '1.25rem' }}>
                        1,247
                      </p>
                      <p className="text-xs text-gray-500">+15% this month</p>
                    </div>
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">AI Generated</p>
                      <p className="text-2xl font-medium" style={{ color: "#0d542b", fontSize: '1.25rem' }}>
                        892
                      </p>
                      <p className="text-xs text-gray-500">High quality</p>
                    </div>
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Sparkle className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">This Week</p>
                      <p className="text-2xl font-medium" style={{ color: "#59168b", fontSize: '1.25rem' }}>
                        47
                      </p>
                      <p className="text-xs text-gray-500">New questions</p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-600">Contributors</p>
                      <p className="text-2xl font-medium" style={{ color: "#7e2a0c", fontSize: '1.25rem' }}>
                        12
                      </p>
                      <p className="text-xs text-gray-500">Active authors</p>
                    </div>
                    <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <User className="h-5 w-5 text-orange-600" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Filters & Search */}
            <Card className="border border-gray-200">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Settings2 className="h-4 w-4" />
                    Filters & Search
                  </div>
                  
                  {[
                    {
                      group: "Content",
                      filters: [
                        {
                          label: "Source Type",
                          defaultValue: "all",
                          options: [
                            { value: "all", label: "All" },
                            { value: "book-based", label: "Book Based" },
                            { value: "ai-generated", label: "AI Generated" },
                          ],
                        },
                        {
                          label: "Study Domain",
                          defaultValue: "all",
                          options: [
                            { value: "all", label: "All" },
                            { value: "cyber-risk", label: "Cyber Risk" },
                            { value: "risk-management", label: "Risk Management" },
                          ],
                        },
                        {
                          label: "Learning Objective",
                          defaultValue: "all",
                          options: [
                            { value: "all", label: "All" },
                            { value: "lo-1", label: "Identify cyber threats" },
                            { value: "lo-2", label: "Apply risk frameworks" },
                          ],
                        },
                        {
                          label: "Taxonomy",
                          defaultValue: "all",
                          options: [
                            { value: "all", label: "All" },
                            { value: "remember", label: "Remember" },
                            { value: "understand", label: "Understand" },
                            { value: "apply", label: "Apply" },
                          ],
                        },
                      ],
                    },
                    {
                      group: "Question",
                      filters: [
                        {
                          label: "Question Type",
                          defaultValue: "all",
                          options: [
                            { value: "all", label: "All" },
                            { value: "multiple-choice", label: "Multiple Choice" },
                            { value: "true-false", label: "True/False" },
                            { value: "short-answer", label: "Short Answer" },
                          ],
                        },
                        {
                          label: "Creativity Level",
                          defaultValue: "all",
                          options: [
                            { value: "all", label: "All" },
                            { value: "low", label: "Low" },
                            { value: "medium", label: "Medium" },
                            { value: "high", label: "High" },
                          ],
                        },
                        {
                          label: "Created By",
                          defaultValue: "me",
                          options: [
                            { value: "me", label: "Me" },
                            { value: "team", label: "Team" },
                            { value: "all", label: "Anyone" },
                          ],
                        },
                        {
                          label: "Rating",
                          defaultValue: "all",
                          options: [
                            { value: "all", label: "All" },
                            { value: "5", label: "5 Stars" },
                            { value: "4", label: "4+ Stars" },
                            { value: "3", label: "3+ Stars" },
                          ],
                        },
                      ],
                    },
                  ].map((section) => (
                    <div key={section.group} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                          {section.group}
                        </span>
                        <span className="h-px flex-1 bg-gray-200" aria-hidden="true" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {section.filters.map((f) => (
                          <div key={f.label} className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">{f.label}</label>
                            <Select defaultValue={f.defaultValue}>
                              <SelectTrigger className="w-full h-11 bg-gray-50/60 border-gray-200 rounded-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                {f.options.map((o) => (
                                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Search</label>
                    <div className="group relative flex items-center h-12 pl-5 pr-1.5 bg-white border border-gray-200 rounded-full transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 hover:border-gray-300">
                      <Search className="text-gray-400 h-4 w-4 mr-3 shrink-0 group-focus-within:text-primary transition-colors" />
                      <input
                        placeholder="Search questions..."
                        className="flex-1 h-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                      />
                      <Button
                        type="button"
                        className="h-9 px-6 rounded-full bg-primary hover:bg-primary/90 text-white text-sm font-semibold shrink-0"
                      >
                        Go
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Questions Table */}
            <Card className="border border-gray-200">
              <div className="p-0">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">3 Questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 border-gray-200">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete Selected
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200">
                      <FileText className="h-4 w-4 mr-1" />
                      Export to Word
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200">
                      <FileSpreadsheet className="h-4 w-4 mr-1" />
                      Export to Excel
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-muted">
                        <th className="text-left p-4 text-sm font-medium text-gray-700 w-12">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700 w-16">#</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700 w-48">Question ID</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Question</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Type</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">User Name</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Preview</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Edit</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Delete</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700 w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900">1</td>
                        <td className="p-4 text-xs font-mono text-gray-600">C20_V2024_S11_L00_MC_L2_EN_ID2426</td>
                        <td className="p-4 text-sm text-gray-900 max-w-md">
                          <TooltipProvider delayDuration={150}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="truncate cursor-default">What characteristic of pure risk makes it more acceptable for insurer...</p>
                              </TooltipTrigger>
                              <TooltipContent side="top" align="start" className="max-w-md text-sm leading-relaxed">
                                What characteristic of pure risk makes it more acceptable for insurers to underwrite compared to speculative risk?
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="p-4 text-sm text-gray-700">Multiple Choice</td>
                        <td className="p-4 text-sm text-gray-700">Anil Kumar</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4 text-gray-500" />
                          </Button>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit3 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRateQuestion("What characteristic of pure risk makes it more acceptable for insurer...")}>
                                  <Star className="h-4 w-4 mr-2" />
                                  Rate Question
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer"
                                  onClick={() => {
                                    navigate('/check-similarity', { 
                                      state: { 
                                        from: location.pathname,
                                        question: {
                                          identifier: "C20_V2024_S11_L00_MC_L2_EN_ID2426",
                                          text: "What characteristic of pure risk makes it more acceptable for insurers to cover compared to speculative risk?",
                                          options: [
                                            { id: "A", text: "Pure risk only involves potential loss or no loss, making it predictable" },
                                            { id: "B", text: "Pure risk offers the possibility of gain" },
                                            { id: "C", text: "Speculative risk is more measurable" },
                                            { id: "D", text: "Pure risk always results in loss" }
                                          ]
                                        }
                                      }
                                    })
                                  }}
                                >
                                  <Search className="h-4 w-4 mr-2" />
                                  Check Similarity
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenRefinement("What characteristic of pure risk makes it more acceptable for insurer...")}>
                                  <Sparkle className="h-4 w-4 mr-2" />
                                  Question Refinement
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900">2</td>
                        <td className="p-4 text-xs font-mono text-gray-600">C20_V2024_S11_L01_TF_L1_EN_ID2427</td>
                        <td className="p-4 text-sm text-gray-900 max-w-md">
                          <TooltipProvider delayDuration={150}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="truncate cursor-default">Pure risk always results in a loss or no loss situation.</p>
                              </TooltipTrigger>
                              <TooltipContent side="top" align="start" className="max-w-md text-sm leading-relaxed">
                                Pure risk always results in a loss or no loss situation.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="p-4 text-sm text-gray-700">True/False</td>
                        <td className="p-4 text-sm text-gray-700">Sarah Chen</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4 text-gray-500" />
                          </Button>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit3 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRateQuestion("Pure risk always results in a loss or no loss situation.")}>
                                  <Star className="h-4 w-4 mr-2" />
                                  Rate Question
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <GitCompare className="h-4 w-4 mr-2" />
                                  Check Similarity
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenRefinement("Pure risk always results in a loss or no loss situation.")}>
                                  <Sparkle className="h-4 w-4 mr-2" />
                                  Question Refinement
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="p-4">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="p-4 text-sm font-medium text-gray-900">3</td>
                        <td className="p-4 text-xs font-mono text-gray-600">C20_V2024_S11_L02_SA_L3_EN_ID2428</td>
                        <td className="p-4 text-sm text-gray-900 max-w-md">
                          <TooltipProvider delayDuration={150}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="truncate cursor-default">Explain the relationship between risk assessment and cybersecurity f...</p>
                              </TooltipTrigger>
                              <TooltipContent side="top" align="start" className="max-w-md text-sm leading-relaxed">
                                Explain the relationship between risk assessment and cybersecurity frameworks, and how organizations can apply both to mitigate emerging threats.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>
                        <td className="p-4 text-sm text-gray-700">Short Answer</td>
                        <td className="p-4 text-sm text-gray-700">Mike Ross</td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4 text-gray-500" />
                          </Button>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit3 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRateQuestion("Explain the relationship between risk assessment and cybersecurity f...")}>
                                  <Star className="h-4 w-4 mr-2" />
                                  Rate Question
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <GitCompare className="h-4 w-4 mr-2" />
                                  Check Similarity
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOpenRefinement("Explain the relationship between risk assessment and cybersecurity f...")}>
                                  <Sparkle className="h-4 w-4 mr-2" />
                                  Question Refinement
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>
        )}


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

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Share feedback</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pt-2">
            {/* Question Display */}
            <div>
              <p className="text-sm text-foreground leading-relaxed">
                <span className="font-medium">1.</span> {selectedQuestion}
              </p>
            </div>

            {/* Rating Buttons */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setSelectedRating("up")}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 ${
                  selectedRating === "up"
                    ? "bg-green-500 border-green-600 scale-110 shadow-lg"
                    : "bg-white border-gray-300 hover:border-green-400 hover:scale-105"
                }`}
              >
                <ThumbsUp 
                  className={`h-8 w-8 ${selectedRating === "up" ? "text-white" : "text-gray-400"}`} 
                  fill={selectedRating === "up" ? "white" : "none"}
                />
              </button>
              <button
                onClick={() => setSelectedRating("down")}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 ${
                  selectedRating === "down"
                    ? "bg-red-500 border-red-600 scale-110 shadow-lg"
                    : "bg-white border-gray-300 hover:border-red-400 hover:scale-105"
                }`}
              >
                <ThumbsDown 
                  className={`h-8 w-8 ${selectedRating === "down" ? "text-white" : "text-gray-400"}`} 
                  fill={selectedRating === "down" ? "white" : "none"}
                />
              </button>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description:</label>
              <Textarea
                placeholder="Enter your feedback."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Note */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800 italic leading-relaxed">
                Note: This feedback will be triaged by Development team and will be accounted for further training the model.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setRatingDialogOpen(false)}
                className="px-6"
              >
                Close
              </Button>
              <Button
                onClick={handleSubmitFeedback}
                className="px-6"
              >
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Question Refinement Dialog */}
      <Dialog open={refinementDialogOpen} onOpenChange={setRefinementDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Sparkle className="h-5 w-5" />
              <DialogTitle className="text-xl font-medium">Question Refinement</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">
              Choose the target question type and specify how many variations you'd like to generate.
            </p>

            {/* Question Refinement Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Question Refinement Type</label>
              <Select value={refinementType} onValueChange={setRefinementType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Rewrite">Rewrite</SelectItem>
                  <SelectItem value="Generate Similar">Generate Similar</SelectItem>
                  <SelectItem value="Language Conversion">Language Conversion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Question Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Question Type</label>
              <Select value={refinementQuestionType} onValueChange={setRefinementQuestionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                  <SelectItem value="true-false">True/False</SelectItem>
                  <SelectItem value="short-answer">Short Answer</SelectItem>
                  <SelectItem value="essay">Essay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Questions */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Number of Questions</label>
              <Select value={refinementNumQuestions} onValueChange={setRefinementNumQuestions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Taxonomy */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Taxonomy</label>
              <Select value={refinementTaxonomy} onValueChange={setRefinementTaxonomy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remember">Remember</SelectItem>
                  <SelectItem value="understand">Understand</SelectItem>
                  <SelectItem value="apply">Apply</SelectItem>
                  <SelectItem value="analyze">Analyze</SelectItem>
                  <SelectItem value="evaluate">Evaluate</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Creativity Level */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Creativity Level</label>
              <Select value={refinementCreativity} onValueChange={setRefinementCreativity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Number of Response Options */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Number of Response Options</label>
              <Select value={refinementNumOptions} onValueChange={setRefinementNumOptions}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Source Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Source Type</label>
              <Select value={refinementSourceType} onValueChange={setRefinementSourceType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Book">Book</SelectItem>
                  <SelectItem value="LLM">LLM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setRefinementDialogOpen(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRewriteQuestion}
                className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Rewrite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuestionGenerator