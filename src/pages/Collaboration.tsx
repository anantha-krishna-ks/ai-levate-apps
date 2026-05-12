import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Search, Edit, Trash2, Package, Menu, Plus, Users as UsersIcon, X } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import { useSidebarCollapsed } from "@/hooks/use-sidebar-collapsed";
import { ProfileDropdown } from "@/components/ProfileDropdown";

const users = [
  { id: 1, firstName: "ShivaEu01", lastName: "M", loginName: "ShivaEu01", emailId: "shivaraj@gmail.com" },
  { id: 2, firstName: "naresh", lastName: "dp", loginName: "nareshdp", emailId: "nareshgowdadpn@gmail.com" },
  { id: 3, firstName: "Vish", lastName: "", loginName: "Vish", emailId: "Vishwanath.subbanng@excelindia.com" },
  { id: 4, firstName: "Naresh", lastName: "N", loginName: "nareshgowda.dp@excelindia.com", emailId: "nareshgowda.dp@excelindia.com" },
  { id: 5, firstName: "abcd", lastName: "D", loginName: "abcd", emailId: "abcd@gmail.com" },
  { id: 6, firstName: "ESUser1", lastName: "", loginName: "ESUser1", emailId: "ESUser1@excelsoftcorp.com" },
  { id: 7, firstName: "ESUser2", lastName: "", loginName: "ESUser2", emailId: "ESUser2@excelsoftcorp.com" },
  { id: 8, firstName: "ESUser3", lastName: "", loginName: "ESUser3", emailId: "ESUser3@excelsoftcorp.com" },
];

const Collaboration = () => {
  const sidebarCollapsed = useSidebarCollapsed();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [deletingUser, setDeletingUser] = useState<typeof users[0] | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userName: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditUser = (user: typeof users[0]) => {
    setEditingUserId(user.id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.emailId,
      userName: user.loginName,
      password: "",
      confirmPassword: "",
      contactNumber: "",
    });
    setIsAddingUser(true);
  };

  const handleSaveUser = () => {
    // TODO: Add validation and save logic
    if (editingUserId) {
      console.log("Updating user:", editingUserId, formData);
    } else {
      console.log("Creating user:", formData);
    }
    setIsAddingUser(false);
    setEditingUserId(null);
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      userName: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
    });
  };

  const handleDeleteUser = () => {
    if (deletingUser) {
      console.log("Deleting user:", deletingUser.id);
      // TODO: Implement actual delete logic
      setDeletingUser(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.loginName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.emailId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onMenuClick={() => setMobileMenuOpen(true)} />
      {/* Desktop Sidebar */}
      <div
        className={`fixed left-0 top-16 h-[calc(100%-4rem)] z-[60] hidden lg:block transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-52"
        }`}
      >
        <AppSidebar />
      </div>

      {/* Mobile Menu Sheet */}
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
          sidebarCollapsed ? "lg:ml-16" : "lg:ml-52"
        }`}
      >
        {/* Page Title Section */}
        <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base sm:text-lg font-medium text-gray-900">
                  Collaboration
                </h2>
              </div>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
              onClick={() => setIsAddingUser(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Add/Edit User Dialog */}
        <Dialog open={isAddingUser} onOpenChange={(open) => {
          setIsAddingUser(open);
          if (!open) setEditingUserId(null);
        }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-gray-900">
                {editingUserId ? "Edit User" : "Create User"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                  <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">Last Name</Label>
                    <Input
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-900">Contact Number</Label>
                  <Input
                    placeholder="+91-00000-00000"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              {/* Account Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <div className="w-1 h-5 bg-green-600 rounded-full"></div>
                  <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">
                      User Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter username"
                      value={formData.userName}
                      onChange={(e) => handleInputChange("userName", e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <div className="w-1 h-5 bg-purple-600 rounded-full"></div>
                  <h3 className="text-lg font-medium text-gray-900">Security</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-900">
                      Confirm Password <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsAddingUser(false);
                    setEditingUserId(null);
                  }}
                  className="flex-1 h-11 text-base font-medium"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveUser}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11 text-base font-medium"
                >
                  {editingUserId ? "Update User" : "Save User"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Subscription Details Dialog */}
        <Dialog open={subscriptionDialogOpen} onOpenChange={setSubscriptionDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-medium text-gray-900">Subscription Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Subscription Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-12">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </TableHead>
                      <TableHead className="font-medium text-gray-900">App Name</TableHead>
                      <TableHead className="font-medium text-gray-900">App Status</TableHead>
                      <TableHead className="font-medium text-gray-900">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                        No subscription details available.
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 text-base font-medium"
                >
                  Tag Apps
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 text-base font-medium"
                >
                  Untag Apps
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                {deletingUser && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 text-gray-900">
                    <p><span className="font-medium">Name:</span> {deletingUser.firstName} {deletingUser.lastName}</p>
                    <p><span className="font-medium">Login Name:</span> {deletingUser.loginName}</p>
                    <p><span className="font-medium">Email:</span> {deletingUser.emailId}</p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteUser}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Search Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-gray-300"
                />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-medium text-gray-900">First Name</TableHead>
                    <TableHead className="font-medium text-gray-900">Last Name</TableHead>
                    <TableHead className="font-medium text-gray-900">Login Name</TableHead>
                    <TableHead className="font-medium text-gray-900">Email Id</TableHead>
                    <TableHead className="font-medium text-gray-900">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-gray-900">{user.firstName}</TableCell>
                        <TableCell className="text-gray-900">{user.lastName}</TableCell>
                        <TableCell className="text-gray-900">{user.loginName}</TableCell>
                        <TableCell className="text-gray-900">{user.emailId}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => setDeletingUser(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => {
                                setSelectedUserId(user.id);
                                setSubscriptionDialogOpen(true);
                              }}
                            >
                              <Package className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Collaboration;
