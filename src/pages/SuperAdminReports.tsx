import { useState } from "react";
import { SuperAdminSidebar } from "@/components/SuperAdminSidebar";
import { AppHeader } from "@/components/AppHeader";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import comingSoonImage from "@/assets/coming-soon-new.jpg";

const SuperAdminReports = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onMenuClick={() => setMobileMenuOpen(true)} />
      {/* Desktop Sidebar */}
      <div className="fixed left-0 top-16 h-[calc(100%-4rem)] w-52 z-[60] hidden lg:block">
        <SuperAdminSidebar />
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SuperAdminSidebar onNavigate={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="ml-0 pt-16 lg:ml-52 min-h-screen flex flex-col">
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
          <h1 className="text-base sm:text-xl font-medium text-gray-900">Reports</h1>
        </div>

        {/* Main Content - Coming Soon */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12">
              <img 
                src={comingSoonImage}
                alt="Coming Soon" 
                className="w-full h-64 object-cover rounded-lg mb-8"
              />
              <h2 className="text-3xl sm:text-4xl font-medium text-gray-900 mb-4">
                Coming Soon
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Advanced reporting features are under development and will be available soon.
              </p>
              <div className="inline-block px-6 py-3 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Stay tuned for updates!
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SuperAdminReports;
