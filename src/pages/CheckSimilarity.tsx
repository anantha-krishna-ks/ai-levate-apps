import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Eye, GitCompare, FileQuestion, Hash, CheckCircle2, Sparkle, BookOpen, User, Target, ListChecks, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import TokenUsagePopover from "@/components/TokenUsagePopover"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const CheckSimilarity = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedQuestion = location.state?.question
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [previewQuestion, setPreviewQuestion] = useState<any>(null)
  const [filterType, setFilterType] = useState("all")

  // Sample similar questions data
  const similarQuestions = [
    {
      id: 1,
      identifier: "IG_V2025_C43_LO307_MC_L4_EN_ID4825",
      question: "Within the context of accounting and finance functions in a large organisation, internal audit and external audit often address different objectives during their assessments. How do the roles of internal and external audit differ when reviewing the effectiveness of a company's internal control systems?",
      score: 74
    },
    {
      id: 2,
      identifier: "IG_V2025_C43_LO304_MC_L1_EN_ID4816",
      question: "An organisation is reviewing its annual accounting process to ensure compliance and accurate reporting for its owners. Which function is critical in transforming raw financial data into reports that reflect the company's performance each financial year?",
      score: 48
    },
    {
      id: 3,
      identifier: "IG_V2025_C43_LO303_MC_L1_EN_ID4815",
      question: "A company aims to monitor its procedures and performance to ensure operational effectiveness using appropriate organisational functions. Which role does accounting play in helping the company to achieve this goal?",
      score: 49
    },
    {
      id: 4,
      identifier: "IG_V2025_C43_LO302_MC_L2_EN_ID4814",
      question: "Managers in an organisation use various kinds of data to review internal processes and evaluate financial health for decision-making purposes. Which accounting function primarily focuses on providing detailed reports for internal management use?",
      score: 42
    },
    {
      id: 5,
      identifier: "IG_V2025_C43_LO301_MC_L3_EN_ID4813",
      question: "In a business environment, different stakeholders require financial information for various purposes. How does the target audience differ between management accounting and financial accounting?",
      score: 38
    }
  ]

  const handlePreview = (question: any) => {
    setPreviewQuestion(question)
    setIsPreviewDialogOpen(true)
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
            <TokenUsagePopover used={2238} total={10000} scopeLabel="Check Similarity" />

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
              <BreadcrumbPage>Check Similarity</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Title + Back */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-9 rounded-full pl-2.5 pr-3.5 gap-1.5 border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </Button>
            <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
            <h1 className="text-2xl font-medium text-gray-900">Check Similarity</h1>
          </div>
        </div>

        {/* Selected Question Details */}
        <Card className="overflow-hidden bg-card border shadow-sm mb-6 animate-fade-in">
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-5 py-3 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileQuestion className="w-4 h-4 text-primary-foreground" />
              </div>
              <h2 className="text-lg font-medium text-foreground">Question Details</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Question ID Badge */}
            <div className="animate-scale-in">
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Question ID</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-md">
                <span className="font-mono text-sm font-medium text-primary">
                  {selectedQuestion?.identifier || "C20_V2024_S11_L00_MC_L2_EN_ID2426"}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-2">
                <Sparkle className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-muted-foreground">Question</span>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50/50 to-blue-50/50 rounded-md border border-purple-100">
                <p className="text-sm text-foreground leading-relaxed font-medium">
                  {selectedQuestion?.text || "What characteristic of pure risk makes it more acceptable for insurers to cover compared to speculative risk?"}
                </p>
              </div>
            </div>

            {/* Options */}
            <div className="animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-muted-foreground">Answer Options</span>
              </div>
              <div className="space-y-2.5">
                {selectedQuestion?.options ? (
                  selectedQuestion.options.map((option: any) => (
                    <div 
                      key={option.id} 
                      className="flex gap-3 p-3 bg-card rounded-md border border-border"
                    >
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                        <span className="font-medium text-white text-sm">{option.id}</span>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed flex-1">{option.text}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex gap-3 p-3 bg-card rounded-md border border-border">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                        <span className="font-medium text-white text-sm">A</span>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed flex-1">Pure risk only involves potential loss or no loss, making it predictable</span>
                    </div>
                    <div className="flex gap-3 p-3 bg-card rounded-md border border-border">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                        <span className="font-medium text-white text-sm">B</span>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed flex-1">Pure risk offers the possibility of gain</span>
                    </div>
                    <div className="flex gap-3 p-3 bg-card rounded-md border border-border">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                        <span className="font-medium text-white text-sm">C</span>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed flex-1">Speculative risk is more measurable</span>
                    </div>
                    <div className="flex gap-3 p-3 bg-card rounded-md border border-border">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                        <span className="font-medium text-white text-sm">D</span>
                      </div>
                      <span className="text-sm text-foreground leading-relaxed flex-1">Pure risk always results in loss</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Filter Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-foreground">Similar Questions</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Filter by:</span>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="stem">Stem and Option</SelectItem>
                <SelectItem value="high-score">High Score (&gt;60)</SelectItem>
                <SelectItem value="medium-score">Medium Score (40-60)</SelectItem>
                <SelectItem value="low-score">Low Score (&lt;40)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Similar Questions Table */}
        <Card className="bg-card border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-muted">
                <TableHead className="font-medium text-foreground">Sl No</TableHead>
                <TableHead className="font-medium text-foreground">Question Identifier</TableHead>
                <TableHead className="font-medium text-foreground w-[50%]">Question</TableHead>
                <TableHead className="font-medium text-foreground text-center">Score</TableHead>
                <TableHead className="font-medium text-foreground text-center">Preview</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {similarQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="text-foreground">{question.id}</TableCell>
                  <TableCell className="text-foreground font-mono text-sm">{question.identifier}</TableCell>
                  <TableCell className="text-foreground">{question.question}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <div className={`inline-flex items-center justify-center min-w-[3.5rem] px-3 py-1.5 rounded-full font-medium text-sm ${
                        question.score >= 60 ? 'bg-green-600 text-white' : 
                        question.score >= 40 ? 'bg-orange-600 text-white' : 
                        'bg-red-600 text-white'
                      }`}>
                        {question.score}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePreview(question)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Preview Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] w-[calc(100vw-2rem)] p-0">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 sm:px-6 py-4 border-b">
            <DialogTitle className="text-lg sm:text-xl font-medium text-foreground flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-primary" />
              Question Preview
            </DialogTitle>
          </div>
          
          {previewQuestion && (
            <ScrollArea className="h-[calc(90vh-140px)]">
              <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
                {/* Question Identifier & Score */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">Question Identifier</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-md">
                      <span className="font-mono text-sm font-medium text-primary">
                        {previewQuestion.identifier}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-sm font-medium text-muted-foreground block mb-2">Similarity Score</span>
                    <div className={`text-4xl font-medium ${
                      previewQuestion.score >= 60 ? 'text-green-600' : 
                      previewQuestion.score >= 40 ? 'text-orange-600' : 
                      'text-red-600'
                    }`}>
                      {previewQuestion.score}%
                    </div>
                  </div>
                </div>

                {/* Question Stem */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkle className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-muted-foreground">Question Stem</span>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50/50 to-blue-50/50 rounded-md border border-purple-100">
                    <p className="text-base text-foreground leading-relaxed">
                      {previewQuestion.question}
                    </p>
                  </div>
                </div>

                {/* Options */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ListChecks className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-muted-foreground">Answer Options</span>
                  </div>
                  <div className="space-y-2.5">
                    {['A', 'B', 'C', 'D', 'E', 'F'].map((option) => (
                      <div key={option} className="flex gap-3 p-3 bg-card rounded-md border border-border">
                        <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-primary to-blue-600 rounded flex items-center justify-center">
                          <span className="font-medium text-white text-sm">{option}</span>
                        </div>
                        <span className="text-sm text-foreground leading-relaxed flex-1">
                          [Option {option} text placeholder]
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correct Answer */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-muted-foreground">Correct Answer</span>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-base text-foreground font-medium">
                      A. [Correct answer text placeholder]
                    </p>
                  </div>
                </div>

                {/* Feedback */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-muted-foreground">Feedback</span>
                  </div>
                  <div className="space-y-2.5">
                    {['A', 'B', 'C', 'D', 'E', 'F'].map((option) => (
                      <div key={option} className="p-3 bg-muted/30 rounded-md border border-border/50">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">Option {option}:</span> [Feedback for option {option}]
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-card rounded-md border border-border">
                    <span className="text-sm font-medium text-muted-foreground block mb-2">Type</span>
                    <Badge variant="secondary" className="text-sm">Multiple Choice</Badge>
                  </div>
                  
                  <div className="p-4 bg-card rounded-md border border-border">
                    <span className="text-sm font-medium text-muted-foreground block mb-2">Taxonomy</span>
                    <Badge variant="secondary" className="text-sm">Analyze</Badge>
                  </div>
                  
                  <div className="col-span-2 p-4 bg-card rounded-md border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">Book Name</span>
                    </div>
                    <p className="text-sm text-foreground font-medium">BUSINESS AND TECHNOLOGY</p>
                  </div>
                  
                  <div className="col-span-2 p-4 bg-card rounded-md border border-border">
                    <span className="text-sm font-medium text-muted-foreground block mb-2">Source</span>
                    <p className="text-sm text-foreground">Accounting and Finance Functions</p>
                  </div>
                  
                  <div className="col-span-2 p-4 bg-card rounded-md border border-border">
                    <span className="text-sm font-medium text-muted-foreground block mb-2">Learning Objectives</span>
                    <p className="text-sm text-foreground leading-relaxed">
                      2.e. Describe the main audit and assurance roles in business
                    </p>
                  </div>
                  
                  <div className="p-4 bg-card rounded-md border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">User Name</span>
                    </div>
                    <p className="text-sm text-foreground font-medium">esiguser3</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
          
          {/* Close Button */}
          <div className="border-t bg-card px-4 sm:px-6 py-4">
            <div className="flex justify-end">
              <Button onClick={() => setIsPreviewDialogOpen(false)} size="lg">
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CheckSimilarity
