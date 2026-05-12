import React, { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { AppSidebar } from "@/components/AppSidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, Database, Brain, TrendingUp, Users, Eye, Edit, Trash2, Download, FileText } from "lucide-react";

const QuestionRepository = () => {
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);

  const statsData = [
    {
      title: "Total Questions",
      value: "1,247",
      change: "+15% this month",
      icon: Database,
      valueColor: "#1c398e"
    },
    {
      title: "AI Generated", 
      value: "892",
      change: "High quality",
      icon: Brain,
      valueColor: "#0d542b"
    },
    {
      title: "This Week",
      value: "47", 
      change: "New questions",
      icon: TrendingUp,
      valueColor: "#59168b"
    },
    {
      title: "Contributors",
      value: "12",
      change: "Active authors", 
      icon: Users,
      valueColor: "#7e2a0c"
    }
  ];

  const questions = [
    {
      id: "C20_V2024_S11_L00_MC_L2_EN_ID2426",
      question: "What characteristic of pure risk makes it more acceptable for insurance?",
      type: "Multiple Choice",
      topic: "Risk Management", 
      difficulty: "Medium",
      created: "2 hours ago"
    },
    {
      id: "C20_V2024_S11_L01_TF_L1_EN_ID2427", 
      question: "Pure risk always results in a loss or no loss situation.",
      type: "True/False",
      topic: "Risk Fundamentals",
      difficulty: "Easy", 
      created: "1 day ago"
    },
    {
      id: "C20_V2024_S11_L02_SA_L3_EN_ID2428",
      question: "Explain the relationship between risk assessment and cybersecurity frameworks.",
      type: "Short Answer",
      topic: "Cybersecurity", 
      difficulty: "Hard",
      created: "3 days ago"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800"; 
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleSelectQuestion = (questionId: string) => {
    setSelectedQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      
      <div className="pl-64">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-medium">Question Repository</h1>
            </div>
            <ProfileDropdown />
          </div>
        </header>

        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="border border-border/40">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-medium" style={{ color: stat.valueColor, fontSize: '1.25rem' }}>
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">{stat.change}</p>
                      </div>
                      <Icon className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Filters & Search */}
          <Card className="border border-border/40">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="h-4 w-4" />
                  Filters & Search
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Source Type</label>
                    <Select defaultValue="all-sources">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-sources">All Sources</SelectItem>
                        <SelectItem value="book-based">Book Based</SelectItem>
                        <SelectItem value="ai-generated">AI Generated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Study Area</label>
                    <Select defaultValue="all-areas">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-areas">All Areas</SelectItem>
                        <SelectItem value="cyber-risk">Cyber Risk</SelectItem>
                        <SelectItem value="risk-management">Risk Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Question Type</label>
                    <Select defaultValue="all-types">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-types">All Types</SelectItem>
                        <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                        <SelectItem value="true-false">True/False</SelectItem>
                        <SelectItem value="short-answer">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Difficulty</label>
                    <Select defaultValue="all-levels">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-levels">All Levels</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Questions</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder="Search questions, topics, or content..." 
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions Table */}
          <Card className="border border-border/40">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">3 Questions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Selected
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Export to Word
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export to Excel
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedQuestions(questions.map(q => q.id));
                          } else {
                            setSelectedQuestions([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead className="w-48">Question ID</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((question, index) => (
                    <TableRow key={question.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={selectedQuestions.includes(question.id)}
                          onChange={() => handleSelectQuestion(question.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-mono text-xs">{question.id}</TableCell>
                      <TableCell className="max-w-md">
                        <p className="truncate">{question.question}</p>
                      </TableCell>
                      <TableCell>{question.type}</TableCell>
                      <TableCell>
                        <span style={{ color: "#7e2a0c", fontSize: '0.875rem' }}>
                          {question.topic}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <span style={{ fontSize: '0.875rem' }}>{question.created}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default QuestionRepository;