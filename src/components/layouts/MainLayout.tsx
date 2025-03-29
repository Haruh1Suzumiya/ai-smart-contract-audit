import { ReactNode, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/navigation/MainNav";
import Sidebar from "@/components/navigation/Sidebar";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  
  // Check if we're in a dashboard-related page
  const isDashboardPage = location.pathname.includes('/dashboard') || 
    location.pathname.includes('/audit/') || 
    location.pathname.includes('/settings') ||
    location.pathname.includes('/reports') ||
    location.pathname.includes('/features/');

  // Use effect to handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Main navigation header */}
      <MainNav />
      
      {/* Main content area with optional sidebar */}
      <div className="flex flex-1 pt-16"> {/* Adjust for fixed header */}
        {showSidebar && user && isDashboardPage && (
          <Sidebar />
        )}
        
        <main 
          className={`flex-1 transition-all duration-300 p-6 ${
            showSidebar && user && isDashboardPage ? 'lg:pl-64' : ''
          }`}
        >
          {/* Only show children after mounting to prevent layout shift */}
          {mounted && children}
        </main>
      </div>
    </div>
  );
}