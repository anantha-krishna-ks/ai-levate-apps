import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Database,
  Sparkle,
  FileText,
  FileSpreadsheet,
  User,
  Settings2,
  Search,
  Trash2,
  Eye,
  Edit3,
  MoreVertical,
  Star,
  GitCompare,
  ThumbsUp,
  ThumbsDown,
  PlayCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

type RowQuestion = {
  id: number
  identifier: string
  text: string
  fullText: string
  type: string
  user: string
}

const ROWS: RowQuestion[] = [
  {
    id: 1,
    identifier: "C20_V2024_S11_L00_MC_L2_EN_ID2426",
    text: "What characteristic of pure risk makes it more acceptable for insurer...",
    fullText:
      "What characteristic of pure risk makes it more acceptable for insurers to underwrite compared to speculative risk?",
    type: "Multiple Choice",
    user: "Anil Kumar",
  },
  {
    id: 2,
    identifier: "C20_V2024_S11_L01_TF_L1_EN_ID2427",
    text: "Pure risk always results in a loss or no loss situation.",
    fullText: "Pure risk always results in a loss or no loss situation.",
    type: "True/False",
    user: "Sarah Chen",
  },
  {
    id: 3,
    identifier: "C20_V2024_S11_L02_SA_L3_EN_ID2428",
    text: "Explain the relationship between risk assessment and cybersecurity f...",
    fullText:
      "Explain the relationship between risk assessment and cybersecurity frameworks, and how organizations can apply both to mitigate emerging threats.",
    type: "Short Answer",
    user: "Mike Ross",
  },
]

const FILTER_SECTIONS = [
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
        label: "Difficulty Level",
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
]

