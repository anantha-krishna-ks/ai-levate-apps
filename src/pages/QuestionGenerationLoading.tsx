import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Brain, Check, Zap, Target, Shield, Sparkle, Cpu, Database, Lightbulb } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const QuestionGenerationLoading = () => {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Analyzing Source Material",
      subtitle: "Processing document content and structure",
      status: "complete"
    },
    {
      title: "Understanding Context",
      subtitle: "Extracting key concepts and learning objectives",
      status: "complete"
    },
    {
      title: "Generating Questions",
      subtitle: "Creating contextually relevant questions",
      status: "complete"
    },
    {
      title: "Optimizing Quality",
      subtitle: "Ensuring question clarity and accuracy",
      status: "processing"
    },
    {
      title: "Finalizing Results",
      subtitle: "Preparing your assessment questions",
      status: "pending"
    }
  ]

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Neural Analysis",
      subtitle: "Advanced NLP processing",
      bgColor: "from-blue-500 to-blue-600"
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: "AI Processing",
      subtitle: "Real-time generation",
      bgColor: "from-purple-500 to-purple-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Quality Assurance",
      subtitle: "Accuracy validation",
      bgColor: "from-green-500 to-green-600"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Processing",
      subtitle: "Content optimization",
      bgColor: "from-orange-500 to-orange-600"
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2
        
        // Update current step based on progress
        if (newProgress >= 20 && currentStep < 1) setCurrentStep(1)
        if (newProgress >= 40 && currentStep < 2) setCurrentStep(2)
        if (newProgress >= 60 && currentStep < 3) setCurrentStep(3)
        if (newProgress >= 80 && currentStep < 4) setCurrentStep(4)
        
        // Complete and navigate when done
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            navigate("/question-results")
          }, 1000)
          return 100
        }
        
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [currentStep, navigate])

  const getStepStatus = (index: number) => {
    if (index < currentStep) return "complete"
    if (index === currentStep) return "processing"
    return "pending"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-100 rounded-full opacity-50 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-100 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-indigo-100 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-medium text-sm">AL</span>
          </div>
          <img 
            src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
            alt="AI-Levate" 
            className="h-6 w-auto"
          />
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-blue-600 font-medium">Processing your request...</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-5xl w-full space-y-8">
          {/* AI Brain Section */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Main brain container */}
              <div className="relative w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-16 h-16 text-white animate-pulse" />
              </div>
              
              {/* Status indicator */}
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-medium text-gray-900 animate-fade-in">
              AI is Generating Your Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Our AI is analyzing your content and creating high-quality assessment questions.
            </p>
          </div>

          {/* Progress Section */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-800">Processing Progress</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-medium text-blue-600">{progress}%</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                </div>
              </div>
              
              <Progress value={progress} className="h-3 bg-gray-200" />

              {/* Processing Steps */}
              <div className="space-y-3 mt-6">
                {steps.map((step, index) => {
                  const status = getStepStatus(index)
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                        status === "complete" 
                          ? "bg-green-50 border border-green-200" 
                          : status === "processing"
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        status === "complete" 
                          ? "bg-green-500" 
                          : status === "processing"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                      }`}>
                        {status === "complete" ? (
                          <Check className="w-6 h-6 text-white" />
                        ) : status === "processing" ? (
                          <Target className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <Check className="w-6 h-6 text-white opacity-50" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className={`text-base font-medium mb-1 ${
                          status === "complete" ? "text-green-900" :
                          status === "processing" ? "text-blue-900" : "text-gray-500"
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm ${
                          status === "complete" ? "text-green-700" :
                          status === "processing" ? "text-blue-700" : "text-gray-400"
                        }`}>
                          {step.subtitle}
                        </p>
                      </div>
                      
                      {status === "complete" && (
                        <div className="text-sm font-medium text-green-600 flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                          <Check className="w-3 h-3" />
                          Complete
                        </div>
                      )}
                      {status === "processing" && (
                        <div className="text-sm font-medium text-blue-600 flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                          <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm"
              >
                <div className="flex justify-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.bgColor} rounded-xl flex items-center justify-center`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.subtitle}</p>
              </div>
            ))}
          </div>

          {/* Footer Message */}
          <div className="text-center bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <p className="text-gray-600 font-medium">
              Please wait while our AI processes your request. This may take a few moments...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuestionGenerationLoading