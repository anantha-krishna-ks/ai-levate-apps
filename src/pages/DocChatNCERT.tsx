import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ArrowLeft, 
  MessageSquare, 
  BookOpen,
  Send,
  Sparkle,
  Loader2,
  Bot,
  User,
  Copy,
  Download,
  Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ncertBookImage from "@/assets/ncert-biology-book.jpg"
import { AppHeader } from "@/components/AppHeader"

interface Message {
  role: "user" | "assistant"
  content: string
  type?: "text" | "chapter-list" | "summary" | "questions" | "lesson-plan"
  data?: any
}

const DocChatNCERT = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      content: "Hello! I'm your NCERT Biology Class 11 textbook assistant. I can help you with:\n\n• Generate chapter list from the book\n• Summarize specific chapters\n• Create practice questions\n• Generate lesson plans\n• Answer any questions about the content\n\nJust ask me what you'd like to do!",
      type: "text"
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const textareaRef = useState<HTMLTextAreaElement | null>(null)[0]

  const adjustTextareaHeight = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto'
    element.style.height = `${Math.min(element.scrollHeight, 200)}px`
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputMessage(e.target.value)
    adjustTextareaHeight(e.target)
  }

  const detectIntentAndRespond = (userInput: string) => {
    const input = userInput.toLowerCase()
    
    // Chapter list generation
    if (input.includes("chapter") && (input.includes("list") || input.includes("generate") || input.includes("show"))) {
      return {
        type: "chapter-list",
        content: "Here's the complete chapter list from the NCERT Biology Class 11 textbook:",
        data: [
          { id: 1, title: "The Living World", pages: "1-15" },
          { id: 2, title: "Biological Classification", pages: "16-35" },
          { id: 3, title: "Plant Kingdom", pages: "36-58" },
          { id: 4, title: "Animal Kingdom", pages: "59-85" },
          { id: 5, title: "Morphology of Flowering Plants", pages: "86-112" },
          { id: 6, title: "Anatomy of Flowering Plants", pages: "113-138" },
          { id: 7, title: "Structural Organization in Animals", pages: "139-165" },
          { id: 8, title: "Cell: The Unit of Life", pages: "166-195" }
        ]
      }
    }
    
    // Chapter summary
    if (input.includes("summar")) {
      const chapterMatch = input.match(/chapter\s*(\d+)|(\d+)\s*chapter/i)
      const chapterNum = chapterMatch ? parseInt(chapterMatch[1] || chapterMatch[2]) : 1
      
      const chapters = [
        "The Living World",
        "Biological Classification",
        "Plant Kingdom",
        "Animal Kingdom",
        "Morphology of Flowering Plants",
        "Anatomy of Flowering Plants",
        "Structural Organization in Animals",
        "Cell: The Unit of Life"
      ]
      
      return {
        type: "summary",
        content: `Summary of Chapter ${chapterNum}: ${chapters[chapterNum - 1] || chapters[0]}`,
        data: `This chapter introduces fundamental concepts about ${(chapters[chapterNum - 1] || chapters[0]).toLowerCase()}. It begins with defining key terminology and explores the historical development of our understanding in this area.

**Key Points:**
• Definition and scope of the topic
• Historical perspectives and major contributors
• Classification systems and methodology
• Practical applications and examples
• Contemporary relevance and importance

The chapter concludes with exercises designed to reinforce understanding of these critical biological concepts.`
      }
    }
    
    // Question generation
    if (input.includes("question") || input.includes("practice") || input.includes("quiz")) {
      return {
        type: "questions",
        content: "Here are practice questions generated from the NCERT textbook:",
        data: [
          "1. What are the defining characteristics of living organisms?",
          "2. Explain the biological classification system with examples.",
          "3. Compare and contrast the plant and animal kingdoms.",
          "4. Describe the morphology of a typical flowering plant.",
          "5. What is the importance of anatomical studies in biology?",
          "6. How do cells function as the basic unit of life?",
          "7. Discuss the structural organization in different animal phyla.",
          "8. What role does taxonomy play in biological classification?"
        ]
      }
    }
    
    // Lesson plan
    if (input.includes("lesson") && input.includes("plan")) {
      return {
        type: "lesson-plan",
        content: "Here's a comprehensive lesson plan based on the NCERT textbook:",
        data: `**Lesson Plan: Introduction to Biology**
Duration: 60 minutes | Grade Level: Class 11 | Subject: Biology

**Learning Objectives:**
• Students will understand the basic concepts of living organisms
• Students will be able to identify different classification systems
• Students will apply their knowledge to real-world examples

**Materials Needed:**
• NCERT Biology Textbook
• Chart papers and markers
• Projector for presentations
• Sample specimens (if available)

**Lesson Structure:**

Introduction (10 minutes):
- Begin with a thought-provoking question about life
- Discuss students' prior knowledge
- Present learning objectives

Main Content (35 minutes):
- Direct instruction on key concepts (15 mins)
- Group activity: Classification exercise (10 mins)
- Discussion and Q&A (10 mins)

Assessment (10 minutes):
- Quick formative assessment through questions
- Exit ticket with key concept review

**Homework:**
- Read next chapter and prepare questions
- Complete exercise problems from textbook

**Extension Activities:**
- Research project on local biodiversity
- Create a classification chart for organisms`
      }
    }
    
    // Default response
    return {
      type: "text",
      content: `Based on the NCERT textbook, here's information about "${userInput}":\n\nThis topic is covered comprehensively in the textbook. The content explains key concepts and provides detailed examples to help students understand the fundamental principles. For specific chapters and detailed explanations, please refer to the relevant sections of the book.\n\nWould you like me to:\n• Show you the chapter list?\n• Summarize a specific chapter?\n• Generate practice questions?\n• Create a lesson plan?`
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = inputMessage.trim()
    setMessages(prev => [...prev, { role: "user", content: userMessage, type: "text" }])
    setInputMessage("")
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      const response = detectIntentAndRespond(userMessage)
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: response.content,
        type: response.type as any,
        data: response.data
      }])
      setIsLoading(false)
      
      toast({
        title: "Response generated",
        description: "AI has processed your request."
      })
    }, 1500)
  }

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied successfully."
    })
  }

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Downloaded",
      description: "Content has been downloaded successfully."
    })
  }

  const renderMessageContent = (message: Message) => {
    if (message.type === "chapter-list" && message.data) {
      return (
        <div className="space-y-3">
          <p className="text-sm mb-3">{message.content}</p>
          <div className="space-y-2">
            {message.data.map((chapter: any) => (
              <Card key={chapter.id} className="bg-white border border-purple-200">
                <CardContent className="p-3 flex items-center gap-3">
                  <Badge className="bg-purple-600 text-white">{chapter.id}</Badge>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{chapter.title}</h3>
                    <p className="text-xs text-gray-600">Pages {chapter.pages}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )
    }
    
    if (message.type === "summary" && message.data) {
      return (
        <div className="space-y-3">
          <p className="text-sm font-medium mb-2">{message.content}</p>
          <div className="bg-white border border-purple-200 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-xs font-sans text-gray-800">{message.data}</pre>
          </div>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleCopyContent(message.data)}
              className="text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload(message.data, "chapter-summary.txt")}
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      )
    }
    
    if (message.type === "questions" && message.data) {
      return (
        <div className="space-y-3">
          <p className="text-sm mb-2">{message.content}</p>
          <div className="space-y-2">
            {message.data.map((question: string, index: number) => (
              <div 
                key={index} 
                className="p-3 bg-white border border-orange-200 rounded-lg"
              >
                <p className="text-xs text-gray-900">{question}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleCopyContent(message.data.join('\n\n'))}
              className="text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload(message.data.join('\n\n'), "practice-questions.txt")}
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      )
    }
    
    if (message.type === "lesson-plan" && message.data) {
      return (
        <div className="space-y-3">
          <p className="text-sm font-medium mb-2">{message.content}</p>
          <div className="bg-white border border-pink-200 rounded-lg p-4">
            <pre className="whitespace-pre-wrap text-xs font-sans text-gray-800">{message.data}</pre>
          </div>
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleCopyContent(message.data)}
              className="text-xs"
            >
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleDownload(message.data, "lesson-plan.txt")}
              className="text-xs"
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        </div>
      )
    }
    
    return <p className="text-sm whitespace-pre-wrap">{message.content}</p>
  }

  const BookDetailsContent = () => (
    <div className="p-4 space-y-4 bg-muted h-full">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-purple-600 text-white rounded-lg">
          <BookOpen className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-medium text-gray-900">Book Information</h2>
          <p className="text-xs text-gray-600">NCERT Textbook</p>
        </div>
      </div>

      {/* Book Cover */}
      <div className="relative">
        <img src={ncertBookImage} alt="NCERT Biology Class 11 Textbook" className="w-full h-64 object-cover rounded-lg shadow-lg border border-border" />
      </div>

      {/* Book Details */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-0.5">Biology</h3>
          <p className="text-xs text-gray-600">Textbook for Class XI</p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-700 min-w-[70px]">Publisher:</span>
            <span className="text-xs text-gray-600">NCERT, New Delhi</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-700 min-w-[70px]">Subject:</span>
            <span className="text-xs text-gray-600">Biology</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-700 min-w-[70px]">Class:</span>
            <span className="text-xs text-gray-600">XI (Eleventh)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-700 min-w-[70px]">Edition:</span>
            <span className="text-xs text-gray-600">2024-25</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-700 min-w-[70px]">Total Pages:</span>
            <span className="text-xs text-gray-600">368 pages</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-medium text-gray-700 min-w-[70px]">Chapters:</span>
            <span className="text-xs text-gray-600">22 Chapters</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <AppHeader onMenuClick={() => setIsDrawerOpen(true)} />
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex-shrink-0 mt-16">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Hamburger Menu for Mobile */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Book Details</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-full">
                  <BookDetailsContent />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-900">Doc Chat - NCERT</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Interactive AI-powered textbook assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Book Info - Hidden on mobile */}
        <aside className="hidden md:flex w-80 bg-white border-r border-gray-200 flex-col overflow-y-auto">
          <BookDetailsContent />
        </aside>

        {/* Right Section - Chat Interface */}
        <main className="flex-1 flex flex-col bg-gradient-to-b from-gray-50 to-white">
          {/* Chat Header */}
          <div className="px-6 py-3 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-600 text-white rounded-lg">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-medium text-gray-900">Chat with NCERT Textbook</h2>
                <p className="text-xs text-gray-600">Ask questions, generate summaries, or create study materials</p>
              </div>
            </div>
          </div>

          {/* Chat Messages - Scrollable Area */}
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 py-4 max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Sparkle className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-lg p-4 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-200 shadow-sm text-gray-900"
                    }`}
                  >
                    {renderMessageContent(message)}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <Sparkle className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {/* Chat Input - Fixed at Bottom */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white">
            <div className="max-w-4xl mx-auto flex gap-2 items-end">
              <Textarea
                placeholder="Ask about chapters, summaries, questions, or lesson plans..."
                value={inputMessage}
                onChange={handleTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="flex-1 min-h-[44px] max-h-[200px] resize-none"
                rows={1}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white h-[44px]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DocChatNCERT