export const QuestionRepositoryTab = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false)
  const [refinementDialogOpen, setRefinementDialogOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState("")
  const [selectedRating, setSelectedRating] = useState<"up" | "down" | null>(null)
  const [feedbackText, setFeedbackText] = useState("")
  const [refinementType, setRefinementType] = useState("Rewrite")
  const [refinementQuestionType, setRefinementQuestionType] = useState("multiple-choice")
  const [refinementNumQuestions, setRefinementNumQuestions] = useState("1")
  const [refinementTaxonomy, setRefinementTaxonomy] = useState("apply")
  const [refinementCreativity, setRefinementCreativity] = useState("moderate")
  const [refinementNumOptions, setRefinementNumOptions] = useState("4")
  const [refinementSourceType, setRefinementSourceType] = useState("Book")
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [isLaunching, setIsLaunching] = useState(false)

  const allSelected = selectedIds.length === ROWS.length && ROWS.length > 0
  const toggleAll = (checked: boolean) =>
    setSelectedIds(checked ? ROWS.map((r) => r.id) : [])
  const toggleOne = (id: number, checked: boolean) =>
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((x) => x !== id)
    )

  const handleRunAnalysis = () => {
    if (selectedIds.length === 0 || isLaunching) return
    setIsLaunching(true)
    toast.success(
      `Launching analysis for ${selectedIds.length} question${selectedIds.length > 1 ? "s" : ""}...`,
      { description: "Preparing your analysis run. Hang tight." }
    )
    setTimeout(() => {
      navigate("/item-validation/analysis-runs", {
        state: { selectedCount: selectedIds.length },
      })
    }, 850)
  }

  const handleRateQuestion = (q: string) => {
    setSelectedQuestion(q)
    setSelectedRating(null)
    setFeedbackText("")
    setRatingDialogOpen(true)
  }
  const handleOpenRefinement = (q: string) => {
    setSelectedQuestion(q)
    setRefinementDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <Card className="border border-gray-200">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Settings2 className="h-4 w-4" />
              Filters & Search
            </div>

            {FILTER_SECTIONS.map((section) => (
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
              <span className="text-sm font-medium text-gray-700">{ROWS.length} Questions</span>
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
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={allSelected}
                      onChange={(e) => toggleAll(e.target.checked)}
                    />
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
                {ROWS.map((q) => (
                  <tr key={q.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selectedIds.includes(q.id)}
                        onChange={(e) => toggleOne(q.id, e.target.checked)}
                      />
                    </td>
                    <td className="p-4 text-sm font-medium text-gray-900">{q.id}</td>
                    <td className="p-4 text-xs font-mono text-gray-600">{q.identifier}</td>
                    <td className="p-4 text-sm text-gray-900 max-w-md">
                      <TooltipProvider delayDuration={150}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <p className="truncate cursor-default">{q.text}</p>
                          </TooltipTrigger>
                          <TooltipContent side="top" align="start" className="max-w-md text-sm leading-relaxed">
                            {q.fullText}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{q.type}</td>
                    <td className="p-4 text-sm text-gray-700">{q.user}</td>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRateQuestion(q.text)}>
                            <Star className="h-4 w-4 mr-2" />
                            Rate Question
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              navigate("/check-similarity", {
                                state: {
                                  from: location.pathname,
                                  question: {
                                    identifier: q.identifier,
                                    text: q.fullText,
                                  },
                                },
                              })
                            }
                          >
                            <GitCompare className="h-4 w-4 mr-2" />
                            Check Similarity
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleOpenRefinement(q.text)}>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Rating Dialog */}
      <Dialog open={ratingDialogOpen} onOpenChange={setRatingDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-medium">Share feedback</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <p className="text-sm text-foreground leading-relaxed">
              <span className="font-medium">1.</span> {selectedQuestion}
            </p>
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setSelectedRating("up")}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 ${
                  selectedRating === "up"
                    ? "bg-green-500 border-green-600 scale-110 shadow-lg"
                    : "bg-white border-gray-300 hover:border-green-400 hover:scale-105"
                }`}
              >
                <ThumbsUp className={`h-8 w-8 ${selectedRating === "up" ? "text-white" : "text-gray-400"}`} fill={selectedRating === "up" ? "white" : "none"} />
              </button>
              <button
                onClick={() => setSelectedRating("down")}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all border-2 ${
                  selectedRating === "down"
                    ? "bg-red-500 border-red-600 scale-110 shadow-lg"
                    : "bg-white border-gray-300 hover:border-red-400 hover:scale-105"
                }`}
              >
                <ThumbsDown className={`h-8 w-8 ${selectedRating === "down" ? "text-white" : "text-gray-400"}`} fill={selectedRating === "down" ? "white" : "none"} />
              </button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description:</label>
              <Textarea
                placeholder="Enter your feedback."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="min-h-[120px] resize-none"
              />
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-sm text-amber-800 italic leading-relaxed">
                Note: This feedback will be triaged by Development team and will be accounted for further training the model.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setRatingDialogOpen(false)} className="px-6">Close</Button>
              <Button onClick={() => setRatingDialogOpen(false)} className="px-6">Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refinement Dialog */}
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
            {[
              { label: "Question Refinement Type", value: refinementType, set: setRefinementType, options: ["Rewrite", "Generate Similar", "Language Conversion"] },
              { label: "Question Type", value: refinementQuestionType, set: setRefinementQuestionType, options: ["multiple-choice", "true-false", "short-answer", "essay"] },
              { label: "Number of Questions", value: refinementNumQuestions, set: setRefinementNumQuestions, options: ["1", "2", "3", "5", "10"] },
              { label: "Taxonomy", value: refinementTaxonomy, set: setRefinementTaxonomy, options: ["remember", "understand", "apply", "analyze", "evaluate", "create"] },
              { label: "Difficulty Level", value: refinementCreativity, set: setRefinementCreativity, options: ["low", "moderate", "high"] },
              { label: "Number of Response Options", value: refinementNumOptions, set: setRefinementNumOptions, options: ["2", "3", "4", "5"] },
              { label: "Source Type", value: refinementSourceType, set: setRefinementSourceType, options: ["Book", "LLM"] },
            ].map((f) => (
              <div key={f.label} className="space-y-2">
                <label className="text-sm font-medium text-foreground">{f.label}</label>
                <Select value={f.value} onValueChange={f.set}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {f.options.map((o) => (
                      <SelectItem key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1).replace(/-/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setRefinementDialogOpen(false)} className="px-6">Cancel</Button>
              <Button onClick={() => setRefinementDialogOpen(false)} className="px-6 bg-primary hover:bg-primary/90 text-primary-foreground">Rewrite</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuestionRepositoryTab