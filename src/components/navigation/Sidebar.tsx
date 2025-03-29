import { Link, useLocation } from "react-router-dom";
import { 
  BarChart, 
  FileText, 
  Home, 
  Settings, 
  PlusCircle, 
  History, 
  ShieldCheck,
  Zap,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";

interface SidebarItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  isActive: boolean;
}

function SidebarItem({ href, icon: Icon, title, isActive }: SidebarItemProps) {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
        isActive 
          ? "bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-900/20 dark:to-violet-900/20 text-blue-600 dark:text-blue-400 font-medium" 
          : "text-gray-500 dark:text-gray-400"
      )}
    >
      <Icon className={cn(
        "h-5 w-5",
        isActive 
          ? "text-blue-600 dark:text-blue-400" 
          : "text-gray-500 dark:text-gray-400"
      )} />
      <span>{title}</span>
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hidden md:block">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            <Logo size={24} className="mr-2" />
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-600">
              SecureAudit
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">General</h3>
              <nav className="space-y-1">
                <SidebarItem
                  href="/dashboard"
                  icon={Home}
                  title="Dashboard"
                  isActive={pathname === "/dashboard"}
                />
                <SidebarItem
                  href="/audit/history"
                  icon={History}
                  title="Audit History"
                  isActive={pathname === "/audit/history"}
                />
                <SidebarItem
                  href="/audit/new"
                  icon={PlusCircle}
                  title="New Audit"
                  isActive={pathname === "/audit/new"}
                />
              </nav>
            </div>
            
            <div>
              <h3 className="mb-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Features</h3>
              <nav className="space-y-1">
                <SidebarItem
                  href="/features/security"
                  icon={ShieldCheck}
                  title="Security Analysis"
                  isActive={pathname.includes('/features/security')}
                />
                <SidebarItem
                  href="/features/gas"
                  icon={Zap}
                  title="Gas Optimization"
                  isActive={pathname.includes('/features/gas')}
                />
                <SidebarItem
                  href="/features/code"
                  icon={Code}
                  title="Code Quality"
                  isActive={pathname.includes('/features/code')}
                />
              </nav>
            </div>
            
            <div>
              <h3 className="mb-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Reports</h3>
              <nav className="space-y-1">
                <SidebarItem
                  href="/reports/summary"
                  icon={BarChart}
                  title="Summary"
                  isActive={pathname.includes('/reports/summary')}
                />
                <SidebarItem
                  href="/reports/exports"
                  icon={FileText}
                  title="Exports"
                  isActive={pathname.includes('/reports/exports')}
                />
              </nav>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <nav className="space-y-1">
            <SidebarItem
              href="/settings"
              icon={Settings}
              title="Settings"
              isActive={pathname.includes('/settings')}
            />
          </nav>
        </div>
      </div>
    </aside>
  );
}