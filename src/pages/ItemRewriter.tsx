import { useState } from "react";
import { ArrowLeft, Upload, Download, FileText, RefreshCw, Trash2, Sparkle, Clock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface QuestionData {
  questionNo: string;
  passage: string;
  question: string;
}

interface RewrittenQuestion {
  original: string;
  rewritten: string;
  choices?: string[];
  correctAnswer?: number; // Index of the correct answer
}

const ItemRewriter = () => {
  const { toast } = useToast();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<QuestionData[]>([]);
  const [rewrittenQuestions, setRewrittenQuestions] = useState<RewrittenQuestion[]>([]);
  const [selectedFormat, setSelectedFormat] = useState("multiple-choice");
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [isRewriting, setIsRewriting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const stats = [
    {
      icon: <Sparkle className="w-5 h-5" />,
      title: "Token Usage",
      total: "4,651",
      subtitle: "Available Tokens",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-blue-600",
      textColor: "text-blue-600",
      borderColor: "border-blue-200"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Questions Processed",
      total: "127",
      subtitle: "Total Rewritten",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconBg: "bg-green-600",
      textColor: "text-green-600",
      borderColor: "border-green-200"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "Success Rate",
      total: "98.5%",
      subtitle: "Quality Score",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconBg: "bg-purple-600",
      textColor: "text-purple-600",
      borderColor: "border-purple-200"
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
    setUploadedData([]);
    // Reset the file input
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
    
    // Mock data simulation - in real app, you'd parse the Excel file
    const mockData: QuestionData[] = [
      {
        questionNo: "Q1",
        passage: "Jill Brien, age 20, is a university student. She is a non-smoker who has asthma. She has had infrequent asthma symptoms over the years, and uses her medication once or twice a week. You consider her to have mild asthma.",
        question: "What class of medication should be the mainstay of her pharmacological therapy? Be specific."
      },
      {
        questionNo: "Q2", 
        passage: "Jill Brien, age 20, is a university student. She is a non-smoker who has asthma. She has had infrequent asthma symptoms over the years, and uses her medication once or twice a week. You consider her to have mild asthma.",
        question: "Ms. Brien starts a part-time job at a construction site. Over the next few weeks she notices that her asthma symptoms are occurring more frequently, and require her to use the medication in question 1 at least once daily. What is the most likely cause of her asthma exacerbation?"
      },
      {
        questionNo: "Q3",
        passage: "Jill Brien, age 20, is a university student. She is a non-smoker who has asthma. She has had infrequent asthma symptoms over the years, and uses her medication once or twice a week. You consider her to have mild asthma.",
        question: "What class of medication should be the mainstay of Ms. Brien's pharmacological therapy at this point?"
      },
      {
        questionNo: "Q4",
        passage: "Jill Brien, age 20, is a university student. She is a non-smoker who has asthma. She has had infrequent asthma symptoms over the years, and uses her medication once or twice a week. You consider her to have mild asthma.",
        question: "Ms. Brien would like to be able to manage her own asthma therapy. What device would you recommend she purchase?"
      }
    ];
    
    setUploadedData(mockData);
    toast({
      title: "File Uploaded Successfully",
      description: `Uploaded ${mockData.length} questions`,
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

  const handleRewriteQuestions = async () => {
    if (uploadedData.length === 0) {
      toast({
        title: "No Data to Rewrite",
        description: "Please upload a file first",
        variant: "destructive",
      });
      return;
    }

    setIsRewriting(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock rewritten questions
    const mockRewritten: RewrittenQuestion[] = [
      {
        original: "What class of medication should be the mainstay of her pharmacological therapy? Be specific.",
        rewritten: "What is a possible characteristic of Jill Brien's asthma management?",
        choices: [
          "a. She frequently experiences severe asthma symptoms.",
          "b. She uses medication daily for asthma control.",
          "c. She has mild asthma and uses medication once or twice weekly.",
          "d. She is a smoker with moderate asthma."
        ],
        correctAnswer: 2
      },
      {
        original: "Ms. Brien starts a part-time job at a construction site. Over the next few weeks she notices that her asthma symptoms are occurring more frequently, and require her to use the medication in question 1 at least once daily. What is the most likely cause of her asthma exacerbation?",
        rewritten: "According to the passage, what level of asthma does Jill Brien have?",
        choices: [
          "a. Severe asthma",
          "b. Moderate asthma", 
          "c. Mild asthma",
          "d. Chronic asthma"
        ],
        correctAnswer: 2
      },
      {
        original: "What class of medication should be the mainstay of Ms. Brien's pharmacological therapy at this point?",
        rewritten: "What is Jill Brien's age?",
        choices: [
          "a. 18",
          "b. 20",
          "c. 22", 
          "d. 25"
        ],
        correctAnswer: 1
      },
      {
        original: "Ms. Brien would like to be able to manage her own asthma therapy. What device would you recommend she purchase?",
        rewritten: "What is the likely asthma classification for Jill Brien based on her symptoms?",
        choices: [
          "a. Severe asthma",
          "b. Moderate asthma",
          "c. Mild asthma",
          "d. Chronic asthma"
        ],
        correctAnswer: 2
      }
    ];
    
    setRewrittenQuestions(mockRewritten);
    setIsRewriting(false);
    
    toast({
      title: "Questions Rewritten Successfully",
      description: `${mockRewritten.length} questions have been rewritten`,
    });
  };

  const handleDownloadTemplate = () => {
    toast({
      title: "Template Downloaded",
      description: "Sample template has been downloaded",
    });
  };

  const handleClear = () => {
    setRewrittenQuestions([]);
    toast({
      title: "Cleared",
      description: "Rewritten questions have been cleared",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: "Your rewritten questions are being downloaded",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg hover-scale">
                <span className="text-white font-medium text-sm">AL</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">Item Rewriter</span>
                <span className="text-xs text-gray-500">AI-Powered Question Transformation</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                <Sparkle className="w-2 h-2 text-white" />
              </div>
              <span className="text-sm text-blue-700 font-medium">4,651 Tokens</span>
            </div>
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-600 hover-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Enhanced Page Title */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <RefreshCw className="w-4 h-4" />
            Transform Your Questions
          </div>
          <h1 className="text-4xl font-medium bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Intelligent Question Rewriter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your questions and transform them into different formats with AI-powered precision
          </p>
        </div>


        {/* Enhanced Upload Section */}
        <Card className="border-2 border-gray-200">
          <div className="p-8">
            <div className="text-center space-y-6">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                <Clock className="w-3 h-3 mr-1" />
                Remaining Tokens: 4,651
              </Badge>
              
              <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">Format: .xlsx only</Badge>
                  <Badge variant="outline" className="text-xs">Limit: 20 Questions</Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  className="border-2 border-blue-400 text-blue-700 bg-white hover:bg-blue-50 hover:border-blue-500 hover:text-blue-800 transition-all duration-200 hover:scale-105"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
              
              {!uploadedFile ? (
                <div 
                  className={`border-2 border-dashed rounded-xl p-16 transition-all duration-300 cursor-pointer ${
                    isDragOver 
                      ? 'border-blue-500 bg-blue-50/50' 
                      : 'border-gray-300 hover:border-blue-400 bg-gray-50/30'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <div className="text-center space-y-6">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto transition-all duration-300 ${
                      isDragOver 
                        ? 'bg-blue-600' 
                        : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      <Upload className={`w-8 h-8 transition-all duration-300 ${
                        isDragOver ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        Drop your Excel file here
                      </h3>
                      <p className="text-gray-500">
                        or click to browse for files
                      </p>
                      <p className="text-sm text-gray-400">
                        Supported formats: XLSX (Max 20 Questions)
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
                      className="border-2 border-blue-400 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-500 hover:text-blue-800 transition-all duration-200"
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
                <div className="border-2 border-green-200 rounded-xl p-12 bg-green-50/30">
                  <div className="text-center space-y-6">
                    <div className="w-16 h-16 rounded-lg bg-green-100 border-2 border-green-300 flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {uploadedFile.name}
                      </h3>
                      <p className="text-green-600 font-medium">
                        File uploaded successfully!
                      </p>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="border-2 border-red-400 text-red-600 bg-white hover:bg-red-50 hover:border-red-500 transition-all duration-200"
                      onClick={handleRemoveFile}
                    >
                      Remove File
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Enhanced Uploaded Data Section */}
        {uploadedData.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 animate-fade-in">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-medium text-gray-900">Uploaded Data</h2>
                    <p className="text-gray-600 mt-1">Review your uploaded questions before processing</p>
                  </div>
                </div>
                <Badge className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 text-sm font-medium">
                  {uploadedData.length} Questions Loaded
                </Badge>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200">
                        <th className="px-8 py-5 text-left font-medium text-gray-900 text-sm uppercase tracking-wide">Question No</th>
                        <th className="px-8 py-5 text-left font-medium text-gray-900 text-sm uppercase tracking-wide">Passage</th>
                        <th className="px-8 py-5 text-left font-medium text-gray-900 text-sm uppercase tracking-wide">Question(s)</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {uploadedData.map((item, index) => (
                        <tr key={index} className="hover:bg-green-50/50 transition-colors duration-200">
                          <td className="px-8 py-6 font-medium text-green-600 text-lg">{item.questionNo}</td>
                          <td className="px-8 py-6 text-gray-700 leading-relaxed max-w-md">{item.passage}</td>
                          <td className="px-8 py-6 text-gray-700 leading-relaxed max-w-md font-medium">{item.question}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mt-8 p-6 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 rounded-xl border border-blue-200">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 flex-1">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-800 uppercase tracking-wide">Question Format</label>
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger className="w-64 h-12 border border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 z-50">
                        <SelectItem value="multiple-choice">Multiple Choice Question</SelectItem>
                        <SelectItem value="multiple-response">Multiple Response Question</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-800 uppercase tracking-wide">Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="w-40 h-12 border border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 z-50">
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 h-12 text-base font-medium rounded-full transition-all duration-200 hover:scale-105"
                  onClick={handleRewriteQuestions}
                  disabled={isRewriting}
                >
                  {isRewriting ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                      Rewriting Questions...
                    </>
                  ) : (
                    <>
                      <Sparkle className="w-5 h-5 mr-3" />
                      Rewrite Questions
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Rewritten Questions Section */}
        {rewrittenQuestions.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 animate-fade-in">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-medium text-gray-900">Rewritten Questions</h2>
                    <p className="text-gray-600 mt-1">AI-generated questions ready for download</p>
                  </div>
                  <Badge className="bg-purple-50 text-purple-700 border border-purple-200 px-4 py-2 text-sm font-medium">
                    {rewrittenQuestions.length} Questions Completed
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleClear} 
                    className="border border-red-300 text-red-600 bg-white hover:bg-red-50 hover:border-red-400 transition-all duration-200 px-6 py-2"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2 transition-all duration-200 hover:scale-105" 
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Results
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-100 via-blue-50 to-purple-100 border-b border-gray-200">
                        <th className="px-8 py-5 text-left font-medium text-gray-900 text-sm uppercase tracking-wide w-1/2">Original Question</th>
                        <th className="px-8 py-5 text-left font-medium text-gray-900 text-sm uppercase tracking-wide w-1/2">Rewritten Question</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {rewrittenQuestions.map((item, index) => (
                        <tr key={index} className="hover:bg-purple-50/30 transition-colors duration-200">
                          <td className="px-8 py-6 text-gray-700 leading-relaxed align-top">{item.original}</td>
                          <td className="px-8 py-6 space-y-4 align-top">
                            <div className="font-medium text-gray-900 text-lg leading-relaxed">{item.rewritten}</div>
                             {item.choices && (
                              <div className="bg-blue-50 rounded-lg p-4 space-y-2 border border-blue-200">
                                <div className="text-xs font-medium text-blue-700 uppercase tracking-wide mb-3">Answer Choices</div>
                                {item.choices.map((choice, idx) => {
                                  const isCorrect = item.correctAnswer === idx;
                                  return (
                                    <div key={idx} className={`text-sm flex items-start gap-3 py-2 px-3 rounded-md ${
                                      isCorrect 
                                        ? 'bg-green-100 border border-green-300 text-green-800' 
                                        : 'text-gray-700'
                                    }`}>
                                      <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                        isCorrect ? 'bg-green-500' : 'bg-blue-400'
                                      }`}></span>
                                      <span className="leading-relaxed font-medium">{choice}</span>
                                      {isCorrect && (
                                        <span className="ml-auto text-xs font-medium text-green-600 bg-green-200 px-2 py-1 rounded-full">
                                          Correct
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Footer */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center border-2 border-blue-200">
              <Sparkle className="w-3 h-3 text-white" />
            </div>
            <span className="font-medium">Powered by Advanced AI Technology</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemRewriter;