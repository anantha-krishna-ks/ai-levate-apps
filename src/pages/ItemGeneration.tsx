import { ArrowLeft, Users, FileText, Bookmark, ChevronRight, Zap, CheckCircle, Clock, Shield, TrendingUp, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ItemGeneration = () => {
  const stats = [
    {
      tone: "peach" as const,
      icon: Zap,
      label: "Token Usage",
      value: 5349,
      total: 10000,
      caption: "Today's tokens used",
      items: [
        { label: "Used today", value: "5,349" },
        { label: "Balance", value: "4,651" },
      ],
    },
    {
      tone: "lavender" as const,
      icon: FileText,
      label: "Generated",
      value: 72,
      total: 100,
      caption: "Questions generated",
      items: [
        { label: "Multiple Choice", value: "65" },
        { label: "Written Response", value: "7" },
      ],
    },
    {
      tone: "mint" as const,
      icon: Bookmark,
      label: "Saved",
      value: 28,
      total: 72,
      caption: "Questions saved",
      items: [
        { label: "Multiple Choice", value: "27" },
        { label: "Written Response", value: "1" },
      ],
    }
  ];

  const knowledgeBases = [
    {
      id: 1,
      year: "2024",
      level: "Advanced",
      category: "Risk Management",
      title: "Cyber Risk",
      description: "Comprehensive cybersecurity and risk management materials",
      questions: 11,
      image: "/lovable-uploads/a13547e7-af5f-49b0-bb15-9b344d6cd72e.png",
      status: "Active",
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      year: "2023",
      level: "Intermediate",
      category: "Insurance",
      title: "Principles and Practice of Insurance",
      description: "Fundamental principles and practical applications of insurance",
      questions: 17,
      image: "/lovable-uploads/b401ff6b-c99f-41b0-8578-92b80ce62cd0.png",
      status: "Active",
      lastUpdated: "1 week ago"
    },
    {
      id: 3,
      year: "2024",
      level: "Advanced",
      category: "Finance",
      title: "Financial Risk Assessment",
      description: "Modern approaches to financial risk analysis and management",
      questions: 23,
      image: "/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png",
      status: "Active",
      lastUpdated: "3 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-medium text-sm">AL</span>
              </div>
              <img 
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
                alt="AI-Levate" 
                className="h-5 w-auto"
              />
              <span className="text-sm text-gray-500">Knowledge Base Selection</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs">✦</span>
              </div>
              <span className="text-sm text-blue-600 font-medium">4,651 Tokens</span>
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
      <div className="p-6 max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Select Knowledge Base</h1>
          <p className="text-gray-600">Choose a knowledge base to start generating intelligent questions</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const TONE: Record<string, { bg: string; ink: string; fill: string }> = {
              lavender: { bg: "bg-pastel-lavender", ink: "text-pastel-lavender-ink", fill: "bg-pastel-lavender-ink" },
              mint:     { bg: "bg-pastel-mint",     ink: "text-pastel-mint-ink",     fill: "bg-pastel-mint-ink" },
              peach:    { bg: "bg-pastel-peach",    ink: "text-pastel-peach-ink",    fill: "bg-pastel-peach-ink" },
              sky:      { bg: "bg-pastel-sky",      ink: "text-pastel-sky-ink",      fill: "bg-pastel-sky-ink" },
            };
            const s = TONE[stat.tone];
            const Icon = stat.icon;
            const pct = Math.max(0, Math.min(100, Math.round((stat.value / stat.total) * 100)));
            return (
              <div
                key={index}
                className={`relative overflow-hidden rounded-3xl border border-border/70 shadow-soft-xs p-5 ${s.bg} ${s.ink}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-full bg-white/85 flex items-center justify-center shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_4px_10px_-2px_rgba(0,0,0,0.10)] ring-1 ring-black/5">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[15px] font-medium tracking-tight">{stat.label}</span>
                  </div>
                  <span className="text-xs font-medium opacity-80 tabular-nums">{pct}%</span>
                </div>

                {/* Big value */}
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[40px] leading-none font-medium tracking-tight tabular-nums">
                    {stat.value.toLocaleString()}
                  </span>
                  <span className="text-base font-medium opacity-75">/ {stat.total.toLocaleString()}</span>
                </div>
                <p className="text-sm opacity-90 mt-2 mb-5">{stat.caption}</p>

                {/* Breakdown chips */}
                <div className="grid grid-cols-2 gap-2.5">
                  {stat.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white/70 ring-1 ring-black/5 px-3.5 py-2.5 backdrop-blur-sm"
                    >
                      <div className="text-[11px] font-medium opacity-75 truncate">{item.label}</div>
                      <div className="text-lg font-semibold tracking-tight tabular-nums mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Knowledge Base Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {knowledgeBases.map((base) => (
            <Card key={base.id} className="overflow-hidden bg-white border border-gray-200 hover:shadow-md transition-shadow">
              {/* Image Section */}
              <div className="relative h-48 bg-gray-100">
                <img 
                  src={base.image} 
                  alt={base.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-gray-900 text-white hover:bg-gray-900">
                    {base.year}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant="secondary" 
                    className={base.level === 'Advanced' ? 'bg-red-100 text-red-700 hover:bg-red-100' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'}
                  >
                    {base.level}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <div className="bg-white rounded-lg px-2 py-1 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-gray-900">Questions: {base.questions}</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="mb-3">
                  <div className="text-sm text-gray-500 mb-1">{base.category}</div>
                  <h3 className="font-medium text-gray-900 mb-2">{base.title}</h3>
                  <p className="text-sm text-gray-600">{base.description}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{base.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>{base.status}</span>
                  </div>
                </div>

                <Link to={`/question-generator/${base.title.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Zap className="w-4 h-4 mr-2" />
                    Start Generating
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xs">⚡</span>
            </div>
            <span>Powered by advanced AI technology</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemGeneration;