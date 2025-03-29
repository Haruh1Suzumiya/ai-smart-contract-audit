import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MainLayout from "@/components/layouts/MainLayout";
import { toast } from "sonner";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Extract the hash fragment from the URL
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    // Check if there's an access token or error
    const accessToken = params.get("access_token");
    const error = params.get("error");
    const type = params.get("type");
    
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
    
    if (!accessToken || !type || type !== "recovery") {
      // If no token or not a recovery, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!newPassword || !confirmPassword) {
      setErrorMessage("Please fill out all fields");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      
      // Update password using the access token from the URL
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });
      
      if (error) {
        throw error;
      }
      
      setSuccess(true);
      toast.success("Your password has been reset successfully!");
      
      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Failed to reset password. Please try again.");
      if (error instanceof Error) {
        setErrorMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout showSidebar={false}>
      <div className="max-w-md mx-auto py-10">
        <div className="mx-auto max-w-md space-y-6 p-6 border border-border rounded-lg shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {success 
                ? "Your password has been reset successfully!" 
                : "Enter your new password below."}
            </p>
          </div>
          
          {success ? (
            <Alert>
              <AlertDescription>
                Your password has been reset successfully! 
                You will be redirected to the login page shortly.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting password..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
}