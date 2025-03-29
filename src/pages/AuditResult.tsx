import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAudit } from "@/contexts/AuditContext";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/layouts/MainLayout";
import AuditResults from "@/components/audit/AuditResults";
import AuditLoading from "@/components/audit/AuditLoading";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function AuditResult() {
  const { id } = useParams<{ id: string }>();
  const { getAudit } = useAudit();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // If user is not logged in and not currently loading auth state, redirect to login
    if (!user && !authLoading) {
      navigate("/login");
      return;
    }
    
    const fetchAudit = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        const result = await getAudit(id);
        
        if (!result) {
          setError("Audit not found");
          return;
        }
        
        setAudit(result);
      } catch (error) {
        console.error("Error fetching audit:", error);
        setError("Failed to load audit data");
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchAudit();
    }
  }, [id, user, authLoading, getAudit, navigate]);

  if (authLoading || loading) {
    return (
      <MainLayout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <AuditLoading />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container max-w-3xl mx-auto px-4 py-16">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!audit) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <AuditResults audit={audit} />
      </div>
    </MainLayout>
  );
}