import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAudit } from "@/contexts/AuditContext";
import MainLayout from "@/components/layouts/MainLayout";
import AuditForm from "@/components/audit/AuditForm";
import AuditLoading from "@/components/audit/AuditLoading"; 

export default function NewAudit() {
  const { user, loading: authLoading } = useAuth();
  const { loading: auditLoading } = useAudit();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-80">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {auditLoading ? <AuditLoading /> : <AuditForm />}
    </MainLayout>
  );
}