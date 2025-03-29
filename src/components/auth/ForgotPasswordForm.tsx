import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Logo from "@/components/Logo";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordForm() {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!email) {
      setErrorMessage("Please enter your email");
      return;
    }
    
    try {
      await resetPassword(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Reset password error:", error);
      // Error message is handled by the Auth context
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <Link to="/" className="flex items-center mb-6">
            <Logo size={40} />
            <h1 className="text-2xl font-bold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-700">
              SecureAudit
            </h1>
          </Link>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isSubmitted
              ? "Check your email for a password reset link"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>
        
        {!isSubmitted ? (
          <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
            {errorMessage && (
              <div className="px-6 pt-6">
                <Alert variant="destructive" className="border-red-300 dark:border-red-800 text-red-800 dark:text-red-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </div>
            )}
            
            <CardContent className={errorMessage ? "pt-4" : "pt-6"}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
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
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-violet-700 hover:from-blue-700 hover:to-violet-800 text-white font-medium shadow-md" 
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center pt-2 pb-6">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-gray-200 dark:border-gray-800 shadow-lg">
            <CardContent className="pt-6 pb-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full mx-auto flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We've sent a password reset link to <strong>{email}</strong>.
                  <br /><br />
                  The link will expire in 24 hours.
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-violet-700 hover:from-blue-700 hover:to-violet-800 text-white font-medium shadow-md"
                >
                  <Link to="/login">Return to Login</Link>
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center pt-2 pb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Didn't receive an email?{" "}
                <button 
                  onClick={() => {
                    setIsSubmitted(false);
                    toast.info("Enter your email and try again");
                  }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Try again
                </button>
              </p>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}