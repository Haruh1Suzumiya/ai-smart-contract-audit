import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainNav from "@/components/navigation/MainNav";
import Sidebar from "@/components/navigation/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function MainLayout({ children, showSidebar = true }: MainLayoutProps) {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <div className="flex">
        {showSidebar && user && (
          <Sidebar />
        )}
        <main className={`flex-1 ${showSidebar && user ? 'pl-0 md:pl-64' : ''} transition-all duration-300`}>
          <div className="container max-w-full py-6 md:py-10 px-4 md:px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}