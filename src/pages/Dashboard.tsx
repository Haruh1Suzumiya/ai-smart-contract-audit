import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is not logged in and not currently loading auth state, redirect to login
    if (!user && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
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
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <DashboardOverview />
      </div>
    </MainLayout>
  );
}