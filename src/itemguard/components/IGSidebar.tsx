import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  PlayCircle,
  FileText,
  BookOpen,
  GraduationCap,
  Copy,
  Settings,
  Shield,
} from 'lucide-react';

const BASE = '/item-validation';

const navItems = [
  { label: 'Dashboard', path: '', icon: LayoutDashboard, end: true },
  { label: 'Item Bank', path: 'item-bank', icon: Database },
  { label: 'Analysis Runs', path: 'analysis-runs', icon: PlayCircle },
  { label: 'Item Reports', path: 'item-reports', icon: FileText },
  { label: 'Guidelines & Rules', path: 'guidelines', icon: BookOpen },
  { label: 'Qualification Specs', path: 'qualifications', icon: GraduationCap },
  { label: 'Duplicates Review', path: 'duplicates', icon: Copy },
  { label: 'Settings', path: 'settings', icon: Settings },
];

export function IGSidebar() {
  const location = useLocation();
  return (
    <aside
      className="w-56 shrink-0 flex flex-col border-r"
      style={{
        backgroundColor: 'hsl(var(--ig-sidebar-bg))',
        color: 'hsl(var(--ig-sidebar-fg))',
        borderColor: 'hsl(var(--ig-sidebar-border))',
      }}
    >
      <div
        className="flex items-center gap-2.5 px-4 h-14 border-b shrink-0"
        style={{ borderColor: 'hsl(var(--ig-sidebar-border))' }}
      >
        <Shield className="w-5 h-5 shrink-0" style={{ color: 'hsl(var(--ig-sidebar-primary))' }} />
        <span className="text-sm font-bold tracking-tight whitespace-nowrap" style={{ color: 'hsl(var(--ig-sidebar-accent-fg))' }}>
          AI Assessment Guard
        </span>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const fullPath = item.path ? `${BASE}/${item.path}` : BASE;
          const isActive = item.end
            ? location.pathname === BASE || location.pathname === BASE + '/'
            : location.pathname === fullPath || location.pathname.startsWith(fullPath + '/');
          return (
            <RouterNavLink
              key={item.label}
              to={fullPath}
              end={item.end}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors"
              style={{
                backgroundColor: isActive ? 'hsl(var(--ig-sidebar-accent))' : 'transparent',
                color: isActive ? 'hsl(var(--ig-sidebar-accent-fg))' : 'hsl(var(--ig-sidebar-fg))',
                fontWeight: isActive ? 500 : 400,
              }}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </RouterNavLink>
          );
        })}
      </nav>
    </aside>
  );
}
