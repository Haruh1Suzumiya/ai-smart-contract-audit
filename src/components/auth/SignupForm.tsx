import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle, Mail, Lock, User, EyeOff, Eye, CheckCircle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/Logo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupForm() {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    
    try {
      await signUp(email, password, fullName);
      setSignupSuccess(true);
    } catch (error) {
      console.error("Signup error:", error);
      // Error message is handled by the Auth context
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50 dark:bg-gray-900">
      {/* Left Panel - Branding & Info */}
      <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-violet-700 p-8 text-white">
        <div className="max-w-md mx-auto flex flex-col items-center text-center space-y-8">
          <div className="flex items-center space-x-2 mb-4">
            <Logo size={48} className="text-white" />
            <h1 className="text-3xl font-bold">SecureAudit</h1>
          </div>
          
          <h2 className="text-2xl font-bold">Start securing your smart contracts today</h2>
          <p className="text-lg opacity-90">
            Create an account and get started with AI-powered smart contract security audits in minutes.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mt-8 w-full">
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-blue-600 p-2 mr-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Detect Vulnerabilities</h3>
                <p className="text-sm text-blue-100">Identify reentrancy, overflow, and other common issues</p>
              </div>
            </div>
            <div className="flex items-center mb-4">
              <div className="rounded-full bg-blue-600 p-2 mr-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Optimize Gas Usage</h3>
                <p className="text-sm text-blue-100">Reduce transaction costs with optimized code</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="rounded-full bg-blue-600 p-2 mr-3">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-medium">Best Practices</h3>
                <p className="text-sm text-blue-100">Follow Solidity coding standards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Panel - Signup Form */}
      <div className="flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto w-full">
          <div className="flex items-center justify-center md:hidden mb-8">
            <Logo size={40} />
            <h1 className="text-2xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-700">
              SecureAudit
            </h1>
          </div>
          
          {signupSuccess ? (
            <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mx-auto flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration successful!</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Please check your email to verify your account. We've sent a verification link to <strong>{email}</strong>.
                  </p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-700 hover:from-blue-700 hover:to-violet-800 text-white font-medium shadow-md"
                  >
                    Go to Login
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pt-4 pb-6 border-t border-gray-100 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Didn't receive an email?{" "}
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                    Resend verification email
                  </button>
                </p>
              </CardFooter>
            </Card>
          ) : (
            <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                <CardDescription className="text-center">
                  Fill in the form below to create your account
                </CardDescription>
              </CardHeader>
              
              {errorMessage && (
                <div className="px-6">
                  <Alert variant="destructive" className="border-red-300 dark:border-red-800 text-red-800 dark:text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                </div>
              )}
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="full-name"
                        type="text"
                        placeholder="John Doe"
                        className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Password must be at least 6 characters
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-700 hover:from-blue-700 hover:to-violet-800 text-white font-medium shadow-md mt-2" 
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    Sign in
                  </Link>
                </div>
                
                <div className="flex items-center justify-between w-full">
                  <hr className="w-full border-gray-200 dark:border-gray-700" />
                  <span className="px-3 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">or</span>
                  <hr className="w-full border-gray-200 dark:border-gray-700" />
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Continue with Google
                </Button>
                
                <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="underline text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                    Privacy Policy
                  </a>
                </p>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}