import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowLeft, ScanLine, Sparkles, Upload, FolderOpen, RotateCcw, Eye, CheckCircle, Check, Clock, AlertCircle, Loader2, User, Users, FileText, Building, MapPin, X, Edit2, ChevronLeft, ChevronRight, Image, Award, Target, ListChecks, AlertTriangle, MessageSquare, ZoomIn, ZoomOut, Maximize2, Search, Filter, Layers, Download, ChevronDown, HardDrive, Plus, BookOpen, Save, Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import ocrAnswerSheet1 from "@/assets/ocr-answer-sheet-1.png"
import ocrAnswerSheet2 from "@/assets/ocr-answer-sheet-2.png"
import ocrAnswerSheet3 from "@/assets/ocr-answer-sheet-3.png"
interface AnswerSheetPage {
  pageNumber: number
  imageUrl: string
}

interface SegmentImage {
  id: number
  imageUrl: string
  label: string
  ocrText: string
}

interface EvaluationData {
  questionTitle: string
  maxScore: number
  extractedInfo: string
  keypoints: string[]
  evaluationScore: number
  missing: string[]
  rational: string
}

type PhaseStatus = "yet-to-segmentation" | "yet-to-ocr" | "yet-to-evaluation" | "in-progress" | "completed" | "pending" | "approved"

interface UploadedFolder {
  id: string
  name: string
  fileCount: number
  size: number
  type: "folder" | "zip" | "pdf"
  uploadedAt: string
}

interface Workspace {
  id: string
  name: string
  createdAt: string
  fileCount: number
  totalSize: number
  candidateCount: number
  status: "active" | "completed" | "archived"
  uploadedFolders?: UploadedFolder[]
}

interface CandidateData {
  id: string
  candidateName: string
  registrationName: string
  centreName: string
  centreAddress: string
  phase1: PhaseStatus
  phase2: PhaseStatus
  phase3: PhaseStatus
  segmentData?: string
  ocrData?: string
  answerSheets?: AnswerSheetPage[]
  segmentImages?: SegmentImage[]
  evaluationData?: EvaluationData
  evaluationMarks?: number
  maxMarks?: number
  quickApprove?: boolean
  standardsMet?: { met: number; total: number }
  category?: string
}

