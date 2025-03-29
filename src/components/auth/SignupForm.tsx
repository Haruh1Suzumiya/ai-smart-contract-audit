import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle, Mail, Lock, User, EyeOff, Eye, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/Logo";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Logo size={64} />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Create a new account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Or{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        {signupSuccess ? (
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Registration successful!</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Please check your email to verify your account.
              </p>
              <div className="mt-6">
                <Button
                  className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white shadow-sm"
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {errorMessage && (
              <Alert variant="destructive" className="animate-fade-in">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 dark:border-gray-700">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="full-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="full-name"
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 block w-full"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-10 block w-full"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 block w-full"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 6 characters
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </Label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10 pr-10 block w-full"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white shadow-sm" 
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Create account"}
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}