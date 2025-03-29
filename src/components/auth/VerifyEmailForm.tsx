
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function VerifyEmailForm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (token) {
        setVerified(true);
        toast.success("Email verified successfully!");
      } else {
        toast.error("Invalid verification token");
      }
      
      setLoading(false);
    };

    verifyEmail();
  }, [token]);

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <div className="rounded-full bg-red-100 p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </div>
      {!loading && (
        <div className="space-y-4">
          {verified ? (
            <Button className="w-full" onClick={handleContinue}>
              Continue to Login
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-center text-sm">
                The verification link may have expired or is invalid.
              </p>
              <Button asChild className="w-full">
                <Link to="/login">Return to Login</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