const StatusBadge = ({ 
  status, 
  clickable = false, 
  onClick 
}: { 
  status: string
  clickable?: boolean
  onClick?: () => void
}) => {
  const config = {
    "yet-to-segmentation": {
      icon: Clock,
      label: "Yet to Segmentation",
      className: "bg-slate-50 text-slate-600 border-slate-200"
    },
    "yet-to-ocr": {
      icon: Clock,
      label: "Yet to OCR",
      className: "bg-slate-50 text-slate-600 border-slate-200"
    },
    "yet-to-evaluation": {
      icon: Clock,
      label: "Yet to Evaluation",
      className: "bg-slate-50 text-slate-600 border-slate-200"
    },
    "in-progress": {
      icon: Loader2,
      label: "In Progress",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      animate: true
    },
    completed: {
      icon: CheckCircle,
      label: "Completed",
      className: "bg-emerald-50 text-emerald-700 border-emerald-200"
    },
    pending: {
      icon: Clock,
      label: "Pending",
      className: "bg-amber-50 text-amber-700 border-amber-200"
    },
    approved: {
      icon: CheckCircle,
      label: "Approved",
      className: "bg-teal-50 text-teal-700 border-teal-200"
    }
  }[status] || {
    icon: Clock,
    label: "Unknown",
    className: "bg-gray-50 text-gray-500 border-gray-200"
  }

  const Icon = config.icon

  return (
    <button
      type="button"
      onClick={clickable ? onClick : undefined}
      disabled={!clickable}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.className} ${
        clickable ? 'cursor-pointer hover:ring-2 hover:ring-teal-300 transition-all' : 'cursor-default'
      }`}
    >
      <Icon className={`w-3.5 h-3.5 ${config.animate ? 'animate-spin' : ''}`} />
      {config.label}
    </button>
  )
}

const OCREvaluation = () => {
  // Workspace states
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { 
      id: "ws-1", 
      name: "Broadcast Journalism - Batch 1", 
      createdAt: "2024-01-15", 
      fileCount: 45, 
      totalSize: 125000000, 
      candidateCount: 45, 
      status: "active",
      uploadedFolders: [
        { id: "f1", name: "Batch_1_Papers", fileCount: 20, size: 55000000, type: "folder", uploadedAt: "2024-01-15" },
        { id: "f2", name: "Additional_Papers.zip", fileCount: 15, size: 42000000, type: "zip", uploadedAt: "2024-01-16" },
        { id: "f3", name: "Late_Submissions", fileCount: 10, size: 28000000, type: "folder", uploadedAt: "2024-01-17" },
      ]
    },
    { 
      id: "ws-2", 
      name: "Print Journalism - Midterm", 
      createdAt: "2024-01-10", 
      fileCount: 32, 
      totalSize: 89000000, 
      candidateCount: 32, 
      status: "completed",
      uploadedFolders: [
        { id: "f4", name: "Midterm_Papers.zip", fileCount: 32, size: 89000000, type: "zip", uploadedAt: "2024-01-10" },
      ]
    },
    { 
      id: "ws-3", 
      name: "Digital Media - Final Exam", 
      createdAt: "2024-01-05", 
      fileCount: 28, 
      totalSize: 76000000, 
      candidateCount: 28, 
      status: "archived",
      uploadedFolders: [
        { id: "f5", name: "Final_Papers", fileCount: 18, size: 50000000, type: "folder", uploadedAt: "2024-01-05" },
        { id: "f6", name: "Supplementary_Papers", fileCount: 10, size: 26000000, type: "folder", uploadedAt: "2024-01-06" },
      ]
    },
  ])
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null)
  const [showCreateWorkspaceDialog, setShowCreateWorkspaceDialog] = useState(false)
  const [newWorkspaceName, setNewWorkspaceName] = useState("")
  const [newWorkspaceFiles, setNewWorkspaceFiles] = useState<File[]>([])
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false)

  const [isFolderUploading, setIsFolderUploading] = useState(false)
  const [isZipUploading, setIsZipUploading] = useState(false)
  const [isPdfUploading, setIsPdfUploading] = useState(false)
  const [hasUploaded, setHasUploaded] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [fileCount, setFileCount] = useState(0)
  const [totalFileSize, setTotalFileSize] = useState(0)
  const [candidates, setCandidates] = useState<CandidateData[]>([])
  const [previewCandidate, setPreviewCandidate] = useState<CandidateData | null>(null)
  const [detailCandidate, setDetailCandidate] = useState<CandidateData | null>(null)
  const [ocrReviewCandidate, setOcrReviewCandidate] = useState<CandidateData | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSegmentData, setEditedSegmentData] = useState("")
  const [editedOcrData, setEditedOcrData] = useState("")
  const [phase1ReviewCandidate, setPhase1ReviewCandidate] = useState<CandidateData | null>(null)
  const [fromPageInput, setFromPageInput] = useState("")
  const [toPageInput, setToPageInput] = useState("")
  const [answerSheets, setAnswerSheets] = useState<AnswerSheetPage[]>([])
  const [evaluationReviewCandidate, setEvaluationReviewCandidate] = useState<CandidateData | null>(null)
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0)
  const [ocrActiveQuestionIndex, setOcrActiveQuestionIndex] = useState(0)
  const [evalActiveQuestionIndex, setEvalActiveQuestionIndex] = useState(0)
  const [showReuploadConfirm, setShowReuploadConfirm] = useState(false)
  const [activeAnswerSheetIndex, setActiveAnswerSheetIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [searchQuery, setSearchQuery] = useState("")
  const [phaseFilter, setPhaseFilter] = useState<"all" | "phase1" | "phase2" | "phase3">("all")
  const [statusFilter, setStatusFilter] = useState<"all" | PhaseStatus>("all")
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const [showUploadConfirm, setShowUploadConfirm] = useState(false)
  const [phase1VisitedQuestions, setPhase1VisitedQuestions] = useState<Set<number>>(new Set([0]))
  const [phase2VisitedQuestions, setPhase2VisitedQuestions] = useState<Set<number>>(new Set([0]))
  const [phase3VisitedQuestions, setPhase3VisitedQuestions] = useState<Set<number>>(new Set([0]))
  const [pendingUploadData, setPendingUploadData] = useState<{
    folderName: string
    fileCount: number
    totalSize: number
    candidates: CandidateData[]
  } | null>(null)
  const [selectedSubject, setSelectedSubject] = useState("broadcast-journalism")
  // Individual segment OCR editing states
  const [editingSegmentId, setEditingSegmentId] = useState<number | null>(null)
  const [segmentOcrTexts, setSegmentOcrTexts] = useState<Record<number, string>>({})
  const [editedSegmentOcrText, setEditedSegmentOcrText] = useState("")
  // Re-evaluation dialog state
  const [showReEvaluationDialog, setShowReEvaluationDialog] = useState(false)
  const [reEvaluationPrompt, setReEvaluationPrompt] = useState("")
  // Multi-select state for download
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set())
  // Image popup state
  const [popupImage, setPopupImage] = useState<{ url: string; label: string } | null>(null)
  // Added files dialog state
  const [showAddedFilesDialog, setShowAddedFilesDialog] = useState(false)
  const [addedFilesInfo, setAddedFilesInfo] = useState<{ files: File[]; totalSize: number } | null>(null)
  // Evaluation score editing state
  const [editedEvalScore, setEditedEvalScore] = useState<string>("")
  // Manual marking state
  const [manualMarkingEnabled, setManualMarkingEnabled] = useState(false)
  // Save confirmation dialog state
  const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false)
  const [pendingSaveScore, setPendingSaveScore] = useState<number | null>(null)

  const subjects = [
    { value: "broadcast-journalism", label: "Broadcast Journalism" },
    { value: "print-journalism", label: "Print Journalism" },
    { value: "digital-media", label: "Digital Media" },
    { value: "mass-communication", label: "Mass Communication" },
    { value: "public-relations", label: "Public Relations" },
    { value: "advertising", label: "Advertising" },
    { value: "media-studies", label: "Media Studies" },
    { value: "film-production", label: "Film Production" },
  ]

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Mock questions list for Phase 1 review
  const mockQuestionsList = [
    { id: 1, text: "Explain the process of photosynthesis in plants and describe the role of chlorophyll in this process.", maxScore: 10, pages: 3 },
    { id: 2, text: "Define the term 'ecosystem' and describe the different components of an ecosystem with suitable examples.", maxScore: 8, pages: 2 },
    { id: 3, text: "What is cellular respiration? Explain the difference between aerobic and anaerobic respiration.", maxScore: 10, pages: 3 },
    { id: 4, text: "Describe the structure of DNA and explain how genetic information is transferred from one generation to another.", maxScore: 12, pages: 4 },
    { id: 5, text: "Explain the water cycle and its importance in maintaining ecological balance.", maxScore: 6, pages: 2 },
  ]

  // Mock evaluation data
  const generateMockEvaluationData = (): EvaluationData => ({
    questionTitle: "Explain the process of photosynthesis in plants and describe the role of chlorophyll in this process.",
    maxScore: 10,
    extractedInfo: "The student has explained that photosynthesis is a process where plants convert carbon dioxide and water into glucose and oxygen using sunlight. The answer mentions that this process takes place in the leaves and involves the green pigment called chlorophyll which captures light energy.",
    keypoints: [
      "Definition of photosynthesis correctly stated",
      "Reactants (CO₂ and H₂O) and products (glucose and O₂) identified",
      "Role of sunlight as energy source mentioned",
      "Chlorophyll identified as the light-absorbing pigment",
      "Location of photosynthesis in chloroplasts mentioned"
    ],
    evaluationScore: 7,
    missing: [
      "Light-dependent and light-independent reactions not explained",
      "Chemical equation not provided",
      "Stomata's role in gas exchange not mentioned"
    ],
    rational: "The student demonstrates a good foundational understanding of photosynthesis. The answer correctly identifies the basic components and process of photosynthesis. However, the response lacks depth in explaining the detailed mechanisms such as the two stages of photosynthesis (light-dependent and light-independent reactions). The role of chlorophyll is mentioned but could be elaborated further to include how it absorbs specific wavelengths of light. Overall, a competent answer that meets most basic requirements but misses some advanced concepts expected at this level."
  })

  // Mock answer sheet images
  const generateMockAnswerSheets = (): AnswerSheetPage[] => {
    return [
      { pageNumber: 1, imageUrl: ocrAnswerSheet1 },
      { pageNumber: 2, imageUrl: ocrAnswerSheet2 },
      { pageNumber: 3, imageUrl: ocrAnswerSheet3 },
    ]
  }

  // Generate mock candidates for a workspace
  const generateMockCandidates = (count: number, folders?: UploadedFolder[]): CandidateData[] => {
    const centres = ["Delhi Centre", "Mumbai Centre", "Bangalore Centre", "Chennai Centre", "Kolkata Centre"]
    const addresses = [
      "123, Connaught Place, New Delhi - 110001",
      "456, Bandra West, Mumbai - 400050",
      "789, MG Road, Bangalore - 560001",
      "321, Anna Nagar, Chennai - 600040",
      "654, Park Street, Kolkata - 700016"
    ]
    
    return Array.from({ length: Math.min(count, 125) }, (_, index) => {
      const statuses = generateConsistentStatuses()
      return {
        id: `candidate-${index + 1}`,
        candidateName: `Candidate ${String(index + 1).padStart(3, '0')}`,
        registrationName: `REG${String(index + 1).padStart(6, '0')}`,
        centreName: centres[index % centres.length],
        centreAddress: addresses[index % addresses.length],
        phase1: statuses.phase1,
        phase2: statuses.phase2,
        phase3: statuses.phase3,
        segmentData: `Section A: Question 1-10\nSection B: Question 11-20\nSection C: Question 21-30\nTotal Segments: 30\nDetected Boundaries: 28/30`,
        ocrData: `Extracted Text Preview:\n\nQ1. What is the capital of India?\nA) Mumbai B) Delhi C) Chennai D) Kolkata\n\nQ2. Which river is longest in India?\nA) Ganga B) Yamuna C) Godavari D) Brahmaputra\n\nConfidence Score: 94.5%\nCharacter Recognition Rate: 98.2%`,
        segmentImages: generateMockSegmentImages(),
        evaluationData: generateMockEvaluationData(),
        evaluationMarks: statuses.hasEvaluationMarks ? Math.floor(Math.random() * 51) + 50 : undefined,
        maxMarks: 100,
        standardsMet: { met: Math.floor(Math.random() * 3) + 8, total: 10 },
        category: folders && folders.length > 1 ? folders[index % folders.length]?.name : undefined,
        quickApprove: statuses.quickApprove,
      }
    })
  }

  // Mock segment images (handwritten answer segments)
  const generateMockSegmentImages = (): SegmentImage[] => {
    return [
      { id: 1, imageUrl: ocrAnswerSheet1, label: "Section A - Q1-10", ocrText: "Q1. The photosynthesis process occurs in the chloroplast of plant cells. During this process, light energy is converted into chemical energy stored in glucose molecules.\n\nQ2. The answer discusses cellular respiration and its role in ATP production through the electron transport chain." },
      { id: 2, imageUrl: ocrAnswerSheet2, label: "Section B - Q11-20", ocrText: "Q11. The mitochondria is known as the powerhouse of the cell because it produces ATP through oxidative phosphorylation.\n\nQ12. DNA replication is a semi-conservative process where each new double helix contains one original strand and one new strand." },
      { id: 3, imageUrl: ocrAnswerSheet3, label: "Section C - Q21-30", ocrText: "Q21. Evolution is driven by natural selection, where organisms with favorable traits are more likely to survive and reproduce.\n\nQ22. The nervous system coordinates body functions through electrical impulses transmitted along neurons." },
    ]
  }

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsFolderUploading(true)

    // Calculate total file size
    const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0)

    setTimeout(() => {
      const firstFilePath = files[0].webkitRelativePath
      const extractedFolderName = firstFilePath ? firstFilePath.split('/')[0] : files[0].name.replace(/\.[^/.]+$/, "")
      
      const candidateNames = new Set<string>()
      Array.from(files).forEach(file => {
        const fileName = file.name.replace(/\.[^/.]+$/, "")
        const namePart = fileName.split('_')[0] || fileName
        if (namePart) candidateNames.add(namePart)
      })

      const centres = ["Delhi Centre", "Mumbai Centre", "Bangalore Centre", "Chennai Centre", "Kolkata Centre"]
      const addresses = [
        "123, Connaught Place, New Delhi - 110001",
        "456, Bandra West, Mumbai - 400050",
        "789, MG Road, Bangalore - 560001",
        "321, Anna Nagar, Chennai - 600040",
        "654, Park Street, Kolkata - 700016"
      ]
      
      const mockCandidates: CandidateData[] = candidateNames.size > 0 
        ? Array.from(candidateNames).slice(0, 125).map((name, index) => {
            const statuses = generateConsistentStatuses()
            return {
              id: `candidate-${index + 1}`,
              candidateName: name,
              registrationName: `REG${String(index + 1).padStart(6, '0')}`,
              centreName: centres[index % centres.length],
              centreAddress: addresses[index % addresses.length],
              phase1: statuses.phase1,
              phase2: statuses.phase2,
              phase3: statuses.phase3,
              segmentData: `Section A: Question 1-10\nSection B: Question 11-20\nSection C: Question 21-30\nTotal Segments: 30\nDetected Boundaries: 28/30`,
              ocrData: `Extracted Text Preview:\n\nQ1. What is the capital of India?\nA) Mumbai B) Delhi C) Chennai D) Kolkata\n\nQ2. Which river is longest in India?\nA) Ganga B) Yamuna C) Godavari D) Brahmaputra\n\nConfidence Score: 94.5%\nCharacter Recognition Rate: 98.2%`,
              segmentImages: generateMockSegmentImages(),
              evaluationData: generateMockEvaluationData(),
              evaluationMarks: statuses.hasEvaluationMarks ? Math.floor(Math.random() * 51) + 50 : undefined,
              maxMarks: 100,
              standardsMet: { met: Math.floor(Math.random() * 3) + 8, total: 10 },
              quickApprove: statuses.quickApprove,
            }
          })
        : Array.from({ length: Math.min(files.length, 125) }, (_, index) => {
            const statuses = generateConsistentStatuses()
            return {
              id: `candidate-${index + 1}`,
              candidateName: `Candidate ${String(index + 1).padStart(3, '0')}`,
              registrationName: `REG${String(index + 1).padStart(6, '0')}`,
              centreName: centres[index % centres.length],
              centreAddress: addresses[index % addresses.length],
              phase1: statuses.phase1,
              phase2: statuses.phase2,
              phase3: statuses.phase3,
              segmentData: `Section A: Question 1-10\nSection B: Question 11-20\nSection C: Question 21-30\nTotal Segments: 30\nDetected Boundaries: 28/30`,
              ocrData: `Extracted Text Preview:\n\nQ1. What is the capital of India?\nA) Mumbai B) Delhi C) Chennai D) Kolkata\n\nQ2. Which river is longest in India?\nA) Ganga B) Yamuna C) Godavari D) Brahmaputra\n\nConfidence Score: 94.5%\nCharacter Recognition Rate: 98.2%`,
              segmentImages: generateMockSegmentImages(),
              evaluationData: generateMockEvaluationData(),
              evaluationMarks: statuses.hasEvaluationMarks ? Math.floor(Math.random() * 51) + 50 : undefined,
              maxMarks: 100,
              standardsMet: { met: Math.floor(Math.random() * 3) + 8, total: 10 },
              quickApprove: statuses.quickApprove,
            }
          })

      // Store pending data and show confirmation dialog
      setPendingUploadData({
        folderName: extractedFolderName,
        fileCount: files.length,
        totalSize: totalSize,
        candidates: mockCandidates
      })
      setIsFolderUploading(false)
      setShowUploadConfirm(true)
    }, 2000)
  }

  const handleZipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsZipUploading(true)

    // Calculate total file size
    const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0)

    setTimeout(() => {
      const extractedFolderName = files[0].name.replace(/\.[^/.]+$/, "")
      
      const candidateNames = new Set<string>()
      Array.from(files).forEach(file => {
        const fileName = file.name.replace(/\.[^/.]+$/, "")
        const namePart = fileName.split('_')[0] || fileName
        if (namePart) candidateNames.add(namePart)
      })

      const centres = ["Delhi Centre", "Mumbai Centre", "Bangalore Centre", "Chennai Centre", "Kolkata Centre"]
      const addresses = [
        "123, Connaught Place, New Delhi - 110001",
        "456, Bandra West, Mumbai - 400050",
        "789, MG Road, Bangalore - 560001",
        "321, Anna Nagar, Chennai - 600040",
        "654, Park Street, Kolkata - 700016"
      ]
      
      const mockCandidates: CandidateData[] = Array.from({ length: Math.min(50, 125) }, (_, index) => {
        const statuses = generateConsistentStatuses()
        return {
          id: `candidate-${index + 1}`,
          candidateName: `Candidate ${String(index + 1).padStart(3, '0')}`,
          registrationName: `REG${String(index + 1).padStart(6, '0')}`,
          centreName: centres[index % centres.length],
          centreAddress: addresses[index % addresses.length],
          phase1: statuses.phase1,
          phase2: statuses.phase2,
          phase3: statuses.phase3,
          segmentData: `Section A: Question 1-10\nSection B: Question 11-20\nSection C: Question 21-30\nTotal Segments: 30\nDetected Boundaries: 28/30`,
          ocrData: `Extracted Text Preview:\n\nQ1. What is the capital of India?\nA) Mumbai B) Delhi C) Chennai D) Kolkata\n\nQ2. Which river is longest in India?\nA) Ganga B) Yamuna C) Godavari D) Brahmaputra\n\nConfidence Score: 94.5%\nCharacter Recognition Rate: 98.2%`,
          segmentImages: generateMockSegmentImages(),
          evaluationData: generateMockEvaluationData(),
          evaluationMarks: statuses.hasEvaluationMarks ? Math.floor(Math.random() * 51) + 50 : undefined,
          maxMarks: 100,
          standardsMet: { met: Math.floor(Math.random() * 3) + 8, total: 10 },
          quickApprove: statuses.quickApprove,
        }
      })

      // Store pending data and show confirmation dialog
      setPendingUploadData({
        folderName: extractedFolderName,
        fileCount: files.length,
        totalSize: totalSize,
        candidates: mockCandidates
      })
      setIsZipUploading(false)
      setShowUploadConfirm(true)
    }, 2000)
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsPdfUploading(true)

    // Calculate total file size
    const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0)

    setTimeout(() => {
      const extractedFolderName = `PDFs_${files.length}_files`
      
      const centres = ["Delhi Centre", "Mumbai Centre", "Bangalore Centre", "Chennai Centre", "Kolkata Centre"]
      const addresses = [
        "123, Connaught Place, New Delhi - 110001",
        "456, Bandra West, Mumbai - 400050",
        "789, MG Road, Bangalore - 560001",
        "321, Anna Nagar, Chennai - 600040",
        "654, Park Street, Kolkata - 700016"
      ]
      
      const mockCandidates: CandidateData[] = Array.from({ length: Math.min(files.length, 125) }, (_, index) => {
        const statuses = generateConsistentStatuses()
        return {
          id: `candidate-${index + 1}`,
          candidateName: `PDF Candidate ${String(index + 1).padStart(3, '0')}`,
          registrationName: `REG${String(index + 1).padStart(6, '0')}`,
          centreName: centres[index % centres.length],
          centreAddress: addresses[index % addresses.length],
          phase1: statuses.phase1,
          phase2: statuses.phase2,
          phase3: statuses.phase3,
          segmentData: `Section A: Question 1-10\nSection B: Question 11-20\nSection C: Question 21-30\nTotal Segments: 30\nDetected Boundaries: 28/30`,
          ocrData: `Extracted Text Preview:\n\nQ1. What is the capital of India?\nA) Mumbai B) Delhi C) Chennai D) Kolkata\n\nQ2. Which river is longest in India?\nA) Ganga B) Yamuna C) Godavari D) Brahmaputra\n\nConfidence Score: 94.5%\nCharacter Recognition Rate: 98.2%`,
          segmentImages: generateMockSegmentImages(),
          evaluationData: generateMockEvaluationData(),
          evaluationMarks: statuses.hasEvaluationMarks ? Math.floor(Math.random() * 51) + 50 : undefined,
          maxMarks: 100,
          standardsMet: { met: Math.floor(Math.random() * 3) + 8, total: 10 },
          quickApprove: statuses.quickApprove,
        }
      })

      // Store pending data and show confirmation dialog
      setPendingUploadData({
        folderName: extractedFolderName,
        fileCount: files.length,
        totalSize: totalSize,
        candidates: mockCandidates
      })
      setIsPdfUploading(false)
      setShowUploadConfirm(true)
    }, 2000)
  }

  const handleUploadConfirm = () => {
    if (pendingUploadData) {
      setFolderName(pendingUploadData.folderName)
      setFileCount(pendingUploadData.fileCount)
      setTotalFileSize(pendingUploadData.totalSize)
      setCandidates(pendingUploadData.candidates)
      setHasUploaded(true)
      setPendingUploadData(null)
      setShowUploadConfirm(false)
      toast.success("Upload confirmed successfully!")
    }
  }

  const handleUploadCancel = () => {
    setPendingUploadData(null)
    setShowUploadConfirm(false)
    toast.info("Upload cancelled")
  }

  // Generate consistent phase statuses - phases must progress sequentially
  const generateConsistentStatuses = (): { phase1: PhaseStatus; phase2: PhaseStatus; phase3: PhaseStatus; hasEvaluationMarks: boolean; quickApprove: boolean } => {
    const random = Math.random()
    
    // 15% - All phases not started
    if (random < 0.15) {
      return { phase1: "yet-to-segmentation", phase2: "yet-to-ocr", phase3: "yet-to-evaluation", hasEvaluationMarks: false, quickApprove: false }
    }
    // 15% - Phase 1 in progress
    if (random < 0.30) {
      return { phase1: "in-progress", phase2: "yet-to-ocr", phase3: "yet-to-evaluation", hasEvaluationMarks: false, quickApprove: false }
    }
    // 15% - Phase 1 completed, Phase 2 not started
    if (random < 0.45) {
      return { phase1: "completed", phase2: "yet-to-ocr", phase3: "yet-to-evaluation", hasEvaluationMarks: false, quickApprove: false }
    }
    // 10% - Phase 1 completed, Phase 2 in progress
    if (random < 0.55) {
      return { phase1: "completed", phase2: "in-progress", phase3: "yet-to-evaluation", hasEvaluationMarks: false, quickApprove: false }
    }
    // 15% - Phase 1 & 2 completed, Phase 3 not started
    if (random < 0.70) {
      return { phase1: "completed", phase2: "completed", phase3: "yet-to-evaluation", hasEvaluationMarks: false, quickApprove: false }
    }
    // 10% - Phase 1 & 2 completed, Phase 3 in progress
    if (random < 0.80) {
      return { phase1: "completed", phase2: "completed", phase3: "in-progress", hasEvaluationMarks: false, quickApprove: false }
    }
    // 10% - All phases completed with evaluation marks
    if (random < 0.90) {
      return { phase1: "completed", phase2: "completed", phase3: "completed", hasEvaluationMarks: true, quickApprove: false }
    }
    // 10% - All phases approved with evaluation marks - auto-enable quickApprove
    return { phase1: "approved", phase2: "approved", phase3: "approved", hasEvaluationMarks: true, quickApprove: true }
  }

  // Helper to check if Quick Approve can be enabled - when both phases are completed or approved
  const canEnableQuickApprove = (candidate: CandidateData): boolean => {
    const phase1Ready = candidate.phase1 === "completed" || candidate.phase1 === "approved"
    const phase2Ready = candidate.phase2 === "completed" || candidate.phase2 === "approved"
    return phase1Ready && phase2Ready
  }

  const handleReuploadConfirm = () => {
    setHasUploaded(false)
    setCandidates([])
    setFolderName("")
    setFileCount(0)
    setTotalFileSize(0)
    setShowReuploadConfirm(false)
    toast.info("Ready to upload a new folder")
  }

  const handleOpenOcrReview = (candidate: CandidateData) => {
    setOcrReviewCandidate(candidate)
    setEditedSegmentData(candidate.segmentData || "")
    setEditedOcrData(candidate.ocrData || "")
    setIsEditing(false)
  }

  const handleOpenPhase1Review = (candidate: CandidateData) => {
    setPhase1ReviewCandidate(candidate)
    const sheets = candidate.answerSheets || generateMockAnswerSheets()
    setAnswerSheets(sheets)
    setFromPageInput("")
    setToPageInput("")
    setActiveAnswerSheetIndex(0) // Reset to first page
    setZoomLevel(100) // Reset zoom
  }

  const handleRepositionPages = () => {
    const fromPage = parseInt(fromPageInput)
    const toPage = parseInt(toPageInput)
    
    if (!fromPage || fromPage < 1 || fromPage > answerSheets.length) {
      toast.error(`Please enter a valid "From" page number (1-${answerSheets.length})`)
      return
    }
    if (!toPage || toPage < 1 || toPage > answerSheets.length) {
      toast.error(`Please enter a valid "To" page number (1-${answerSheets.length})`)
      return
    }
    if (fromPage === toPage) {
      toast.error("From and To page numbers must be different")
      return
    }
    
    const newSheets = [...answerSheets]
    const [removed] = newSheets.splice(fromPage - 1, 1)
    newSheets.splice(toPage - 1, 0, removed)
    
    // Update page numbers
    const updatedSheets = newSheets.map((sheet, idx) => ({
      ...sheet,
      pageNumber: idx + 1
    }))
    
    setAnswerSheets(updatedSheets)
    setFromPageInput("")
    setToPageInput("")
    toast.success(`Page ${fromPage} repositioned to position ${toPage}`)
  }

  const handleReorderPage = (fromIndex: number, toPosition: number) => {
    if (toPosition < 1 || toPosition > answerSheets.length) {
      toast.error(`Invalid position. Please enter a number between 1 and ${answerSheets.length}`)
      return
    }
    
    const newSheets = [...answerSheets]
    const [removed] = newSheets.splice(fromIndex, 1)
    newSheets.splice(toPosition - 1, 0, removed)
    
    // Update page numbers
    const reorderedSheets = newSheets.map((sheet, index) => ({
      ...sheet,
      pageNumber: index + 1
    }))
    
    setAnswerSheets(reorderedSheets)
    toast.success(`Page moved to position ${toPosition}`)
  }

  const handlePhase1Approve = () => {
    if (phase1ReviewCandidate) {
      setCandidates(prev => prev.map(c => {
        if (c.id === phase1ReviewCandidate.id) {
          return {
            ...c,
            phase1: "approved" as any,
            answerSheets: answerSheets
          }
        }
        return c
      }))
      toast.success(`Phase 1 approved for ${phase1ReviewCandidate.candidateName}`)
      setPhase1ReviewCandidate(null)
      setAnswerSheets([])
    }
  }

  const handleUpdate = () => {
    setIsEditing(true)
  }

  const handleSaveEdits = () => {
    if (ocrReviewCandidate) {
      setCandidates(prev => prev.map(c => {
        if (c.id === ocrReviewCandidate.id) {
          return {
            ...c,
            segmentData: editedSegmentData,
            ocrData: editedOcrData
          }
        }
        return c
      }))
      toast.success(`Changes saved for ${ocrReviewCandidate.candidateName}`)
      setIsEditing(false)
    }
  }

  const handleCancelEdits = () => {
    if (ocrReviewCandidate) {
      setEditedSegmentData(ocrReviewCandidate.segmentData || "")
      setEditedOcrData(ocrReviewCandidate.ocrData || "")
    }
    setIsEditing(false)
    toast.info("Changes discarded")
  }

  const handleApprove = () => {
    if (ocrReviewCandidate) {
      setCandidates(prev => prev.map(c => {
        if (c.id === ocrReviewCandidate.id) {
          return {
            ...c,
            phase2: "approved" as any,
            segmentData: editedSegmentData,
            ocrData: editedOcrData
          }
        }
        return c
      }))
      toast.success(`Phase 2 approved for ${ocrReviewCandidate.candidateName}`)
      setOcrReviewCandidate(null)
      setIsEditing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-600 to-teal-700 rounded-lg flex items-center justify-center shrink-0">
              <ScanLine className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-medium text-gray-900">OCR Evaluation</h1>
              <p className="text-xs text-gray-500 hidden sm:block">AI-powered OCR accuracy assessment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Evaluator Display */}
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-teal-50 rounded-full border border-teal-200">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600" />
              <span className="text-xs sm:text-sm font-medium text-teal-700">
                {localStorage.getItem('userName') || 'Evaluator'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-50 rounded-full border border-purple-200">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-500" />
              <span className="text-xs sm:text-sm font-medium text-purple-600">
                4,651 Tokens
              </span>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 px-2 sm:px-3">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {!selectedWorkspace ? (
            <>
              {/* Workspace List Section */}
              <Card className="border border-slate-200 bg-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                        <Layers className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-medium text-slate-800">Workspaces</h2>
                        <p className="text-sm text-slate-500">Select or create a workspace to start evaluation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="h-10 px-3 py-2 text-sm border border-slate-200 rounded-md bg-white focus:border-teal-400 focus:ring-1 focus:ring-teal-200 focus:outline-none min-w-[180px]"
                      >
                        {subjects.map((subject) => (
                          <option key={subject.value} value={subject.value}>
                            {subject.label}
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={() => setShowCreateWorkspaceDialog(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white"
                      >
                        <FolderOpen className="w-4 h-4 mr-2" />
                        Create New Workspace
                      </Button>
                    </div>
                  </div>

                  {/* Workspace Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {workspaces.map((workspace) => (
                      <div
                        key={workspace.id}
                        onClick={() => {
                          setSelectedWorkspace(workspace)
                          setHasUploaded(true)
                          setFolderName(workspace.name)
                          setFileCount(workspace.fileCount)
                          setTotalFileSize(workspace.totalSize)
                          // Generate mock candidates for the workspace
                          const mockCandidates = generateMockCandidates(workspace.candidateCount, workspace.uploadedFolders)
                          setCandidates(mockCandidates)
                        }}
                        className="p-4 border border-slate-200 rounded-lg cursor-pointer hover:border-teal-400 hover:bg-teal-50/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 bg-teal-100 text-teal-600 rounded-lg group-hover:bg-teal-200">
                            <FolderOpen className="h-5 w-5" />
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            workspace.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                            workspace.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {workspace.status.charAt(0).toUpperCase() + workspace.status.slice(1)}
                          </span>
                        </div>
                        <h3 className="font-medium text-slate-800 mb-1 truncate">{workspace.name}</h3>
                        <p className="text-xs text-slate-500 mb-3">Created: {workspace.createdAt}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3.5 w-3.5" />
                            {workspace.fileCount} files
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {workspace.candidateCount} candidates
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {workspaces.length === 0 && (
                    <div className="text-center py-12">
                      <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500">No workspaces yet. Create one to get started.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Workspace Header - Show when workspace is selected */}
              <Card className="border border-slate-200 bg-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col gap-4">
                    {/* Top Row - Back button and dropdowns */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedWorkspace(null)
                            setHasUploaded(false)
                            setCandidates([])
                          }}
                          className="text-slate-600"
                        >
                          <ArrowLeft className="w-4 h-4 mr-1" />
                          Back
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        {/* Subject Dropdown */}
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <span className="px-3 py-2.5 text-xs font-medium text-slate-500 bg-slate-50 border-r border-slate-200 uppercase tracking-wide">Subject</span>
                          <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="h-10 px-3 pr-8 text-sm font-medium text-slate-800 bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer appearance-none min-w-[140px]"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '1rem' }}
                          >
                            {subjects.map((subject) => (
                              <option key={subject.value} value={subject.value}>
                                {subject.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Workspace Dropdown */}
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 overflow-hidden">
                          <span className="px-3 py-2.5 text-xs font-medium text-slate-500 bg-slate-50 border-r border-slate-200 uppercase tracking-wide">Workspace</span>
                          <select
                            value={selectedWorkspace.id}
                            onChange={(e) => {
                              const workspace = workspaces.find(w => w.id === e.target.value)
                              if (workspace) {
                                setSelectedWorkspace(workspace)
                                setFolderName(workspace.name)
                                setFileCount(workspace.fileCount)
                                setTotalFileSize(workspace.totalSize)
                                const mockCandidates = generateMockCandidates(workspace.candidateCount, workspace.uploadedFolders)
                                setCandidates(mockCandidates)
                              }
                            }}
                            className="h-10 px-3 pr-8 text-sm font-medium text-slate-800 bg-transparent border-0 focus:ring-0 focus:outline-none cursor-pointer appearance-none min-w-[160px]"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '1rem' }}
                          >
                            {workspaces.map((workspace) => (
                              <option key={workspace.id} value={workspace.id}>
                                {workspace.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row - File details and Add Missing Files */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
                      {/* File Details */}
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                          <FolderOpen className="h-4 w-4 text-teal-600" />
                          <span className="text-sm font-medium text-slate-700">{selectedWorkspace.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <FileText className="h-4 w-4 text-slate-400" />
                            {selectedWorkspace.fileCount} files
                          </span>
                          <span className="flex items-center gap-1.5">
                            <HardDrive className="h-4 w-4 text-slate-400" />
                            {(selectedWorkspace.totalSize / (1024 * 1024)).toFixed(1)} MB
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Users className="h-4 w-4 text-slate-400" />
                            {selectedWorkspace.candidateCount} candidates
                          </span>
                        </div>
                      </div>

                      {/* Add Missing Files Button */}
                      <div className="relative">
                        <input
                          type="file"
                          id="add-missing-files"
                          multiple
                          accept=".pdf,.zip"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              const newFiles = Array.from(e.target.files)
                              const additionalSize = newFiles.reduce((acc, file) => acc + file.size, 0)
                              const additionalCount = newFiles.length
                              
                              // Update workspace with new files
                              setSelectedWorkspace(prev => prev ? {
                                ...prev,
                                fileCount: prev.fileCount + additionalCount,
                                totalSize: prev.totalSize + additionalSize
                              } : null)
                              
                              // Update workspaces list
                              setWorkspaces(prev => prev.map(w => 
                                w.id === selectedWorkspace.id 
                                  ? { ...w, fileCount: w.fileCount + additionalCount, totalSize: w.totalSize + additionalSize }
                                  : w
                              ))
                              
                              // Show dialog with file info
                              setAddedFilesInfo({ files: newFiles, totalSize: additionalSize })
                              setShowAddedFilesDialog(true)
                              e.target.value = ''
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-dashed border-teal-300 text-teal-600 hover:bg-teal-50 hover:border-teal-400"
                        >
                          <Plus className="w-4 h-4 mr-1.5" />
                          Upload Additional Files
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          {/* Status Count Widgets */}
          {hasUploaded && candidates.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Total Count */}
              <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Users className="h-4 w-4 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="text-sm font-medium text-slate-700">
                    {candidates.length} / {candidates.length}
                  </p>
                </div>
              </div>

              {/* Segmentation Count */}
              <div className="flex items-center gap-3 p-3 bg-white border border-blue-200 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Layers className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Segmentation</p>
                  <p className="text-sm font-medium text-blue-700">
                    {candidates.filter(c => c.phase1 === "completed" || c.phase1 === "approved").length} / {candidates.length}
                  </p>
                </div>
              </div>

              {/* OCR Count */}
              <div className="flex items-center gap-3 p-3 bg-white border border-purple-200 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <ScanLine className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">OCR</p>
                  <p className="text-sm font-medium text-purple-700">
                    {candidates.filter(c => c.phase2 === "completed" || c.phase2 === "approved").length} / {candidates.length}
                  </p>
                </div>
              </div>

              {/* Evaluation Count */}
              <div className="flex items-center gap-3 p-3 bg-white border border-teal-200 rounded-lg">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Evaluation</p>
                  <p className="text-sm font-medium text-teal-700">
                    {candidates.filter(c => c.phase3 === "completed" || c.phase3 === "approved").length} / {candidates.length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Results Table */}
          {hasUploaded && candidates.length > 0 && (
            <Card className="border-2 border-slate-100 bg-white">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-slate-500 text-white rounded-lg shrink-0">
                      <ScanLine className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <h2 className="text-lg sm:text-2xl font-medium text-slate-700">Evaluation Results</h2>
                  </div>
                  
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Input */}
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search by candidate name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 border-slate-200 focus:border-teal-300 focus:ring-teal-200"
                      />
                    </div>
                    
                    {/* Phase Filter */}
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
                      <select
                        value={phaseFilter}
                        onChange={(e) => setPhaseFilter(e.target.value as "all" | "phase1" | "phase2" | "phase3")}
                        className="h-10 px-3 py-2 text-sm border border-slate-200 rounded-md bg-white focus:border-teal-300 focus:ring-1 focus:ring-teal-200 focus:outline-none"
                      >
                        <option value="all">All Phases</option>
                        <option value="phase1">Segmentation Indexing</option>
                        <option value="phase2">OCR</option>
                        <option value="phase3">Evaluation</option>
                      </select>
                    </div>
                    
                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as "all" | PhaseStatus)}
                      className="h-10 px-3 py-2 text-sm border border-slate-200 rounded-md bg-white focus:border-teal-300 focus:ring-1 focus:ring-teal-200 focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      {/* <option value="completed">Completed</option> */}
                      <option value="in-progress">In Progress</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="yet-to-segmentation">Yet to Start</option>
                      {/* <option value="yet-to-ocr">Yet to OCR</option> */}
                      {/* <option value="yet-to-evaluation">Yet to Evaluation</option> */}
                    </select>
                  </div>
                </div>

                {/* Filtered Results */}
                {(() => {
                  const filteredCandidates = candidates.filter(candidate => {
                    // Search filter
                    const matchesSearch = candidate.candidateName.toLowerCase().includes(searchQuery.toLowerCase())
                    
                    // Status filter
                    let matchesStatus = statusFilter === "all"
                    if (!matchesStatus) {
                      if (phaseFilter === "all") {
                        matchesStatus = candidate.phase1 === statusFilter || candidate.phase2 === statusFilter || candidate.phase3 === statusFilter
                      } else if (phaseFilter === "phase1") {
                        matchesStatus = candidate.phase1 === statusFilter
                      } else if (phaseFilter === "phase2") {
                        matchesStatus = candidate.phase2 === statusFilter
                      } else if (phaseFilter === "phase3") {
                        matchesStatus = candidate.phase3 === statusFilter
                      }
                    }
                    
                    return matchesSearch && matchesStatus
                  })

                  // Check if a candidate has Segmentation and OCR phases approved (Evaluation doesn't require approval)
                  const isDownloadReady = (candidate: CandidateData) => 
                    candidate.phase1 === "approved" && 
                    candidate.phase2 === "approved"

                  // Get downloadable candidates (Segmentation and OCR approved)
                  const downloadableCandidates = filteredCandidates.filter(isDownloadReady)
                  
                  // Get selected downloadable candidates
                  const selectedDownloadable = filteredCandidates.filter(
                    c => selectedCandidates.has(c.id) && isDownloadReady(c)
                  )

                  const hasDownloadableSelected = selectedDownloadable.length > 0
                  const hasAnyDownloadable = downloadableCandidates.length > 0

                  // Handle select all
                  const handleSelectAll = (checked: boolean) => {
                    if (checked) {
                      const allIds = new Set(filteredCandidates.map(c => c.id))
                      setSelectedCandidates(allIds)
                    } else {
                      setSelectedCandidates(new Set())
                    }
                  }

                  // Handle individual select
                  const handleSelectCandidate = (id: string, checked: boolean) => {
                    const newSelected = new Set(selectedCandidates)
                    if (checked) {
                      newSelected.add(id)
                    } else {
                      newSelected.delete(id)
                    }
                    setSelectedCandidates(newSelected)
                  }

                  // Handle download - creates and downloads CSV file
                  const handleDownload = (type: "selected" | "all") => {
                    const toDownload = type === "selected" ? selectedDownloadable : downloadableCandidates
                    if (toDownload.length === 0) {
                      toast.error("No approved candidates available for download")
                      return
                    }
                    
                    // Create CSV content
                    const headers = ["Sl No", "Candidate Name", "Registration Name", "Centre Name", "Segmentation Status", "OCR Status", "Evaluation Status", "Evaluation Score", "Max Marks"]
                    const csvRows = [headers.join(",")]
                    
                    toDownload.forEach((candidate, index) => {
                      const row = [
                        index + 1,
                        `"${candidate.candidateName}"`,
                        `"${candidate.registrationName}"`,
                        `"${candidate.centreName}"`,
                        candidate.phase1,
                        candidate.phase2,
                        candidate.phase3,
                        candidate.evaluationMarks ?? "N/A",
                        candidate.maxMarks ?? 100
                      ]
                      csvRows.push(row.join(","))
                    })
                    
                    const csvContent = csvRows.join("\n")
                    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
                    const url = URL.createObjectURL(blob)
                    const link = document.createElement("a")
                    link.setAttribute("href", url)
                    link.setAttribute("download", `evaluation_results_${new Date().toISOString().split('T')[0]}.csv`)
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                    URL.revokeObjectURL(url)
                    
                    toast.success(`Downloaded ${toDownload.length} candidate${toDownload.length > 1 ? 's' : ''} data`)
                  }

                  const allSelected = filteredCandidates.length > 0 && 
                    filteredCandidates.every(c => selectedCandidates.has(c.id))
                  const someSelected = filteredCandidates.some(c => selectedCandidates.has(c.id))

                  return (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-slate-500">
                          Showing {filteredCandidates.length} of {candidates.length} candidates
                          {selectedCandidates.size > 0 && (
                            <span className="ml-2 text-teal-600 font-medium">
                              ({selectedCandidates.size} selected)
                            </span>
                          )}
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={!hasDownloadableSelected && !hasAnyDownloadable}
                              className="gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Download
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border border-slate-200 shadow-lg z-50">
                            <DropdownMenuItem 
                              onClick={() => handleDownload("selected")}
                              disabled={!hasDownloadableSelected}
                              className="gap-2 cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Download Selected ({selectedDownloadable.length})
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDownload("all")}
                              disabled={!hasAnyDownloadable}
                              className="gap-2 cursor-pointer"
                            >
                              <Users className="w-4 h-4" />
                              Download All Approved ({downloadableCandidates.length})
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 -mx-4 sm:mx-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                              <TableHead className="w-10 py-3 sm:py-4">
                                <Checkbox 
                                  checked={allSelected}
                                  onCheckedChange={handleSelectAll}
                                  className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                />
                              </TableHead>
                              <TableHead className="font-medium text-slate-700 py-3 sm:py-4 w-12 sm:w-16 text-xs sm:text-sm text-left">Sl. No</TableHead>
                              <TableHead className="font-medium text-slate-700 py-3 sm:py-4 text-xs sm:text-sm text-left">Candidate Name</TableHead>
                              <TableHead className="font-medium text-slate-700 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap text-left">Segmentation Indexing</TableHead>
                              <TableHead className="font-medium text-slate-700 py-3 sm:py-4 text-xs sm:text-sm text-left">OCR</TableHead>
                              <TableHead className="font-medium text-slate-700 py-3 sm:py-4 text-xs sm:text-sm text-left">Evaluation</TableHead>
                              <TableHead className="font-medium text-slate-700 py-3 sm:py-4 text-xs sm:text-sm text-center whitespace-nowrap">Quick Approve</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredCandidates.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                  No candidates found matching your filters
                                </TableCell>
                              </TableRow>
                            ) : selectedWorkspace?.uploadedFolders && selectedWorkspace.uploadedFolders.length > 1 ? (
                              // Group candidates by category when multiple folders exist
                              (() => {
                                const groupedCandidates = filteredCandidates.reduce((acc, candidate) => {
                                  const category = candidate.category || "Uncategorized"
                                  if (!acc[category]) acc[category] = []
                                  acc[category].push(candidate)
                                  return acc
                                }, {} as Record<string, CandidateData[]>)

                                let globalIndex = 0

                                return Object.entries(groupedCandidates).map(([category, categoryCandidates], catIndex) => {
                                  const isExpanded = expandedCategories.has(category)
                                  const folder = selectedWorkspace.uploadedFolders?.find(f => f.name === category)
                                  const folderIndex = selectedWorkspace.uploadedFolders?.findIndex(f => f.name === category) ?? 0
                                  
                                  const colorClass = folderIndex % 3 === 0 
                                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                    : folderIndex % 3 === 1 
                                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                    : 'bg-blue-50 text-blue-700 border-blue-200'

                                  return (
                                    <>
                                      {/* Category Parent Row */}
                                      <TableRow 
                                        key={`category-${category}`}
                                        className={`border-b border-slate-200 cursor-pointer ${colorClass.split(' ')[0]}`}
                                        onClick={() => {
                                          setExpandedCategories(prev => {
                                            const next = new Set(prev)
                                            if (next.has(category)) {
                                              next.delete(category)
                                            } else {
                                              next.add(category)
                                            }
                                            return next
                                          })
                                        }}
                                      >
                                        <TableCell colSpan={7} className="py-2.5 px-4">
                                          <div className="flex items-center gap-3">
                                            <div className={`p-1 rounded ${isExpanded ? 'bg-slate-200' : 'bg-slate-100'}`}>
                                              {isExpanded ? (
                                                <ChevronDown className="h-4 w-4 text-slate-600" />
                                              ) : (
                                                <ChevronRight className="h-4 w-4 text-slate-600" />
                                              )}
                                            </div>
                                            <div className={`p-1.5 rounded ${
                                              folderIndex % 3 === 0 ? 'bg-amber-100' : 
                                              folderIndex % 3 === 1 ? 'bg-purple-100' : 'bg-blue-100'
                                            }`}>
                                              {folder?.type === 'zip' ? (
                                                <HardDrive className="h-4 w-4" />
                                              ) : (
                                                <FolderOpen className="h-4 w-4" />
                                              )}
                                            </div>
                                            <span className="font-medium text-sm text-slate-800">{category}</span>
                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                              {categoryCandidates.length} candidates
                                            </span>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                      
                                      {/* Child Candidate Rows */}
                                      {isExpanded && categoryCandidates.map((candidate) => {
                                        globalIndex++
                                        return (
                                          <TableRow 
                                            key={candidate.id} 
                                            className={`border-b border-slate-100 last:border-b-0 ${
                                              selectedCandidates.has(candidate.id) ? 'bg-teal-50/50' : ''
                                            }`}
                                          >
                                            <TableCell className="py-3 sm:py-4 pl-6">
                                              <Checkbox 
                                                checked={selectedCandidates.has(candidate.id)}
                                                onCheckedChange={(checked) => handleSelectCandidate(candidate.id, checked as boolean)}
                                                className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                              />
                                            </TableCell>
                                            <TableCell className="text-slate-600 py-3 sm:py-4 text-xs sm:text-sm text-left pl-6">
                                              {globalIndex}
                                            </TableCell>
                                            <TableCell className="py-3 sm:py-4 text-left">
                                              <button
                                                onClick={() => setDetailCandidate(candidate)}
                                                className="font-medium text-teal-700 hover:text-teal-800 hover:underline cursor-pointer text-left text-xs sm:text-sm"
                                              >
                                                {candidate.candidateName}
                                              </button>
                                            </TableCell>
                                            <TableCell className="py-3 sm:py-4 text-left">
                                              <div className="flex items-center gap-2">
                                    <StatusBadge 
                                      status={candidate.phase1}
                                      clickable={candidate.phase1 === "completed" || candidate.phase1 === "approved"}
                                      onClick={() => handleOpenPhase1Review(candidate)}
                                    />
                                                {candidate.phase1 === "completed" && candidate.standardsMet && (
                                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                    {candidate.standardsMet.met}/{candidate.standardsMet.total}
                                                  </span>
                                                )}
                                              </div>
                                            </TableCell>
                                            <TableCell className="py-3 sm:py-4 text-left">
                                    <StatusBadge 
                                      status={candidate.phase2} 
                                      clickable={candidate.phase2 === "completed" || candidate.phase2 === "approved"}
                                      onClick={() => handleOpenOcrReview(candidate)}
                                    />
                                            </TableCell>
                                            <TableCell className="py-3 sm:py-4 text-left">
                                              {candidate.evaluationMarks !== undefined ? (
                                                <button
                                                  onClick={() => setEvaluationReviewCandidate(candidate)}
                                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                                                    (candidate.evaluationMarks / (candidate.maxMarks || 100)) >= 0.6 
                                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                                      : (candidate.evaluationMarks / (candidate.maxMarks || 100)) >= 0.4 
                                                      ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                                                      : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                                  }`}
                                                >
                                                  {candidate.evaluationMarks}/{candidate.maxMarks || 100}
                                                </button>
                                              ) : (
                                                <StatusBadge 
                                                  status={candidate.phase3}
                                                  clickable={candidate.phase3 === "completed"}
                                                  onClick={() => setEvaluationReviewCandidate(candidate)}
                                                />
                                              )}
                                            </TableCell>
                                            <TableCell className="py-3 sm:py-4 text-center">
                                              <Switch
                                                checked={candidate.quickApprove || false}
                                                onCheckedChange={(checked) => {
                                                  setCandidates(prev => prev.map(c => 
                                                    c.id === candidate.id ? { ...c, quickApprove: checked } : c
                                                  ))
                                                }}
                                                disabled={!canEnableQuickApprove(candidate)}
                                                className="data-[state=checked]:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                              />
                                            </TableCell>
                                          </TableRow>
                                        )
                                      })}
                                    </>
                                  )
                                })
                              })()
                            ) : (
                              // Flat list when single folder or no folders
                              filteredCandidates.map((candidate, index) => (
                                <TableRow 
                                  key={candidate.id} 
                                  className={`border-b border-slate-100 last:border-b-0 ${
                                    selectedCandidates.has(candidate.id) ? 'bg-teal-50/50' : ''
                                  }`}
                                >
                                  <TableCell className="py-3 sm:py-4">
                                    <Checkbox 
                                      checked={selectedCandidates.has(candidate.id)}
                                      onCheckedChange={(checked) => handleSelectCandidate(candidate.id, checked as boolean)}
                                      className="data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                                    />
                                  </TableCell>
                                  <TableCell className="text-slate-600 py-3 sm:py-4 text-xs sm:text-sm text-left">
                                    {index + 1}
                                  </TableCell>
                                  <TableCell className="py-3 sm:py-4 text-left">
                                    <button
                                      onClick={() => setDetailCandidate(candidate)}
                                      className="font-medium text-teal-700 hover:text-teal-800 hover:underline cursor-pointer text-left text-xs sm:text-sm"
                                    >
                                      {candidate.candidateName}
                                    </button>
                                  </TableCell>
                                  <TableCell className="py-3 sm:py-4 text-left">
                                    <div className="flex items-center gap-2">
                                    <StatusBadge 
                                      status={candidate.phase1}
                                      clickable={candidate.phase1 === "completed" || candidate.phase1 === "approved"}
                                      onClick={() => handleOpenPhase1Review(candidate)}
                                    />
                                      {candidate.phase1 === "completed" && candidate.standardsMet && (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                          {candidate.standardsMet.met}/{candidate.standardsMet.total}
                                        </span>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="py-3 sm:py-4 text-left">
                                    <StatusBadge 
                                      status={candidate.phase2} 
                                      clickable={candidate.phase2 === "completed" || candidate.phase2 === "approved"}
                                      onClick={() => handleOpenOcrReview(candidate)}
                                    />
                                  </TableCell>
                                  <TableCell className="py-3 sm:py-4 text-left">
                                    {candidate.evaluationMarks !== undefined ? (
                                      <button
                                        onClick={() => setEvaluationReviewCandidate(candidate)}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                                          (candidate.evaluationMarks / (candidate.maxMarks || 100)) >= 0.6 
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                            : (candidate.evaluationMarks / (candidate.maxMarks || 100)) >= 0.4 
                                            ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' 
                                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                                        }`}
                                      >
                                        {candidate.evaluationMarks}/{candidate.maxMarks || 100}
                                      </button>
                                    ) : (
                                      <StatusBadge 
                                        status={candidate.phase3}
                                        clickable={candidate.phase3 === "completed"}
                                        onClick={() => setEvaluationReviewCandidate(candidate)}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell className="py-3 sm:py-4 text-center">
                                    <Switch
                                      checked={candidate.quickApprove || false}
                                      onCheckedChange={(checked) => {
                                        setCandidates(prev => prev.map(c => 
                                          c.id === candidate.id ? { ...c, quickApprove: checked } : c
                                        ))
                                      }}
                                      disabled={!canEnableQuickApprove(candidate)}
                                      className="data-[state=checked]:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          )}
            </>
          )}
        </div>
      </main>

      {/* Create Workspace Dialog */}
      <Dialog open={showCreateWorkspaceDialog} onOpenChange={setShowCreateWorkspaceDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              <FolderOpen className="w-5 h-5 text-teal-600" />
              Create New Workspace
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Enter a workspace name and upload assessment files to get started.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-5">
            {/* Workspace Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Workspace Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="e.g., Broadcast Journalism - Batch 1"
                className="h-10"
              />
            </div>

            {/* File Upload - Unified Dropzone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Upload Files <span className="text-red-500">*</span>
              </label>
              
              {newWorkspaceFiles.length === 0 ? (
                <div
                  className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:border-teal-400 hover:bg-teal-50/30 transition-all cursor-pointer group"
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('border-teal-400', 'bg-teal-50/50')
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-teal-400', 'bg-teal-50/50')
                  }}
                  onDrop={async (e) => {
                    e.preventDefault()
                    e.currentTarget.classList.remove('border-teal-400', 'bg-teal-50/50')
                    
                    const items = e.dataTransfer.items
                    const allFiles: File[] = []
                    
                    // Handle DataTransferItemList for folder support
                    if (items && items.length > 0) {
                      const processEntry = async (entry: FileSystemEntry): Promise<void> => {
                        if (entry.isFile) {
                          const fileEntry = entry as FileSystemFileEntry
                          return new Promise((resolve) => {
                            fileEntry.file((file) => {
                              if (file.name.endsWith('.pdf') || file.name.endsWith('.zip')) {
                                allFiles.push(file)
                              }
                              resolve()
                            })
                          })
                        } else if (entry.isDirectory) {
                          const dirEntry = entry as FileSystemDirectoryEntry
                          const reader = dirEntry.createReader()
                          return new Promise((resolve) => {
                            const readEntries = () => {
                              reader.readEntries(async (entries) => {
                                if (entries.length === 0) {
                                  resolve()
                                } else {
                                  for (const subEntry of entries) {
                                    await processEntry(subEntry)
                                  }
                                  readEntries()
                                }
                              })
                            }
                            readEntries()
                          })
                        }
                      }
                      
                      const promises: Promise<void>[] = []
                      for (let i = 0; i < items.length; i++) {
                        const entry = items[i].webkitGetAsEntry()
                        if (entry) {
                          promises.push(processEntry(entry))
                        }
                      }
                      await Promise.all(promises)
                      
                      if (allFiles.length > 0) {
                        setNewWorkspaceFiles(allFiles)
                        toast.success(`${allFiles.length} file(s) added`)
                      } else {
                        toast.error('No PDF or ZIP files found')
                      }
                    } else {
                      // Fallback for regular file drops
                      const files = e.dataTransfer.files
                      if (files && files.length > 0) {
                        const validFiles = Array.from(files).filter(f => 
                          f.name.endsWith('.pdf') || f.name.endsWith('.zip')
                        )
                        if (validFiles.length > 0) {
                          setNewWorkspaceFiles(validFiles)
                          toast.success(`${validFiles.length} file(s) added`)
                        } else {
                          toast.error('No PDF or ZIP files found')
                        }
                      }
                    }
                  }}
                >
                  {/* Hidden input for PDF/ZIP files */}
                  <input
                    type="file"
                    id="workspace-file-upload"
                    multiple
                    accept=".pdf,.zip"
                    onChange={(e) => {
                      const files = e.target.files
                      if (files && files.length > 0) {
                        setNewWorkspaceFiles(Array.from(files))
                        toast.success(`${files.length} file(s) selected`)
                      }
                    }}
                    className="hidden"
                  />
                  
                  {/* Hidden input for folder upload */}
                  <input
                    type="file"
                    id="workspace-folder-upload"
                    // @ts-ignore - webkitdirectory is not in types but works in browsers
                    webkitdirectory=""
                    directory=""
                    multiple
                    onChange={(e) => {
                      const files = e.target.files
                      if (files && files.length > 0) {
                        const pdfFiles = Array.from(files).filter(f => 
                          f.name.endsWith('.pdf') || f.name.endsWith('.zip')
                        )
                        if (pdfFiles.length > 0) {
                          setNewWorkspaceFiles(pdfFiles)
                          toast.success(`${pdfFiles.length} PDF/ZIP file(s) found in folder`)
                        } else {
                          toast.error('No PDF or ZIP files found in folder')
                        }
                      }
                    }}
                    className="hidden"
                  />
                  
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-100 mb-4 group-hover:bg-teal-200 transition-colors">
                    <Upload className="w-7 h-7 text-teal-600" />
                  </div>
                  
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Drop files or folders here
                  </p>
                  <p className="text-xs text-slate-500 text-center mb-4">
                    Supports PDF files, ZIP archives, or folders containing PDFs
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        document.getElementById('workspace-file-upload')?.click()
                      }}
                      className="h-8 px-3 text-xs bg-white border-teal-400 text-teal-700 hover:bg-teal-500 hover:text-white hover:border-teal-500 hover:shadow-md transition-all duration-200"
                    >
                      <FileText className="w-3.5 h-3.5 mr-1.5" />
                      PDF / ZIP Files
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        document.getElementById('workspace-folder-upload')?.click()
                      }}
                      className="h-8 px-3 text-xs bg-white border-teal-400 text-teal-700 hover:bg-teal-500 hover:text-white hover:border-teal-500 hover:shadow-md transition-all duration-200"
                    >
                      <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
                      Upload Folder
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-teal-50 rounded-xl border border-teal-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-100">
                        <CheckCircle className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-teal-800">
                          {newWorkspaceFiles.length} file(s) selected
                        </p>
                        <p className="text-xs text-teal-600">
                          {(newWorkspaceFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(2)} MB total
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewWorkspaceFiles([])}
                      className="text-teal-600 hover:text-teal-800 hover:bg-teal-100 h-8 px-3"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateWorkspaceDialog(false)
                setNewWorkspaceName("")
                setNewWorkspaceFiles([])
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!newWorkspaceName.trim()) {
                  toast.error("Please enter a workspace name")
                  return
                }
                if (newWorkspaceFiles.length === 0) {
                  toast.error("Please upload files")
                  return
                }
                
                setIsCreatingWorkspace(true)
                
                // Simulate workspace creation
                setTimeout(() => {
                  // Group files into folders based on file type
                  const uploadedFolders: UploadedFolder[] = []
                  const pdfFiles = newWorkspaceFiles.filter(f => f.name.endsWith('.pdf'))
                  const zipFiles = newWorkspaceFiles.filter(f => f.name.endsWith('.zip'))
                  
                  if (pdfFiles.length > 0) {
                    uploadedFolders.push({
                      id: `f-pdf-${Date.now()}`,
                      name: "PDF Files",
                      fileCount: pdfFiles.length,
                      size: pdfFiles.reduce((acc, f) => acc + f.size, 0),
                      type: "pdf",
                      uploadedAt: new Date().toISOString().split('T')[0]
                    })
                  }
                  
                  zipFiles.forEach((file, index) => {
                    uploadedFolders.push({
                      id: `f-zip-${Date.now()}-${index}`,
                      name: file.name,
                      fileCount: Math.floor(Math.random() * 20) + 5, // Simulated file count inside zip
                      size: file.size,
                      type: "zip",
                      uploadedAt: new Date().toISOString().split('T')[0]
                    })
                  })
                  
                  const newWorkspace: Workspace = {
                    id: `ws-${Date.now()}`,
                    name: newWorkspaceName,
                    createdAt: new Date().toISOString().split('T')[0],
                    fileCount: newWorkspaceFiles.length,
                    totalSize: newWorkspaceFiles.reduce((acc, f) => acc + f.size, 0),
                    candidateCount: newWorkspaceFiles.length,
                    status: "active",
                    uploadedFolders: uploadedFolders.length > 0 ? uploadedFolders : undefined
                  }
                  
                  setWorkspaces(prev => [newWorkspace, ...prev])
                  setSelectedWorkspace(newWorkspace)
                  setHasUploaded(true)
                  setFolderName(newWorkspace.name)
                  setFileCount(newWorkspace.fileCount)
                  setTotalFileSize(newWorkspace.totalSize)
                  
                  // Generate mock candidates
                  const mockCandidates = generateMockCandidates(newWorkspace.candidateCount, newWorkspace.uploadedFolders)
                  setCandidates(mockCandidates)
                  
                  setShowCreateWorkspaceDialog(false)
                  setNewWorkspaceName("")
                  setNewWorkspaceFiles([])
                  setIsCreatingWorkspace(false)
                  
                  toast.success(`Workspace "${newWorkspace.name}" created successfully!`)
                }, 1000)
              }}
              disabled={!newWorkspaceName.trim() || newWorkspaceFiles.length === 0 || isCreatingWorkspace}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isCreatingWorkspace ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Workspace"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewCandidate} onOpenChange={() => setPreviewCandidate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ScanLine className="w-5 h-5 text-teal-600" />
              Candidate Preview: {previewCandidate?.candidateName}
            </DialogTitle>
          </DialogHeader>
          
          {previewCandidate && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">Segmentation Indexing</p>
                  <StatusBadge status={previewCandidate.phase1} />
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">OCR</p>
                  <StatusBadge status={previewCandidate.phase2} />
                </div>
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                  <p className="text-sm text-gray-500 mb-2">Evaluation</p>
                  <StatusBadge status={previewCandidate.phase3} />
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-slate-200 bg-white">
                <p className="text-sm text-gray-500 mb-2">OCR Analysis Summary</p>
                <p className="text-sm text-gray-700">
                  Detailed OCR analysis and accuracy metrics for this candidate will be displayed here once processing is complete.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Candidate Detail Dialog */}
      <Dialog open={!!detailCandidate} onOpenChange={() => setDetailCandidate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-teal-700">
              <User className="w-5 h-5" />
              Candidate Details
            </DialogTitle>
          </DialogHeader>
          
          {detailCandidate && (
            <div className="space-y-4 py-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <User className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                    <p className="font-medium text-gray-900">{detailCandidate.candidateName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <FileText className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Registration Name</p>
                    <p className="font-medium text-gray-900">{detailCandidate.registrationName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <Building className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Centre Name</p>
                    <p className="font-medium text-gray-900">{detailCandidate.centreName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <MapPin className="w-5 h-5 text-teal-600 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Centre Address</p>
                    <p className="font-medium text-gray-900">{detailCandidate.centreAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* OCR Review Dialog */}
      <Dialog open={!!ocrReviewCandidate} onOpenChange={() => { setOcrReviewCandidate(null); setIsEditing(false); setOcrActiveQuestionIndex(0); setPhase2VisitedQuestions(new Set([0])); setEditingSegmentId(null); setSegmentOcrTexts({}); }}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] sm:h-[95vh] max-h-[95vh] p-0 overflow-hidden [&>button]:hidden">
          {/* Dialog Header */}
          <div className="flex items-center justify-between gap-2 p-2 sm:p-3 md:p-4 border-b border-slate-200 bg-white shrink-0">
            <DialogTitle className="flex items-center gap-1.5 sm:gap-2 text-slate-800 text-xs sm:text-sm md:text-base min-w-0">
              <ScanLine className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
              <span className="truncate">OCR Review - {ocrReviewCandidate?.candidateName}</span>
            </DialogTitle>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
              {ocrReviewCandidate?.quickApprove && (
                <>
                  {/* Progress Indicator */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                    <span className="text-xs text-slate-600">
                      {phase2VisitedQuestions.size}/{mockQuestionsList.length} reviewed
                    </span>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${(phase2VisitedQuestions.size / mockQuestionsList.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleApprove}
                    size="sm"
                    className="px-2 sm:px-3 md:px-6 h-7 sm:h-8 text-[10px] sm:text-xs md:text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium"
                  >
                    Approve
                  </Button>
                </>
              )}
              <button 
                onClick={() => { 
                  setOcrReviewCandidate(null); 
                  setIsEditing(false); 
                  setOcrActiveQuestionIndex(0); 
                  setPhase2VisitedQuestions(new Set([0])); 
                  setEditingSegmentId(null);
                  setSegmentOcrTexts({});
                }}
                className="p-1 sm:p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          {ocrReviewCandidate && (
            <div className="flex flex-col h-[calc(95vh-52px)] sm:h-[calc(95vh-56px)] md:h-[calc(95vh-64px)] overflow-hidden">
              {/* Mobile/Tablet: Horizontal Question Selector */}
              <div className="md:hidden bg-slate-50 border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-2 px-2 py-2">
                  <span className="text-xs font-medium text-slate-500 shrink-0">Q:</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {mockQuestionsList.map((question, index) => {
                      const isCurrentQuestion = ocrActiveQuestionIndex === index
                      const isPreviousQuestion = index < ocrActiveQuestionIndex
                      const isNextQuestion = index === ocrActiveQuestionIndex + 1
                      const isClickable = isCurrentQuestion || isPreviousQuestion || (isNextQuestion && phase2VisitedQuestions.has(ocrActiveQuestionIndex))
                      
                      return (
                        <button
                          key={question.id}
                          onClick={() => {
                            if (isClickable) {
                              setOcrActiveQuestionIndex(index)
                              setPhase2VisitedQuestions(prev => new Set([...prev, index]))
                            }
                          }}
                          disabled={!isClickable}
                          className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium shrink-0 transition-all ${
                            isCurrentQuestion
                              ? 'bg-teal-600 text-white shadow-sm'
                              : phase2VisitedQuestions.has(index)
                              ? 'bg-teal-500 text-white'
                              : isClickable
                              ? 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          {phase2VisitedQuestions.has(index) && ocrActiveQuestionIndex !== index ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            question.id
                          )}
                        </button>
                      )
                    })}
                  </div>
                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-1 shrink-0 ml-auto">
                    <button
                      onClick={() => {
                        const newIndex = Math.max(0, ocrActiveQuestionIndex - 1)
                        setOcrActiveQuestionIndex(newIndex)
                        setPhase2VisitedQuestions(prev => new Set([...prev, newIndex]))
                      }}
                      disabled={ocrActiveQuestionIndex === 0}
                      className="p-1.5 rounded-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => {
                        const newIndex = Math.min(mockQuestionsList.length - 1, ocrActiveQuestionIndex + 1)
                        // Only allow navigation to next question if current question has been visited
                        if (phase2VisitedQuestions.has(ocrActiveQuestionIndex)) {
                          setOcrActiveQuestionIndex(newIndex)
                          setPhase2VisitedQuestions(prev => new Set([...prev, newIndex]))
                        }
                      }}
                      disabled={ocrActiveQuestionIndex === mockQuestionsList.length - 1 || !phase2VisitedQuestions.has(ocrActiveQuestionIndex)}
                      className="p-1.5 rounded-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 min-h-0">
                {/* Desktop: Left Sidebar Question List */}
                <div className="hidden md:flex w-64 lg:w-72 border-r border-slate-200 bg-slate-50 flex-col shrink-0">
                  <div className="px-3 lg:px-4 py-2.5 lg:py-3 border-b border-slate-200 bg-white shrink-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs lg:text-sm font-medium text-slate-700">Questions</h4>
                      <span className={`text-[10px] lg:text-xs font-medium px-2 py-0.5 rounded-full ${
                        phase2VisitedQuestions.size === mockQuestionsList.length 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {phase2VisitedQuestions.size}/{mockQuestionsList.length}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            phase2VisitedQuestions.size === mockQuestionsList.length ? 'bg-teal-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${(phase2VisitedQuestions.size / mockQuestionsList.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-1.5 lg:p-2 space-y-1">
                      {mockQuestionsList.map((question, index) => {
                        const isCurrentQuestion = ocrActiveQuestionIndex === index
                        const isPreviousQuestion = index < ocrActiveQuestionIndex
                        const isNextQuestion = index === ocrActiveQuestionIndex + 1
                        const isClickable = isCurrentQuestion || isPreviousQuestion || (isNextQuestion && phase2VisitedQuestions.has(ocrActiveQuestionIndex))
                        
                        return (
                          <button
                            key={question.id}
                            onClick={() => {
                              if (isClickable) {
                                setOcrActiveQuestionIndex(index)
                                setPhase2VisitedQuestions(prev => new Set([...prev, index]))
                              }
                            }}
                            disabled={!isClickable}
                            className={`w-full text-left px-2.5 lg:px-3 py-2.5 lg:py-3 rounded-lg transition-all ${
                              isCurrentQuestion
                                ? 'bg-teal-600 text-white shadow-sm'
                                : phase2VisitedQuestions.has(index)
                                ? 'bg-teal-50 text-slate-700 border border-teal-200'
                                : isClickable
                                ? 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                                : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`relative flex items-center justify-center h-5 w-5 lg:h-6 lg:w-6 rounded-full text-[10px] lg:text-xs font-medium shrink-0 ${
                                isCurrentQuestion
                                  ? 'bg-white/20 text-white'
                                  : phase2VisitedQuestions.has(index)
                                  ? 'bg-teal-500 text-white'
                                  : isClickable
                                  ? 'bg-teal-100 text-teal-700'
                                  : 'bg-slate-200 text-slate-400'
                              }`}>
                                {phase2VisitedQuestions.has(index) && ocrActiveQuestionIndex !== index ? (
                                  <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                ) : (
                                  question.id
                                )}
                              </span>
                              <p className={`text-[10px] lg:text-xs leading-relaxed line-clamp-2 ${
                                isCurrentQuestion ? 'text-white/90' : isClickable ? 'text-slate-600' : 'text-slate-400'
                              }`}>
                                {question.text}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Right Content: Active Question Details */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <ScrollArea className="flex-1 bg-slate-50">
                    {/* Active Question Card */}
                    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-teal-50 to-slate-50">
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-xl bg-white border border-teal-100">
                        <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-teal-600 text-white shrink-0">
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium">Q{mockQuestionsList[ocrActiveQuestionIndex]?.id}</span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                          <p className="text-[11px] sm:text-xs md:text-sm text-slate-800 leading-relaxed font-medium">
                            {mockQuestionsList[ocrActiveQuestionIndex]?.text}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600" />
                              Max Score: <span className="font-medium text-teal-700">{mockQuestionsList[ocrActiveQuestionIndex]?.maxScore}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Side-by-side Segment Images with OCR Fields */}
                    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 space-y-4">
                      {(ocrReviewCandidate.segmentImages || generateMockSegmentImages()).map((segment) => {
                        const isEditingThis = editingSegmentId === segment.id
                        const currentOcrText = segmentOcrTexts[segment.id] ?? segment.ocrText
                        
                        return (
                          <div key={segment.id} className="rounded-lg sm:rounded-xl border border-slate-200 bg-white overflow-hidden">
                            {/* Segment Header */}
                            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-700">
                                  <span className="text-xs font-medium">{segment.id}</span>
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-slate-700">{segment.label}</span>
                              </div>
                              {/* Individual Edit/Save/Cancel Buttons - Only show when quickApprove is ON */}
                              {ocrReviewCandidate?.quickApprove && (
                                <div className="flex items-center gap-1.5">
                                  {isEditingThis ? (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setSegmentOcrTexts(prev => ({ ...prev, [segment.id]: editedSegmentOcrText }))
                                          setEditingSegmentId(null)
                                          toast.success(`OCR text for ${segment.label} saved`)
                                        }}
                                        disabled={!editedSegmentOcrText.trim()}
                                        className="h-7 px-2.5 text-xs bg-teal-600 hover:bg-teal-700 text-white disabled:bg-slate-300 disabled:cursor-not-allowed"
                                      >
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                          setEditingSegmentId(null)
                                          setEditedSegmentOcrText("")
                                        }}
                                        className="h-7 px-2.5 text-xs border-slate-300"
                                      >
                                        Cancel
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditingSegmentId(segment.id)
                                        setEditedSegmentOcrText(currentOcrText)
                                      }}
                                      className="h-7 px-2.5 text-xs border-slate-300"
                                    >
                                      <Edit2 className="w-3 h-3 mr-1" />
                                      Update
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            {/* Side-by-side Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                              {/* Left: Segment Image */}
                              <div className="p-3 sm:p-4">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Image className="w-3.5 h-3.5 text-indigo-600" />
                                  <span className="text-xs font-medium text-slate-600">Answer Sheet Segment</span>
                                </div>
                                <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50 cursor-pointer hover:border-teal-300 transition-colors">
                                  <img 
                                    src={segment.imageUrl} 
                                    alt={segment.label}
                                    className="w-full h-48 sm:h-56 md:h-64 object-contain"
                                    onClick={() => setPopupImage({ url: segment.imageUrl, label: segment.label })}
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      target.src = "/placeholder.svg"
                                    }}
                                  />
                                </div>
                              </div>
                              
                              {/* Right: OCR Text */}
                              <div className="p-3 sm:p-4">
                                <div className="flex items-center gap-1.5 mb-2">
                                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                                  <span className="text-xs font-medium text-slate-600">Extracted OCR Text</span>
                                </div>
                                {isEditingThis ? (
                                  <Textarea
                                    value={editedSegmentOcrText}
                                    onChange={(e) => setEditedSegmentOcrText(e.target.value)}
                                    className="min-h-[180px] sm:min-h-[210px] md:min-h-[240px] text-xs sm:text-sm font-mono bg-white border-slate-300 resize-none"
                                    placeholder="Enter extracted text..."
                                  />
                                ) : (
                                  <pre className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200 min-h-[180px] sm:min-h-[210px] md:min-h-[240px] overflow-auto">
                                    {currentOcrText}
                                  </pre>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Popup Dialog */}
      <Dialog open={!!popupImage} onOpenChange={() => setPopupImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden [&>button]:hidden bg-transparent">
          <div className="relative w-full h-full min-h-[400px] bg-transparent flex items-center justify-center">
            <button 
              onClick={() => setPopupImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
            >
              <X className="w-5 h-5 text-slate-700" />
            </button>
            <div className="w-full h-full flex items-center justify-center p-4">
              <img 
                src={popupImage?.url} 
                alt={popupImage?.label}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-slate-800 text-sm font-medium bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                {popupImage?.label}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Phase 1 Answer Sheets Review Dialog */}
      <Dialog open={!!phase1ReviewCandidate} onOpenChange={() => { setPhase1ReviewCandidate(null); setAnswerSheets([]); setActiveQuestionIndex(0); setPhase1VisitedQuestions(new Set([0])); }}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] sm:h-[95vh] max-h-[95vh] p-0 overflow-hidden [&>button]:hidden">
          {/* Dialog Header */}
          <div className="flex items-center justify-between gap-2 p-2 sm:p-3 md:p-4 border-b border-slate-200 bg-white shrink-0">
            <DialogTitle className="flex items-center gap-1.5 sm:gap-2 text-slate-800 text-xs sm:text-sm md:text-base min-w-0">
              <Image className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
              <span className="truncate">Segmentation Indexing - {phase1ReviewCandidate?.candidateName}</span>
            </DialogTitle>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
              {phase1ReviewCandidate?.quickApprove && (
                <>
                  {/* Progress Indicator */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
                    <span className="text-xs text-slate-600">
                      {phase1VisitedQuestions.size}/{mockQuestionsList.length} reviewed
                    </span>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${(phase1VisitedQuestions.size / mockQuestionsList.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handlePhase1Approve}
                    size="sm"
                    className="px-2 sm:px-3 md:px-6 h-7 sm:h-8 text-[10px] sm:text-xs md:text-sm bg-teal-600 hover:bg-teal-700 text-white font-medium"
                  >
                    Approve
                  </Button>
                </>
              )}
              <button 
                onClick={() => { setPhase1ReviewCandidate(null); setAnswerSheets([]); setActiveQuestionIndex(0); setPhase1VisitedQuestions(new Set([0])); }}
                className="p-1 sm:p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          {phase1ReviewCandidate && (
            <div className="flex flex-col h-[calc(95vh-52px)] sm:h-[calc(95vh-56px)] md:h-[calc(95vh-64px)] overflow-hidden">
              {/* Mobile/Tablet: Horizontal Question Selector */}
              <div className="md:hidden bg-slate-50 border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-2 px-2 py-2">
                  <span className="text-xs font-medium text-slate-500 shrink-0">Q:</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {mockQuestionsList.map((question, index) => {
                      const isCurrentQuestion = activeQuestionIndex === index
                      const isPreviousQuestion = index < activeQuestionIndex
                      const isNextQuestion = index === activeQuestionIndex + 1
                      const isClickable = isCurrentQuestion || isPreviousQuestion || (isNextQuestion && phase1VisitedQuestions.has(activeQuestionIndex))
                      
                      return (
                        <button
                          key={question.id}
                          onClick={() => {
                            if (isClickable) {
                              setActiveQuestionIndex(index)
                              setPhase1VisitedQuestions(prev => new Set([...prev, index]))
                            }
                          }}
                          disabled={!isClickable}
                          className={`relative flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium shrink-0 transition-all ${
                            isCurrentQuestion
                              ? 'bg-teal-600 text-white shadow-sm'
                              : phase1VisitedQuestions.has(index)
                              ? 'bg-teal-500 text-white'
                              : isClickable
                              ? 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          {phase1VisitedQuestions.has(index) && activeQuestionIndex !== index ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            question.id
                          )}
                        </button>
                      )
                    })}
                  </div>
                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-1 shrink-0 ml-auto">
                    <button
                      onClick={() => {
                        const newIndex = Math.max(0, activeQuestionIndex - 1)
                        setActiveQuestionIndex(newIndex)
                        setPhase1VisitedQuestions(prev => new Set([...prev, newIndex]))
                      }}
                      disabled={activeQuestionIndex === 0}
                      className="p-1.5 rounded-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => {
                        const newIndex = Math.min(mockQuestionsList.length - 1, activeQuestionIndex + 1)
                        // Only allow navigation to next question if current question has been visited
                        if (phase1VisitedQuestions.has(activeQuestionIndex)) {
                          setActiveQuestionIndex(newIndex)
                          setPhase1VisitedQuestions(prev => new Set([...prev, newIndex]))
                        }
                      }}
                      disabled={activeQuestionIndex === mockQuestionsList.length - 1 || !phase1VisitedQuestions.has(activeQuestionIndex)}
                      className="p-1.5 rounded-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 min-h-0">
                {/* Desktop: Left Sidebar Question List */}
                <div className="hidden md:flex w-64 lg:w-72 border-r border-slate-200 bg-slate-50 flex-col shrink-0">
                  <div className="px-3 lg:px-4 py-2.5 lg:py-3 border-b border-slate-200 bg-white shrink-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs lg:text-sm font-medium text-slate-700">Questions</h4>
                      <span className={`text-[10px] lg:text-xs font-medium px-2 py-0.5 rounded-full ${
                        phase1VisitedQuestions.size === mockQuestionsList.length 
                          ? 'bg-teal-100 text-teal-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {phase1VisitedQuestions.size}/{mockQuestionsList.length}
                      </span>
                    </div>
                    <div className="mt-2">
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            phase1VisitedQuestions.size === mockQuestionsList.length ? 'bg-teal-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${(phase1VisitedQuestions.size / mockQuestionsList.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-1.5 lg:p-2 space-y-1">
                      {mockQuestionsList.map((question, index) => {
                        const isCurrentQuestion = activeQuestionIndex === index
                        const isPreviousQuestion = index < activeQuestionIndex
                        const isNextQuestion = index === activeQuestionIndex + 1
                        const isClickable = isCurrentQuestion || isPreviousQuestion || (isNextQuestion && phase1VisitedQuestions.has(activeQuestionIndex))
                        
                        return (
                          <button
                            key={question.id}
                            onClick={() => {
                              if (isClickable) {
                                setActiveQuestionIndex(index)
                                setPhase1VisitedQuestions(prev => new Set([...prev, index]))
                              }
                            }}
                            disabled={!isClickable}
                            className={`w-full text-left px-2.5 lg:px-3 py-2.5 lg:py-3 rounded-lg transition-all ${
                              isCurrentQuestion
                                ? 'bg-teal-600 text-white shadow-sm'
                                : phase1VisitedQuestions.has(index)
                                ? 'bg-teal-50 text-slate-700 border border-teal-200'
                                : isClickable
                                ? 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                                : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`relative flex items-center justify-center h-5 w-5 lg:h-6 lg:w-6 rounded-full text-[10px] lg:text-xs font-medium shrink-0 ${
                                isCurrentQuestion
                                  ? 'bg-white/20 text-white'
                                  : phase1VisitedQuestions.has(index)
                                  ? 'bg-teal-500 text-white'
                                  : isClickable
                                  ? 'bg-teal-100 text-teal-700'
                                  : 'bg-slate-200 text-slate-400'
                              }`}>
                                {phase1VisitedQuestions.has(index) && activeQuestionIndex !== index ? (
                                  <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                ) : (
                                  question.id
                                )}
                              </span>
                              <p className={`text-[10px] lg:text-xs leading-relaxed line-clamp-2 ${
                                isCurrentQuestion ? 'text-white/90' : isClickable ? 'text-slate-600' : 'text-slate-400'
                              }`}>
                                {question.text}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Right Content: Active Question Details */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  <ScrollArea className="flex-1 bg-slate-50">
                    {/* Header with Candidate Info & Controls */}
                    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-teal-50 to-slate-50">
                      <div className="flex flex-col gap-2 sm:gap-3">
                        {/* Candidate Info Row */}
                        <div className="flex items-center gap-2 sm:gap-3">
                          <h3 className="text-xs sm:text-sm md:text-lg font-medium text-slate-800 truncate">{phase1ReviewCandidate.candidateName}</h3>
                          <span className="text-[10px] sm:text-xs md:text-sm text-slate-500 bg-white/70 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                            {phase1ReviewCandidate.registrationName}
                          </span>
                        </div>
                        {/* Reposition Controls Row - Only show when quickApprove is ON */}
                        {phase1ReviewCandidate?.quickApprove && (
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg border border-slate-200 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5">
                              <span className="text-[10px] sm:text-xs font-medium text-slate-500">From</span>
                              <Input
                                type="number"
                                placeholder="#"
                                value={fromPageInput}
                                onChange={(e) => setFromPageInput(e.target.value)}
                                className="w-8 sm:w-10 md:w-14 h-5 sm:h-6 md:h-7 text-[10px] sm:text-xs md:text-sm border-slate-300 text-center px-1"
                                min={1}
                                max={answerSheets.length}
                              />
                              <span className="text-[10px] sm:text-xs font-medium text-slate-500">To</span>
                              <Input
                                type="number"
                                placeholder="#"
                                value={toPageInput}
                                onChange={(e) => setToPageInput(e.target.value)}
                                className="w-8 sm:w-10 md:w-14 h-5 sm:h-6 md:h-7 text-[10px] sm:text-xs md:text-sm border-slate-300 text-center px-1"
                                min={1}
                                max={answerSheets.length}
                              />
                              <Button
                                onClick={handleRepositionPages}
                                size="sm"
                                className="h-5 sm:h-6 md:h-7 px-1.5 sm:px-2 md:px-3 bg-teal-600 hover:bg-teal-700 text-white text-[10px] sm:text-xs"
                              >
                                Reposition
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Active Question Card */}
                    <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-white">
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-xl bg-gradient-to-r from-teal-50 to-slate-50 border border-teal-100">
                        <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-teal-600 text-white shrink-0">
                          <span className="text-[10px] sm:text-xs md:text-sm font-medium">Q{mockQuestionsList[activeQuestionIndex]?.id}</span>
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
                          <p className="text-[11px] sm:text-xs md:text-sm text-slate-800 leading-relaxed font-medium">
                            {mockQuestionsList[activeQuestionIndex]?.text}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-600" />
                              Max Score: <span className="font-medium text-teal-700">{mockQuestionsList[activeQuestionIndex]?.maxScore}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Answer Sheet Viewer - Single Image Focus with Navigation */}
                    <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex flex-col gap-3 sm:gap-4">
                      {/* Main Image Viewer with Navigation */}
                      <div className="flex-1 rounded-xl border border-slate-200 bg-white overflow-hidden">
                        {/* Header with page info, navigation, and zoom controls */}
                        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4 text-teal-600" />
                            <span className="text-xs sm:text-sm font-medium text-slate-700">
                              Page {activeAnswerSheetIndex + 1} of {answerSheets.length}
                            </span>
                          </div>
                          
                          {/* Center: Zoom Controls */}
                          <div className="flex items-center gap-1 sm:gap-1.5 bg-white rounded-lg border border-slate-200 p-0.5 sm:p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setZoomLevel(prev => Math.max(25, prev - 25))}
                              disabled={zoomLevel <= 25}
                              className="h-6 sm:h-7 w-6 sm:w-7 p-0"
                              title="Zoom out"
                            >
                              <ZoomOut className="w-3.5 h-3.5" />
                            </Button>
                            <span className="text-[10px] sm:text-xs font-medium text-slate-600 w-10 sm:w-12 text-center">
                              {zoomLevel}%
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setZoomLevel(prev => Math.min(300, prev + 25))}
                              disabled={zoomLevel >= 300}
                              className="h-6 sm:h-7 w-6 sm:w-7 p-0"
                              title="Zoom in"
                            >
                              <ZoomIn className="w-3.5 h-3.5" />
                            </Button>
                            <div className="w-px h-4 bg-slate-200 mx-0.5" />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setZoomLevel(100)}
                              className="h-6 sm:h-7 px-1.5 sm:px-2 text-[10px] sm:text-xs"
                              title="Reset zoom"
                            >
                              <Maximize2 className="w-3 h-3 sm:mr-1" />
                              <span className="hidden sm:inline">Fit</span>
                            </Button>
                          </div>

                          {/* Right: Page Navigation */}
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveAnswerSheetIndex(prev => Math.max(0, prev - 1))
                                setZoomLevel(100)
                              }}
                              disabled={activeAnswerSheetIndex === 0}
                              className="h-7 sm:h-8 w-7 sm:w-8 p-0"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setActiveAnswerSheetIndex(prev => Math.min(answerSheets.length - 1, prev + 1))
                                setZoomLevel(100)
                              }}
                              disabled={activeAnswerSheetIndex === answerSheets.length - 1}
                              className="h-7 sm:h-8 w-7 sm:w-8 p-0"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Main Image Area with Zoom */}
                        <div className="relative bg-slate-100 min-h-[350px] sm:min-h-[400px] max-h-[50vh] sm:max-h-[55vh] overflow-auto">
                          <div 
                            className="flex items-center justify-center p-4 min-h-full"
                            style={{ 
                              minWidth: zoomLevel > 100 ? `${zoomLevel}%` : '100%',
                              minHeight: zoomLevel > 100 ? `${zoomLevel}%` : '100%'
                            }}
                          >
                            <div 
                              className="relative bg-white rounded-lg overflow-hidden shadow-md border border-slate-200 transition-transform duration-200"
                              style={{ 
                                transform: `scale(${zoomLevel / 100})`,
                                transformOrigin: 'center center'
                              }}
                            >
                              <img 
                                src={answerSheets[activeAnswerSheetIndex]?.imageUrl} 
                                alt={`Answer sheet page ${activeAnswerSheetIndex + 1}`}
                                className="max-w-full object-contain"
                                style={{ maxHeight: zoomLevel <= 100 ? '50vh' : 'none' }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg"
                                }}
                                draggable={false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Thumbnail Navigation Strip */}
                      <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] sm:text-xs font-medium text-slate-500 shrink-0">Quick Nav:</span>
                        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto py-0.5">
                          {answerSheets.map((sheet, index) => (
                            <button
                              key={sheet.pageNumber}
                              onClick={() => setActiveAnswerSheetIndex(index)}
                              className={`shrink-0 w-10 h-14 sm:w-12 sm:h-16 rounded-md border-2 overflow-hidden transition-all ${
                                index === activeAnswerSheetIndex 
                                  ? 'ring-2 ring-teal-500 ring-offset-1 border-teal-400' 
                                  : 'border-slate-200 opacity-50 hover:opacity-100 hover:border-slate-300'
                              }`}
                            >
                              <img 
                                src={sheet.imageUrl} 
                                alt={`Page ${sheet.pageNumber}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg"
                                }}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Evaluation Review Dialog */}
      <Dialog open={!!evaluationReviewCandidate} onOpenChange={() => { setEvaluationReviewCandidate(null); setEvalActiveQuestionIndex(0); setPhase3VisitedQuestions(new Set([0])); }}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] sm:h-[95vh] max-h-[95vh] p-0 overflow-hidden [&>button]:hidden">
          {/* Dialog Header */}
          <div className="flex items-center justify-between gap-2 p-2 sm:p-3 md:p-4 border-b border-slate-200 bg-white shrink-0">
            <DialogTitle className="flex items-center gap-1.5 sm:gap-2 text-slate-800 text-xs sm:text-sm md:text-base min-w-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
              <span className="truncate">Evaluation Review - {evaluationReviewCandidate?.candidateName}</span>
            </DialogTitle>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4 shrink-0">
              {/* Info Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 sm:h-8 px-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                    <Info className="w-4 h-4" />
                    <span className="hidden sm:inline ml-1 text-xs">Info</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-3">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-slate-800">Evaluation Details</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Model Used:</span>
                        <span className="font-medium text-slate-700">GPT-4 Turbo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Confidence:</span>
                        <span className="font-medium text-emerald-600">92.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Processing Time:</span>
                        <span className="font-medium text-slate-700">1.8s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Rubric Match:</span>
                        <span className="font-medium text-slate-700">High</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Last Updated:</span>
                        <span className="font-medium text-slate-700">{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        Evaluation performed using AI-assisted rubric matching with manual review capability.
                      </p>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* Manual Marking Toggle */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-medium text-slate-600">Manual Marking</span>
                <Switch
                  checked={manualMarkingEnabled}
                  onCheckedChange={setManualMarkingEnabled}
                  className="data-[state=checked]:bg-teal-600"
                />
              </div>
              {/* Total Marks Display */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-xs sm:text-sm font-medium text-amber-700">
                  Total: {mockQuestionsList.reduce((sum, q) => sum + q.maxScore, 0)} marks
                </span>
              </div>
              <Button
                onClick={() => setShowReEvaluationDialog(true)}
                size="sm"
                variant="outline"
                className="px-2 sm:px-3 md:px-6 h-7 sm:h-8 text-[10px] sm:text-xs md:text-sm border-amber-300 bg-amber-50 hover:bg-amber-100 hover:text-amber-700 text-amber-700 font-medium"
              >
                <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="hidden sm:inline">Re-evaluate</span>
              </Button>
              <button 
                onClick={() => { setEvaluationReviewCandidate(null); setEvalActiveQuestionIndex(0); setPhase3VisitedQuestions(new Set([0])); }}
                className="p-1 sm:p-1.5 rounded-md hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
              </button>
            </div>
          </div>
          
          {evaluationReviewCandidate && (
            <div className="flex flex-col h-[calc(95vh-52px)] sm:h-[calc(95vh-56px)] md:h-[calc(95vh-64px)] overflow-hidden">
              {/* Mobile/Tablet: Horizontal Question Selector */}
              <div className="md:hidden bg-slate-50 border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-2 px-2 py-2">
                  <span className="text-xs font-medium text-slate-500 shrink-0">Q:</span>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                    {mockQuestionsList.map((question, index) => {
                      const isCurrentQuestion = evalActiveQuestionIndex === index
                      const isPreviousQuestion = index < evalActiveQuestionIndex
                      const isNextQuestion = index === evalActiveQuestionIndex + 1
                      const isClickable = isCurrentQuestion || isPreviousQuestion || (isNextQuestion && phase3VisitedQuestions.has(evalActiveQuestionIndex))
                      
                      return (
                        <button
                          key={question.id}
                          onClick={() => {
                            if (isClickable) {
                              setEvalActiveQuestionIndex(index)
                              setPhase3VisitedQuestions(prev => new Set([...prev, index]))
                            }
                          }}
                          disabled={!isClickable}
                          className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium shrink-0 transition-all ${
                            isCurrentQuestion
                              ? 'bg-teal-600 text-white shadow-sm'
                              : phase3VisitedQuestions.has(index)
                              ? 'bg-teal-500 text-white'
                              : isClickable
                              ? 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                          }`}
                        >
                          {phase3VisitedQuestions.has(index) && evalActiveQuestionIndex !== index ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            question.id
                          )}
                        </button>
                      )
                    })}
                  </div>
                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-1 shrink-0 ml-auto">
                    <button
                      onClick={() => {
                        const newIndex = Math.max(0, evalActiveQuestionIndex - 1)
                        setEvalActiveQuestionIndex(newIndex)
                        setPhase3VisitedQuestions(prev => new Set([...prev, newIndex]))
                      }}
                      disabled={evalActiveQuestionIndex === 0}
                      className="p-1.5 rounded-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <button
                      onClick={() => {
                        const newIndex = Math.min(mockQuestionsList.length - 1, evalActiveQuestionIndex + 1)
                        // Only allow navigation to next question if current question has been visited
                        if (phase3VisitedQuestions.has(evalActiveQuestionIndex)) {
                          setEvalActiveQuestionIndex(newIndex)
                          setPhase3VisitedQuestions(prev => new Set([...prev, newIndex]))
                        }
                      }}
                      disabled={evalActiveQuestionIndex === mockQuestionsList.length - 1 || !phase3VisitedQuestions.has(evalActiveQuestionIndex)}
                      className="p-1.5 rounded-md hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 min-h-0">
                {/* Desktop: Left Sidebar Question List */}
                <div className="hidden md:flex w-64 lg:w-72 border-r border-slate-200 bg-slate-50 flex-col shrink-0">
                  <div className="px-3 lg:px-4 py-2.5 lg:py-3 border-b border-slate-200 bg-white shrink-0">
                    <h4 className="text-xs lg:text-sm font-medium text-slate-700">Questions</h4>
                    <p className="text-[10px] lg:text-xs text-slate-500 mt-0.5">{mockQuestionsList.length} questions</p>
                    <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 transition-all duration-300" 
                        style={{ width: `${(phase3VisitedQuestions.size / mockQuestionsList.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-1.5 lg:p-2 space-y-1">
                      {mockQuestionsList.map((question, index) => {
                        const isCurrentQuestion = evalActiveQuestionIndex === index
                        const isPreviousQuestion = index < evalActiveQuestionIndex
                        const isNextQuestion = index === evalActiveQuestionIndex + 1
                        const isClickable = isCurrentQuestion || isPreviousQuestion || (isNextQuestion && phase3VisitedQuestions.has(evalActiveQuestionIndex))
                        
                        return (
                          <button
                            key={question.id}
                            onClick={() => {
                              if (isClickable) {
                                setEvalActiveQuestionIndex(index)
                                setPhase3VisitedQuestions(prev => new Set([...prev, index]))
                              }
                            }}
                            disabled={!isClickable}
                            className={`w-full text-left px-2.5 lg:px-3 py-2.5 lg:py-3 rounded-lg transition-all ${
                              isCurrentQuestion
                                ? 'bg-teal-600 text-white shadow-sm'
                                : phase3VisitedQuestions.has(index)
                                ? 'bg-teal-50 text-slate-700 border border-teal-200'
                                : isClickable
                                ? 'bg-white text-slate-700 border border-slate-200 hover:border-teal-300'
                                : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <span className={`relative flex items-center justify-center h-5 w-5 lg:h-6 lg:w-6 rounded-full text-[10px] lg:text-xs font-medium shrink-0 ${
                                isCurrentQuestion
                                  ? 'bg-white/20 text-white'
                                  : phase3VisitedQuestions.has(index)
                                  ? 'bg-teal-500 text-white'
                                  : isClickable
                                  ? 'bg-teal-100 text-teal-700'
                                  : 'bg-slate-200 text-slate-400'
                              }`}>
                                {phase3VisitedQuestions.has(index) && evalActiveQuestionIndex !== index ? (
                                  <Check className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                ) : (
                                  question.id
                                )}
                              </span>
                              <p className={`text-[10px] lg:text-xs leading-relaxed line-clamp-2 ${
                                isCurrentQuestion ? 'text-white/90' : isClickable ? 'text-slate-600' : 'text-slate-400'
                              }`}>
                                {question.text}
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Right Content: Active Question Details */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                  {(() => {
                    const evalData = evaluationReviewCandidate.evaluationData || generateMockEvaluationData()
                    const activeQuestion = mockQuestionsList[evalActiveQuestionIndex]
                    return (
                      <ScrollArea className="flex-1 bg-slate-50">
                        {/* Active Question Card */}
                        <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 bg-gradient-to-r from-teal-50 to-slate-50">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 md:gap-6 p-2.5 sm:p-3 md:p-4 rounded-xl bg-white border border-teal-100">
                            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                              <div className="flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 rounded-full bg-teal-600 text-white shrink-0">
                                <span className="text-[10px] sm:text-xs md:text-sm font-medium">Q{activeQuestion?.id}</span>
                              </div>
                              <div className="space-y-1 flex-1 min-w-0">
                                <p className="text-[11px] sm:text-xs md:text-sm text-slate-800 leading-relaxed font-medium">
                                  {activeQuestion?.text}
                                </p>
                              </div>
                            </div>
                            <div className="shrink-0 sm:text-right">
                              <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Max Score</p>
                              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg bg-teal-50 border border-teal-200">
                                <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-teal-600" />
                                <span className="text-lg sm:text-xl md:text-2xl font-medium text-teal-700">{activeQuestion?.maxScore}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Evaluation Details */}
                        <div className="px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                          {/* Score Banner */}
                          <div className="mb-4 sm:mb-5 md:mb-6 rounded-lg sm:rounded-xl border border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50 overflow-hidden">
                            <div className="px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <Award className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                                <h3 className="text-sm sm:text-base font-medium text-slate-800">Evaluation Score</h3>
                              </div>
                              <div className="flex items-center gap-3 sm:gap-4">
                                <div className="flex items-baseline gap-1.5 sm:gap-2">
                                  <input
                                    type="text"
                                    inputMode="decimal"
                                    value={editedEvalScore || evalData.evaluationScore.toString()}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      // Allow empty, numbers, and single decimal point
                                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                        setEditedEvalScore(val);
                                      }
                                    }}
                                    onFocus={() => {
                                      if (!editedEvalScore) {
                                        setEditedEvalScore(evalData.evaluationScore.toString());
                                      }
                                    }}
                                    disabled={!manualMarkingEnabled}
                                    className={`w-16 sm:w-20 md:w-24 text-3xl sm:text-4xl md:text-5xl font-medium bg-transparent border-b-2 focus:outline-none text-center ${
                                      manualMarkingEnabled 
                                        ? 'text-teal-600 border-teal-300 focus:border-teal-500 cursor-text' 
                                        : 'text-slate-400 border-slate-200 cursor-not-allowed'
                                    }`}
                                  />
                                  <span className="text-lg sm:text-xl text-slate-400">/</span>
                                  <span className="text-xl sm:text-2xl font-medium text-slate-500">{activeQuestion?.maxScore}</span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const value = parseFloat(editedEvalScore);
                                    const maxScore = activeQuestion?.maxScore || 10;
                                    if (!isNaN(value) && value >= 0 && value <= maxScore) {
                                      const roundedValue = Math.round(value * 10) / 10;
                                      setPendingSaveScore(roundedValue);
                                      setShowSaveConfirmDialog(true);
                                    } else {
                                      toast.error(`Please enter a value between 0 and ${maxScore}`);
                                    }
                                  }}
                                  disabled={!editedEvalScore || !manualMarkingEnabled}
                                  className="bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50"
                                >
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Save Confirmation Dialog */}
                          <Dialog open={showSaveConfirmDialog} onOpenChange={setShowSaveConfirmDialog}>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <Award className="w-5 h-5 text-teal-600" />
                                  Confirm Score Update
                                </DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to update the evaluation score to <span className="font-medium text-teal-600">{pendingSaveScore}</span> out of <span className="font-medium">{activeQuestion?.maxScore}</span>?
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="gap-2 sm:gap-0">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowSaveConfirmDialog(false);
                                    setPendingSaveScore(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={() => {
                                    if (pendingSaveScore !== null) {
                                      // Update evaluationReviewCandidate state
                                      setEvaluationReviewCandidate(prev => {
                                        if (!prev || !prev.evaluationData) return prev;
                                        return { 
                                          ...prev, 
                                          evaluationData: { ...prev.evaluationData, evaluationScore: pendingSaveScore }
                                        };
                                      });
                                      // Also update main candidates state to persist the score
                                      setCandidates(prev => prev.map(c => {
                                        if (c.id === evaluationReviewCandidate?.id && c.evaluationData) {
                                          return { 
                                            ...c, 
                                            evaluationData: { ...c.evaluationData, evaluationScore: pendingSaveScore },
                                            evaluationMarks: pendingSaveScore
                                          };
                                        }
                                        return c;
                                      }));
                                      setEditedEvalScore("");
                                      setManualMarkingEnabled(false);
                                      toast.success(`Evaluation score updated to ${pendingSaveScore}`);
                                    }
                                    setShowSaveConfirmDialog(false);
                                    setPendingSaveScore(null);
                                  }}
                                  className="bg-teal-600 hover:bg-teal-700 text-white"
                                >
                                  Confirm
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          {/* Main Content - Single Column */}
                          <div className="space-y-4 sm:space-y-5">
                            {/* Extracted Info */}
                            <div className="rounded-lg sm:rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-indigo-50 border-b border-slate-200 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-indigo-600" />
                                <h3 className="text-xs sm:text-sm font-medium text-slate-800">OCR Data</h3>
                              </div>
                              <div className="p-3 sm:p-4">
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                  {evalData.extractedInfo}
                                </p>
                              </div>
                            </div>

                            {/* Keypoints */}
                            <div className="rounded-lg sm:rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-emerald-50 border-b border-slate-200 flex items-center gap-2">
                                <ListChecks className="w-4 h-4 text-emerald-600" />
                                <h3 className="text-xs sm:text-sm font-medium text-slate-800">Keypoints</h3>
                              </div>
                              <div className="p-3 sm:p-4">
                                <ul className="space-y-2">
                                  {evalData.keypoints.map((point, index) => (
                                    <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Missing Items */}
                            <div className="rounded-lg sm:rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-amber-50 border-b border-slate-200 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600" />
                                <h3 className="text-xs sm:text-sm font-medium text-slate-800">Missing Items</h3>
                              </div>
                              <div className="p-3 sm:p-4">
                                <ul className="space-y-2">
                                  {evalData.missing.map((item, index) => (
                                    <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                                      <X className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Rationale */}
                            <div className="rounded-lg sm:rounded-xl border border-slate-200 bg-white overflow-hidden">
                              <div className="px-3 sm:px-4 py-2.5 sm:py-3 bg-purple-50 border-b border-slate-200 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4 text-purple-600" />
                                <h3 className="text-xs sm:text-sm font-medium text-slate-800">Rationale</h3>
                              </div>
                              <div className="p-3 sm:p-4">
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                  {evalData.rational}
                                </p>
                              </div>
                            </div>

                            {/* Close Button at bottom of scroll content */}
                            <div className="pt-6 pb-2 flex justify-center">
                              <Button
                                onClick={() => {
                                  setEvaluationReviewCandidate(null)
                                  setEvalActiveQuestionIndex(0)
                                  setPhase3VisitedQuestions(new Set([0]))
                                }}
                                variant="outline"
                                className="px-8 border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                              >
                                Close
                              </Button>
                            </div>
                          </div>
                        </div>
                      </ScrollArea>
                    )
                  })()}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Re-upload Confirmation Dialog */}
      <Dialog open={showReuploadConfirm} onOpenChange={setShowReuploadConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              <RotateCcw className="w-5 h-5 text-teal-600" />
              Confirm Cancle
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              Are you sure you want to Cancle? This will clear all current candidate data and evaluation progress.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowReuploadConfirm(false)}
              className="w-full sm:w-auto border-teal-300 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReuploadConfirm}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white"
            >
              Yes, Cancle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Confirmation Dialog */}
      <Dialog open={showUploadConfirm} onOpenChange={setShowUploadConfirm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              Upload Summary
            </DialogTitle>
            <DialogDescription className="text-slate-600 pt-2">
              Please review the upload details before confirming.
            </DialogDescription>
          </DialogHeader>
          
          {pendingUploadData && (
            <div className="py-4 space-y-4">
              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-teal-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-500">Folder Name</p>
                    <p className="font-medium text-slate-800 truncate">{pendingUploadData.folderName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-teal-200">
                  {/* <div className="text-center">
                    <p className="text-xl font-medium text-teal-700">{pendingUploadData.candidates.length}</p>
                    <p className="text-xs text-slate-500">Candidates</p>
                  </div> */}
                  <div className="text-center">
                    <p className="text-xl font-medium text-teal-700">{pendingUploadData.fileCount}</p>
                    <p className="text-xs text-slate-500">Files</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-medium text-teal-700">{formatFileSize(pendingUploadData.totalSize)}</p>
                    <p className="text-xs text-slate-500">Total Size</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Click "OK" to proceed with the evaluation or "Cancel" to discard the upload.
              </p>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleUploadCancel}
              className="w-full sm:w-auto border-teal-300 text-teal-700 hover:bg-teal-50 hover:text-teal-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadConfirm}
              className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white"
            >
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Re-evaluation Dialog */}
      <Dialog open={showReEvaluationDialog} onOpenChange={setShowReEvaluationDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-slate-800">
              <RotateCcw className="w-5 h-5 text-amber-600" />
              Request Re-evaluation
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Provide instructions for how this evaluation should be revised.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">Candidate</p>
              <p className="text-sm font-medium text-slate-700">{evaluationReviewCandidate?.candidateName}</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Re-evaluation Instructions
              </label>
              <Textarea
                value={reEvaluationPrompt}
                onChange={(e) => setReEvaluationPrompt(e.target.value)}
                placeholder="Describe what changes or corrections are needed for this evaluation..."
                className="min-h-[120px] resize-none"
              />
              <p className="text-xs text-slate-400">
                Be specific about which aspects need to be re-evaluated.
              </p>
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowReEvaluationDialog(false)
                setReEvaluationPrompt("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!reEvaluationPrompt.trim()) {
                  toast.error("Please provide re-evaluation instructions")
                  return
                }
                toast.success("Re-evaluation request submitted successfully")
                setShowReEvaluationDialog(false)
                setReEvaluationPrompt("")
                setEvaluationReviewCandidate(null)
                setEvalActiveQuestionIndex(0)
                setPhase3VisitedQuestions(new Set([0]))
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
              disabled={!reEvaluationPrompt.trim()}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Added Files Success Dialog */}
      <Dialog open={showAddedFilesDialog} onOpenChange={setShowAddedFilesDialog}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg mx-auto max-h-[85vh] flex flex-col">
          <DialogHeader className="pb-4 flex-shrink-0">
            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <DialogTitle className="text-center text-lg sm:text-xl">Files Added Successfully</DialogTitle>
            <DialogDescription className="text-center text-slate-500 text-sm">
              Your files have been added to the workspace
            </DialogDescription>
          </DialogHeader>
          
          {addedFilesInfo && (
            <div className="space-y-3 sm:space-y-4 overflow-y-auto flex-1 min-h-0">
              {/* Summary Stats */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-slate-500">Files Added</p>
                    <p className="text-base sm:text-lg font-medium text-slate-800">{addedFilesInfo.files.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-slate-50 rounded-lg sm:rounded-xl">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HardDrive className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-slate-500">Total Size</p>
                    <p className="text-base sm:text-lg font-medium text-slate-800 truncate">{formatFileSize(addedFilesInfo.totalSize)}</p>
                  </div>
                </div>
              </div>

              {/* File List */}
              <div className="border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 border-b border-slate-200">
                  <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">Added Files</span>
                </div>
                <ScrollArea className="max-h-[200px] sm:max-h-[280px]">
                  <div className="divide-y divide-slate-100">
                    {addedFilesInfo.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between px-2 sm:px-3 py-2 sm:py-2.5 gap-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            file.name.endsWith('.pdf') ? 'bg-red-100' : 'bg-amber-100'
                          }`}>
                            {file.name.endsWith('.pdf') ? (
                              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                            ) : (
                              <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                            )}
                          </div>
                          <span className="text-xs sm:text-sm text-slate-700 truncate">{file.name}</span>
                        </div>
                        <span className="text-[10px] sm:text-xs text-slate-400 flex-shrink-0">{formatFileSize(file.size)}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Workspace Info */}
              {selectedWorkspace && (
                <div className="flex items-center justify-between p-2 sm:p-3 bg-teal-50 rounded-lg sm:rounded-xl border border-teal-100 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FolderOpen className="w-4 h-4 text-teal-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-teal-700 truncate">{selectedWorkspace.name}</span>
                  </div>
                  <span className="text-[10px] sm:text-xs text-teal-600 flex-shrink-0">
                    {selectedWorkspace.fileCount} files
                  </span>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter className="mt-4 flex-shrink-0">
            <Button
              onClick={() => {
                setShowAddedFilesDialog(false)
                setAddedFilesInfo(null)
                toast.success("Files integrated into workspace")
              }}
              className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default OCREvaluation
