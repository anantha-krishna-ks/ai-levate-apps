import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  Zap, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  FileText,
  FileSpreadsheet,
  Database,
  Edit3,
  Eye,
  Trash2,
  RotateCcw,
  Sparkle,
  ChevronDown,
  Target,
  User,
  Hash,
  AlignLeft,
  X,
  XCircle,
  AlertCircle,
  Plus,
  Star,
  GraduationCap,
  FileQuestion,
  MessageSquare,
  List,
  Check,
  Info,
  Settings2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import TokenUsagePopover from "@/components/TokenUsagePopover"
import { QuestionPillToggle } from "./QuestionGenerator"
import { LogOut, Settings } from "lucide-react"
import { QuestionRepositoryTab } from "@/components/QuestionRepositoryTab"

const QuestionResults = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("generate")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [questionType, setQuestionType] = useState("multiple-choice")
  const [selectedQuestionType, setSelectedQuestionType] = useState("Multiple Choice")
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "Why are speculative risks generally excluded from insurance coverage, and how does this differ from the treatment of pure risks?",
      type: "multiple-choice",
      marks: 5,
      options: [
        { id: "A", text: "Pure risk involves only the possibility of loss or no loss, making it insurable.", isCorrect: true },
        { id: "B", text: "Speculative risk involves the possibility of gain, making it insurable.", isCorrect: false },
        { id: "C", text: "Pure risk involves both gain and loss, making it uninsurable.", isCorrect: false },
        { id: "D", text: "Speculative risk involves only loss, making it insurable.", isCorrect: false }
      ],
      answer: "Speculative risks involve the possibility of gain or loss, making them unsuitable for insurance coverage, which is designed for predictable and measurable risks like pure risks. Pure risks only involve the chance of loss or no loss, allowing insurers to calculate premiums and manage claims effectively."
    },
    {
      id: 2,
      text: "What role does statistical predictability play in the insurability of pure risks versus speculative risks?",
      type: "multiple-choice",
      marks: 5,
      options: [
        { id: "A", text: "Statistical predictability makes both pure and speculative risks equally insurable.", isCorrect: false },
        { id: "B", text: "Pure risks are statistically predictable, allowing insurers to calculate accurate premiums.", isCorrect: true },
        { id: "C", text: "Speculative risks are more predictable than pure risks.", isCorrect: false },
        { id: "D", text: "Statistical predictability is irrelevant to insurance coverage.", isCorrect: false }
      ],
      answer: "Pure risks are statistically predictable because they follow established patterns of loss occurrence, enabling insurers to calculate accurate premiums and maintain financial stability. Speculative risks involve unpredictable outcomes that could result in gains or losses, making them unsuitable for traditional insurance models."
    }
  ])
  const [keyPoints, setKeyPoints] = useState([
    "Speculative risks - Include the potential for financial gain, which is incompatible with insurance principles.",
    "Pure risks - Only involve loss or no loss, making them insurable and predictable.",
    "Risk predictability - Insurance relies on statistical data to assess and cover pure risks.",
    "Profit exclusion - Insurance excludes risks with potential profit to avoid gambling",
    "Actuarial basis - Insurers use pure risks for accurate premium calculations and risk management."
  ])

  const stats = [
    {
      title: "Remaining Tokens",
      value: "2200",
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Questions Generated", 
      value: questions.length.toString(),
      icon: <CheckCircle2 className="w-5 h-5 text-green-600" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Generation Time",
      value: "2.3 seconds", 
      icon: <Clock className="w-5 h-5 text-purple-600" />,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
    {
      title: "Knowledge Base",
      value: "Cyber Risk",
      icon: <BookOpen className="w-5 h-5 text-orange-600" />,
      bgColor: "bg-orange-50", 
      borderColor: "border-orange-200"
    }
  ]

  const generateNewQuestions = async () => {
    setIsRegenerating(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate new questions based on the current question type
    const newQuestions = questionType === "multiple-choice" ? [
      {
        id: questions.length + 1,
        text: "How does the principle of utmost good faith apply differently to pure risks compared to speculative risks in insurance contracts?",
        type: "multiple-choice",
        marks: 5,
        options: [
          { id: "A", text: "Utmost good faith applies equally to both pure and speculative risks.", isCorrect: false },
          { id: "B", text: "Pure risks require full disclosure as they are based on factual circumstances that can be verified.", isCorrect: true },
          { id: "C", text: "Speculative risks require more disclosure than pure risks.", isCorrect: false },
          { id: "D", text: "Utmost good faith is not applicable to insurance contracts.", isCorrect: false }
        ],
        answer: "Pure risks require full disclosure under utmost good faith principles because insurers need accurate information about factual circumstances to assess risk properly. This differs from speculative risks where the element of potential gain makes disclosure requirements more complex."
      },
      {
        id: questions.length + 2,
        text: "What impact does the law of large numbers have on the insurability of pure risks versus speculative risks?",
        type: "multiple-choice",
        marks: 5,
        options: [
          { id: "A", text: "The law of large numbers makes speculative risks more predictable than pure risks.", isCorrect: false },
          { id: "B", text: "Pure risks benefit from the law of large numbers, enabling accurate premium calculations.", isCorrect: true },
          { id: "C", text: "The law of large numbers has no impact on insurance pricing.", isCorrect: false },
          { id: "D", text: "Both pure and speculative risks are equally affected by the law of large numbers.", isCorrect: false }
        ],
        answer: "The law of large numbers enables insurers to predict the frequency and severity of pure risk losses across a large pool of similar exposures, making premium calculations accurate and sustainable. Speculative risks don't follow predictable patterns, making this principle less applicable."
      }
    ] : [
      {
        id: questions.length + 1,
        text: "Analyze the fundamental differences between pure and speculative risks in terms of their characteristics and explain why insurance companies focus primarily on pure risks.",
        type: "written-response",
        marks: 5,
        options: [],
        answer: "Pure risks are characterized by uncertainty about whether a loss will occur, with only two possible outcomes: loss or no loss. They are typically involuntary, predictable through statistical analysis, and involve circumstances beyond the insured's control. Speculative risks, conversely, involve three possible outcomes: gain, loss, or no change, and are often voluntary decisions made for potential profit. Insurance companies focus on pure risks because they can be quantified, predicted, and managed through risk pooling and the law of large numbers, while speculative risks would create moral hazard and contradict insurance principles by potentially rewarding risky behavior undertaken for profit."
      },
      {
        id: questions.length + 2,
        text: "Discuss how the principle of indemnity applies to pure risks and explain why this principle would be problematic if applied to speculative risks in insurance coverage.",
        type: "written-response",
        marks: 5,
        options: [],
        answer: "The principle of indemnity ensures that insurance compensation restores the insured to their financial position before the loss, preventing profit from insurance claims. This works well with pure risks because the loss is measurable and the goal is restoration, not enrichment. With speculative risks, applying indemnity would be problematic because these risks involve potential gains that cannot be measured or predicted. If someone takes a speculative risk expecting profit but suffers a loss, compensating them would essentially guarantee the gain they hoped for while eliminating the risk they voluntarily assumed, creating moral hazard and transforming insurance into a gambling mechanism."
      }
    ]
    
    setQuestions(prevQuestions => [...prevQuestions, ...newQuestions])
    setIsRegenerating(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - frosted glass, full width */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-card/95 border-b border-border">
        <div className="flex h-16 items-center px-6 gap-4">
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link to="/dashboard" className="flex-shrink-0">
              <img
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png"
                alt="AI-Levate"
                className="h-8 w-auto"
              />
            </Link>
          </div>

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
              <BreadcrumbLink asChild>
                <Link to="/question-generator/cyber-risk">Cyber Risk</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Generated Questions</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title + Pill Toggle */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Link to="/question-generator/cyber-risk" aria-label="Back to question generator">
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
        <>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className={`p-6 ${stat.bgColor} border ${stat.borderColor} shadow-sm`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stat.title}</span>
                {stat.icon}
              </div>
              <div className="text-2xl font-medium text-gray-900">{stat.value}</div>
            </Card>
          ))}
        </div>

        {/* Question Generation Parameters */}
        <Card className="p-6 bg-white border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">?</span>
            <h3 className="text-lg font-medium text-gray-900">Question Generation Parameters</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            <div>
              <label className="text-sm text-gray-600 block mb-2">Study</label>
              <Select defaultValue="defining-risk">
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="defining-risk">1. Defining Risk and C...</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 block mb-2">Learning Outcomes</label>
              <Select defaultValue="explain-pure">
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="explain-pure">1. Explain why pure ri...</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 block mb-2">Taxonomy</label>
              <Select defaultValue="understand">
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="understand">Understand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 block mb-2">Number of Questions</label>
              <Select defaultValue="5">
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 block mb-2">Marks</label>
              <Select defaultValue="1">
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-600 block mb-2">Question Type</label>
              <Select defaultValue="multiple-choice" onValueChange={(value) => {
                setQuestionType(value)
                setSelectedQuestionType(value === "multiple-choice" ? "Multiple Choice" : "Written Response")
              }}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">1. Multiple Choice</SelectItem>
                  <SelectItem value="written-response">2. Written Response</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={generateNewQuestions}
              disabled={isRegenerating}
            >
              <RotateCcw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
              {isRegenerating ? 'Generating...' : 'Regenerate'}
            </Button>
            <Button 
              variant="outline" 
              className="text-gray-600"
              onClick={() => navigate('/question-generator/cyber-risk')}
            >
              Back to Setup
            </Button>
          </div>
        </Card>

        {/* Generated Questions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Generated Questions</h3>
              <p className="text-sm text-gray-500">Review and manage your generated questions</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="text-primary border-primary/30 hover:bg-primary/5 hover:text-primary">
                <FileText className="w-4 h-4 mr-2 text-primary" />
                Export to Word
              </Button>
              <Button variant="outline" className="text-primary border-primary/30 hover:bg-primary/5 hover:text-primary">
                <FileSpreadsheet className="w-4 h-4 mr-2 text-primary" />
                Export to Excel
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setIsSuccessDialogOpen(true)}
              >
                <Database className="w-4 h-4 mr-2" />
                Save Data
              </Button>
            </div>
          </div>

          {/* Questions List */}
          {questions.map((question, index) => (
            <Card key={question.id} className="mb-6 border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-black text-white px-3 py-1 rounded text-sm font-medium">Question {index + 1}</span>
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">{question.marks} Marks</span>
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm">
                      {question.type === "multiple-choice" ? "Multiple Choice" : "Written Response"}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-purple-600"
                      onClick={() => setIsPreviewDialogOpen(true)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this question?")) {
                          setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== question.id))
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
                
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  {index + 1}. {question.text}
                </h4>
                
                {question.type === "multiple-choice" ? (
                  <>
                    <div className="space-y-3 mb-4">
                      {question.options.map((option) => (
                        <div 
                          key={option.id}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            option.isCorrect 
                              ? 'bg-green-50 border border-green-200' 
                              : 'border border-gray-200'
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                            option.isCorrect 
                              ? 'bg-green-600 text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {option.id}
                          </span>
                          <span className={option.isCorrect ? 'text-gray-900' : 'text-gray-700'}>
                            {option.text}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        <strong>Correct Answer:</strong> {question.options.find(opt => opt.isCorrect)?.id}. {question.options.find(opt => opt.isCorrect)?.text}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <MessageSquare className="w-5 h-5 text-green-600 mt-0.5" />
                      <h5 className="font-medium text-green-900">Sample Answer:</h5>
                    </div>
                    <p className="text-green-800 leading-relaxed">
                      {question.answer}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}

        </div>

        {/* Need More Questions */}
        <Card className="p-8 text-center border border-gray-200 mb-8">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkle className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Need more questions?</h3>
          <p className="text-gray-600 mb-6">Generate additional questions with the same or different parameters</p>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Generate More Questions
          </Button>
        </Card>
        </>
        )}

        {/* Footer */}
        {activeTab === "generate" && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground">
            <Sparkle className="h-3.5 w-3.5 text-primary" />
            <span>Powered by advanced AI technology</span>
          </div>
          </div>
        )}

        {/* Repository Tab Content */}
        {activeTab === "repository" && <QuestionRepositoryTab />}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-medium text-gray-900">
                  {questionType === "written-response" ? "Edit Written Response" : "Edit Multiple Choice"}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {questionType === "written-response" 
                    ? "Modify the question content, sample answer, key points, and metadata below."
                    : "Modify the question content, options, feedback, and metadata below."
                  }
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8 py-6">
            {/* Question Stem */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Question Stem</h3>
              </div>
              
              <Textarea 
                defaultValue="Why are speculative risks generally excluded from insurance coverage, and how does this differ from the treatment of pure risks?"
                className="min-h-[100px] text-gray-900 bg-gray-50 border-gray-200 resize-none"
                placeholder="Enter your question here..."
              />
            </div>

            {questionType === "written-response" ? (
              <>
                {/* Sample Answer */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Sample Answer</h3>
                  </div>
                  
                  <Textarea 
                    defaultValue="Speculative risks involve the possibility of gain or loss, making them unsuitable for insurance coverage, which is designed for predictable and measurable risks like pure risks. Pure risks only involve the chance of loss or no loss, allowing insurers to calculate premiums and manage claims effectively."
                    className="min-h-[120px] text-gray-900 bg-gray-50 border-gray-200 resize-none"
                    placeholder="Enter the sample answer..."
                  />
                </div>

                {/* Key Points */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                        <List className="w-4 h-4 text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">Key Points</h3>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Point
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <Textarea 
                          defaultValue={point}
                          className="flex-1 min-h-[60px] bg-white border-gray-200 resize-none"
                          placeholder={`Enter key point ${index + 1}...`}
                        />
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 flex-shrink-0 mt-1">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-800">
                        <strong>Tip:</strong> Key points should highlight the main concepts, differences, or important aspects that students should understand from this question.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <Label className="text-lg font-medium text-gray-800">Options</Label>
                      <p className="text-sm text-gray-500">Configure answer choices</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {['A', 'B', 'C', 'D'].map((option, index) => (
                      <div key={option} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className="w-10 h-10 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 mt-1 shadow-sm">
                          {option}
                        </div>
                        <Textarea 
                          defaultValue={[
                            "Pure risk involves only the possibility of loss or no loss, making it insurable.",
                            "Speculative risk involves the possibility of gain, making it insurable.",
                            "Pure risk involves both gain and loss, making it uninsurable.",
                            "Speculative risk involves only loss, making it insurable."
                          ][index]}
                          className="flex-1 min-h-[80px] resize-none border-gray-200 focus:border-blue-400 focus:ring-blue-100"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <Label className="text-lg font-medium text-gray-800">Correct Answer</Label>
                      <p className="text-sm text-gray-500">Select the correct option</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Select defaultValue="A">
                      <SelectTrigger className="w-24 h-12 border-gray-200 focus:border-purple-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-900">
                        <strong>Selected Answer:</strong> A. Pure risk involves only the possibility of loss or no loss, making it insurable.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <Label className="text-lg font-medium text-gray-800">Feedback</Label>
                      <p className="text-sm text-gray-500">Provide explanations for each option</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {[
                      {option: 'A', feedback: 'Correct. Pure risk is insurable because it does not include the possibility of gain.', bg: 'bg-gray-50'},
                      {option: 'B', feedback: 'Incorrect. Speculative risk includes the possibility of gain, which makes it uninsurable.', bg: 'bg-gray-50'},
                      {option: 'C', feedback: 'Incorrect. Pure risk does not involve gain, only the possibility of loss or no loss.', bg: 'bg-gray-50'},
                      {option: 'D', feedback: 'Incorrect. Speculative risk involves both loss and gain, making it uninsurable.', bg: 'bg-gray-50'}
                    ].map((item, index) => (
                      <div key={item.option} className={`p-4 ${item.bg} rounded-lg border border-gray-200`}>
                        <Label className="text-sm font-medium text-gray-800 mb-3 block flex items-center gap-2">
                          <span className="w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xs font-medium">
                            {item.option}
                          </span>
                          Option {item.option} Feedback
                        </Label>
                        <Textarea 
                          defaultValue={item.feedback}
                          className="min-h-[80px] resize-none border-gray-200 focus:border-orange-400 focus:ring-orange-100 bg-white"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Question Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <FileQuestion className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Question Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    Max Marks
                  </Label>
                  <Select defaultValue="5">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FileQuestion className="w-4 h-4" />
                    Type
                  </Label>
                  <Select defaultValue={questionType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="written-response">Written Response</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Source
                  </Label>
                  <Select defaultValue="book-based">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="book-based">Book Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button 
              onClick={() => setIsEditDialogOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-medium text-gray-900">
                  {questionType === "written-response" ? "Preview Written Response" : "Preview Multiple Choice"}
                </DialogTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {questionType === "written-response"
                    ? "Review the complete written response question with sample answer, key points, and metadata details."
                    : "Review the complete question with all options, feedback, and metadata details."
                  }
                </p>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-8 py-6">
            {/* Question Stem */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Question Stem:</h3>
              </div>
              
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-900 leading-relaxed">
                  Why are speculative risks generally excluded from insurance coverage, and how does this differ from the treatment of pure risks?
                </p>
              </div>
            </div>

            {questionType === "written-response" ? (
              <>
                {/* Answer */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Answer:</h3>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-purple-900 leading-relaxed">
                      Speculative risks involve the possibility of gain or loss, making them unsuitable for insurance coverage, which is designed for predictable and measurable risks like pure risks. Pure risks only involve the chance of loss or no loss, allowing insurers to calculate premiums and manage claims effectively.
                    </p>
                  </div>
                </div>

                {/* Key Points */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <List className="w-4 h-4 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Key Points:</h3>
                  </div>
                  
                  <div className="p-6 bg-green-50 border border-green-200 rounded-lg space-y-4">
                    {keyPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          •
                        </div>
                        <p className="text-green-800 leading-relaxed">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Answer Options:</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-green-50 border-2 border-green-300 rounded-lg">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">A.</span>
                        <span className="text-gray-900 ml-2">Pure risk involves only the possibility of loss or no loss, making it insurable.</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
                        B
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">B.</span>
                        <span className="text-gray-700 ml-2">Speculative risk involves the possibility of gain, making it insurable.</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
                        C
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">C.</span>
                        <span className="text-gray-700 ml-2">Pure risk involves both gain and loss, making it uninsurable.</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-700 flex-shrink-0">
                        D
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">D.</span>
                        <span className="text-gray-700 ml-2">Speculative risk involves only loss, making it insurable.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Correct Answer */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
                  <p className="text-blue-900 font-medium">
                    <strong>Correct Answer:</strong> A. Pure risk involves only the possibility of loss or no loss, making it insurable.
                  </p>
                </div>

                {/* Detailed Feedback */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">Detailed Feedback:</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Option A:</span>
                        <span className="text-green-800 font-medium ml-2">Correct. Pure risk is insurable because it does not include the possibility of gain.</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Option B:</span>
                        <span className="text-red-800 font-medium ml-2">Incorrect. Speculative risk includes the possibility of gain, which makes it uninsurable.</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Option C:</span>
                        <span className="text-red-800 font-medium ml-2">Incorrect. Pure risk does not involve gain, only the possibility of loss or no loss.</span>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <XCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Option D:</span>
                        <span className="text-red-800 font-medium ml-2">Incorrect. Speculative risk involves both loss and gain, making it uninsurable.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Question Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                  <FileQuestion className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Question Details:</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileQuestion className="w-4 h-4 text-blue-600" />
                    <Label className="text-sm font-medium text-blue-700">Type</Label>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-blue-900 font-medium">{questionType === "written-response" ? "Written Response" : "Multiple Choice"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-purple-600" />
                    <Label className="text-sm font-medium text-purple-700">Max Marks</Label>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <span className="text-purple-900 font-medium">5</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-600" />
                    <Label className="text-sm font-medium text-green-700">Source</Label>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-900 font-medium">Book Based</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-600" />
                    <Label className="text-sm font-medium text-gray-700">Book Name</Label>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <span className="text-orange-900 font-medium">Cyber Risk</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-blue-600" />
                    <Label className="text-sm font-medium text-blue-700">Taxonomy</Label>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-blue-900 font-medium">Understand</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <Label className="text-sm font-medium text-gray-700">User Name</Label>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-900 font-medium">Robert Jones</span>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gray-600" />
                    <Label className="text-sm font-medium text-gray-700">Study</Label>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-900 font-medium">Defining Risk and Cyber Risk</span>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gray-600" />
                    <Label className="text-sm font-medium text-gray-700">Learning Objective</Label>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-900 font-medium">Explain why pure risk is insurable but speculative risk is not</span>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <Label className="text-sm font-medium text-gray-700">Reference Info</Label>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <span className="text-gray-900 font-medium">Study 1, Learning Objective 1, Page 1.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button 
              variant="outline" 
              onClick={() => setIsPreviewDialogOpen(false)}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-xl font-medium text-gray-900 mb-2">
                Data Saved Successfully!
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 mb-6">
              {questions.length} questions have been successfully saved to your repository.
            </p>
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg w-full mb-6">
              <Database className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-green-800">Repository Updated</p>
                <p className="text-xs text-green-600">Questions are now available in your collection</p>
              </div>
            </div>
            <Button 
              onClick={() => setIsSuccessDialogOpen(false)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuestionResults
