import { ArrowLeft, Info, User, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TokenUsagePopover from "@/components/TokenUsagePopover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ItemValidation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - frosted glass, full width */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-card/95 border-b border-border">
        <div className="flex h-16 items-center px-6 gap-4">
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link to="/dashboard" className="flex-shrink-0">
              <img
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png"
                alt="AI-Levate"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
            <TokenUsagePopover used={5349} total={10000} scopeLabel="This course" />
            <Separator orientation="vertical" className="hidden sm:block h-8" />
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-11 h-11 p-0 rounded-full border-2 border-primary/30 hover:border-primary/50 hover:bg-transparent"
                >
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
                <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 text-sm text-foreground/80 transition-colors focus:bg-primary/10 focus:text-primary [&>svg]:text-muted-foreground focus:[&>svg]:text-primary">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded-md px-2 py-2 text-sm text-foreground/80 transition-colors focus:bg-primary/10 focus:text-primary [&>svg]:text-muted-foreground focus:[&>svg]:text-primary">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer rounded-md px-2 py-2 text-sm text-destructive transition-colors focus:bg-destructive/10 focus:text-destructive [&>svg]:text-destructive/70 focus:[&>svg]:text-destructive"
                  onClick={() => navigate("/")}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-16">
        <div className="p-6 max-w-[1440px] mx-auto">
          <div className="pt-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Link to="/dashboard" aria-label="Back to dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-full pl-2.5 pr-3.5 gap-1.5 border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-colors"
                >
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
            </div>
          </div>
        </div>

        {/* Embedded ItemGuard Pro */}
        <div className="px-6 pb-6 max-w-[1440px] mx-auto">
          <div className="rounded-lg border border-border bg-white overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
            <iframe
              src="https://id-preview--06fdadb6-0a4c-433f-bdb0-e178ad1065f0.lovable.app/"
              title="Item Validation"
              className="h-full w-full border-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemValidation;
