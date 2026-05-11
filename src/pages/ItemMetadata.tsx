import { useState } from "react"
import { Link } from "react-router-dom"
import { 
  ArrowLeft, 
  Download, 
  Upload, 
  Filter,
  FileText,
  Database,
  CheckCircle,
  Sparkles,
  BarChart3,
  Target,
  Trash2,
  Eye,
  Settings,
  Plus,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"

const ItemMetadata = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [customMetadataList, setCustomMetadataList] = useState<string[]>(["", "", ""])
  const [showResults, setShowResults] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const metadataOptions = [
    "Select metadata",
    "Grade Level",
    "Topic", 
    "Learning Objective",
    "Bloom's Taxonomy Level",
    "Competency",
    "Misconception",
    "Marks"
  ]

  // Filter out selected values from other dropdowns
  const getAvailableOptions = (currentIndex: number) => {
    const selectedValues = customMetadataList.filter((_, index) => index !== currentIndex)
    return metadataOptions.filter(option => 
      option === "Select metadata" || !selectedValues.includes(option)
    )
  }

  const addMetadataField = () => {
    if (customMetadataList.length < 5) {
      setCustomMetadataList([...customMetadataList, ""])
    }
  }

  const removeMetadataField = (index: number) => {
    if (customMetadataList.length > 3) {
      const newList = customMetadataList.filter((_, i) => i !== index)
      setCustomMetadataList(newList)
    }
  }

  const updateMetadataField = (index: number, value: string) => {
    const newList = [...customMetadataList]
    newList[index] = value
    setCustomMetadataList(newList)
  }

  const validateFile = (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File Format",
        description: "Please upload .xlsx, .xls, or .csv files only",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && validateFile(file)) {
      setUploadedFile(file)
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and validated.`
      })
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file && validateFile(file)) {
      setUploadedFile(file)
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and validated.`
      })
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    const fileInput = document.getElementById('file-upload') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
    toast({
      title: "File Removed",
      description: "File has been removed successfully"
    })
  }

  const handleDownloadTemplate = () => {
    // Create a simple CSV template
    const template = "Question,Answer,Grade,Topic\n\"Sample Question\",\"Sample Answer\",\"Grade 5\",\"Mathematics\""
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'item-metadata-template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    
    toast({
      title: "Template downloaded",
      description: "Please fill in your item details and upload the completed file."
    })
  }

  const handleFilterAndGenerate = () => {
    if (!uploadedFile) {
      toast({
        title: "No file uploaded",
        description: "Please upload a completed template file first.",
        variant: "destructive"
      })
      return
    }

    const hasEmptyMetadata = customMetadataList.some(metadata => 
      !metadata || metadata === "Select metadata"
    )
    
    if (hasEmptyMetadata) {
      toast({
        title: "Missing metadata selection",
        description: "Please select all metadata types.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false)
      setShowResults(true)
      toast({
        title: "Analysis complete",
        description: "Metadata has been generated successfully."
      })
    }, 2500)
  }

  // Sample results data
  const resultsData = [
    {
      id: 1,
      question: "What is the sum of 5 + 3?",
      ...customMetadataList.reduce((acc, metadata, index) => {
        acc[`metadata${index + 1}`] = metadata === "Grade Level" ? "Grade 3" : "Basic Addition"
        return acc
      }, {} as Record<string, string>)
    },
    {
      id: 2,
      question: "Identify the noun in this sentence: 'The dog runs fast.'",
      ...customMetadataList.reduce((acc, metadata, index) => {
        acc[`metadata${index + 1}`] = metadata === "Grade Level" ? "Grade 4" : "Grammar"
        return acc
      }, {} as Record<string, string>)
    },
    {
      id: 3,
      question: "What is the capital of France?",
      ...customMetadataList.reduce((acc, metadata, index) => {
        acc[`metadata${index + 1}`] = metadata === "Grade Level" ? "Grade 5" : "Geography"
        return acc
      }, {} as Record<string, string>)
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-lg">IM</span>
            </div>
            <div>
              <h1 className="text-xl font-medium text-gray-900">Item Metadata</h1>
              <p className="text-sm text-gray-500">AI-Powered Metadata Extraction</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">2,847 Tokens</span>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="hover:bg-gray-200 hover:text-gray-900 bg-transparent text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Step 1: Download Template */}
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-800">
                <div className="p-2 bg-blue-600 text-white rounded-lg">
                  <Download className="h-5 w-5" />
                </div>
                Step 1: Download Standard Template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                Download our standard template to ensure your data is formatted correctly for optimal metadata generation.
              </p>
              <Button 
                onClick={handleDownloadTemplate} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template (.CSV)
              </Button>
            </CardContent>
          </Card>

          {/* Step 2: Upload File */}
          <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-green-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-800">
                <div className="p-2 bg-green-600 text-white rounded-lg">
                  <Upload className="h-5 w-5" />
                </div>
                Step 2: Upload Your Completed File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 mb-4">
                Upload your completed template with item details. Supported formats: .CSV, .XLSX, .XLS
              </p>
              
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                  isDragOver 
                    ? 'border-green-400 bg-green-50' 
                    : uploadedFile 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-gray-300 hover:border-green-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {uploadedFile ? (
                  <div className="space-y-4">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-green-800">{uploadedFile.name}</p>
                      <p className="text-sm text-green-600">File uploaded successfully</p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <Button 
                        onClick={handleRemoveFile}
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove File
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drag and drop your file here, or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports .CSV, .XLSX, .XLS files up to 10MB
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="file-upload" className="sr-only">Upload file</Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileUpload}
                        className="max-w-xs mx-auto cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Configure Metadata */}
          {uploadedFile && (
            <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-800">
                  <div className="p-2 bg-purple-600 text-white rounded-lg">
                    <Settings className="h-5 w-5" />
                  </div>
                  Step 3: Configure Metadata Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-purple-800">Custom Metadata Fields</h3>
                    <Button
                      onClick={addMetadataField}
                      disabled={customMetadataList.length >= 5}
                      variant="outline"
                      size="sm"
                      className="border-purple-200 text-purple-700 hover:bg-purple-100 hover:border-purple-300 hover:text-purple-800 bg-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field ({customMetadataList.length}/5)
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {customMetadataList.map((metadata, index) => (
                      <div key={index} className="flex items-end gap-3">
                        <div className="flex-1">
                          <Label className="text-sm font-medium text-purple-800">
                            Custom Metadata {index + 1} <span className="text-red-500">*</span>
                          </Label>
                          <Select 
                            value={metadata} 
                            onValueChange={(value) => updateMetadataField(index, value)}
                          >
                            <SelectTrigger className="bg-white border-purple-200">
                              <SelectValue placeholder="Select metadata" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableOptions(index).map((option) => (
                                <SelectItem key={option} value={option} disabled={option === "Select metadata"}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {customMetadataList.length > 3 && (
                          <Button
                            onClick={() => removeMetadataField(index)}
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {isProcessing ? (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="animate-spin">
                          <Sparkles className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-blue-800">Processing your items...</p>
                          <p className="text-sm text-blue-600">AI is analyzing and generating metadata</p>
                          <Progress value={75} className="w-full mt-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Button 
                    onClick={handleFilterAndGenerate} 
                    size="lg" 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={customMetadataList.some(metadata => 
                      !metadata || metadata === "Select metadata"
                    )}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Generate Metadata Analysis
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Results */}
          {showResults && (
            <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-orange-800">
                    <div className="p-2 bg-orange-600 text-white rounded-lg">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    Generated Metadata Results
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-orange-200 hover:bg-orange-100">
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white rounded-lg border border-orange-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-orange-100">
                        <TableHead className="w-16 font-medium">Sl. No.</TableHead>
                        <TableHead className="font-medium">Question</TableHead>
                         {customMetadataList.map((metadata, index) => (
                           <TableHead key={index} className="font-medium">
                             {metadata || `Metadata ${index + 1}`}
                           </TableHead>
                         ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultsData.map((item) => (
                        <TableRow key={item.id} className="hover:bg-orange-50">
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell className="max-w-md text-sm">{item.question}</TableCell>
                           {customMetadataList.map((_, index) => (
                             <TableCell key={index}>
                               <Badge 
                                 variant="secondary" 
                                 className={`${
                                   index === 0 ? 'bg-blue-100 text-blue-800' :
                                   index === 1 ? 'bg-green-100 text-green-800' :
                                   index === 2 ? 'bg-purple-100 text-purple-800' :
                                   index === 3 ? 'bg-orange-100 text-orange-800' :
                                   'bg-gray-100 text-gray-800'
                                 }`}
                               >
                                 {(item as any)[`metadata${index + 1}`]}
                               </Badge>
                             </TableCell>
                           ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default ItemMetadata