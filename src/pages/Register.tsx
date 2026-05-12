import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Brain, Sparkle, ArrowRight, ArrowLeft, Check, Mail, User, Building, Shield, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    organizationName: "",
    acceptTerms: false
  });
  const [fieldValidation, setFieldValidation] = useState({
    firstName: false,
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
    contactNumber: false,
    organizationName: false
  });
  const [errors, setErrors] = useState({
    firstName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    organizationName: "",
    general: ""
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "", general: "" }));
    }
    
    // Real-time validation
    if (typeof value === 'string' && value.length > 0) {
      if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setFieldValidation(prev => ({ ...prev, [field]: emailRegex.test(value) }));
      } else if (field === 'password') {
        setFieldValidation(prev => ({ ...prev, [field]: value.length >= 6 }));
      } else if (field === 'confirmPassword') {
        setFieldValidation(prev => ({ ...prev, [field]: value === formData.password && value.length >= 6 }));
      } else if (field === 'contactNumber') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        setFieldValidation(prev => ({ ...prev, [field]: phoneRegex.test(value.replace(/\s/g, '')) }));
      } else {
        setFieldValidation(prev => ({ ...prev, [field]: value.trim().length > 0 }));
      }
    }
  };

  const getProgressPercentage = () => {
    return (currentStep / 3) * 100;
  };

  const canProceedStep1 = () => {
    return formData.firstName.trim() && formData.email.trim() && fieldValidation.email;
  };

  const canProceedStep2 = () => {
    return formData.username.trim() && formData.password.trim() && fieldValidation.password;
  };

  const canSubmit = () => {
    return formData.organizationName.trim() && formData.acceptTerms;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors = {
      firstName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      organizationName: "",
      general: ""
    };
    
    // Validation
    let hasErrors = false;
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      hasErrors = true;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else if (!fieldValidation.email) {
      newErrors.email = "Please enter a valid email address";
      hasErrors = true;
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      hasErrors = true;
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
      hasErrors = true;
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (!fieldValidation.password) {
      newErrors.password = "Password must be at least 6 characters";
      hasErrors = true;
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
      hasErrors = true;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }
    
    if (formData.contactNumber.trim() && !fieldValidation.contactNumber) {
      newErrors.contactNumber = "Please enter a valid contact number";
      hasErrors = true;
    }
    
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = "Organization name is required";
      hasErrors = true;
    }
    
    if (!formData.acceptTerms) {
      newErrors.general = "Please accept the End User License Agreement to continue";
      hasErrors = true;
    }
    
    if (hasErrors) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate successful registration
    console.log("Registration successful:", formData);
    navigate("/dashboard");
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
                Join the Future of
                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> AI Innovation</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Create your account and unlock the full potential of AI-powered automation and intelligent workflows.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
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
                  <div className="text-sm text-gray-500 mb-4">
                    Already have an account?{' '}
                    <button 
                      onClick={() => navigate('/')}
                      className="text-primary hover:text-primary/80 font-medium transition-colors underline"
                    >
                      Sign in
                    </button>
                  </div>
                  <h2 className="text-3xl font-medium text-gray-900 mb-2">Create Account</h2>
                  <p className="text-gray-600">Join the AI-powered platform</p>
                </div>

                {/* Simple Registration Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                  {/* General Error Message */}
                  {errors.general && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
                      <div className="flex items-center">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                        <p className="text-sm text-red-700">{errors.general}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="First Name *"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`h-12 border-gray-200 bg-white/80 focus:border-primary focus:ring-primary/20 transition-all duration-200 ${
                          errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 
                          fieldValidation.firstName ? 'border-green-300 focus:border-green-500' : ''
                        }`}
                      />
                      {errors.firstName && (
                        <div className="flex items-center mt-1 animate-fade-in">
                          <AlertCircle className="w-3 h-3 text-red-500 mr-1 flex-shrink-0" />
                          <p className="text-xs text-red-600">{errors.firstName}</p>
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="h-12 border-gray-200 bg-white/80 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`h-12 border-gray-200 bg-white/80 focus:border-primary focus:ring-primary/20 transition-all duration-200 ${
                        errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 
                        fieldValidation.email && formData.email ? 'border-green-300 focus:border-green-500' : ''
                      }`}
                    />
                    {errors.email && (
                      <div className="flex items-center mt-2 animate-fade-in">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />
                        <p className="text-sm text-red-600">{errors.email}</p>
                      </div>
                    )}
                    {!errors.email && fieldValidation.email && formData.email && (
                      <div className="flex items-center mt-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />
                        <p className="text-sm text-green-600">Valid email format</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Username *"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`h-12 border-gray-200 bg-white/80 focus:border-primary focus:ring-primary/20 transition-all duration-200 ${
                        errors.username ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 
                        fieldValidation.username && formData.username ? 'border-green-300 focus:border-green-500' : ''
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
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password *"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`h-12 border-gray-200 bg-white/80 focus:border-primary focus:ring-primary/20 transition-all duration-200 pr-12 ${
                        errors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 
                        fieldValidation.password && formData.password ? 'border-green-300 focus:border-green-500' : ''
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
                    {!errors.password && fieldValidation.password && formData.password && (
                      <div className="flex items-center mt-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />
                        <p className="text-sm text-green-600">Strong password</p>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password *"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`h-12 border-gray-200 bg-white/80 focus:border-primary focus:ring-primary/20 transition-all duration-200 pr-12 ${
                        errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 
                        fieldValidation.confirmPassword && formData.confirmPassword ? 'border-green-300 focus:border-green-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {errors.confirmPassword && (
                      <div className="flex items-center mt-2 animate-fade-in">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />
                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                      </div>
                    )}
                    {!errors.confirmPassword && fieldValidation.confirmPassword && formData.confirmPassword && (
                      <div className="flex items-center mt-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />
                        <p className="text-sm text-green-600">Passwords match</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Input
                      type="tel"
                      placeholder="Contact Number"
                      value={formData.contactNumber}
                      onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                      className={`h-12 border-gray-200 bg-white/80 focus:border-primary focus:ring-primary/20 transition-all duration-200 ${
                        errors.contactNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 
                        fieldValidation.contactNumber && formData.contactNumber ? 'border-green-300 focus:border-green-500' : ''
                      }`}
                    />
                    {errors.contactNumber && (
                      <div className="flex items-center mt-2 animate-fade-in">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />
                        <p className="text-sm text-red-600">{errors.contactNumber}</p>
                      </div>
                    )}
                    {!errors.contactNumber && fieldValidation.contactNumber && formData.contactNumber && (
                      <div className="flex items-center mt-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mr-1 flex-shrink-0" />
                        <p className="text-sm text-green-600">Valid contact number</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <Input
                      placeholder="Organization Name *"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      className={`h-12 border-gray-200 bg-white/80 focus:border-primary focus:ring-primary/20 transition-all duration-200 ${
                        errors.organizationName ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 
                        fieldValidation.organizationName && formData.organizationName ? 'border-green-300 focus:border-green-500' : ''
                      }`}
                    />
                    {errors.organizationName && (
                      <div className="flex items-center mt-2 animate-fade-in">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1 flex-shrink-0" />
                        <p className="text-sm text-red-600">{errors.organizationName}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start space-x-2 py-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleInputChange('acceptTerms', checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                      I accept the{' '}
                      <a href="#" className="text-primary hover:text-primary/80 underline">
                        End User License Agreement (EULA)
                      </a>
                    </Label>
                  </div>

                  <Button 
                    type="submit"
                    className="w-full h-12 bg-[#2563eb] hover:bg-[#2563eb]/90 text-white font-medium rounded-full transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    Create Account
                  </Button>
                </form>
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

export default Register;