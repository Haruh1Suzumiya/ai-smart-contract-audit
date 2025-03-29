import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import AuditHistoryList from "@/components/audit/AuditHistoryList";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, History } from "lucide-react";

export default function AuditHistory() {
  const { user, loading: authLoading } = useAuth();
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
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <History className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <h2 className="text-3xl font-bold">Audit History</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage your previous smart contract security audits
            </p>
          </div>
          <Button 
            onClick={() => navigate("/audit/new")}
            className="bg-gradient-to-r from-blue-500 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Audit
          </Button>
        </div>
        
        <AuditHistoryList />
      </div>
    </MainLayout>
  );
}