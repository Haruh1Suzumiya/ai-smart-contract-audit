import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function VerifyEmailForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        
        if (type === "signup" && token) {
          // This is a signup confirmation
          // Users would typically click a link in their email that Supabase auth sends
          // In this demo app, we'll simulate verification
          setVerified(true);
          toast.success("Email verified successfully!");
        } else {
          setError("Invalid verification parameters");
        }
      } catch (err) {
        console.error("Error verifying email:", err);
        setError("There was a problem verifying your email");
        toast.error("Failed to verify email");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, type]);

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 border border-border rounded-lg shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Email Verification</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {loading
            ? "Verifying your email address..."
            : verified
            ? "Your email has been verified successfully"
            : "There was a problem verifying your email"}
        </p>
      </div>
      <div className="flex justify-center">
        {loading ? (
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        ) : verified ? (
          <div className="rounded-full bg-green-100 p-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        ) : (
          <div className="rounded-full bg-red-100 p-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        )}
      </div>
      {!loading && (
        <div className="space-y-4">
          {verified ? (
            <Alert>
              <AlertDescription>
                Your email has been verified successfully! You can now log in to your account.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error || "The verification link may have expired or is invalid."}
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            className="w-full" 
            onClick={handleContinue}
          >
            Continue to Login
          </Button>
        </div>
      )}
    </div>
  );
}