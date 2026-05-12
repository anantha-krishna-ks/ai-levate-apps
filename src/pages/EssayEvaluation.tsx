import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { BookOpen, Users, FileText, ArrowRight, ArrowLeft, PenTool, Sparkle } from "lucide-react"
import essayEvaluationImage from "@/assets/essay-evaluation-hero.jpg"

const EssayEvaluation = () => {
  const essayCards = [
    {
      id: "essay-1",
      title: "Biology Assessment",
      image: essayEvaluationImage,
      questionsTotal: 8,
      questionsEvaluated: 1,
      usersEvaluated: 1
    },
    {
      id: "essay-2", 
      title: "Physics Evaluation",
      image: essayEvaluationImage,
      questionsTotal: 10,
      questionsEvaluated: 3,
      usersEvaluated: 2
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">Essay Evaluation - Fine tuned</span>
                <span className="text-xs text-gray-500">AI-powered evaluation for subjective responses</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Sparkle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">2,847 Tokens</span>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Page Title */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <PenTool className="w-4 h-4" />
            Essay Assessment Platform
          </div>
          <h1 className="text-4xl font-medium bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Essay Evaluation System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Subjective questions are evaluated for predefined books, using AI to get score and feedbacks for answer responses
          </p>
        </div>
          {/* Stats Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6 bg-blue-50 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700">Total Questions Evaluated</span>
              </div>
              <div className="text-3xl font-medium text-gray-900">2</div>
            </Card>

            <Card className="p-6 bg-green-50 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <span className="font-medium text-gray-700">Total Users Evaluated</span>
              </div>
              <div className="text-3xl font-medium text-gray-900">2</div>
            </Card>
          </div>

          {/* Essay Cards */}
          <div>
            <h2 className="text-xl font-medium text-gray-900 mb-6">Question's Available</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {essayCards.map((essay) => (
                <Card key={essay.id} className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                  <div className="relative">
                    <img 
                      src={essay.image} 
                      alt={essay.title}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
                      <BookOpen className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="font-medium text-gray-900 mb-4">{essay.title}</h3>
                    
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Number of Questions:</span>
                        <span className="font-medium text-gray-900">{essay.questionsTotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions Evaluated:</span>
                        <span className="font-medium text-gray-900">{essay.questionsEvaluated}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Users Evaluated:</span>
                        <span className="font-medium text-gray-900">{essay.usersEvaluated}</span>
                      </div>
                    </div>
                    
                    <Link to={`/essay-evaluation/${essay.id}`}>
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:scale-[1.02]"
                        size="sm"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Open Essay
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}

export default EssayEvaluation