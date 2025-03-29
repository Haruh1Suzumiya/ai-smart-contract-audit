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
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium" 
          : "text-gray-600 dark:text-gray-400"
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
    <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pt-16 hidden lg:block">
      <div className="flex flex-col h-full py-4 px-3">
        <div className="space-y-6">
          <div>
            <h3 className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">GENERAL</h3>
            <div className="mt-1 space-y-1">
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
            </div>
          </div>
          
          <div>
            <h3 className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">FEATURES</h3>
            <div className="mt-1 space-y-1">
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
            </div>
          </div>
          
          <div>
            <h3 className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">REPORTS</h3>
            <div className="mt-1 space-y-1">
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
            </div>
          </div>
        </div>
      
        <div className="mt-auto pt-6">
          <SidebarItem
            href="/settings"
            icon={Settings}
            title="Settings"
            isActive={pathname.includes('/settings')}
          />
        </div>
      </div>
    </aside>
  );
}