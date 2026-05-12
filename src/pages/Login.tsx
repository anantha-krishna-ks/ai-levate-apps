import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkle, Eye, EyeOff, AlertCircle, CheckCircle2, LogIn, User, ShieldCheck, Zap, Mail, Lock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: ""
  });
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "", general: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({ username: "", password: "", general: "" });
    
    // Validation
    let hasErrors = false;
    const newErrors = { username: "", password: "", general: "" };
    
    // Check if fields are empty
    if (!formData.username.trim()) {
      newErrors.username = "Please enter your username or email address";
      hasErrors = true;
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Please enter your password";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    // Email format validation for username field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmail = emailRegex.test(formData.username);
    
    // Simulate login validation with demo accounts
    const validAccounts = [
      { username: "demo@example.com", password: "password123", type: "email", role: "user" },
      { username: "superadmin@excelindia.com", password: "school", type: "email", role: "superadmin" }
    ];
    
    const matchedAccount = validAccounts.find(account => 
      account.username.toLowerCase() === formData.username.toLowerCase()
    );
    
    if (!matchedAccount) {
      if (isEmail) {
        newErrors.username = `No account found with email "${formData.username}". Please check the spelling or create a new account.`;
      } else {
        newErrors.username = `Username "${formData.username}" doesn't exist. Try using: demo@example.com`;
      }
      setErrors(newErrors);
      return;
    }
    
    if (matchedAccount.password !== formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = "Password is too short. Please enter at least 6 characters.";
      } else {
        newErrors.password = `Incorrect password for ${matchedAccount.type === 'email' ? 'this email' : 'username "' + matchedAccount.username + '"'}. Please try again.`;
      }
      setErrors(newErrors);
      return;
    }
    
    // Successful login - store user role and navigate
    localStorage.setItem("userRole", matchedAccount.role);
    localStorage.setItem("userEmail", matchedAccount.username);
    
    if (matchedAccount.role === "superadmin") {
      navigate("/superadmin-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  const canSubmit = () => {
    return formData.username.trim() && formData.password.trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute top-1/3 -right-20 w-64 h-64 bg-gradient-to-r from-purple-400/15 to-pink-400/15 rounded-full blur-3xl animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '30s' }} />
        
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - AI Illustration Area */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
          <div className="max-w-md text-center space-y-8">
            {/* AI-Levate Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <img 
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
                alt="AI-Levate" 
                className="h-12 w-auto"
              />
            </div>

            {/* Abstract AI Visualization */}
            <div className="relative mx-auto w-80 h-80">
              {/* Central Core */}
              <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-primary to-blue-500 rounded-full shadow-2xl animate-pulse" />
              
              {/* Orbiting Elements */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-80" />
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-80" />
              </div>
              
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-80" />
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-red-400 to-rose-400 rounded-full opacity-80" />
              </div>

              {/* Neural Network Lines */}
              <div className="absolute inset-0">
                <svg className="w-full h-full opacity-30" viewBox="0 0 320 320">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2e5c9e" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                  <path d="M160,60 Q160,160 60,160" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" />
                  <path d="M160,60 Q160,160 260,160" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <path d="M60,160 Q160,160 160,260" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '1s' }} />
                  <path d="M260,160 Q160,160 160,260" stroke="url(#lineGradient)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '1.5s' }} />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-medium text-gray-900 leading-tight">
                Welcome Back to
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> AI Innovation</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Sign in to continue your AI-powered automation and intelligent workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <img 
                src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
                alt="AI-Levate" 
                className="h-10 w-auto"
              />
            </div>

            <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
              <CardContent className="p-8">
                {/* Header */}
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-medium text-gray-900 mb-2">Welcome Back</h2>
                  <p className="text-gray-600">Sign in to your AI-powered platform</p>
                </div>

                {/* Login Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  {/* General Error Message */}
                  {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-red-700">{errors.general}</p>
                      </div>
                    </div>
                  )}

                  {/* Demo Accounts dropdown */}
                  <div>
                    <Select
                      onValueChange={(value) => {
                        if (value === "user") {
                          handleInputChange("username", "demo@example.com");
                          handleInputChange("password", "password123");
                        } else if (value === "superadmin") {
                          handleInputChange("username", "superadmin@excelindia.com");
                          handleInputChange("password", "school");
                        }
                      }}
                    >
                      <SelectTrigger
                        className="h-12 bg-primary-soft/60 border border-primary/20 text-sm text-foreground hover:bg-primary-soft hover:border-primary/40 focus:ring-primary/30 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shrink-0">
                            <Zap className="w-3.5 h-3.5" />
                          </span>
                          <SelectValue placeholder="Quick fill demo account" />
                        </div>
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-border/70 shadow-soft-md p-1.5">
                        <SelectItem
                          value="user"
                          className="rounded-xl py-2.5 pl-3 pr-8 cursor-pointer focus:bg-primary-soft focus:text-foreground data-[state=checked]:bg-primary-soft"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pastel-sky text-pastel-sky-ink shrink-0">
                              <User className="w-4 h-4" />
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium leading-tight">User</span>
                              <span className="text-xs text-muted-foreground">demo@example.com</span>
                            </div>
                          </div>
                        </SelectItem>
                        <SelectItem
                          value="superadmin"
                          className="rounded-xl py-2.5 pl-3 pr-8 cursor-pointer focus:bg-primary-soft focus:text-foreground data-[state=checked]:bg-primary-soft"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-pastel-lavender text-pastel-lavender-ink shrink-0">
                              <ShieldCheck className="w-4 h-4" />
                            </span>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium leading-tight">Super Admin</span>
                              <span className="text-xs text-muted-foreground">superadmin@excelindia.com</span>
                            </div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <Input
                      placeholder="Username or Email"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`h-12 border-gray-200 bg-white/80 pl-12 focus:border-primary focus:ring-primary/20 transition-all duration-200 ${
                        errors.username ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                      }`}
                    />
                    {errors.username && (
                      <div className="flex items-center mt-2 animate-fade-in">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />
                        <p className="text-sm text-red-600">{errors.username}</p>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`h-12 border-gray-200 bg-white/80 pl-12 pr-12 focus:border-primary focus:ring-primary/20 transition-all duration-200 ${
                        errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.password && (
                      <div className="flex items-center mt-2 animate-fade-in">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />
                        <p className="text-sm text-red-600">{errors.password}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button 
                    type="submit"
                    disabled={!canSubmit()}
                    className="w-full h-12 bg-[#2563eb] hover:bg-[#2563eb]/90 text-white font-medium rounded-full transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button 
                      onClick={() => navigate('/register')}
                      className="text-primary hover:text-primary/80 font-medium transition-colors underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="mt-8 text-center space-y-2">
              <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                <Sparkle className="w-3 h-3" />
                <span className="flex items-center gap-1">Powered By: 
                  <img 
                    src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png" 
                    alt="AI-Levate" 
                    className="h-3 w-auto"
                  />
                </span>
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <p>Copyright © 2025 | Excelsoft Technologies Ltd.</p>
                <div className="flex items-center justify-center space-x-4">
                  <a href="#" className="hover:text-primary transition-colors">Privacy and Cookie Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-primary transition-colors">Help</a>
                  <span>•</span>
                  <span>Version: V.1.0.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;