import { ArrowLeft, Info, User, Settings, LogOut, PlayCircle } from "lucide-react";
import { Link, useNavigate, Routes, Route, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TokenUsagePopover from "@/components/TokenUsagePopover";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IGSidebar } from "@/itemguard/components/IGSidebar";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import Dashboard from "@/itemguard/pages/Dashboard";
import ItemBank from "@/itemguard/pages/ItemBank";
import AnalysisRuns from "@/itemguard/pages/AnalysisRuns";
import AnalysisRunLoading from "@/itemguard/pages/AnalysisRunLoading";
import ItemReports from "@/itemguard/pages/ItemReports";
import ItemDetail from "@/itemguard/pages/ItemDetail";
import Guidelines from "@/itemguard/pages/Guidelines";
import QualificationSpecs from "@/itemguard/pages/QualificationSpecs";
import DuplicatesReview from "@/itemguard/pages/DuplicatesReview";
import SettingsPage from "@/itemguard/pages/SettingsPage";

const ItemValidation = () => {
  const navigate = useNavigate();
  const sidebarCollapsed = useSidebarCollapsed();
  const location = useLocation();
  const isDashboard =
    location.pathname === "/item-validation" ||
    location.pathname === "/item-validation/";

  return (
    <div className="itemguard min-h-screen bg-gray-50">
      {/* Desktop Sidebar (matches /dashboard) */}
      <div
        className={`fixed left-0 top-16 h-[calc(100%-4rem)] z-[60] hidden lg:block transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-52"
        }`}
      >
        <IGSidebar />
      </div>

      {/* Top header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-card/95 border-b border-border">
        <div className="flex h-16 items-center px-6 gap-4">
          <Link to="/dashboard" className="flex-shrink-0">
            <img src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" alt="AI-Levate" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-3 ml-auto">
            <TokenUsagePopover used={5349} total={10000} scopeLabel="This course" />
            <Separator orientation="vertical" className="hidden sm:block h-8" />
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-11 h-11 p-0 rounded-full border-2 border-primary/30 hover:border-primary/50 hover:bg-transparent">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">A</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 p-2">
                <div className="flex flex-col min-w-0 px-2 py-2">
                  <span className="text-sm font-semibold text-foreground truncate">Anil Kumar</span>
                  <span className="text-xs text-muted-foreground truncate">anil.kumar@ailevate.com</span>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 text-sm"><User className="mr-2 h-4 w-4" /><span>Profile</span></DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 text-sm"><Settings className="mr-2 h-4 w-4" /><span>Settings</span></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 text-sm text-destructive" onClick={() => navigate("/")}>
                  <LogOut className="mr-2 h-4 w-4" /><span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Page title row */}
      <div
        className={`pt-16 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-52"
        }`}
      >
        <div className="px-6 pt-6 pb-3 max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" aria-label="Back to dashboard">
              <Button variant="outline" size="sm"
                className="h-9 rounded-full pl-2.5 pr-3.5 gap-1.5 border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
              </Button>
            </Link>
            <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
            <h1 className="text-2xl font-medium text-gray-900">Item Validation</h1>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="ml-1.5 w-7 h-7 rounded-full bg-blue-50 text-blue-400 hover:text-blue-600 hover:bg-blue-100 ring-1 ring-blue-200/60 hover:ring-blue-300 transition-all duration-200 flex items-center justify-center shadow-sm">
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>AI-powered validation tool that checks question quality, accuracy, and alignment with learning objectives</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {isDashboard && (
              <Link to="/item-validation/item-bank" className="ml-auto">
                <Button size="sm" className="h-9 rounded-full px-4 gap-1.5">
                  <PlayCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Start Validation</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Sub-app: sidebar + routed content */}
        <div className="px-6 pb-6 max-w-[1600px] mx-auto">
          <main style={{ minHeight: "calc(100vh - 180px)" }}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="item-bank" element={<ItemBank />} />
              <Route path="analysis-runs" element={<AnalysisRuns />} />
              <Route path="analysis-running" element={<AnalysisRunLoading />} />
              <Route path="item-reports" element={<ItemReports />} />
              <Route path="item-reports/:itemId" element={<ItemDetail />} />
              <Route path="guidelines" element={<Guidelines />} />
              <Route path="qualifications" element={<QualificationSpecs />} />
              <Route path="duplicates" element={<DuplicatesReview />} />
              <Route path="settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ItemValidation;
