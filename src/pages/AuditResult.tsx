
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAudit } from "@/contexts/AuditContext";
import MainLayout from "@/components/layouts/MainLayout";
import AuditResults from "@/components/audit/AuditResults";

export default function AuditResult() {
  const { user, loading: authLoading } = useAuth();
  const { getAudit, currentAudit, setCurrentAudit } = useAudit();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (id) {
      const audit = getAudit(id);
      if (audit) {
        setCurrentAudit(audit);
      } else {
        navigate("/dashboard");
      }
    }
  }, [id, user, authLoading, navigate, getAudit, setCurrentAudit]);

  if (authLoading || !currentAudit) {
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
      <AuditResults audit={currentAudit} />
    </MainLayout>
  );
}
