
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminReports from "./pages/SuperAdminReports";
import ItemGenerator from "./pages/ItemGenerator";
import ItemGeneration from "./pages/ItemGeneration";
import ItemRewriter from "./pages/ItemRewriter";
import ItemSimilarity from "./pages/ItemSimilarity";
import ItemMetadata from "./pages/ItemMetadata";
import SpeechEvaluation from "./pages/SpeechEvaluation";
import EssayEvaluation from "./pages/EssayEvaluation";
import EssayEvaluationDetail from "./pages/EssayEvaluationDetail";
import EssayEvaluationZeroShot from "./pages/EssayEvaluationZeroShot";
import DocChatNCERT from "./pages/DocChatNCERT";
import QuestionGenerator from "./pages/QuestionGenerator";
import QuestionGenerationLoading from "./pages/QuestionGenerationLoading";
import QuestionResults from "./pages/QuestionResults";
import QuestionRepository from "./pages/QuestionRepository";
import CheckSimilarity from "./pages/CheckSimilarity";
import Reports from "./pages/Reports";
import ManageUsers from "./pages/ManageUsers";
import KnowledgeBase from "./pages/KnowledgeBase";
import KnowledgeBaseCopy from "./pages/KnowledgeBaseCopy";
import EditKnowledgeBase from "./pages/EditKnowledgeBase";
import Collaboration from "./pages/Collaboration";
import NotFound from "./pages/NotFound";
import OCREvaluation from "./pages/OCREvaluation";
import ItemValidation from "./pages/ItemValidation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
          <Route path="/superadmin-reports" element={<SuperAdminReports />} />
          <Route path="/item-generator" element={<ItemGenerator />} />
          <Route path="/item-generation" element={<ItemGeneration />} />
          <Route path="/item-rewriter" element={<ItemRewriter />} />
          <Route path="/item-similarity" element={<ItemSimilarity />} />
          <Route path="/item-metadata" element={<ItemMetadata />} />
          <Route path="/speech-evaluation" element={<SpeechEvaluation />} />
          <Route path="/essay-evaluation" element={<EssayEvaluation />} />
          <Route path="/essay-evaluation/:essayId" element={<EssayEvaluationDetail />} />
          <Route path="/essay-evaluation-zero" element={<EssayEvaluationZeroShot />} />
          <Route path="/question-generator/:bookCode" element={<QuestionGenerator />} />
          <Route path="/question-generation-loading" element={<QuestionGenerationLoading />} />
          <Route path="/question-results" element={<QuestionResults />} />
          <Route path="/question-repository" element={<QuestionRepository />} />
          <Route path="/check-similarity" element={<CheckSimilarity />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/manage-users" element={<ManageUsers />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/knowledge-base-copy" element={<KnowledgeBaseCopy />} />
        <Route path="/knowledge-base/edit/:id" element={<EditKnowledgeBase />} />
          <Route path="/collaboration" element={<Collaboration />} />
          <Route path="/doc-chat-ncert" element={<DocChatNCERT />} />
          <Route path="/ocr-evaluation" element={<OCREvaluation />} />
          <Route path="/item-validation/*" element={<ItemValidation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
