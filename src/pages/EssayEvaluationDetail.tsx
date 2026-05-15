import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams, Link } from "react-router-dom"
import { Save, FileSpreadsheet, Trash, ChevronDown, ChevronUp, ArrowLeft, PenTool, Loader2, Download, Eye, ArrowUp, Sparkle } from "lucide-react"
import essayEvaluationImage from "@/assets/essay-evaluation-hero.jpg"
import { AppHeader } from "@/components/AppHeader"

const EssayEvaluationDetail = () => {
  const { essayId } = useParams()
  const [candidateId, setCandidateId] = useState("")
  const [courseDetails, setCourseDetails] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [isEvaluated, setIsEvaluated] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null)
  const [viewDialogExpanded, setViewDialogExpanded] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [openItems, setOpenItems] = useState<string[]>([])
  const [viewOpenItems, setViewOpenItems] = useState<string[]>([])
  const [savedEvaluations, setSavedEvaluations] = useState([
    {
      id: 1,
      candidateId: "GKa_002_2025-09-11 11:17:30.076024+00",
      evaluatedDate: "11/09/2025 04:47:30 PM",
      evaluatedBy: "Current User",
      courseDetails: "Bodily Injury Claims",
      questions: [
        {
          id: 1,
          stem: "Briefly describe the purpose and construction of the rib cage.",
          keyAnswer: "Study 1, pp.11-12 – Verifying Facts—Importance of Visual Evidence – Any TEN (10) points required.",
          markerNotes: "Key points are underlined. Marks to be awarded if the student adequately addresses the key points.",
          maxScore: 10,
          reference: "Study 1 - Investigating Bodily Injury Claims, pp.11-12",
          answer: "• Number of ribs: There are 24 ribs, 12 on each side of the chest, that are connected to the vertebrae of the spine by costal cartilage.\n\n• Upper ribs: Fourteen of the upper true ribs are connected at the front of the chest to the sternum, or breastbone.\n\n• Lower ribs: Six of the lower false ribs are connected by cartilage to the rib above.",
          feedback: "Based on the candidate's response, the answer demonstrates good understanding of the key concepts. The response addresses most of the required points with adequate detail and shows clear comprehension of the subject matter.",
          aiScore: 6
        },
        {
          id: 2,
          stem: "Explain the role of medical experts in personal injury claims and discuss the importance of medical documentation.",
          keyAnswer: "Study 2, pp.15-18 – Medical Evidence in Personal Injury Claims – Any EIGHT (8) points required.",
          markerNotes: "Focus on the significance of medical experts and proper documentation.",
          maxScore: 8,
          reference: "Study 2 - Medical Evidence and Expert Testimony, pp.15-18",
          answer: "Medical experts play a crucial role in personal injury claims by providing professional opinions on the extent and causation of injuries. They review medical records, conduct examinations, and provide testimony regarding the medical aspects of the case.",
          feedback: "The response demonstrates excellent understanding of medical expert roles. Clear explanation of their functions and importance in establishing medical evidence for personal injury claims.",
          aiScore: 7
        }
      ]
    },
    {
      id: 2,
      candidateId: "GKa_002_2025-09-12 04:42:57.930813+00", 
      evaluatedDate: "12/09/2025 10:12:57 AM",
      evaluatedBy: "Current User",
      courseDetails: "Settlement Negotiations",
      questions: [
        {
          id: 3,
          stem: "Analyze the process of settlement negotiations in personal injury cases and identify key factors that influence settlement amounts.",
          keyAnswer: "Study 3, pp.22-25 – Settlement Negotiations and Valuation – Any TWELVE (12) points required.",
          markerNotes: "Students should demonstrate understanding of negotiation strategies and valuation factors.",
          maxScore: 12,
          reference: "Study 3 - Settlement Negotiations and Case Valuation, pp.22-25",
          answer: "Settlement negotiations involve multiple factors including liability assessment, damage quantification, and consideration of trial risks. Key influencing factors include the strength of medical evidence, precedent cases, insurance policy limits, and the client's willingness to settle versus proceed to trial.",
          feedback: "Comprehensive response covering the main aspects of settlement negotiations. Good understanding of the various factors that influence settlement amounts and the negotiation process.",
          aiScore: 10
        }
      ]
    }
  ])

  const updateQuestionAnswer = (questionId: number, answer: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, answer } : q
    ))
  }

  const clearAllAnswers = () => {
    setQuestions(questions.map(q => ({ ...q, answer: "" })))
  }

  const handleEvaluateEssay = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update questions with mock feedback and scores
    const updatedQuestions = questions.map(q => ({
      ...q,
      feedback: `Based on the candidate's response, the answer demonstrates ${Math.random() > 0.5 ? 'good' : 'excellent'} understanding of the key concepts. The response addresses most of the required points with adequate detail and shows clear comprehension of the subject matter.`,
      aiScore: Math.floor(Math.random() * (q.maxScore - Math.floor(q.maxScore * 0.6)) + Math.floor(q.maxScore * 0.6))
    }))
    
    setQuestions(updatedQuestions)
    setIsLoading(false)
    setShowResultDialog(true)
  }

  const handleDialogClose = () => {
    setShowResultDialog(false)
    setIsEvaluated(true)
  }

  const handleSaveResponse = () => {
    if (isEvaluated && candidateId) {
      const newEvaluation = {
        id: savedEvaluations.length + 1,
        candidateId: candidateId,
        evaluatedDate: new Date().toLocaleString(),
        evaluatedBy: "Current User",
        courseDetails: courseDetails || "N/A",
        questions: questions
      }
      setSavedEvaluations([...savedEvaluations, newEvaluation])
      setShowSaveDialog(true)
    }
  }

  const handleSaveDialogClose = () => {
    setShowSaveDialog(false)
  }

  const handleDownloadEvaluation = (evaluation: any) => {
    // Create a simple CSV download
    const csvContent = `Candidate ID,Evaluated Date,Evaluated By,Question,Answer,AI Score,Feedback\n` +
      evaluation.questions.map((q: any) => 
        `"${evaluation.candidateId}","${evaluation.evaluatedDate}","${evaluation.evaluatedBy}","${q.stem}","${q.answer}","${q.aiScore}","${q.feedback}"`
      ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `evaluation_${evaluation.candidateId}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleViewEvaluation = (evaluation: any) => {
    setSelectedEvaluation(evaluation)
    setShowViewDialog(true)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  // Handle scroll for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCloseViewDialog = () => {
    setShowViewDialog(false)
    setSelectedEvaluation(null)
    setViewDialogExpanded(false)
  }

  const handleDownloadAsExcel = () => {
    if (!selectedEvaluation) return
    
    // Create Excel-like CSV content
    const csvContent = `Evaluation Details\n\n` +
      `Candidate ID,${selectedEvaluation.candidateId}\n` +
      `Course Details,${selectedEvaluation.courseDetails || 'N/A'}\n` +
      `Total Questions,${selectedEvaluation.questions.length}\n` +
      `Evaluated Date,${selectedEvaluation.evaluatedDate}\n` +
      `Evaluated By,${selectedEvaluation.evaluatedBy}\n\n` +
      `Question,Key Answer,Max Score,Reference,Answer Response,AI Score\n` +
      selectedEvaluation.questions.map((q: any, index: number) => 
        `"Question ${index + 1}: ${q.stem}","${q.keyAnswer}","${q.maxScore}","${q.reference}","${q.answer}","${q.aiScore}"`
      ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `evaluation_details_${selectedEvaluation.candidateId}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const [questions, setQuestions] = useState([
    {
      id: 1,
      stem: "Briefly describe the purpose and construction of the rib cage.",
      keyAnswer: "Study 1, pp.11-12 – Verifying Facts—Importance of Visual Evidence – Any TEN (10) points required.",
      markerNotes: "Key points are underlined. Marks to be awarded if the student adequately addresses the key points. Allow marks for other valid points provided by the student.",
      keyPoints: [
        "Value of visual evidence: Photographs and videos provide objective evidence that helps determine negligence or refresh memories.",
        "Injuries: Photographs of injuries (e.g., scars) offer insights into impact on claimant's appearance.",
        "Size reference in photography: Use rulers or reference points to show size clearly; lighting improves visibility.",
        "Recording surveillance: Modern tech records claimant activities for verification.",
        "Video surveillance: Detailed investigations may require multiple recordings over time.",
        "Gather facts: Essential for laying a foundation for admissibility of surveillance.",
        "Hire a professional: Use experts for surveillance, photography, or accident reconstruction when needed.",
        "Photography records: Note date, time, place, and photographer details; mount and describe photographs.",
        "Digital recordings: Maintain strict handling records to prevent tampering claims.",
        "Admissibility: Depends on photographer's experience and equipment quality."
      ],
      maxScore: 10,
      reference: "Study 1 - Investigating Bodily Injury Claims, pp.11-12",
      answer: "",
      feedback: "",
      aiScore: 0
    },
    {
      id: 2,
      stem: "Explain the role of medical experts in personal injury claims and discuss the importance of medical documentation.",
      keyAnswer: "Study 2, pp.15-18 – Medical Evidence in Personal Injury Claims – Any EIGHT (8) points required.",
      markerNotes: "Focus on the significance of medical experts and proper documentation. Award marks for comprehensive understanding of medical evidence requirements.",
      keyPoints: [
        "Expert medical testimony: Essential for establishing causation and extent of injuries.",
        "Medical records: Comprehensive documentation from initial treatment through recovery.",
        "Independent medical examinations: Objective assessment by neutral medical professionals.",
        "Treatment plans: Detailed documentation of ongoing and future medical needs.",
        "Specialist consultations: Input from relevant medical specialists based on injury type.",
        "Medical imaging: X-rays, MRIs, and CT scans provide objective evidence of injuries.",
        "Prognosis documentation: Future medical needs and long-term impact assessment.",
        "Cost of care: Detailed breakdown of medical expenses and future treatment costs."
      ],
      maxScore: 8,
      reference: "Study 2 - Medical Evidence and Expert Testimony, pp.15-18",
      answer: "",
      feedback: "",
      aiScore: 0
    },
    {
      id: 3,
      stem: "Analyze the process of settlement negotiations in personal injury cases and identify key factors that influence settlement amounts.",
      keyAnswer: "Study 3, pp.22-25 – Settlement Negotiations and Valuation – Any TWELVE (12) points required.",
      markerNotes: "Students should demonstrate understanding of negotiation strategies and valuation factors. Allow marks for practical examples and case law references.",
      keyPoints: [
        "Liability assessment: Clear establishment of fault and negligence.",
        "Damage quantification: Accurate calculation of economic and non-economic losses.",
        "Medical evidence strength: Quality and completeness of medical documentation.",
        "Negotiation timing: Strategic timing of settlement discussions.",
        "Insurance policy limits: Understanding of coverage limitations and excess provisions.",
        "Precedent cases: Reference to similar cases and their settlement amounts.",
        "Client instructions: Clear understanding of client's settlement preferences.",
        "Alternative dispute resolution: Mediation and arbitration options.",
        "Trial risks: Assessment of potential outcomes if case proceeds to court.",
        "Cost considerations: Legal costs versus potential settlement amounts.",
        "Documentation requirements: Proper settlement documentation and releases.",
        "Tax implications: Understanding of tax treatment of settlement payments."
      ],
      maxScore: 12,
      reference: "Study 3 - Settlement Negotiations and Case Valuation, pp.22-25",
      answer: "",
      feedback: "",
      aiScore: 0
    }
  ])

  const totalQuestions = questions.length

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      {/* Page Title */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 mt-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-gray-900">Essay Evaluation Detail</h1>
              <p className="text-sm text-gray-500">Evaluate candidate responses and review evaluations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/essay-evaluation">
              <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Essays
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <Tabs defaultValue="evaluate" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-2 rounded-xl shadow-sm border gap-2 h-16">
              <TabsTrigger 
                value="evaluate" 
                className="rounded-lg h-full font-medium transition-all data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              >
                Evaluate Candidate
              </TabsTrigger>
              <TabsTrigger 
                value="review"
                className="rounded-lg h-full font-medium transition-all data-[state=active]:bg-orange-600 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-600 hover:text-gray-800 hover:bg-gray-200"
              >
                Review Evaluation
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="evaluate" className="space-y-8">
              {/* Step 1: Candidate Information */}
              <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-blue-800">
                    <div className="p-2 bg-blue-600 text-white rounded-lg">
                      <PenTool className="h-5 w-5" />
                    </div>
                    Step 1: Enter Candidate Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img 
                        src={essayEvaluationImage}
                        alt="Essay Evaluation"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <p className="text-blue-700 mb-4">
                        Enter the candidate ID and course details to begin the evaluation process.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="candidateId" className="text-blue-800">Candidate ID *</Label>
                          <Input 
                            id="candidateId"
                            value={candidateId}
                            onChange={(e) => setCandidateId(e.target.value)}
                            placeholder="Enter candidate ID"
                            className="bg-white border-blue-200"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="courseDetails" className="text-blue-800">Course Details</Label>
                          <Input 
                            id="courseDetails"
                            value={courseDetails}
                            onChange={(e) => setCourseDetails(e.target.value)}
                            placeholder="Enter course details"
                            className="bg-white border-blue-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Evaluation Actions */}
              <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-green-800">
                    <div className="p-2 bg-green-600 text-white rounded-lg">
                      <Save className="h-5 w-5" />
                    </div>
                    Evaluation Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <p className="text-green-700 mb-2">
                        Total Questions: <span className="font-medium text-green-800">{totalQuestions}</span>
                      </p>
                      <p className="text-sm text-green-600">
                        Use the actions below to manage your evaluation process.
                      </p>
                    </div>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={handleEvaluateEssay}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Evaluating...
                            </>
                          ) : (
                            'Evaluate Essay'
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="ai-button-secondary"
                          onClick={handleSaveResponse}
                          disabled={!isEvaluated}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Response
                        </Button>
                        <Button variant="outline" className="ai-button-secondary">
                          <FileSpreadsheet className="h-4 w-4 mr-2" />
                          Export to Excel
                        </Button>
                        <Button 
                          variant="outline" 
                          className="ai-button-secondary"
                          onClick={clearAllAnswers}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Clear All
                        </Button>
                        <Button 
                          variant="outline"
                          className="ai-button-secondary"
                          onClick={() => {
                            if (openItems.length === questions.length) {
                              setOpenItems([])
                              setIsExpanded(false)
                            } else {
                              const all = questions.map(q => `question-${q.id}`)
                              setOpenItems(all)
                              setIsExpanded(true)
                            }
                          }}
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-2" />
                              Collapse
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-2" />
                              Expand
                            </>
                          )}
                        </Button>
                      </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 3: Questions */}
              <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-800">
                    <div className="p-2 bg-purple-600 text-white rounded-lg">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    Step 2: Evaluate Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-700 mb-6">
                    Review each question and provide candidate responses for evaluation.
                  </p>
                  <Accordion 
                    type="multiple" 
                    className="w-full space-y-4"
                    value={openItems}
                    onValueChange={(v) => {
                      const vals = v as string[]
                      setOpenItems(vals)
                      setIsExpanded(vals.length === questions.length)
                    }}
                  >
                    {questions.map((question) => (
                      <AccordionItem key={question.id} value={`question-${question.id}`} className="border border-purple-200 rounded-lg bg-white">
                        <AccordionTrigger className="text-left px-4 hover:no-underline">
                          <div className="flex flex-col items-start w-full gap-3">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-md">
                                Question Stem
                              </span>
                            </div>
                            <div className="w-full">
                              <h3 className="text-base font-medium text-gray-900 leading-relaxed pl-2 border-l-4 border-purple-400">
                                {question.stem}
                              </h3>
                            </div>
                          </div>
                        </AccordionTrigger>
                        
                         <div className="px-4 pb-4 space-y-4">
                           <div className="space-y-2">
                             <Label htmlFor={`answer-${question.id}`} className="text-purple-800 font-medium">
                               Answer Response:
                             </Label>
                             <Textarea 
                               id={`answer-${question.id}`}
                               placeholder="Enter candidate's answer response..."
                               className="min-h-[100px] bg-white border-purple-200"
                               value={question.answer}
                               onChange={(e) => updateQuestionAnswer(question.id, e.target.value)}
                             />
                           </div>
                           
                           {isEvaluated && question.feedback && (
                             <div className="space-y-3">
                               <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                 <h4 className="text-sm font-medium text-blue-900 mb-2">AI Feedback</h4>
                                 <p className="text-sm text-gray-700 leading-relaxed">{question.feedback}</p>
                               </div>
                               <div className="flex items-center gap-4 py-2 px-4 bg-gray-50 rounded-lg">
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium text-gray-600">Max Score:</span>
                                   <span className="text-lg font-medium text-purple-700">{question.maxScore}</span>
                                 </div>
                                 <div className="h-4 w-px bg-gray-300"></div>
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium text-gray-600">AI Score:</span>
                                   <span className="text-lg font-medium text-green-700">{question.aiScore}</span>
                                 </div>
                               </div>
                             </div>
                           )}
                         </div>
                        
                         <AccordionContent className="px-4 pb-4">
                           <div className="space-y-4">
                             <div className="bg-purple-50 rounded-lg p-4">
                               <h4 className="text-sm font-medium text-purple-900 mb-2">Key Answer</h4>
                               <p className="text-sm text-gray-700 leading-relaxed">{question.keyAnswer}</p>
                             </div>
                             
                             <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg">
                               <div className="flex items-center gap-4">
                                 <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium text-gray-600">Reference:</span>
                                   <span className="text-sm text-gray-700">{question.reference}</span>
                                 </div>
                               </div>
                             </div>
                           </div>
                         </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="review" className="space-y-8">
              <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-orange-800">
                    <div className="p-2 bg-orange-600 text-white rounded-lg">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    Review Evaluation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3">
                      <img 
                        src={essayEvaluationImage}
                        alt="Essay Evaluation"
                        className="w-full h-40 object-cover rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3">
                       <div className="flex flex-col md:flex-row gap-4 items-end">
                         <div className="flex-1">
                           <Label htmlFor="userType" className="text-orange-800">User Type</Label>
                           <Select defaultValue="me">
                             <SelectTrigger className="bg-white border-orange-200">
                               <SelectValue placeholder="Select user type" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="me">Me</SelectItem>
                               <SelectItem value="all">All Users</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                         <div className="flex-1">
                           <Label htmlFor="search" className="text-orange-800">Search</Label>
                           <Input 
                             id="search"
                             placeholder="Search..."
                             className="bg-white border-orange-200"
                           />
                         </div>
                         <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                           Get Data
                         </Button>
                       </div>
                     </div>
                   </div>

                  <div className="bg-white rounded-lg border border-orange-200 overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-orange-200">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
                        >
                          Bulk Export
                        </Button>
                      </div>
                      <span className="text-sm text-gray-600">
                        Total Candidates: <span className="font-medium text-blue-600">{savedEvaluations.length}</span>
                      </span>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-12">
                            <Checkbox />
                          </TableHead>
                          <TableHead>Candidate ID</TableHead>
                          <TableHead>Evaluated date and time</TableHead>
                          <TableHead>Evaluated By</TableHead>
                          <TableHead className="w-24">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {savedEvaluations.map((evaluation) => (
                          <TableRow key={evaluation.id}>
                            <TableCell>
                              <Checkbox />
                            </TableCell>
                            <TableCell className="font-medium">
                              {evaluation.candidateId}
                            </TableCell>
                            <TableCell>{evaluation.evaluatedDate}</TableCell>
                            <TableCell>{evaluation.evaluatedBy}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDownloadEvaluation(evaluation)}
                                  title="Download evaluation"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewEvaluation(evaluation)}
                                  title="View evaluation"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* View Evaluation Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Evaluation Details</span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDownloadAsExcel}
                  className="border-green-500 text-green-700 hover:bg-green-100 hover:border-green-600 bg-white"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Download as Excel
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const total = selectedEvaluation?.questions?.length ?? 0
                    if (viewOpenItems.length === total) {
                      setViewOpenItems([])
                      setViewDialogExpanded(false)
                    } else {
                      const all = (selectedEvaluation?.questions ?? []).map((q: any) => `question-${q.id}`)
                      setViewOpenItems(all)
                      setViewDialogExpanded(true)
                    }
                  }}
                  className="border-blue-500 text-blue-700 hover:bg-blue-100 hover:border-blue-600 bg-white"
                >
                  {viewDialogExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Collapse
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Expand
                    </>
                  )}
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEvaluation && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Candidate ID:</Label>
                  <p className="text-sm font-medium text-gray-900">{selectedEvaluation.candidateId}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Course Details:</Label>
                  <p className="text-sm font-medium text-gray-900">{selectedEvaluation.courseDetails || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Total Questions:</Label>
                  <p className="text-sm font-medium text-gray-900">{selectedEvaluation.questions.length}</p>
                </div>
              </div>

              {/* Questions Details */}
              <div className="space-y-4">
                <p className="text-purple-700 mb-6">
                  Review each question and candidate responses with AI evaluation results.
                </p>
                <Accordion 
                  type="multiple" 
                  className="w-full space-y-4"
                  value={viewOpenItems}
                  onValueChange={(v) => {
                    const vals = v as string[]
                    setViewOpenItems(vals)
                    const total = selectedEvaluation?.questions?.length ?? 0
                    setViewDialogExpanded(total > 0 && vals.length === total)
                  }}
                >
                  {selectedEvaluation.questions.map((question: any, index: number) => (
                    <AccordionItem key={question.id} value={`question-${question.id}`} className="border border-purple-200 rounded-lg bg-white">
                      <AccordionTrigger className="text-left px-4 hover:no-underline">
                        <div className="flex flex-col items-start w-full gap-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-md">
                              Question Stem
                            </span>
                          </div>
                          <div className="w-full">
                            <h3 className="text-base font-medium text-gray-900 leading-relaxed pl-2 border-l-4 border-purple-400">
                              {question.stem}
                            </h3>
                          </div>
                        </div>
                      </AccordionTrigger>
                      
                      <div className="px-4 pb-4 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-purple-800 font-medium">
                            Answer Response:
                          </Label>
                          <div className="min-h-[100px] bg-white border-purple-200 border rounded-lg p-3">
                            <div className="text-gray-700 whitespace-pre-wrap">
                              {question.answer || 'No response provided'}
                            </div>
                          </div>
                        </div>
                        
                        {question.feedback && (
                          <div className="space-y-3">
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                              <h4 className="text-sm font-medium text-blue-900 mb-2">AI Feedback</h4>
                              <p className="text-sm text-gray-700 leading-relaxed">{question.feedback}</p>
                            </div>
                            <div className="flex items-center gap-4 py-2 px-4 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">Max Score:</span>
                                <span className="text-lg font-medium text-purple-700">{question.maxScore}</span>
                              </div>
                              <div className="h-4 w-px bg-gray-300"></div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">AI Score:</span>
                                <span className="text-lg font-medium text-green-700">{question.aiScore}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-purple-900 mb-2">Key Answer</h4>
                            <p className="text-sm text-gray-700 leading-relaxed">{question.keyAnswer}</p>
                          </div>
                          
                          <div className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">Reference:</span>
                                <span className="text-sm text-gray-700">{question.reference}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={handleCloseViewDialog} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Response Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Response Saved</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">Essay responses for the candidate have been saved successfully.</p>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveDialogClose} className="w-full">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Evaluation Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Evaluation Complete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">Evaluation completed and scores are generated with feedbacks</p>
          </div>
          <DialogFooter>
            <Button onClick={handleDialogClose} className="w-full">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-fade-in"
          size="icon"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  )
}

export default EssayEvaluationDetail