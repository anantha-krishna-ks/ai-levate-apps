import { useState } from "react";
import { Menu, CheckCircle, XCircle, FileSearch, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SuperAdminSidebar } from "@/components/SuperAdminSidebar";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const SuperAdminDashboard = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fromDate, setFromDate] = useState("2024-01-01");
  const [toDate, setToDate] = useState("2025-11-26");
  const [organization, setOrganization] = useState("");
  const [status, setStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasData, setHasData] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = () => {
    if (!organization || organization === "none") {
      setShowError(true);
      setHasData(false);
    } else {
      setShowError(false);
      setHasData(true);
    }
  };

  const mockData = [
    {
      date: "02/18/2025 9:19 AM",
      userName: "Madhuri R",
      contactDetails: "8660554859",
      emailId: "madhuri.r@excelindia.com",
      applicationName: "Item Generation",
      adminStatus: "Approved"
    },
    {
      date: "02/17/2025 3:45 PM",
      userName: "Rajesh K",
      contactDetails: "9876543210",
      emailId: "rajesh.k@excelindia.com",
      applicationName: "Essay Evaluation",
      adminStatus: "Rejected"
    },
    {
      date: "02/16/2025 11:30 AM",
      userName: "Priya S",
      contactDetails: "8765432109",
      emailId: "priya.s@excelindia.com",
      applicationName: "Doc Chat",
      adminStatus: "Approved"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="fixed left-0 top-0 h-full w-52 z-40 hidden lg:block">
        <SuperAdminSidebar />
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SuperAdminSidebar onNavigate={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="ml-0 lg:ml-52 min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden flex-shrink-0"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="min-w-0 flex items-center gap-3 flex-1">
                <h1 className="text-base sm:text-xl font-medium text-gray-900 truncate">
                  Subscription Management
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <ProfileDropdown />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
                <Select value={organization} onValueChange={setOrganization}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select Organization</SelectItem>
                    <SelectItem value="excelsoft">Excelsoft Technologies</SelectItem>
                    <SelectItem value="other">Other Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handleSubmit}
                  className="w-full bg-[#2563eb] hover:bg-[#2563eb]/90"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {showError && (
            <div className="bg-white rounded-lg shadow-sm p-8 flex items-center justify-center animate-fade-in">
              <div className="text-center max-w-lg">
                <div className="relative mx-auto w-20 h-20 mb-4">
                  {/* Animated background circles */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 rounded-full animate-pulse opacity-50"></div>
                  <div className="absolute inset-2 bg-white rounded-full"></div>
                  
                  {/* Icon container */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <FileSearch className="w-10 h-10 text-orange-500" strokeWidth={1.5} />
                      <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5">
                        <AlertCircle className="w-4 h-4 text-red-500" fill="currentColor" />
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Subscription Details Found
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  We couldn't find any subscription details for the selected criteria. Please try selecting a different organization or adjusting your date range.
                </p>
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3">
                  <div className="flex items-start gap-2 text-left">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white text-[10px] font-medium">!</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-orange-900 mb-0.5">Quick Tip</p>
                      <p className="text-xs text-orange-700">
                        Select an organization from the dropdown and verify the date range.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Table */}
          {hasData && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-medium">Date</TableHead>
                    <TableHead className="font-medium">User Name</TableHead>
                    <TableHead className="font-medium">Contact Details</TableHead>
                    <TableHead className="font-medium">Email Id</TableHead>
                    <TableHead className="font-medium">Application Name</TableHead>
                    <TableHead className="font-medium">Admin Status</TableHead>
                    <TableHead className="font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData
                    .filter((row) => {
                      if (status === "all") return true;
                      return row.adminStatus.toLowerCase() === status;
                    })
                    .filter((row) => {
                      if (!searchQuery) return true;
                      const searchLower = searchQuery.toLowerCase();
                      return (
                        row.userName.toLowerCase().includes(searchLower) ||
                        row.emailId.toLowerCase().includes(searchLower) ||
                        row.applicationName.toLowerCase().includes(searchLower)
                      );
                    })
                    .map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.date}</TableCell>
                        <TableCell>{row.userName}</TableCell>
                        <TableCell>{row.contactDetails}</TableCell>
                        <TableCell>{row.emailId}</TableCell>
                        <TableCell>{row.applicationName}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              row.adminStatus === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {row.adminStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            </button>
                            <button
                              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5 text-red-600" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Initial State */}
          {!hasData && !showError && (
            <div className="bg-white rounded-lg shadow-sm p-12 flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Please select an organization and click Submit to view subscription details.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
