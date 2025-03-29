import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import AuditForm from "@/components/audit/AuditForm";
import AuditLoading from "@/components/audit/AuditLoading";
import { useAuth } from "@/contexts/AuthContext";
import { useAudit } from "@/contexts/AuditContext";

export default function NewAudit() {
  const { user, loading: authLoading } = useAuth();
  const { loading: auditLoading } = useAudit();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is not logged in and not currently loading auth state, redirect to login
    if (!user && !authLoading) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <MainLayout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {auditLoading ? <AuditLoading /> : <AuditForm />}
      </div>
    </MainLayout>
  );
}