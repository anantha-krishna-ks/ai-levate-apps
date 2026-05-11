import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Link } from "react-router-dom"
import { ArrowLeft, PenTool, Sparkles, X, Plus, Loader2, ClipboardCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

const EssayEvaluationZeroShot = () => {
  const [essayQuestion, setEssayQuestion] = useState("")
  const [essayAnswer, setEssayAnswer] = useState("")
  const [rubricInput, setRubricInput] = useState("")
  const [rubrics, setRubrics] = useState<string[]>([])
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const [evaluationResults, setEvaluationResults] = useState<{
    rationale: Array<{ rubric: string; score: string; explanation: string }>;
    overallScore: number;
  } | null>(null)

  const handleAddRubric = () => {
    const trimmed = rubricInput.trim()
    if (trimmed && !rubrics.includes(trimmed)) {
      setRubrics([...rubrics, trimmed])
      setRubricInput("")
    } else if (rubrics.includes(trimmed)) {
      toast.error("This rubric has already been added")
    }
  }

  const handleRemoveRubric = (rubricToRemove: string) => {
    setRubrics(rubrics.filter(r => r !== rubricToRemove))
  }

  const handleClearAnswer = () => {
    setEssayAnswer("")
    toast.success("Essay answer cleared")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddRubric()
    }
  }

  const handleSubmitEvaluation = async () => {
    if (!essayQuestion.trim()) {
      toast.error("Please enter an essay question")
      return
    }
    if (!essayAnswer.trim()) {
      toast.error("Please enter your essay answer")
      return
    }
    if (rubrics.length === 0) {
      toast.error("Please add at least one rubric")
      return
    }

    setIsEvaluating(true)
    
    // Simulate API call - replace with actual API integration
    setTimeout(() => {
      // Mock evaluation results
      const mockResults = {
        rationale: rubrics.map(rubric => ({
          rubric: rubric,
          score: `${Math.floor(Math.random() * 3) + 7}/10`,
          explanation: `The essay demonstrates ${rubric.toLowerCase()} through well-structured arguments and supporting evidence.`
        })),
        overallScore: Math.floor(Math.random() * 2) + 8
      }
      
      setEvaluationResults(mockResults)
      setHasEvaluated(true)
      setIsEvaluating(false)
      toast.success("Evaluation completed successfully!")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-900">Essay Evaluation - Zero Shot</h1>
              <p className="text-xs text-gray-500">AI-powered evaluation without predefined books</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">4,651 Tokens</span>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">

        {/* Two-column layout for Essay and Rubrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Essay Section */}
          <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-600 text-white rounded-lg">
                  <PenTool className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-medium text-purple-800">Essay Content</h2>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Essay Question
                </label>
                <Input
                  placeholder="Enter your essay topic or question..."
                  value={essayQuestion}
                  onChange={(e) => setEssayQuestion(e.target.value)}
                  className="w-full border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Essay Answer
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAnswer}
                    className="text-gray-500 hover:text-purple-700 hover:bg-purple-50 h-8"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    Clear
                  </Button>
                </div>
                <Textarea
                  placeholder="Start writing your essay here..."
                  value={essayAnswer}
                  onChange={(e) => setEssayAnswer(e.target.value)}
                  className="w-full min-h-[220px] resize-y border-purple-200 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
            </CardContent>
          </Card>

          {/* Rubrics Section */}
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-medium text-blue-800">Evaluation Rubrics</h2>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Add Rubric Keywords
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a rubric keyword and press Enter..."
                    value={rubricInput}
                    onChange={(e) => setRubricInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                  <Button
                    onClick={handleAddRubric}
                    className="px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              {rubrics.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Current Rubrics ({rubrics.length})
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100 min-h-[220px] content-start">
                    {rubrics.map((rubric, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 hover:from-blue-200 hover:to-blue-300 border border-blue-300/50 flex items-center gap-2 h-fit"
                      >
                        {rubric}
                        <button
                          onClick={() => handleRemoveRubric(rubric)}
                          className="hover:text-blue-900 hover:bg-blue-300/50 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSubmitEvaluation}
              disabled={isEvaluating}
              className="px-8 py-6 text-base font-medium bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Evaluating Your Essay...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Submit for AI Evaluation
                </>
              )}
            </Button>
          </div>

          {/* Evaluation Results */}
          {hasEvaluated && evaluationResults && (
            <div className="space-y-4 animate-fade-in">
              {/* Rationale Section */}
              <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-600 text-white rounded-lg">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-medium text-green-800">Detailed Rationale</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {evaluationResults.rationale.map((item, index) => {
                    const scoreValue = parseInt(item.score.split('/')[0])
                    const maxScore = parseInt(item.score.split('/')[1])
                    const percentage = (scoreValue / maxScore) * 100
                    
                    const getScoreColor = (pct: number) => {
                      if (pct >= 80) return 'from-green-500 to-emerald-600'
                      if (pct >= 60) return 'from-blue-500 to-blue-600'
                      return 'from-orange-500 to-red-600'
                    }
                    
                    const getBgColor = (pct: number) => {
                      if (pct >= 80) return 'from-green-50 to-emerald-50/50'
                      if (pct >= 60) return 'from-blue-50 to-blue-50/50'
                      return 'from-orange-50 to-red-50/50'
                    }

                      return (
                        <Card 
                          key={index} 
                          className="border-l-4 bg-white shadow-sm"
                          style={{ borderLeftColor: `hsl(${getScoreColor(percentage).includes('green') ? '142 76% 36%' : getScoreColor(percentage).includes('blue') ? '221 83% 53%' : '25 95% 53%'})` }}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-start gap-3">
                              {/* Left side - Rubric info */}
                              <div className="flex-1 min-w-0 space-y-1.5">
                                <div>
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Rubric</span>
                                  <div className="mt-1">
                                    <Badge className="px-3 py-1 text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300/50">
                                      {item.rubric}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Explanation</span>
                                  <p className="text-sm text-gray-600 leading-relaxed mt-0.5">{item.explanation}</p>
                                </div>
                              </div>
                              
                              {/* Right side - Score */}
                              <div className="flex flex-col items-center gap-2 min-w-[100px]">
                                <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getScoreColor(percentage)} p-0.5 shadow-lg`}>
                                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                    <div className="text-center">
                                      <div className="text-2xl font-medium text-gray-900">{item.score.split('/')[0]}</div>
                                      <div className="text-xs text-gray-500 font-medium">out of {item.score.split('/')[1]}</div>
                                    </div>
                                  </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getScoreColor(percentage)} shadow-sm`}>
                                  <p className="text-xs font-medium text-white">{percentage.toFixed(0)}%</p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Evaluation Results Summary */}
              <Card className="border-2 border-slate-100 bg-gradient-to-br from-white to-slate-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-slate-500 text-white rounded-lg">
                      <ClipboardCheck className="h-5 w-5" />
                    </div>
                    <h2 className="text-2xl font-medium text-slate-700">Evaluation Summary</h2>
                  </div>
                <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                        <TableHead className="font-medium text-slate-700 py-4 text-base">Criteria</TableHead>
                        <TableHead className="font-medium text-slate-700 text-right py-4 text-base">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evaluationResults.rationale.map((item, index) => (
                        <TableRow key={index} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-b-0">
                          <TableCell className="font-medium text-slate-900 py-4">
                            {item.rubric}
                          </TableCell>
                          <TableCell className="text-right py-4 font-medium text-slate-700 text-base">
                            {item.score}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-slate-100 border-t-2 border-slate-300 hover:bg-slate-100">
                        <TableCell className="font-medium text-slate-900 py-5 text-base">
                          Overall Average Score
                        </TableCell>
                        <TableCell className="text-right py-5 font-medium text-green-600 text-xl">
                          {evaluationResults.overallScore}/10
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default EssayEvaluationZeroShot
