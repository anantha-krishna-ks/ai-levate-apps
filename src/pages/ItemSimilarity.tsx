import { useState } from "react";
import { ArrowLeft, Upload, Download, FileText, Scan, Trash2, Clock, BarChart3, Target, AlertTriangle, Eye, Search, Filter , Sparkle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface SimilarItem {
  id: string;
  question: string;
  similarity: number;
  type: string;
  status: 'similar' | 'enemy';
}

interface QuestionItem {
  id: string;
  sequenceNumber: number;
  question: string;
  type: string;
  options?: string[];
  correctAnswer?: string;
}

interface QuestionSet {
  id: string;
  name: string;
  itemCount: number;
}

const ItemSimilarity = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [similarItems, setSimilarItems] = useState<SimilarItem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedQuestionSet, setSelectedQuestionSet] = useState<string>("");
  const [scoreThreshold, setScoreThreshold] = useState<number>(80);
  const [questionItems, setQuestionItems] = useState<QuestionItem[]>([]);
  const [enemyItems, setEnemyItems] = useState<SimilarItem[]>([]);

  // Mock data
  // Mock questions for each set
  const getQuestionsForSet = (setId: string) => {
    const baseQuestions = [
      { id: "q1", question: "Which functional group is present in an alcohol molecule?", type: "MCQ", options: ["Hydroxyl (-OH)", "Carboxyl (-COOH)", "Amino (-NH2)", "Carbonyl (C=O)"], correctAnswer: "Hydroxyl (-OH)" },
      { id: "q2", question: "What is the general formula of an alkane?", type: "MCQ", options: ["CnH2n+2", "CnH2n", "CnH2n-2", "CnHn"], correctAnswer: "CnH2n+2" },
      { id: "q3", question: "Explain the mechanism of electrophilic addition.", type: "Descriptive" },
      { id: "q4", question: "Calculate the molarity of the solution.", type: "Numerical" },
      { id: "q5", question: "Identify the product of the following reaction.", type: "MCQ", options: ["Product A", "Product B", "Product C", "Product D"], correctAnswer: "Product A" }
    ];
    return baseQuestions.map((q, index) => ({ ...q, id: `${setId}_${q.id}`, sequenceNumber: index + 1 }));
  };

  const questionSets: QuestionSet[] = [
    { id: "1", name: "Question Set 1", itemCount: 45 },
    { id: "2", name: "Question Set 2", itemCount: 32 },
    { id: "3", name: "Question Set 3", itemCount: 28 },
  ];

  const stats = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Similar Items Found",
      total: "23",
      subtitle: "Total Matches",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-blue-600",
      textColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Enemy Items",
      total: "5",
      subtitle: "Marked as Enemy",
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      iconBg: "bg-red-600",
      textColor: "text-red-600",
      borderColor: "border-red-200"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Avg Similarity",
      total: "84.2%",
      subtitle: "Match Quality",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconBg: "bg-green-600",
      textColor: "text-green-600",
      borderColor: "border-green-200"
    }
  ];

  const validateFile = (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid File Format",
        description: "Please upload only .xlsx files",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setSimilarItems([]);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    toast({
      title: "File Removed",
      description: "File has been removed successfully",
    });
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;
    setUploadedFile(file);
    toast({
      title: "File Uploaded Successfully",
      description: "Ready to analyze for similar items",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const xlsxFile = files.find(file => 
      file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    );
    
    if (xlsxFile) {
      processFile(xlsxFile);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please drop only .xlsx files",
        variant: "destructive",
      });
    }
  };

  const handleAnalyzeSimilarity = async () => {
    if (!uploadedFile) {
      toast({
        title: "No File Uploaded",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock similar items data
    const mockSimilarItems: SimilarItem[] = [
      {
        id: "1",
        question: "Which functional group is present in an alcohol molecule?",
        similarity: 95.2,
        type: "MCQ",
        status: 'similar'
      },
      {
        id: "2", 
        question: "What is the general formula of an alkane?",
        similarity: 87.8,
        type: "MCQ",
        status: 'similar'
      },
      {
        id: "3",
        question: "Which compound is an example of an aromatic hydrocarbon?",
        similarity: 92.1,
        type: "MCQ",
        status: 'similar'
      },
      {
        id: "4",
        question: "What type of reaction is the conversion of an alcohol to an alkene?",
        similarity: 89.5,
        type: "MCQ",
        status: 'similar'
      },
      {
        id: "5",
        question: "What is the functional group of a ketone?",
        similarity: 76.3,
        type: "MCQ",
        status: 'enemy'
      }
    ];
    
    setSimilarItems(mockSimilarItems);
    
    // Mock processed items data
    const mockQuestionItems: QuestionItem[] = [
      {
        id: "1",
        sequenceNumber: 1,
        question: "Which functional group is present in an alcohol molecule?",
        type: "MCQ",
        options: ["Hydroxyl (-OH)", "Carboxyl (-COOH)", "Amino (-NH2)", "Carbonyl (C=O)"],
        correctAnswer: "Hydroxyl (-OH)"
      },
      {
        id: "2",
        sequenceNumber: 2,
        question: "What is the general formula of an alkane?",
        type: "MCQ", 
        options: ["CnH2n+2", "CnH2n", "CnH2n-2", "CnHn"],
        correctAnswer: "CnH2n+2"
      },
      {
        id: "3",
        sequenceNumber: 3,
        question: "Explain the mechanism of electrophilic addition.",
        type: "Descriptive"
      }
    ];
    
    setQuestionItems(mockQuestionItems);
    setEnemyItems(mockSimilarItems.filter(item => item.status === 'enemy'));
    setIsAnalyzing(false);
    
    toast({
      title: "Analysis Complete",
      description: `Processed ${mockQuestionItems.length} items, found ${mockSimilarItems.length} similar items`,
    });
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template Downloaded",
      description: "Standard template has been downloaded",
    });
  };

  const toggleEnemyStatus = (id: string) => {
    setSimilarItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, status: item.status === 'enemy' ? 'similar' : 'enemy' }
        : item
    ));
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 90) return "text-green-600";
    if (similarity >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getSimilarityBg = (similarity: number) => {
    if (similarity >= 90) return "bg-green-100";
    if (similarity >= 80) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-medium text-sm">IS</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">Item Similarity</span>
                <span className="text-xs text-gray-500">AI-Powered Similarity Analysis</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                <Target className="w-2 h-2 text-white" />
              </div>
              <span className="text-sm text-purple-700 font-medium">4,651 Tokens</span>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
            <Scan className="w-4 h-4" />
            Analyze Item Similarity
          </div>
          <h1 className="text-4xl font-medium bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent">
            Item Similarity Analyzer
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage question sets, find similar items, and identify enemy questions
          </p>
        </div>

        {/* Enhanced Tabs */}
        <Card className="border-gray-200 shadow-xl bg-white/90 backdrop-blur-sm">
          <Tabs defaultValue="item-bank" className="w-full">
            <div className="bg-gradient-to-r from-purple-100 via-blue-100 to-purple-100 border-b border-purple-300/70 px-8 pt-8 pb-4">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-200 h-16 rounded-lg p-1.5">
                <TabsTrigger 
                  value="item-bank" 
                  className="relative flex items-center justify-center gap-2 text-gray-700 font-medium text-sm transition-all duration-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:scale-[1.02] hover:bg-purple-50 rounded-md mx-0.5 h-full px-3 py-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Item Bank</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="similar-items" 
                  className="relative flex items-center justify-center gap-2 text-gray-700 font-medium text-sm transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:scale-[1.02] hover:bg-blue-50 rounded-md mx-0.5 h-full px-3 py-1.5"
                >
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Similar Items</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="enemy-items" 
                  className="relative flex items-center justify-center gap-2 text-gray-700 font-medium text-sm transition-all duration-300 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:scale-[1.02] hover:bg-red-50 rounded-md mx-0.5 h-full px-3 py-1.5"
                >
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Enemy Items</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Item Bank Tab */}
            <TabsContent value="item-bank" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-medium text-gray-900">Item Bank</h2>
                  <p className="text-gray-600 mt-1">Manage your question sets and upload templates</p>
                </div>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
                  <Clock className="w-3 h-3 mr-1" />
                  Tokens: 4,651
                </Badge>
              </div>

              {/* Question Set Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">Select Question Set</label>
                  <Select value={selectedQuestionSet} onValueChange={setSelectedQuestionSet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a question set" />
                    </SelectTrigger>
                    <SelectContent>
                      {questionSets.map((set) => (
                        <SelectItem key={set.id} value={set.id}>
                          {set.name} ({set.itemCount} items)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">Actions</label>
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-purple-400 text-purple-700 hover:bg-purple-50"
                    onClick={handleDownloadTemplate}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Upload Question Template</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Badge variant="outline" className="text-xs">Format: .xlsx only</Badge>
                  <Badge variant="outline" className="text-xs">Limit: 50 Questions</Badge>
                </div>
                
                {!uploadedFile ? (
                  <div 
                    className={`border-2 border-dashed rounded-xl p-12 transition-all duration-300 cursor-pointer ${
                      isDragOver 
                        ? 'border-purple-500 bg-purple-50/50' 
                        : 'border-gray-300 hover:border-purple-400 bg-gray-50/30'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <div className="text-center space-y-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 ${
                        isDragOver 
                          ? 'bg-purple-600' 
                          : 'bg-gray-100 border-2 border-gray-300'
                      }`}>
                        <Upload className={`w-6 h-6 transition-all duration-300 ${
                          isDragOver ? 'text-white' : 'text-gray-500'
                        }`} />
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-md font-medium text-gray-900">
                          Drop your Excel file here
                        </h4>
                        <p className="text-gray-500 text-sm">
                          or click to browse for files
                        </p>
                      </div>
                      
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button 
                        variant="outline" 
                        className="border-2 border-purple-400 text-purple-700 bg-purple-50 hover:bg-purple-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('file-upload')?.click();
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Browse Files
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-green-200 rounded-xl p-8 bg-green-50/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-green-100 border-2 border-green-300 flex items-center justify-center">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-md font-medium text-gray-900">{uploadedFile.name}</h4>
                          <p className="text-green-600 font-medium text-sm">File uploaded successfully!</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          onClick={handleAnalyzeSimilarity}
                          disabled={isAnalyzing}
                        >
                          {isAnalyzing ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Scan className="w-4 h-4 mr-2" />
                              Process Items
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="border-2 border-red-400 text-red-600 hover:bg-red-50"
                          onClick={handleRemoveFile}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Processing Progress */}
              {isAnalyzing && (
                <Card className="border-purple-200 animate-fade-in">
                  <div className="p-6 text-center space-y-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                      <Scan className="w-6 h-6 text-purple-600 animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-medium text-gray-900">Processing Items...</h4>
                      <p className="text-gray-600">AI is analyzing your questions</p>
                      <Progress value={75} className="w-full max-w-md mx-auto" />
                    </div>
                  </div>
                </Card>
              )}

              {/* Questions from Selected Set */}
              {selectedQuestionSet && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">
                      Questions ({getQuestionsForSet(selectedQuestionSet).length} items)
                    </h3>
                    <Button variant="outline" className="border-2 border-blue-400 text-blue-700 hover:bg-blue-50">
                      <Download className="w-4 h-4 mr-2" />
                      Export Questions
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead className="w-24">Type</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getQuestionsForSet(selectedQuestionSet).map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.sequenceNumber}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate">{item.question}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2 text-xl">
                                    <Eye className="w-5 h-5 text-purple-600" />
                                    Question Preview
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  {/* Question Header */}
                                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                                    <div className="flex items-center gap-3 mb-3">
                                      <Badge className="bg-purple-100 text-purple-800">
                                        Question #{item.sequenceNumber}
                                      </Badge>
                                      <Badge variant="outline" className="border-purple-300 text-purple-700">
                                        {item.type}
                                      </Badge>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                      <h3 className="text-lg font-medium text-gray-900 mb-2">Question Statement</h3>
                                      <p className="text-gray-800 leading-relaxed">{item.question}</p>
                                    </div>
                                  </div>

                                  {/* Options Section */}
                                  {item.options && (
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                                        Answer Options
                                      </h3>
                                      <div className="grid gap-3">
                                        {item.options.map((option, idx) => (
                                          <div 
                                            key={idx} 
                                            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
                                              item.correctAnswer === option 
                                                ? 'bg-green-50 border-2 border-green-300 shadow-md' 
                                                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                          >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                              item.correctAnswer === option 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-300 text-gray-700'
                                            }`}>
                                              {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="flex-1 text-gray-800">{option}</span>
                                            {item.correctAnswer === option && (
                                              <Badge className="bg-green-500 text-white">
                                                Correct Answer
                                              </Badge>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Processed Items Table */}
              {questionItems.length > 0 && !isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Processed Items</h3>
                    <Button variant="outline" className="border-2 border-blue-400 text-blue-700 hover:bg-blue-50">
                      <Download className="w-4 h-4 mr-2" />
                      Export Items
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead className="w-24">Type</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questionItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.sequenceNumber}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate">{item.question}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  Preview
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2 text-xl">
                                    <Eye className="w-5 h-5 text-purple-600" />
                                    Question Preview
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-6">
                                  {/* Question Header */}
                                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
                                    <div className="flex items-center gap-3 mb-3">
                                      <Badge className="bg-purple-100 text-purple-800">
                                        Question #{item.sequenceNumber}
                                      </Badge>
                                      <Badge variant="outline" className="border-purple-300 text-purple-700">
                                        {item.type}
                                      </Badge>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                      <h3 className="text-lg font-medium text-gray-900 mb-2">Question Statement</h3>
                                      <p className="text-gray-800 leading-relaxed">{item.question}</p>
                                    </div>
                                  </div>

                                  {/* Options Section */}
                                  {item.options && (
                                    <div className="space-y-4">
                                      <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                                        Answer Options
                                      </h3>
                                      <div className="grid gap-3">
                                        {item.options.map((option, idx) => (
                                          <div 
                                            key={idx} 
                                            className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-200 ${
                                              item.correctAnswer === option 
                                                ? 'bg-green-50 border-2 border-green-300 shadow-md' 
                                                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                                            }`}
                                          >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                              item.correctAnswer === option 
                                                ? 'bg-green-500 text-white' 
                                                : 'bg-gray-300 text-gray-700'
                                            }`}>
                                              {String.fromCharCode(65 + idx)}
                                            </div>
                                            <span className="flex-1 text-gray-800">{option}</span>
                                            {item.correctAnswer === option && (
                                              <Badge className="bg-green-500 text-white">
                                                Correct Answer
                                              </Badge>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Similar Items Tab */}
            <TabsContent value="similar-items" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-medium text-gray-900">Similar Items</h2>
                  <p className="text-gray-600 mt-1">Find and analyze similar questions based on score threshold</p>
                </div>
              </div>

              {/* Question Set Selection */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700">Select Question Set</label>
                <Select value={selectedQuestionSet} onValueChange={setSelectedQuestionSet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a question set" />
                  </SelectTrigger>
                  <SelectContent>
                    {questionSets.map((set) => (
                      <SelectItem key={set.id} value={set.id}>
                        {set.name} ({set.itemCount} items)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Questions List for Similar Items */}
              {selectedQuestionSet && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Questions in {questionSets.find(s => s.id === selectedQuestionSet)?.name}</h3>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="w-16">#</TableHead>
                          <TableHead>Question</TableHead>
                          <TableHead className="w-24">Type</TableHead>
                          <TableHead className="w-32">Score</TableHead>
                          <TableHead className="w-32">Status</TableHead>
                          <TableHead className="w-32">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getQuestionsForSet(selectedQuestionSet).map((question) => (
                          <TableRow key={question.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{question.sequenceNumber}</TableCell>
                            <TableCell className="max-w-md">
                              <div className="truncate" title={question.question}>
                                {question.question}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {question.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-700 border-0">
                                {(85 + Math.random() * 10).toFixed(1)}%
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-700 border-0">
                                Similar
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Question Details</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                                      <p className="text-gray-700">{question.question}</p>
                                    </div>
                                    <div className="flex gap-4">
                                      <div>
                                        <span className="text-sm font-medium text-gray-500">Type:</span>
                                        <Badge variant="outline" className="ml-2">{question.type}</Badge>
                                      </div>
                                      <div>
                                        <span className="text-sm font-medium text-gray-500">ID:</span>
                                        <span className="ml-2 text-sm text-gray-700">{question.id}</span>
                                      </div>
                                    </div>
                                    {question.options && (
                                      <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Options:</h4>
                                        <ul className="space-y-1">
                                          {question.options.map((option, index) => (
                                            <li key={index} className={`p-2 rounded text-sm ${
                                              option === question.correctAnswer 
                                                ? 'bg-green-100 text-green-800 font-medium' 
                                                : 'bg-gray-50 text-gray-700'
                                            }`}>
                                              {String.fromCharCode(65 + index)}. {option}
                                              {option === question.correctAnswer && (
                                                <span className="ml-2 text-green-600">✓ Correct</span>
                                              )}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* Score Threshold in separate row */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-lg font-medium text-gray-800">Score Threshold</label>
                    <span className={`text-lg font-medium px-4 py-2 rounded-lg shadow-sm ${
                      scoreThreshold >= 90 ? 'bg-green-500 text-white' :
                      scoreThreshold >= 80 ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {scoreThreshold}%
                    </span>
                  </div>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={scoreThreshold}
                      onChange={(e) => setScoreThreshold(Number(e.target.value))}
                      className={`w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider ${
                        scoreThreshold >= 90 ? 'slider-green' :
                        scoreThreshold >= 80 ? 'slider-yellow' :
                        'slider-red'
                      }`}
                      style={{
                        background: `linear-gradient(to right, ${
                          scoreThreshold >= 90 ? '#10b981' :
                          scoreThreshold >= 80 ? '#f59e0b' :
                          '#ef4444'
                        } 0%, ${
                          scoreThreshold >= 90 ? '#10b981' :
                          scoreThreshold >= 80 ? '#f59e0b' :
                          '#ef4444'
                        } ${((scoreThreshold - 50) / 50) * 100}%, #e5e7eb ${((scoreThreshold - 50) / 50) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm font-medium text-gray-600">
                      <span>Low (50%)</span>
                      <span>Medium (75%)</span>
                      <span>High (100%)</span>
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Questions with similarity score above <span className="font-medium text-blue-600">{scoreThreshold}%</span> will be displayed
                    </p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!selectedQuestionSet}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Find Similar Items
                </Button>
              </div>

              {/* Similar Items Results */}
              {similarItems.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Similar Items Found</h3>
                    <Button variant="outline" className="border-2 border-blue-400 text-blue-700 hover:bg-blue-50">
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead className="w-24">Type</TableHead>
                        <TableHead className="w-32">Score</TableHead>
                        <TableHead className="w-32">Status</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {similarItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate">{item.question}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSimilarityBg(item.similarity)}`}>
                                <span className={getSimilarityColor(item.similarity)}>
                                  {item.similarity.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={
                                item.status === 'enemy' 
                                  ? 'bg-red-100 text-red-800 hover:bg-red-100' 
                                  : 'bg-green-100 text-green-800 hover:bg-green-100'
                              }
                            >
                              {item.status === 'enemy' ? 'Enemy' : 'Similar'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-xl">
                                      <Target className="w-5 h-5 text-blue-600" />
                                      Similar Items Analysis
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-6">
                                    {/* Original Question */}
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
                                      <div className="flex items-center gap-2 mb-3">
                                        <Badge className="bg-blue-600 text-white">Original Question</Badge>
                                        <Badge variant="outline" className="border-blue-300">{item.type}</Badge>
                                      </div>
                                      <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <p className="text-gray-900 font-medium">{item.question}</p>
                                      </div>
                                    </div>

                                    {/* Similarity Stats */}
                                    <div className="grid grid-cols-3 gap-4">
                                      <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                                        <div className="text-2xl font-medium text-green-600">5</div>
                                        <div className="text-sm text-green-700">Similar Items</div>
                                      </div>
                                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                                        <div className="text-2xl font-medium text-blue-600">{item.similarity.toFixed(1)}%</div>
                                        <div className="text-sm text-blue-700">Avg Similarity</div>
                                      </div>
                                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                                        <div className="text-2xl font-medium text-purple-600">98.2%</div>
                                        <div className="text-sm text-purple-700">Highest Match</div>
                                      </div>
                                    </div>

                                    {/* Similar Items List */}
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                        Similar Items Found
                                      </h4>
                                      <div className="space-y-4">
                                        {[
                                          { id: 1, question: "Which functional group is present in alcohols?", similarity: 98.2, type: "MCQ" },
                                          { id: 2, question: "Identify the functional group in alcohol compounds", similarity: 95.8, type: "MCQ" },
                                          { id: 3, question: "What functional group characterizes alcohol molecules?", similarity: 93.4, type: "MCQ" },
                                          { id: 4, question: "The functional group found in alcohols is called?", similarity: 91.7, type: "Short Answer" },
                                          { id: 5, question: "Name the functional group present in ethanol", similarity: 89.3, type: "MCQ" }
                                        ].map((similarItem) => (
                                          <div key={similarItem.id} className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
                                            <div className="flex items-start justify-between mb-3">
                                              <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                  <span className="text-blue-600 font-medium text-sm">{similarItem.id}</span>
                                                </div>
                                                <Badge variant="outline" className="border-gray-300">
                                                  {similarItem.type}
                                                </Badge>
                                              </div>
                                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                similarItem.similarity >= 95 ? 'bg-green-100 text-green-700' :
                                                similarItem.similarity >= 90 ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-orange-100 text-orange-700'
                                              }`}>
                                                {similarItem.similarity}% Match
                                              </div>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                              <p className="text-gray-800">{similarItem.question}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleEnemyStatus(item.id)}
                                className={
                                  item.status === 'enemy'
                                    ? 'border-green-400 text-green-600 hover:bg-green-50'
                                    : 'border-red-400 text-red-600 hover:bg-red-50'
                                }
                              >
                                {item.status === 'enemy' ? 'Mark Similar' : 'Mark Enemy'}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            {/* Enemy Items Tab */}
            <TabsContent value="enemy-items" className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-medium text-gray-900">Enemy Items</h2>
                  <p className="text-gray-600 mt-1">Manage and export enemy questions</p>
                </div>
                <Button variant="outline" className="border-2 border-red-400 text-red-700 hover:bg-red-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export Enemy Items
                </Button>
              </div>

               {/* Question Set Selection */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Question Set</label>
                   <Select value={selectedQuestionSet} onValueChange={setSelectedQuestionSet}>
                     <SelectTrigger>
                       <SelectValue placeholder="Choose a question set" />
                     </SelectTrigger>
                     <SelectContent>
                       {questionSets.map((set) => (
                         <SelectItem key={set.id} value={set.id}>
                           {set.name} ({set.itemCount} items)
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Actions</label>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                      disabled={!selectedQuestionSet}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Find Enemy Items
                    </Button>
                 </div>
               </div>

               {/* Questions List for Enemy Items */}
               {selectedQuestionSet && (
                 <div className="space-y-4">
                   <h3 className="text-lg font-medium text-gray-900">Questions in {questionSets.find(s => s.id === selectedQuestionSet)?.name}</h3>
                   <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                     <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="w-16">#</TableHead>
                            <TableHead>Question</TableHead>
                            <TableHead className="w-24">Type</TableHead>
                            <TableHead className="w-32">Score</TableHead>
                            <TableHead className="w-32">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getQuestionsForSet(selectedQuestionSet).map((question) => (
                            <TableRow key={question.id} className="hover:bg-gray-50">
                              <TableCell className="font-medium">{question.sequenceNumber}</TableCell>
                              <TableCell className="max-w-md">
                                <div className="truncate" title={question.question}>
                                  {question.question}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-xs">
                                  {question.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-red-100 text-red-700 border-0">
                                  {(65 + Math.random() * 20).toFixed(1)}%
                                </Badge>
                              </TableCell>
                              <TableCell>
                               <Dialog>
                                 <DialogTrigger asChild>
                                   <Button variant="ghost" size="sm">
                                     <Eye className="w-4 h-4" />
                                   </Button>
                                 </DialogTrigger>
                                 <DialogContent className="max-w-2xl">
                                   <DialogHeader>
                                     <DialogTitle>Question Details</DialogTitle>
                                   </DialogHeader>
                                   <div className="space-y-4">
                                     <div>
                                       <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                                       <p className="text-gray-700">{question.question}</p>
                                     </div>
                                     <div className="flex gap-4">
                                       <div>
                                         <span className="text-sm font-medium text-gray-500">Type:</span>
                                         <Badge variant="outline" className="ml-2">{question.type}</Badge>
                                       </div>
                                       <div>
                                         <span className="text-sm font-medium text-gray-500">ID:</span>
                                         <span className="ml-2 text-sm text-gray-700">{question.id}</span>
                                       </div>
                                     </div>
                                     {question.options && (
                                       <div>
                                         <h4 className="font-medium text-gray-900 mb-2">Options:</h4>
                                         <ul className="space-y-1">
                                           {question.options.map((option, index) => (
                                             <li key={index} className={`p-2 rounded text-sm ${
                                               option === question.correctAnswer 
                                                 ? 'bg-green-100 text-green-800 font-medium' 
                                                 : 'bg-gray-50 text-gray-700'
                                             }`}>
                                               {String.fromCharCode(65 + index)}. {option}
                                               {option === question.correctAnswer && (
                                                 <span className="ml-2 text-green-600">✓ Correct</span>
                                               )}
                                             </li>
                                           ))}
                                         </ul>
                                       </div>
                                     )}
                                   </div>
                                 </DialogContent>
                               </Dialog>
                             </TableCell>
                           </TableRow>
                         ))}
                       </TableBody>
                     </Table>
                   </div>
                 </div>
               )}

              {/* Enemy Items Table */}
              {enemyItems.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Enemy Questions ({enemyItems.length})</h3>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead className="w-24">Type</TableHead>
                        <TableHead className="w-32">Score</TableHead>
                        <TableHead className="w-32">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enemyItems.map((item, index) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{index + 1}</TableCell>
                          <TableCell className="max-w-md">
                            <p className="truncate">{item.question}</p>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{item.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSimilarityBg(item.similarity)} inline-block`}>
                              <span className={getSimilarityColor(item.similarity)}>
                                {item.similarity.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </Button>
                              </DialogTrigger>
                               <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                 <DialogHeader className="border-b border-red-200 pb-4">
                                   <DialogTitle className="text-xl font-medium text-red-700 flex items-center gap-2">
                                     <AlertTriangle className="w-5 h-5" />
                                     Enemy Question Preview
                                   </DialogTitle>
                                 </DialogHeader>
                                 <div className="space-y-6 p-2">
                                   <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg">
                                     <div className="flex items-start justify-between mb-4">
                                       <div className="flex items-center gap-3">
                                         <Badge className="bg-red-600 text-white text-sm px-3 py-1">
                                           {item.type}
                                         </Badge>
                                         <Badge variant="outline" className="text-red-700 border-red-300 bg-white">
                                           Similarity: {item.similarity}%
                                         </Badge>
                                       </div>
                                       <div className="text-right">
                                         <span className="text-xs text-red-600 font-medium">Enemy Status</span>
                                         <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                                       </div>
                                     </div>
                                     
                                     <div className="space-y-3">
                                       <label className="text-sm font-medium text-red-800 uppercase tracking-wide">Question</label>
                                       <p className="text-gray-900 text-lg leading-relaxed bg-white p-4 rounded-lg border border-red-200 shadow-sm">
                                         {item.question}
                                       </p>
                                     </div>

                                     {item.type === "MCQ" && (
                                       <div className="mt-6 space-y-3">
                                         <label className="text-sm font-medium text-red-800 uppercase tracking-wide">Options</label>
                                         <div className="grid gap-2">
                                           {["Option A", "Option B", "Option C", "Option D"].map((option, idx) => (
                                             <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-red-200 rounded-lg">
                                               <span className="w-6 h-6 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-sm font-medium">
                                                 {String.fromCharCode(65 + idx)}
                                               </span>
                                               <span className="text-gray-700">{option} content here</span>
                                             </div>
                                           ))}
                                         </div>
                                       </div>
                                     )}

                                     <div className="mt-6 pt-4 border-t border-red-200">
                                       <div className="flex items-center justify-between text-sm">
                                         <span className="text-red-700 font-medium">Classification: Enemy Item</span>
                                         <span className="text-gray-600">ID: {item.id}</span>
                                       </div>
                                     </div>
                                   </div>
                                 </div>
                               </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Enemy Items Found</h3>
                  <p className="text-gray-600">Select a question set and click "Find Enemy Items" to start analysis</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card text-xs text-muted-foreground">
            <Sparkle className="h-3.5 w-3.5 text-primary" />
            <span>Powered by advanced AI similarity detection</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemSimilarity;