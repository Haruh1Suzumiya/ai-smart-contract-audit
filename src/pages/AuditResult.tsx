import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAudit } from "@/contexts/AuditContext";
import MainLayout from "@/components/layouts/MainLayout";
import AuditResults from "@/components/audit/AuditResults";
import AuditLoading from "@/components/audit/AuditLoading";

export default function AuditResult() {
  const { user, loading: authLoading } = useAuth();
  const { getAudit, currentAudit, setCurrentAudit, loading: auditLoading } = useAudit();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    const loadAudit = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        
        // 現在のauditが同じIDならロードしない
        if (currentAudit && currentAudit.id === id) {
          setLoading(false);
          return;
        }
        
        const audit = await getAudit(id);
        if (audit) {
          setCurrentAudit(audit);
        } else {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error loading audit:", error);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadAudit();
  }, [id, user, authLoading, currentAudit, navigate, getAudit, setCurrentAudit]);

  if (authLoading || loading || !currentAudit) {
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
      {auditLoading ? <AuditLoading /> : <AuditResults audit={currentAudit} />}
    </MainLayout>
  );
}