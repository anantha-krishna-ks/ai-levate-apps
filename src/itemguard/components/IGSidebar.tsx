import {
  LayoutDashboard,
  Database,
  PlayCircle,
  FileText,
  BookOpen,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  useSidebarCollapsed,
  toggleSidebarCollapsed,
} from "@/hooks/use-sidebar-collapsed";

const BASE = "/item-validation";

const items = [
  { title: "Dashboard", url: BASE, icon: LayoutDashboard, end: true },
  { title: "Item Bank", url: `${BASE}/item-bank`, icon: Database },
  { title: "Knowledge base", url: `${BASE}/qualifications`, icon: GraduationCap },
  { title: "Guidelines", url: `${BASE}/guidelines`, icon: BookOpen },
  { title: "Analysis Runs", url: `${BASE}/analysis-runs`, icon: PlayCircle },
  { title: "Item Reports", url: `${BASE}/item-reports`, icon: FileText },
  { title: "Settings", url: `${BASE}/settings`, icon: Settings },
];

interface IGSidebarProps {
  onNavigate?: () => void;
  forceExpanded?: boolean;
  hideToggle?: boolean;
}

export function IGSidebar({
  onNavigate,
  forceExpanded = false,
  hideToggle = false,
}: IGSidebarProps = {}) {
  const collapsedStored = useSidebarCollapsed();
  const collapsed = forceExpanded ? false : collapsedStored;
  const { pathname } = useLocation();

  const isActive = (url: string, end?: boolean) =>
    end ? pathname === url || pathname === url + "/" : pathname === url || pathname.startsWith(url + "/");

  return (
    <aside
      className={cn(
        "relative h-full bg-white border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-52",
      )}
    >
      {!hideToggle && (
        <button
          type="button"
          onClick={toggleSidebarCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "absolute -right-3.5 top-6 z-20 h-7 w-7 rounded-full border border-sidebar-border",
            "bg-card text-muted-foreground shadow-md flex items-center justify-center",
            "transition-all duration-150 hover:bg-primary hover:text-primary-foreground hover:border-primary",
          )}
        >
          {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      )}

      <div className={cn("py-4 flex-1 overflow-y-auto", collapsed ? "px-2" : "px-3")}>
        {!collapsed && (
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>
        )}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.url, item.end);
            return (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.end}
                onClick={onNavigate}
                title={collapsed ? item.title : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
