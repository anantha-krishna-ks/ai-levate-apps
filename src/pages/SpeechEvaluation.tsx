import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import { 
  ArrowLeft, 
  Mic,
  Upload,
  Play,
  StopCircle,
  Volume2,
  Bell,
  Settings,
  FileText,
  Clock,
  CheckCircle,
  Eye,
  BarChart3,
  Target,
  Headphones,
  Waves,
  Radio,
  Sparkles,
  Download,
  X,
  Pause,
  Square,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"

const SpeechEvaluation = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("")
  const [selectedText, setSelectedText] = useState("")
  const [customText, setCustomText] = useState("")
  const [attemptCount, setAttemptCount] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  const [showResultDetail, setShowResultDetail] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackTime, setPlaybackTime] = useState(0)
  
  // Speaking tab states
  const [selectedSpeakingLanguage, setSelectedSpeakingLanguage] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [speakingAttemptCount, setSpeakingAttemptCount] = useState(0)
  const [speakingHasAudio, setSpeakingHasAudio] = useState(false)
  const [showSpeakingResult, setShowSpeakingResult] = useState(false)
  const recordingInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioLevelInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const playbackInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const languages = [
    { value: "english-india", label: "English (India)" },
    { value: "english-us", label: "English (US)" },
    { value: "english-uk", label: "English (UK)" },
    { value: "hindi", label: "Hindi" },
    { value: "bengali", label: "Bengali" },
    { value: "tamil", label: "Tamil" }
  ]

  const sampleTexts = [
    "We had a great time taking a long walk outside in the morning.",
    "It took me a long time to learn where he came from.",
    "Question the plausibility of one explanation.",
    "The quick brown fox jumps over the lazy dog."
  ]

  const sampleTopics = [
    { value: "talk-about-day", label: "Talk about your day today" },
    { value: "describe-hobby", label: "Describe your favorite hobby" },
    { value: "travel-experience", label: "Share a memorable travel experience" },
    { value: "future-goals", label: "Discuss your future goals" }
  ]

  const attempts = [
    {
      id: 1,
      text: "We had a great time taking a long walk outside in the morning.",
      language: "English (India)",
      createdDate: "22 Jan 2025 – 14:53",
      status: "Completed",
      result: "Show Result"
    }
  ]

  const speakingAttempts = [
    {
      id: 1,
      text: "Talk about your day today",
      language: "English (United States)",
      createdDate: "20 Feb 2024 15:26",
      status: "Completed",
      result: "Show Result"
    }
  ]

  const handleTextSelect = (text: string) => {
    setSelectedText(text)
    setCustomText("")
  }

  const handleCustomTextConfirm = () => {
    if (customText.trim()) {
      setSelectedText(customText.trim())
    }
  }

  const startRecording = () => {
    if (attemptCount < 5) {
      setIsRecording(true)
      setIsPaused(false)
      setAttemptCount(prev => prev + 1)
      setRecordingTime(0)
      
      // Recording timer - 20 seconds for speaking mode
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 199) { // Stop at 20 seconds (200 * 100ms = 20000ms)
            stopRecording()
            return 200
          }
          return prev + 1
        })
      }, 100)
      
      // Audio level animation
      audioLevelInterval.current = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
    }
  }

  const startSpeakingRecording = () => {
    if (speakingAttemptCount < 5) {
      setIsRecording(true)
      setIsPaused(false)
      setSpeakingAttemptCount(prev => prev + 1)
      setRecordingTime(0)
      
      // Recording timer - 20 seconds for speaking mode
      recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 199) { // Stop at 20 seconds (200 * 100ms = 20000ms)
            stopRecording()
            return 200
          }
          return prev + 1
        })
      }, 100)
      
      // Audio level animation
      audioLevelInterval.current = setInterval(() => {
        setAudioLevel(Math.random() * 100)
      }, 100)
    }
  }

  const pauseRecording = () => {
    setIsPaused(true)
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
      recordingInterval.current = null
    }
    if (audioLevelInterval.current) {
      clearInterval(audioLevelInterval.current)
      audioLevelInterval.current = null
    }
  }

  const resumeRecording = () => {
    setIsPaused(false)
    
    // Resume recording timer
    recordingInterval.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 199) {
            stopRecording()
            return 200
          }
          return prev + 1
        })
      }, 100)
    
    // Resume audio level animation
    audioLevelInterval.current = setInterval(() => {
      setAudioLevel(Math.random() * 100)
    }, 100)
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setRecordingTime(0)
    setAudioLevel(0)
    
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
      recordingInterval.current = null
    }
    
    if (audioLevelInterval.current) {
      clearInterval(audioLevelInterval.current)
      audioLevelInterval.current = null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <Headphones className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-gray-900">Speech Evaluation</span>
                <span className="text-xs text-gray-500">AI-Powered Speech Analysis</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                <Mic className="w-2 h-2 text-white" />
              </div>
              <span className="text-sm text-indigo-700 font-medium">Ready to Analyze</span>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            <Headphones className="w-4 h-4" />
            Speech Analysis Platform
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-800 bg-clip-text text-transparent">
            Speech Evaluation System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Analyze pronunciation, fluency, and speaking skills with AI-powered speech evaluation
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Card className="border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <Tabs defaultValue="reading" className="w-full">
            <div className="bg-gradient-to-r from-indigo-100 via-purple-100 to-indigo-100 border-b border-indigo-300/70 px-8 pt-8 pb-4">
              <TabsList className="grid w-full grid-cols-2 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-sm h-16 rounded-lg p-1">
                <TabsTrigger 
                  value="reading" 
                  className="relative flex items-center justify-center gap-3 text-gray-700 font-medium text-base transition-all duration-300 data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-50 hover:text-gray-900 rounded-md mx-0.5 h-full px-4 py-2"
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Reading</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="speaking" 
                  className="relative flex items-center justify-center gap-3 text-gray-700 font-medium text-base transition-all duration-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-sm hover:bg-gray-50 hover:text-gray-900 rounded-md mx-0.5 h-full px-4 py-2"
                >
                  <Mic className="w-5 h-5" />
                  <span className="font-medium">Speaking</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="reading" className="p-6 space-y-6">
              {/* Step 1: Choose Language */}
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      1
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Choose a Language</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-64 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        {languages.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value} className="hover:bg-indigo-50">
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button 
                      disabled={!selectedLanguage}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium px-6 shadow-lg disabled:opacity-50"
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Select or Enter Text */}
              {selectedLanguage && (
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        2
                      </div>
                      <span className="text-lg font-semibold text-gray-900">Select or Enter Text</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-2">
                      Pick one of the sample texts below or type your own. This text will be used for the Speaking activity.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm text-gray-800">Sample Texts</h4>
                      <div className="space-y-2">
                        {sampleTexts.map((text, index) => (
                          <div 
                            key={index}
                            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                              selectedText === text 
                                ? "border-indigo-500 bg-indigo-50/50 shadow-md" 
                                : "border-gray-200 hover:border-indigo-300"
                            }`}
                            onClick={() => handleTextSelect(text)}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-sm font-medium text-gray-500 mt-0.5">
                                {index + 1}.
                              </span>
                              <span className="text-sm text-gray-700 leading-relaxed flex-1">{text}</span>
                              {selectedText === text && (
                                <CheckCircle className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="font-semibold text-sm mb-3 text-gray-800">Or Enter Your Own Text</h4>
                      <div className="space-y-3">
                        <Textarea
                          placeholder="Enter your own text here..."
                          value={customText}
                          onChange={(e) => setCustomText(e.target.value)}
                          className="min-h-20 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 resize-none"
                        />
                        <Button 
                          onClick={handleCustomTextConfirm}
                          disabled={!customText.trim()}
                          variant="outline"
                          className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
                        >
                          Confirm Text
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Enhanced Record or Upload Audio */}
              {selectedText && (
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        3
                      </div>
                      <span className="text-lg font-semibold text-gray-900">Record or Upload Audio</span>
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Target className="w-3 h-3 mr-1" />
                        Max 5 seconds each
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       {/* Enhanced Option A: Record Audio */}
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 mb-4">
                           <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                             A
                           </div>
                           <h4 className="font-semibold text-gray-800">Record Audio</h4>
                         </div>
                         
                         <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 min-h-[480px] flex flex-col">
                          <ul className="text-sm text-gray-600 space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Click to start recording with smart controls
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Use pause/resume for better control
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Recording stops automatically after 5 seconds
                            </li>
                          </ul>
                          
                           <div className="flex flex-col items-center gap-6 flex-1 justify-center">
                            {/* Enhanced Recording Controls */}
                            <div className="relative">
                              <div className={`absolute -inset-4 rounded-full transition-all duration-1000 ${
                                isRecording && !isPaused
                                  ? "bg-gradient-to-r from-blue-400/30 to-emerald-400/30 animate-pulse" 
                                  : "bg-transparent"
                              }`}></div>
                              <Button
                                size="lg"
                                onClick={startRecording}
                                disabled={attemptCount >= 5 || isRecording}
                                className={`relative w-20 h-20 rounded-full transition-all duration-500 border-4 ${
                                  isRecording 
                                    ? "bg-gradient-to-br from-blue-500 to-emerald-500 border-blue-300 shadow-lg" 
                                    : "bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-emerald-300 shadow-lg hover:scale-105"
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                              >
                                <Mic className="h-8 w-8 text-white" />
                              </Button>
                            </div>

                            {/* Recording Controls */}
                            {isRecording && (
                              <div className="flex items-center gap-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={isPaused ? resumeRecording : pauseRecording}
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                  {isPaused ? (
                                    <>
                                      <Play className="h-4 w-4 mr-1" />
                                      Resume
                                    </>
                                  ) : (
                                    <>
                                      <Pause className="h-4 w-4 mr-1" />
                                      Pause
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={stopRecording}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  <Square className="h-4 w-4 mr-1" />
                                  Stop
                                </Button>
                              </div>
                            )}

                            {/* Recording Status */}
                            <div className="text-center space-y-2">
                              <span className={`text-sm font-medium transition-colors duration-200 ${
                                isRecording 
                                  ? isPaused ? "text-amber-600" : "text-blue-600"
                                  : "text-gray-700"
                              }`}>
                                {isRecording 
                                  ? isPaused ? "Recording Paused" : "Recording..." 
                                  : "Ready to Record"
                                }
                              </span>
                              
                              {isRecording && (
                                <div className="flex flex-col items-center gap-2">
                                  <Progress 
                                    value={(recordingTime / 50) * 100} 
                                    className="w-32 h-2 bg-blue-100"
                                  />
                                  <span className="text-xs text-blue-600 font-mono">
                                    {isPaused ? "Paused" : `${Math.max(0, 5 - Math.floor(recordingTime / 10))}s remaining`}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Calmer Audio Visualization */}
                            {isRecording && !isPaused && (
                              <div className="flex items-center justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 bg-gradient-to-t from-blue-400 to-emerald-400 rounded-full transition-all duration-300"
                                    style={{
                                      height: `${8 + Math.sin((Date.now() / 200) + i) * 6}px`,
                                      opacity: 0.7 + Math.sin((Date.now() / 300) + i) * 0.3
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                       {/* Enhanced Option B: Upload Audio */}
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 mb-4">
                           <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                             B
                           </div>
                           <h4 className="font-semibold text-gray-800">Upload Audio File</h4>
                         </div>

                         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 min-h-[480px] flex flex-col">
                          <ul className="text-sm text-gray-600 space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Drag & drop audio files or click to browse
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Supported formats: .mp3, .wav, .m4a
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Maximum duration: 5 seconds
                            </li>
                          </ul>

                           <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group flex-1 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                                <Upload className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-800">Drop audio files here</p>
                                <p className="text-xs text-gray-500">or click to browse your computer</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Browse Files
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Attempts & Results */}
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <BarChart3 className="h-6 w-6 text-indigo-600" />
                    <span className="text-lg font-semibold text-gray-900">Attempts & Results</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2">
                    Track your speech evaluation attempts and view detailed analysis results
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <TableHead className="font-semibold text-gray-700">Question Text</TableHead>
                          <TableHead className="font-semibold text-gray-700">Language</TableHead>
                          <TableHead className="font-semibold text-gray-700">Created Date</TableHead>
                          <TableHead className="font-semibold text-gray-700">Status</TableHead>
                          <TableHead className="font-semibold text-gray-700">Result</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {attempts.map((attempt) => (
                          <TableRow key={attempt.id} className="hover:bg-indigo-50/30 transition-colors">
                            <TableCell className="max-w-md">
                              <div className="truncate text-indigo-700 font-medium" title={attempt.text}>
                                {attempt.text}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-gray-200 text-gray-700">
                                {attempt.language}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">{attempt.createdDate}</TableCell>
                            <TableCell>
                              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 flex items-center gap-1 w-fit">
                                <CheckCircle className="h-3 w-3" />
                                {attempt.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                onClick={() => setShowResultDetail(true)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                {attempt.result}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* Assessment Result - Inline Below Attempts Table */}
              {showResultDetail && (
                <Card className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/20 border border-indigo-200 shadow-2xl">
                  <CardHeader className="border-b border-indigo-200 bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-800 bg-clip-text text-transparent">
                            Assessment Result
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">Detailed analysis of your speech performance</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowResultDetail(false)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {/* Audio Player with Enhanced Transcript */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-indigo-100 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center shadow-sm">
                            <Headphones className="w-3 h-3 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Audio Analysis</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (isPlaying) {
                                setIsPlaying(false)
                                if (playbackInterval.current) {
                                  clearInterval(playbackInterval.current)
                                }
                              } else {
                                setIsPlaying(true)
                                setPlaybackTime(0)
                                playbackInterval.current = setInterval(() => {
                                  setPlaybackTime(prev => {
                                    if (prev >= 50) {
                                      setIsPlaying(false)
                                      return 0
                                    }
                                    return prev + 1
                                  })
                                }, 100)
                              }
                            }}
                            className="border-indigo-200 text-indigo-700 hover:bg-indigo-100/50"
                          >
                            {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                            {isPlaying ? "Pause" : "Play"}
                          </Button>
                          <span className="text-xs text-gray-600 font-mono bg-gray-100 px-1.5 py-0.5 rounded">00:00</span>
                          <Progress 
                            value={(playbackTime / 50) * 100} 
                            className="w-24 h-1"
                          />
                          <span className="text-xs text-gray-600 font-mono bg-gray-100 px-1.5 py-0.5 rounded">00:05</span>
                          <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-100/50">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Enhanced Transcript with highlighting */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Volume2 className="w-4 h-4 text-indigo-600" />
                          <span className="font-semibold text-gray-800">Speech Transcript</span>
                        </div>
                        <p className="text-base leading-relaxed">
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">We </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">had </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">a </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">great </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">time </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">taking </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">a </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">long </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">walk </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">outside </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">in </span>
                          <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">the </span>
                          <span className="bg-yellow-200 text-gray-900 px-1 py-0.5 rounded border-l-4 border-yellow-500">morning</span>
                        </p>
                      </div>
                    </div>

                    {/* Compact Two Column Layout */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {/* Types of Errors - Compact */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center shadow-sm">
                            <Target className="w-3 h-3 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Error Analysis</h3>
                        </div>
                        <div className="space-y-2">
                          {[
                            { type: "Mispronunciations", count: 1, color: "bg-orange-100 text-orange-800 border-orange-300", bgColor: "bg-orange-50" },
                            { type: "Omissions", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" },
                            { type: "Insertions", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" },
                            { type: "Unexpected break", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" },
                            { type: "Missing break", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" },
                            { type: "Monotone", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" }
                          ].map((error, index) => (
                            <div key={index} className={`flex items-center justify-between p-2 ${error.bgColor} border border-gray-200 rounded-lg hover:bg-gray-100/50 transition-all`}>
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${error.count > 0 ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
                                <span className="text-sm font-medium text-gray-800">{error.type}</span>
                              </div>
                              <Badge className={`${error.color} text-sm px-2 py-0.5`}>
                                {error.count}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        {/* Pronunciation Score Meter */}
                        <div className="bg-white/90 backdrop-blur-sm border border-green-200 rounded-lg p-4 shadow-sm">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center shadow-sm">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                            <h4 className="text-sm font-semibold text-gray-900">Pronunciation Score</h4>
                          </div>
                          
                          {/* Score Display */}
                          <div className="text-center mb-4">
                            <span className="text-2xl font-bold text-green-600">93%</span>
                            <p className="text-xs text-gray-600">Overall Pronunciation</p>
                          </div>
                          
                          {/* Meter Visualization */}
                          <div className="space-y-3">
                            <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                              <div className="absolute inset-0 flex">
                                <div className="w-[59%] bg-red-400"></div>
                                <div className="w-[20%] bg-yellow-400"></div>
                                <div className="w-[21%] bg-green-400"></div>
                              </div>
                              <div 
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-2000 ease-out"
                                style={{ width: '93%' }}
                              ></div>
                              <div 
                                className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-white border-2 border-gray-800 rounded-full shadow-md transition-all duration-2000 ease-out"
                                style={{ left: '93%', transform: 'translateX(-50%) translateY(-50%)' }}
                              ></div>
                            </div>
                            
                            {/* Scale Labels */}
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Poor (0-59)</span>
                              <span>Good (60-79)</span>
                              <span>Excellent (80-100)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Compact Score Breakdown */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-md flex items-center justify-center shadow-sm">
                            <Sparkles className="w-3 h-3 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Performance Breakdown</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            { label: "Accuracy Score", score: 92, maxScore: 100, color: "from-green-500 to-emerald-600", bgColor: "bg-green-50", textColor: "text-green-700" },
                            { label: "Fluency Score", score: 100, maxScore: 100, color: "from-blue-500 to-indigo-600", bgColor: "bg-blue-50", textColor: "text-blue-700" },
                            { label: "Completeness Score", score: 92, maxScore: 100, color: "from-purple-500 to-violet-600", bgColor: "bg-purple-50", textColor: "text-purple-700" },
                            { label: "Prosody Score", score: 89.6, maxScore: 100, color: "from-orange-500 to-red-600", bgColor: "bg-orange-50", textColor: "text-orange-700" }
                          ].map((item, index) => (
                            <div key={index} className={`${item.bgColor} border border-gray-200 rounded-lg p-3 hover:bg-gray-100/30 transition-all`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 bg-gradient-to-r ${item.color} rounded-full`}></div>
                                  <span className="text-sm font-medium text-gray-800">{item.label}</span>
                                </div>
                                <span className={`text-sm font-semibold ${item.textColor} bg-white px-2 py-1 rounded`}>
                                  {item.score}/{item.maxScore}
                                </span>
                              </div>
                              <div className="w-full bg-white/80 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full bg-gradient-to-r ${item.color} transition-all duration-2000 ease-out`}
                                  style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                                ></div>
                              </div>
                              <div className="mt-1 text-right">
                                <span className={`text-sm ${item.textColor}`}>
                                  {((item.score / item.maxScore) * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="speaking" className="p-6 space-y-6">
              {/* Step 1: Choose Language and Topic */}
              <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      1
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Choose Language & Topic</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                    {/* Choose Language */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Choose a language</label>
                      <Select value={selectedSpeakingLanguage} onValueChange={setSelectedSpeakingLanguage}>
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="English (United States)" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {languages.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value} className="hover:bg-purple-50">
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Select Sample Topic */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Select a sample topic</label>
                      <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Talk about your day t..." />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {sampleTopics.map((topic) => (
                            <SelectItem key={topic.value} value={topic.value} className="hover:bg-purple-50">
                              {topic.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Button 
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Reset
                      </Button>
                      <Button 
                        disabled={!selectedSpeakingLanguage || !selectedTopic}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 shadow-lg disabled:opacity-50"
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Enhanced Record or Upload Audio */}
              {selectedTopic && (
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        2
                      </div>
                      <span className="text-lg font-semibold text-gray-900">Record or Upload Audio</span>
                    </CardTitle>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                        <Target className="w-3 h-3 mr-1" />
                        Max 20 seconds each
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       {/* Enhanced Option A: Record Audio */}
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 mb-4">
                           <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                             A
                           </div>
                           <h4 className="font-semibold text-gray-800">Record Audio</h4>
                         </div>
                         
                         <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 min-h-[480px] flex flex-col">
                          <ul className="text-sm text-gray-600 space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Click to start recording with smart controls
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Use pause/resume for better control
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                              Recording stops automatically after 20 seconds
                            </li>
                          </ul>
                          
                          <div className="flex flex-col items-center gap-6 flex-1 justify-center">
                            {/* Enhanced Recording Controls */}
                            <div className="relative">
                              <div className={`absolute -inset-4 rounded-full transition-all duration-1000 ${
                                isRecording && !isPaused
                                  ? "bg-gradient-to-r from-blue-400/30 to-emerald-400/30 animate-pulse" 
                                  : "bg-transparent"
                              }`}></div>
                              <Button
                                size="lg"
                                onClick={startSpeakingRecording}
                                disabled={speakingAttemptCount >= 5 || isRecording}
                                className={`relative w-20 h-20 rounded-full transition-all duration-500 border-4 ${
                                  isRecording 
                                    ? "bg-gradient-to-br from-blue-500 to-emerald-500 border-blue-300 shadow-lg" 
                                    : "bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-emerald-300 shadow-lg hover:scale-105"
                                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                              >
                                <Mic className="h-8 w-8 text-white" />
                              </Button>
                            </div>

                            {/* Recording Controls */}
                            {isRecording && (
                              <div className="flex items-center gap-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={isPaused ? resumeRecording : pauseRecording}
                                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                  {isPaused ? (
                                    <>
                                      <Play className="h-4 w-4 mr-1" />
                                      Resume
                                    </>
                                  ) : (
                                    <>
                                      <Pause className="h-4 w-4 mr-1" />
                                      Pause
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={stopRecording}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  <Square className="h-4 w-4 mr-1" />
                                  Stop
                                </Button>
                              </div>
                            )}

                            {/* Recording Status */}
                            <div className="text-center space-y-2">
                              <span className={`text-sm font-medium transition-colors duration-200 ${
                                isRecording 
                                  ? isPaused ? "text-amber-600" : "text-blue-600"
                                  : "text-gray-700"
                              }`}>
                                {isRecording 
                                  ? isPaused ? "Recording Paused" : "Recording..." 
                                  : "Ready to Record"
                                }
                              </span>
                              
                              {isRecording && (
                                <div className="flex flex-col items-center gap-2">
                                  <Progress 
                                    value={(recordingTime / 200) * 100} 
                                    className="w-32 h-2 bg-blue-100"
                                  />
                                  <span className="text-xs text-blue-600 font-mono">
                                    {isPaused ? "Paused" : `${Math.max(0, 20 - Math.floor(recordingTime / 10))}s remaining`}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Calmer Audio Visualization */}
                            {isRecording && !isPaused && (
                              <div className="flex items-center justify-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-2 bg-gradient-to-t from-blue-400 to-emerald-400 rounded-full transition-all duration-300"
                                    style={{
                                      height: `${8 + Math.sin((Date.now() / 200) + i) * 6}px`,
                                      opacity: 0.7 + Math.sin((Date.now() / 300) + i) * 0.3
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                       {/* Enhanced Option B: Upload Audio */}
                       <div className="space-y-4">
                         <div className="flex items-center gap-2 mb-4">
                           <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                             B
                           </div>
                           <h4 className="font-semibold text-gray-800">Upload Audio File</h4>
                         </div>

                         <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 min-h-[480px] flex flex-col">
                          <ul className="text-sm text-gray-600 space-y-2 mb-6">
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Drag & drop audio files or click to browse
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Supported formats: .mp3, .wav, .m4a
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              Maximum duration: 20 seconds
                            </li>
                          </ul>

                          <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group flex-1 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center group-hover:from-blue-200 group-hover:to-indigo-200 transition-all">
                                <Upload className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-800">Drop audio files here</p>
                                <p className="text-xs text-gray-500">or click to browse your computer</p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSpeakingHasAudio(true)}
                                className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Browse Files
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Audio Player (only show when audio exists) */}
                    {speakingHasAudio && (
                      <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-indigo-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center shadow-sm">
                              <Headphones className="w-3 h-3 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Recorded Audio</h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="border-indigo-200 text-indigo-700 hover:bg-indigo-100/50"
                            >
                              {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                              {isPlaying ? "Pause" : "Play"}
                            </Button>
                            <span className="text-xs text-gray-600 font-mono bg-gray-100 px-1.5 py-0.5 rounded">00:00</span>
                            <Progress value={playbackTime * 2} className="w-24 h-1" />
                            <span className="text-xs text-gray-600 font-mono bg-gray-100 px-1.5 py-0.5 rounded">00:20</span>
                            <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-100/50">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Show Result Button */}
                        <div className="mt-4 text-center">
                          <Button
                            onClick={() => {
                              setSpeakingHasAudio(true)
                              setShowSpeakingResult(true)
                            }}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium px-6 py-2 shadow-lg"
                          >
                            Show Result
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Attempts and Results */}
              {selectedTopic && (
                <Card className="bg-white/90 backdrop-blur-sm border border-gray-200/60 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-900">Attempts & Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200">
                          <TableHead className="text-blue-600 font-semibold">QUESTION TEXT</TableHead>
                          <TableHead className="text-blue-600 font-semibold">LANGUAGE</TableHead>
                          <TableHead className="text-blue-600 font-semibold">CREATED DATE</TableHead>
                          <TableHead className="text-blue-600 font-semibold">STATUS</TableHead>
                          <TableHead className="text-blue-600 font-semibold">RESULT</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {speakingAttempts.map((attempt) => (
                          <TableRow key={attempt.id} className="border-gray-200 hover:bg-gray-50/50">
                            <TableCell className="text-gray-700">{attempt.text}</TableCell>
                            <TableCell className="text-gray-600">{attempt.language}</TableCell>
                            <TableCell className="text-gray-600">{attempt.createdDate}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-800 border-green-200">
                                {attempt.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost" 
                                size="sm" 
                                className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50"
                                onClick={() => setShowSpeakingResult(true)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                {attempt.result}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* Speaking Assessment Result */}
              {showSpeakingResult && (
                <Card className="bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/20 border border-indigo-200 shadow-2xl">
                  <CardHeader className="border-b border-indigo-200 bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                          <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-purple-800 bg-clip-text text-transparent">
                            Assessment Result
                          </CardTitle>
                          <p className="text-sm text-gray-600 mt-1">Detailed analysis of your speech performance</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowSpeakingResult(false)}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {/* First Row: Audio Analysis and Error Analysis side by side */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {/* Audio Player with Enhanced Transcript */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-indigo-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center shadow-sm">
                              <Headphones className="w-3 h-3 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Audio Analysis</h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsPlaying(!isPlaying)}
                              className="border-indigo-200 text-indigo-700 hover:bg-indigo-100/50"
                            >
                              {isPlaying ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                              {isPlaying ? "Pause" : "Play"}
                            </Button>
                            <span className="text-xs text-gray-600 font-mono bg-gray-100 px-1.5 py-0.5 rounded">00:00</span>
                            <Progress value={(playbackTime / 50) * 100} className="w-24 h-1" />
                            <span className="text-xs text-gray-600 font-mono bg-gray-100 px-1.5 py-0.5 rounded">00:20</span>
                            <Button variant="outline" size="sm" className="border-gray-200 text-gray-600 hover:bg-gray-100/50">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Enhanced Transcript with highlighting */}
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Volume2 className="w-4 h-4 text-indigo-600" />
                            <span className="font-semibold text-gray-800">Speech Transcript</span>
                          </div>
                          <p className="text-base leading-relaxed">
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">Today </span>
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">was </span>
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">a </span>
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">productive </span>
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">day </span>
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">at </span>
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">work </span>
                            <span className="bg-yellow-200 text-gray-900 px-1 py-0.5 rounded border-l-4 border-yellow-500">and</span>
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100"> I </span>
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">enjoyed </span>
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">the </span>
                            <span className="text-gray-900 px-1 py-0.5 rounded bg-green-100">evening </span>
                          </p>
                        </div>
                      </div>

                      {/* Error Analysis */}
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-orange-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center shadow-sm">
                            <Target className="w-3 h-3 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">Error Analysis</h3>
                        </div>
                        <div className="space-y-2">
                          {[
                            { type: "Mispronunciations", count: 2, color: "bg-orange-100 text-orange-800 border-orange-300", bgColor: "bg-orange-50" },
                            { type: "Omissions", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" },
                            { type: "Insertions", count: 1, color: "bg-yellow-100 text-yellow-800 border-yellow-300", bgColor: "bg-yellow-50" },
                            { type: "Unexpected break", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" },
                            { type: "Missing break", count: 1, color: "bg-blue-100 text-blue-800 border-blue-300", bgColor: "bg-blue-50" },
                            { type: "Monotone", count: 0, color: "bg-gray-100 text-gray-600 border-gray-200", bgColor: "bg-gray-50" }
                          ].map((error, index) => (
                            <div key={index} className={`flex items-center justify-between p-2 ${error.bgColor} border border-gray-200 rounded-lg hover:bg-gray-100/50 transition-all`}>
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${error.count > 0 ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
                                <span className="text-sm font-medium text-gray-800">{error.type}</span>
                              </div>
                              <Badge className={`${error.color} text-sm px-2 py-0.5`}>
                                {error.count}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Second Row: Pronunciation Score and Content Score side by side */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      {/* Pronunciation Score Meter */}
                      <div className="bg-white/90 backdrop-blur-sm border border-green-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-md flex items-center justify-center shadow-sm">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900">Pronunciation Score</h4>
                        </div>
                        
                        {/* Score Display */}
                        <div className="text-center mb-4">
                          <span className="text-2xl font-bold text-green-600">86%</span>
                          <p className="text-xs text-gray-600">Overall Score</p>
                        </div>
                        
                        {/* Meter Visualization */}
                        <div className="space-y-3">
                          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                            <div className="absolute inset-0 flex">
                              <div className="w-[59%] bg-red-400"></div>
                              <div className="w-[20%] bg-yellow-400"></div>
                              <div className="w-[21%] bg-green-400"></div>
                            </div>
                            <div 
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-2000 ease-out"
                              style={{ width: '86%' }}
                            ></div>
                            <div 
                              className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-white border-2 border-gray-800 rounded-full shadow-md transition-all duration-2000 ease-out"
                              style={{ left: '86%', transform: 'translateX(-50%) translateY(-50%)' }}
                            ></div>
                          </div>
                          
                          {/* Scale Labels */}
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Poor (0-59)</span>
                            <span>Good (60-79)</span>
                            <span>Excellent (80-100)</span>
                          </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="mt-4 space-y-2 border-t border-gray-200 pt-3">
                          <h5 className="text-sm font-semibold text-gray-800 mb-2">Score Breakdown</h5>
                           {[
                             { label: "Accuracy Score", score: 95, maxScore: 100, color: "from-green-500 to-emerald-600" },
                             { label: "Fluency Score", score: 79, maxScore: 100, color: "from-blue-500 to-indigo-600" },
                             { label: "Prosody Score", score: 82.8, maxScore: 100, color: "from-purple-500 to-violet-600" }
                           ].map((item, index) => (
                             <div key={index} className="space-y-2">
                               <div className="flex items-center justify-between text-sm">
                                 <span className="text-gray-700 font-medium">{item.label}</span>
                                 <span className="font-bold text-gray-900">{item.score}/{item.maxScore}</span>
                               </div>
                               <div className="relative">
                                 <Progress value={item.score} className="h-2" />
                                 <div className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`} 
                                      style={{ width: `${item.score}%` }}></div>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>

                      {/* Content Score */}
                      <div className="bg-white/90 backdrop-blur-sm border border-orange-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center shadow-sm">
                            <FileText className="w-3 h-3 text-white" />
                          </div>
                          <h4 className="text-sm font-semibold text-gray-900">Content Score</h4>
                        </div>
                        
                        {/* Score Display */}
                        <div className="text-center mb-4">
                          <span className="text-2xl font-bold text-orange-600">31%</span>
                          <p className="text-xs text-gray-600">Overall Score</p>
                        </div>
                        
                        {/* Meter Visualization */}
                        <div className="space-y-3">
                          <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                            <div className="absolute inset-0 flex">
                              <div className="w-[59%] bg-red-400"></div>
                              <div className="w-[20%] bg-yellow-400"></div>
                              <div className="w-[21%] bg-green-400"></div>
                            </div>
                            <div 
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-2000 ease-out"
                              style={{ width: '31%' }}
                            ></div>
                            <div 
                              className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-white border-2 border-gray-800 rounded-full shadow-md transition-all duration-2000 ease-out"
                              style={{ left: '31%', transform: 'translateX(-50%) translateY(-50%)' }}
                            ></div>
                          </div>
                          
                          {/* Scale Labels */}
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>Poor (0-59)</span>
                            <span>Good (60-79)</span>
                            <span>Excellent (80-100)</span>
                          </div>
                        </div>

                        {/* Score Breakdown */}
                        <div className="space-y-2 border-t border-gray-200 pt-3">
                          <h5 className="text-sm font-semibold text-gray-800 mb-2">Score Breakdown</h5>
                           {[
                             { label: "Vocabulary Score", score: 50, maxScore: 100, color: "from-orange-500 to-yellow-600" },
                             { label: "Grammar Score", score: 44, maxScore: 100, color: "from-red-500 to-pink-600" },
                             { label: "Topic Score", score: 0, maxScore: 100, color: "from-gray-400 to-gray-600" }
                           ].map((item, index) => (
                             <div key={index} className="space-y-2">
                               <div className="flex items-center justify-between text-sm">
                                 <span className="text-gray-700 font-medium">{item.label}</span>
                                 <span className="font-bold text-gray-900">{item.score}/{item.maxScore}</span>
                               </div>
                               <div className="relative">
                                 <Progress value={item.score} className="h-2" />
                                 <div className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000`} 
                                      style={{ width: `${item.score}%` }}></div>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

export default SpeechEvaluation