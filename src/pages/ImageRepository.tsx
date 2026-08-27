import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Images } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";

const ImageRepository = () => {
  const sidebarCollapsed = useSidebarCollapsed();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F8FC]">
      <AppHeader onMenuClick={() => setMobileMenuOpen(true)} />

      <div
        className={`fixed left-0 top-16 h-[calc(100%-4rem)] z-[60] hidden lg:block transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-52"
        }`}
      >
        <AppSidebar />
      </div>

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
        className={`ml-0 pt-16 min-h-screen flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-60"
        }`}
      >
        <div className="relative bg-white border-b border-slate-200">
          <div className="relative px-4 sm:px-6 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 p-1">
                <div className="h-full w-full rounded-sm bg-blue-600 flex items-center justify-center">
                  <Images className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg font-semibold text-slate-900 truncate">
                  Image Repository
                </h1>
                <p className="text-xs text-slate-500 truncate">
                  Manage reusable images used across books and generated items
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6">
          <div className="rounded-2xl border border-gray-200/70 bg-white shadow-sm p-10 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Images className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">
              Image Repository coming up next
            </h2>
            <p className="mt-1 text-sm text-slate-500 max-w-md">
              This module is part of the Manage Content revamp. Upload, tagging and
              reuse of images will be implemented here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageRepository;
