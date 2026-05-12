import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ArrowLeft, BookOpen, FileText, Search, Menu, HelpCircle, Library, GraduationCap, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { ProfileDropdown } from "@/components/ProfileDropdown";

const EditKnowledgeBase = () => {
  const sidebarCollapsed = useSidebarCollapsed();
  const { id } = useParams();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [levelType, setLevelType] = useState<"book" | "study">("book");
  const [selectedBook, setSelectedBook] = useState("book1");
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // TODO: Fetch knowledge base data by id
  const knowledgeBase = {
    id: id,
    name: "agex",
    bookName: "agex",
    type: "book",
    retrievalStrategy: "mmr",
    rerankingCandidates: 10,
    chunkSize: "1000",
    overlapPercentage: "20",
    chunkingStrategy: "recursive",
    databaseType: "faiss",
    embeddingModel: "openai"
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setDocumentFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const removeDocumentFile = (index: number) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full z-[60] hidden lg:block transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-52"
        }`}
      >
        <AppSidebar />
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AppSidebar
            forceExpanded
            hideToggle
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div
        className={`ml-0 min-h-screen flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-52"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden flex-shrink-0"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white text-xs">✦</span>
                </div>
                <span className="text-xs sm:text-sm text-blue-600 font-medium whitespace-nowrap">4,651</span>
              </div>
              
              <ProfileDropdown />
            </div>
          </div>
        </header>

        {/* Page Title Section */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/knowledge-base")}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Edit Knowledge Base
                </h2>
                <p className="text-sm text-gray-600">ID: {id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Level Type Selection Card */}
            <Card className="border-2 border-purple-100 bg-purple-50">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-purple-800">Select Knowledge Base Type</h3>
                  <p className="text-sm text-purple-600 mt-1">Choose how you want to organize your knowledge base</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Book Level Option */}
                  <button
                    onClick={() => setLevelType("book")}
                    className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                      levelType === "book"
                        ? "border-purple-600 bg-white shadow-md"
                        : "border-purple-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        levelType === "book"
                          ? "bg-purple-600 text-white"
                          : "bg-purple-100 text-purple-600"
                      }`}>
                        <Library className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium transition-colors ${
                          levelType === "book" ? "text-purple-900" : "text-gray-900"
                        }`}>
                          Book Level
                        </h4>
                      </div>
                      {levelType === "book" && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Study Level Option */}
                  <button
                    onClick={() => setLevelType("study")}
                    className={`relative p-3 rounded-lg border-2 text-left transition-all ${
                      levelType === "study"
                        ? "border-purple-600 bg-white shadow-md"
                        : "border-purple-200 bg-white hover:border-purple-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${
                        levelType === "study"
                          ? "bg-purple-600 text-white"
                          : "bg-purple-100 text-purple-600"
                      }`}>
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium transition-colors ${
                          levelType === "study" ? "text-purple-900" : "text-gray-900"
                        }`}>
                          Study Level
                        </h4>
                      </div>
                      {levelType === "study" && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information Card */}
            <Card className="border-2 border-blue-100 bg-blue-50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-600 text-white rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium text-blue-800">Basic Information</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-blue-900">
                      {levelType === "book" ? "Book Name" : "Book"} <span className="text-red-500">*</span>
                    </Label>
                    {levelType === "book" ? (
                      <Input 
                        placeholder="Enter Book name" 
                        defaultValue={knowledgeBase.bookName}
                        className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    ) : (
                      <Select value={selectedBook} onValueChange={setSelectedBook} defaultValue={knowledgeBase.bookName}>
                        <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20">
                          <SelectValue placeholder="Select a book" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="book1">Book 1</SelectItem>
                          <SelectItem value="book2">Book 2</SelectItem>
                          <SelectItem value="book3">Book 3</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-blue-900">
                      {levelType === "book" ? "Knowledge Base Name" : "Study"} <span className="text-red-500">*</span>
                    </Label>
                    {levelType === "book" ? (
                      <Input 
                        placeholder="Enter knowledge base name" 
                        defaultValue={knowledgeBase.name}
                        className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    ) : (
                      <Select disabled={!selectedBook} defaultValue={knowledgeBase.name}>
                        <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20 disabled:opacity-50 disabled:cursor-not-allowed">
                          <SelectValue placeholder="Select a study" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="study1">Study 1</SelectItem>
                          <SelectItem value="study2">Study 2</SelectItem>
                          <SelectItem value="study3">Study 3</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Section Card */}
            <Card className="border-2 border-teal-100 bg-teal-50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-teal-600 text-white rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium text-teal-800">File Uploads</h3>
                </div>
                
                <div className={`grid ${levelType === "book" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-6`}>
                  <div className="space-y-2 flex-1">
                    <Label className="text-sm font-medium text-teal-900">
                      Document Upload <span className="text-red-500">*</span>
                    </Label>
                    <label className="block bg-white border-2 border-dashed border-teal-200 rounded-lg p-8 text-center space-y-3 hover:border-teal-300 transition-colors cursor-pointer h-[200px] flex flex-col items-center justify-center">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.docx,.txt,.html,.csv,.json"
                        onChange={handleDocumentUpload}
                        className="hidden"
                      />
                      <div className="flex justify-center">
                        <div className="p-3 bg-teal-100 rounded-lg">
                          <FileText className="h-8 w-8 text-teal-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Drag files here or click to select files</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Upload PDF, DOCX, TXT, HTML, CSV, or JSON files up to 30 MB.
                        </p>
                      </div>
                    </label>
                    
                    {documentFiles.length > 0 && (
                      <div className="bg-white border border-teal-200 rounded-lg p-4 space-y-2">
                        <p className="text-sm font-medium text-gray-900 mb-2">{documentFiles.length} file(s) uploaded:</p>
                        {documentFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-teal-50 px-3 py-2 rounded">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <FileText className="h-4 w-4 text-teal-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate">{file.name}</span>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDocumentFile(index)}
                              className="h-7 w-7 flex-shrink-0 hover:bg-red-100 ml-2"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {levelType === "book" && (
                    <div className="space-y-2 flex-1">
                      <Label className="text-sm font-medium text-teal-900">Cover Image Upload</Label>
                      <label className="block bg-white border-2 border-dashed border-teal-200 rounded-lg p-8 text-center space-y-3 hover:border-teal-300 transition-colors cursor-pointer h-[200px] flex flex-col items-center justify-center">
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/gif,image/webp"
                          onChange={handleCoverImageUpload}
                          className="hidden"
                        />
                        <div className="flex justify-center">
                          <div className="p-3 bg-teal-100 rounded-lg">
                            <FileText className="h-8 w-8 text-teal-600" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Drag images here or click to select images</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Recommended: 800x400px (2:1 ratio) • PNG, JPEG, GIF, WEBP • Max 10 MB
                          </p>
                        </div>
                      </label>
                      
                      {coverImage && (
                        <div className="bg-white border border-teal-200 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-900 mb-2">Uploaded image:</p>
                          <div className="flex items-center justify-between bg-teal-50 px-3 py-2 rounded">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <FileText className="h-4 w-4 text-teal-600 flex-shrink-0" />
                              <span className="text-sm text-gray-700 truncate">{coverImage.name}</span>
                              <span className="text-xs text-gray-500 flex-shrink-0">
                                ({(coverImage.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={removeCoverImage}
                              className="h-7 w-7 flex-shrink-0 hover:bg-red-100 ml-2"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Processing Settings Card */}
            <Card className="border-2 border-orange-100 bg-orange-50">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-600 text-white rounded-lg">
                    <Search className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-medium text-orange-800">Processing Settings</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                      Retrieval Strategy
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                            <p className="text-sm leading-relaxed">Retrieval Strategy decides how search results are ranked and selected</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select defaultValue={knowledgeBase.retrievalStrategy}>
                      <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="mmr">Maximal Marginal Relevance (MMR)</SelectItem>
                        <SelectItem value="similarity">Similarity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                      Number of Reranking Candidates (k)
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                            <p className="text-sm leading-relaxed">Defines how many of the initially retrieved results are considered during reranking. Smaller k is faster but may miss relevant documents, larger k is more thorough but slower.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Input 
                      type="number" 
                      defaultValue={knowledgeBase.rerankingCandidates}
                      className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                      Chunk Size
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                            <p className="text-sm leading-relaxed">Defines how large each text segment is when splitting documents for retrieval. Smaller chunks give more precise matches but less context, larger chunks preserve more context but may include irrelevant material.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select defaultValue={knowledgeBase.chunkSize}>
                      <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="500">500 tokens (Smaller chunks)</SelectItem>
                        <SelectItem value="1000">1000 tokens (Larger chunks, more context)</SelectItem>
                        <SelectItem value="1500">1500 tokens (Maximum context)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                      Overlap Percentage
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                            <p className="text-sm leading-relaxed">Defines how much consecutive text chunks overlap when splitting documents. Higher overlap preserves more context across chunks but increases redundancy and processing cost.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select defaultValue={knowledgeBase.overlapPercentage}>
                      <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="10">10% (Less overlap)</SelectItem>
                        <SelectItem value="20">20% (More context between chunks)</SelectItem>
                        <SelectItem value="30">30% (Maximum overlap)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                      Chunking Strategy
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                            <p className="text-sm leading-relaxed">Controls how documents are split into smaller parts for retrieval. Affects accuracy, context, and speed.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select defaultValue={knowledgeBase.chunkingStrategy}>
                      <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="recursive">Recursive Character</SelectItem>
                        <SelectItem value="sentence">Sentence-based</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                      Database Type
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                            <p className="text-sm leading-relaxed">Defines how data is stored for retrieval, impacting speed, scalability, and accuracy.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select defaultValue={knowledgeBase.databaseType}>
                      <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="faiss">Faiss</SelectItem>
                        <SelectItem value="chroma">Chroma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-orange-900 flex items-center gap-1">
                      Embedding Model
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs bg-gray-800 text-white border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                            <p className="text-sm leading-relaxed">Converts text into vectors for similarity search</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select defaultValue={knowledgeBase.embeddingModel}>
                      <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="huggingface">HuggingFace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons Card */}
            <Card className="border-2 border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/knowledge-base")}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Update Knowledge Base
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditKnowledgeBase;
