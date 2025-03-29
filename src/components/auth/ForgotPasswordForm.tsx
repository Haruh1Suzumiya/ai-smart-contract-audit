import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    <div className="mx-auto max-w-md space-y-6 p-6 border border-border rounded-lg shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isSubmitted
            ? "Check your email for a password reset link"
            : "Enter your email to receive a password reset link"}
        </p>
      </div>
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              If an account exists with this email, you will receive a password reset
              link shortly.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link to="/login">Return to Login</Link>
          </Button>
        </div>
      )}
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}