import { LayoutDashboard, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const items = [
  {
    title: "Dashboard",
    url: "/superadmin-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Reports",
    url: "/superadmin-reports",
    icon: FileText,
  },
];

interface SuperAdminSidebarProps {
  onNavigate?: () => void;
}

export function SuperAdminSidebar({ onNavigate }: SuperAdminSidebarProps = {}) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    return currentPath === path;
  };

  return (
    <div className="h-full w-full bg-white/95 backdrop-blur-xl border-r border-border/20 shadow-xl">
      <div className="px-4 py-6 pt-4">
        <nav className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.url) 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
