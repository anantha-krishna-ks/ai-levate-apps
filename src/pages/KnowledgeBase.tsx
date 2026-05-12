import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, FileText, Edit, Eye, MessageSquare, Trash2, ArrowLeft, BookOpen, Plus, Menu, GraduationCap, Library, HelpCircle, ScrollText, RefreshCw, Send, Bot, User, X, Sparkle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { ProfileDropdown } from "@/components/ProfileDropdown";

const knowledgeBases = [
  { id: 1, name: "agex", bookName: "agex", type: "Book Level" },
  { id: 2, name: "imageblank1", bookName: "imageblank", type: "Book Level" },
];

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const sidebarCollapsed = useSidebarCollapsed();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("ACCA");
  const [typeFilter, setTypeFilter] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCreatingStudyLO, setIsCreatingStudyLO] = useState(false);
  const [levelType, setLevelType] = useState<"book" | "study">("book");
  const [selectedBook, setSelectedBook] = useState("");
  const [isViewingGuidelines, setIsViewingGuidelines] = useState(false);
  const [selectedKBForGuidelines, setSelectedKBForGuidelines] = useState<{ id: number; name: string } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editingGuideline, setEditingGuideline] = useState<{ name: string; type: string; subtype?: string } | null>(null);
  const [isChatMode, setIsChatMode] = useState(false);
  const [selectedKBForChat, setSelectedKBForChat] = useState<{ id: number; name: string; bookName: string } | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kbToDelete, setKbToDelete] = useState<{ id: number; name: string; bookName: string } | null>(null);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const handleRefreshGuidelines = async () => {
    setIsRefreshing(true);
    try {
      // TODO: Replace with actual API call to fetch guidelines
      // const { data, error } = await supabase.from('guidelines').select('*');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Guidelines refreshed');
    } catch (error) {
      console.error('Error refreshing guidelines:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    setChatMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    
    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'This is a simulated response. In production, this would query the knowledge base and return relevant information.' 
      }]);
    }, 1000);
    
    setChatInput("");
    // Reset textarea height
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInput(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
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

  const filteredKnowledgeBases = knowledgeBases.filter((kb) =>
    kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kb.bookName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F8FC]">
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
        <header className="sticky top-0 z-50 backdrop-blur-sm bg-card/95 border-b border-border">
          <div className="flex h-16 items-center px-3 sm:px-6 gap-3 sm:gap-4">
            {/* Left: Logo + mobile menu */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <img
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png"
                alt="AI-Levate"
                className="h-8 w-auto"
              />
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden flex-shrink-0"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1" />

            {/* Right: Tokens pill + separator + profile */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="hidden sm:flex items-center gap-1.5 px-3 h-9 rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/30 transition-colors">
                <Sparkle className="h-2 w-2 text-primary fill-primary" />
                <span className="text-xs font-medium text-foreground whitespace-nowrap">932,679</span>
                <span className="text-xs text-muted-foreground">tokens</span>
              </div>

              <Separator orientation="vertical" className="hidden sm:block h-8" />

              <ProfileDropdown />
            </div>
          </div>
        </header>

        {/* Page Title Section */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3">
              {(isCreating || isCreatingStudyLO || isViewingGuidelines || isChatMode) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setIsCreating(false);
                    setIsCreatingStudyLO(false);
                    setIsViewingGuidelines(false);
                    setSelectedKBForGuidelines(null);
                    setIsChatMode(false);
                    setSelectedKBForChat(null);
                  }}
                  className="flex-shrink-0"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              )}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  {isCreating ? "Create New Knowledge Base" : isCreatingStudyLO ? "Create Study LO" : isViewingGuidelines ? "Guideline Data" : isChatMode ? `Knowledge Base: ${selectedKBForChat?.bookName}` : "Knowledge Base System"}
                </h2>
                {isChatMode && selectedKBForChat && (
                  <p className="text-sm text-gray-600">Customer: {selectedCustomer}</p>
                )}
              </div>
            </div>
            {isCreatingStudyLO ? (
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white flex-shrink-0">
                Download Template
              </Button>
            ) : !isCreating && (
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-900 flex-shrink-0">
                <FileText className="w-4 h-4 mr-2" />
                Knowledge Base Manual
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {isChatMode ? (
              /* Chat Interface */
              <div className="flex flex-col h-[calc(100vh-200px)]">
                {/* Chat Messages Area */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200 overflow-y-auto p-6 space-y-6 mb-4">
                  {chatMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium">Start a conversation</p>
                        <p className="text-sm mt-1">Ask questions about your knowledge base documents</p>
                      </div>
                    </div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <div key={index} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.role === 'assistant' && (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className={`max-w-[70%] px-5 py-3.5 rounded-2xl ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-sm' 
                            : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                        }`}>
                          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        </div>
                        {message.role === 'user' && (
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Input Area - Fixed at bottom */}
                <div className="bg-white rounded-2xl border border-gray-200 p-3">
                  <div className="flex flex-col gap-3">
                    <Textarea 
                      placeholder="Ask a question about your documents..."
                      value={chatInput}
                      onChange={handleTextareaChange}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="bg-white border-none focus:ring-0 resize-none min-h-[40px] max-h-[200px] py-2 overflow-y-auto placeholder:text-gray-400"
                      rows={1}
                      style={{ height: 'auto' }}
                    />
                    
                    <div className="flex items-center justify-between gap-3">
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger className="w-40 bg-white border border-gray-300 rounded-lg flex-shrink-0 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="GPT-4o">GPT-4o</SelectItem>
                          <SelectItem value="GPT-4">GPT-4</SelectItem>
                          <SelectItem value="GPT-3.5">GPT-3.5</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        disabled={!chatInput.trim()}
                        className="h-9 w-9 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex-shrink-0"
                      >
                        <Send className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : isViewingGuidelines ? (
              /* Guidelines View */
              <>
                {/* Knowledge Base Info */}
                <Card className="border-2 border-blue-100 bg-blue-50">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Knowledgebase Name:</span> {selectedKBForGuidelines?.name}
                    </p>
                  </CardContent>
                </Card>

                {/* Add New Guideline Card */}
                <Card id="add-guideline-section" className="border-2 border-teal-100 bg-teal-50">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingGuideline ? 'Edit Guideline' : 'Add New Guideline'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900">
                          Guideline Type <span className="text-red-500">*</span>
                        </Label>
                        <Select defaultValue={editingGuideline?.type}>
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Select guideline type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="content">Content</SelectItem>
                            <SelectItem value="validation">Validation</SelectItem>
                            <SelectItem value="generation">Question Generation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900">Guideline Subtype</Label>
                        <Select defaultValue={editingGuideline?.subtype}>
                          <SelectTrigger className="bg-white border-gray-300">
                            <SelectValue placeholder="Select subtype" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="specific">Specific</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-900">
                          Guideline Name <span className="text-red-500">*</span>
                        </Label>
                        <Input 
                          placeholder="Enter guideline name" 
                          className="bg-white border-gray-300"
                          defaultValue={editingGuideline?.name}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900">Guideline to follow</Label>
                      <Textarea 
                        placeholder="Enter guidelines here..." 
                        className="bg-white border-gray-300 min-h-[120px]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-900">
                        Guideline Document (.txt or .pdf, max 5MB)
                      </Label>
                      <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center space-y-3 hover:border-gray-400 transition-colors">
                        <div className="flex justify-center">
                          <div className="p-3 bg-yellow-100 rounded-lg">
                            <FileText className="h-8 w-8 text-yellow-600" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Drag guideline file here or click to select</p>
                          <p className="text-sm text-gray-600 mt-1">.txt or .pdf, max 5MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start gap-3">
                      {editingGuideline && (
                        <Button 
                          variant="outline"
                          onClick={() => setEditingGuideline(null)}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      )}
                      <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                        {editingGuideline ? 'Update Guideline' : 'Upload Guideline'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* All Guidelines Card */}
                <Card className="border-2 border-purple-100 bg-purple-50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">All Guidelines</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={handleRefreshGuidelines}
                        disabled={isRefreshing}
                      >
                        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                      </Button>
                    </div>
                    
                    <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50 border-b-2 border-gray-200 hover:bg-gray-50">
                              <TableHead className="font-medium text-gray-900 py-4">Guideline Name</TableHead>
                              <TableHead className="font-medium text-gray-900 py-4">Guideline Type</TableHead>
                              <TableHead className="font-medium text-gray-900 py-4">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                              <TableCell className="font-medium text-gray-900 py-4">Content</TableCell>
                              <TableCell className="text-gray-700 py-4">Content</TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 hover:bg-blue-100"
                                    onClick={() => {
                                      setEditingGuideline({ name: 'Content', type: 'content' });
                                      document.getElementById('add-guideline-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                  >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-red-100">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                              <TableCell className="font-medium text-gray-900 py-4">CREATE_Validation</TableCell>
                              <TableCell className="text-gray-700 py-4">Validation</TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 hover:bg-blue-100"
                                    onClick={() => {
                                      setEditingGuideline({ name: 'CREATE_Validation', type: 'validation' });
                                      document.getElementById('add-guideline-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                  >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-red-100">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                              <TableCell className="font-medium text-gray-900 py-4">General rule validation</TableCell>
                              <TableCell className="text-gray-700 py-4">Validation</TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 hover:bg-blue-100"
                                    onClick={() => {
                                      setEditingGuideline({ name: 'General rule validation', type: 'validation' });
                                      document.getElementById('add-guideline-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                  >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-red-100">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                            <TableRow className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                              <TableCell className="font-medium text-gray-900 py-4">Multiple Choice Question</TableCell>
                              <TableCell className="text-gray-700 py-4">Question Generation</TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-9 w-9 hover:bg-blue-100"
                                    onClick={() => {
                                      setEditingGuideline({ name: 'Multiple Choice Question', type: 'generation' });
                                      document.getElementById('add-guideline-section')?.scrollIntoView({ behavior: 'smooth' });
                                    }}
                                  >
                                    <Edit className="h-4 w-4 text-blue-600" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-red-100">
                                    <Trash2 className="h-4 w-4 text-red-600" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : isCreatingStudyLO ? (
              /* Create Study LO Form */
              <>
                {/* Select Book Card */}
                <Card className="border-2 border-blue-100 bg-blue-50">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-lg font-medium text-blue-900">Select Book</h3>
                    <Select value={selectedBook} onValueChange={setSelectedBook}>
                      <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20">
                        <SelectValue placeholder="Choose a book" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-50">
                        <SelectItem value="book1">Book 1</SelectItem>
                        <SelectItem value="book2">Book 2</SelectItem>
                        <SelectItem value="book3">Book 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Upload Study LO Documents Card */}
                <Card className="border-2 border-teal-100 bg-teal-50">
                  <CardContent className="p-6 space-y-3">
                    <h3 className="text-lg font-medium text-teal-900">Upload Study LO Documents</h3>
                    <div className="bg-white border-2 border-dashed border-teal-200 rounded-lg p-12 text-center space-y-4 hover:border-teal-300 transition-colors">
                      <div className="flex justify-center">
                        <div className="p-4 bg-yellow-100 rounded-lg">
                          <FileText className="h-10 w-10 text-yellow-600" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-lg">Drag file here or click to select file</p>
                        <p className="text-sm text-gray-600 mt-2">
                          Attach study LO document (CSV), file should not exceed 30mb
                        </p>
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
                        onClick={() => setIsCreatingStudyLO(false)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Create Study LO
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : isCreating ? (
              /* Create Form */
              <>
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
                        <label className="text-sm font-medium text-blue-900">
                          {levelType === "book" ? "Book Name" : "Book"} <span className="text-red-500">*</span>
                        </label>
                        {levelType === "book" ? (
                          <Input 
                            placeholder="Enter Book name" 
                            className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                          />
                        ) : (
                          <Select value={selectedBook} onValueChange={setSelectedBook}>
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
                        <label className="text-sm font-medium text-blue-900">
                          {levelType === "book" ? "Knowledge Base Name" : "Study"} <span className="text-red-500">*</span>
                        </label>
                        {levelType === "book" ? (
                          <Input 
                            placeholder="Enter knowledge base name" 
                            className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                          />
                        ) : (
                          <Select disabled={!selectedBook}>
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
                        <label className="text-sm font-medium text-teal-900">
                          Document Upload <span className="text-red-500">*</span>
                        </label>
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
                          <label className="text-sm font-medium text-teal-900">Cover Image Upload</label>
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
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
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
                        </label>
                        <Select defaultValue="mmr">
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
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
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
                        </label>
                        <Input 
                          type="number" 
                          defaultValue="10" 
                          className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
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
                        </label>
                        <Select defaultValue="1000">
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
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
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
                        </label>
                        <Select defaultValue="20">
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
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
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
                        </label>
                        <Select defaultValue="recursive">
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
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
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
                        </label>
                        <Select defaultValue="faiss">
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
                        <label className="text-sm font-medium text-orange-900 flex items-center gap-1">
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
                        </label>
                        <Select defaultValue="openai">
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
                        onClick={() => setIsCreating(false)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        Create Knowledge Base
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Existing List View */}
          {/* Customer Selection Card */}
          {/* Customer Selection Card */}
          <Card className="border border-gray-200/70 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.10)] rounded-2xl">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 text-gray-700 rounded-lg">
                  <Search className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-gray-500">Customer</span>
                  <h2 className="text-sm font-medium text-gray-900 leading-tight">Active context</h2>
                </div>
              </div>

              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="ACCA">ACCA</SelectItem>
                  <SelectItem value="Customer2">Customer 2</SelectItem>
                  <SelectItem value="Customer3">Customer 3</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Knowledge Bases Card */}
          <Card className="border border-gray-200/70 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.10)] rounded-2xl">
            <CardContent className="p-6 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-200 text-gray-700 rounded-lg">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-medium text-gray-900">Knowledge Bases</h2>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreatingStudyLO(true)}
                    className="px-5 bg-white border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-700 shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Study LO
                  </Button>
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="px-5 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Knowledge Base
                  </Button>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Input
                    placeholder="Search knowledge bases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-200 focus:border-gray-400 focus:ring-gray-400/20"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40 bg-white border-gray-200 focus:border-gray-400 focus:ring-gray-400/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Book Level">Book Level</SelectItem>
                    <SelectItem value="Chapter Level">Chapter Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow className="bg-gray-100 border-b border-gray-300 hover:bg-gray-100">
                        <TableHead className="w-[32%] font-semibold text-gray-800 py-4 text-xs uppercase tracking-wide">Knowledge Base Name</TableHead>
                        <TableHead className="w-[28%] font-semibold text-gray-800 py-4 text-xs uppercase tracking-wide">Book Name</TableHead>
                        <TableHead className="w-[18%] font-semibold text-gray-800 py-4 text-xs uppercase tracking-wide">Type</TableHead>
                        <TableHead className="w-[22%] font-semibold text-gray-800 py-4 text-xs uppercase tracking-wide text-right pr-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredKnowledgeBases.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                            <div className="flex flex-col items-center gap-2">
                              <FileText className="h-12 w-12 text-gray-300" />
                              <p className="font-medium">No knowledge bases found</p>
                              <p className="text-sm">Try adjusting your search or filters</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredKnowledgeBases.map((kb) => (
                          <TableRow key={kb.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                            <TableCell className="font-medium text-gray-900 py-4 truncate">{kb.name}</TableCell>
                            <TableCell className="text-gray-700 py-4 truncate">{kb.bookName}</TableCell>
                            <TableCell className="py-4">
                              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap">
                                {kb.type}
                              </span>
                            </TableCell>
                            <TableCell className="py-4">
                              <div className="flex items-center justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 hover:bg-blue-100 transition-colors"
                                  onClick={() => navigate(`/knowledge-base/edit/${kb.id}`)}
                                >
                                  <Edit className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 hover:bg-purple-100 transition-colors"
                                  onClick={() => {
                                    setSelectedKBForGuidelines({ id: kb.id, name: kb.name });
                                    setIsViewingGuidelines(true);
                                  }}
                                >
                                  <ScrollText className="h-4 w-4 text-purple-600" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 hover:bg-teal-100 transition-colors"
                                  onClick={() => {
                                    setSelectedKBForChat({ id: kb.id, name: kb.name, bookName: kb.bookName });
                                    setIsChatMode(true);
                                    setChatMessages([]);
                                  }}
                                >
                                  <MessageSquare className="h-4 w-4 text-teal-600" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-9 w-9 hover:bg-red-100 transition-colors"
                                  onClick={() => {
                                    setKbToDelete({ id: kb.id, name: kb.name, bookName: kb.bookName });
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-medium text-gray-900">Delete Knowledge Base</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 space-y-3">
              <p>Are you sure you want to delete this knowledge base? This action cannot be undone.</p>
              {kbToDelete && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Knowledge Base:</span>
                    <span className="text-gray-700">{kbToDelete.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Book Name:</span>
                    <span className="text-gray-700">{kbToDelete.bookName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">ID:</span>
                    <span className="text-gray-700">{kbToDelete.id}</span>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                // TODO: Implement delete functionality
                console.log('Deleting knowledge base:', kbToDelete);
                setDeleteDialogOpen(false);
                setKbToDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default KnowledgeBase;
