
import { Link, useLocation } from "react-router-dom";
import { BarChart, FileText, Home, Settings, PlusCircle, History } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
        isActive ? "bg-accent text-primary" : "text-muted-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
      <span>{title}</span>
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="fixed left-0 top-16 z-20 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card p-4 shadow-sm hidden md:block">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">General</h3>
          <nav className="grid gap-1">
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
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">Reports</h3>
          <nav className="grid gap-1">
            <SidebarItem
              href="/reports/summary"
              icon={BarChart}
              title="Summary"
              isActive={pathname === "/reports/summary"}
            />
            <SidebarItem
              href="/reports/exports"
              icon={FileText}
              title="Exports"
              isActive={pathname === "/reports/exports"}
            />
          </nav>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-medium text-muted-foreground">Account</h3>
          <nav className="grid gap-1">
            <SidebarItem
              href="/settings"
              icon={Settings}
              title="Settings"
              isActive={pathname === "/settings"}
            />
          </nav>
        </div>
      </div>
    </div>
  );
}
