import { useState } from "react"
import {
  LayoutDashboard,
  Library,
  BarChart3,
  Users,
  MessageSquare,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  useSidebarCollapsed,
  toggleSidebarCollapsed,
} from "@/hooks/use-sidebar-collapsed"

type NavChild = { title: string; url: string }
type NavItem = {
  title: string
  icon: LucideIcon
  url?: string
  children?: NavChild[]
}

const items: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Manage Knowledge Base", url: "/knowledge-base", icon: Library },
  { title: "Manage Book Details", url: "/manage-book-details", icon: BookOpen },
  { title: "Manage Guidelines", url: "/manage-guidelines", icon: FileText },
  { title: "Feedback Approval", url: "/feedback-approval", icon: MessageSquare },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Collaboration", url: "/collaboration", icon: Users },
]

interface AppSidebarProps {
  onNavigate?: () => void
  /** Force expanded state (used for the mobile drawer). */
  forceExpanded?: boolean
  /** Hide the floating collapse toggle (used for the mobile drawer). */
  hideToggle?: boolean
}

export function AppSidebar({
  onNavigate,
  forceExpanded = false,
  hideToggle = false,
}: AppSidebarProps = {}) {
  const collapsedStored = useSidebarCollapsed()
  const collapsed = forceExpanded ? false : collapsedStored
  const location = useLocation()
  const currentPath = location.pathname

  const isActivePath = (path?: string) => {
    if (!path) return false
    if (path === "/dashboard") {
      return currentPath === "/" || currentPath === "/dashboard"
    }
    return currentPath === path || currentPath.startsWith(path + "/")
  }

  const isGroupActive = (item: NavItem) =>
    !!item.children?.some((c) => isActivePath(c.url))

  // Open groups whose child route is active by default; expanded toggling.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    items.forEach((i) => {
      if (i.children && i.children.some((c) => isActivePath(c.url))) {
        init[i.title] = true
      }
    })
    return init
  })

  const toggleGroup = (title: string) =>
    setOpenGroups((s) => ({ ...s, [title]: !s[title] }))

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
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
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
            const Icon = item.icon

            // Group with children
            if (item.children && item.children.length > 0) {
              const groupActive = isGroupActive(item)
              const open = !collapsed && (openGroups[item.title] ?? false)
              return (
                <div key={item.title}>
                  <button
                    type="button"
                    onClick={() => {
                      if (collapsed) return
                      toggleGroup(item.title)
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150",
                      collapsed && "justify-center px-0",
                      groupActive
                        ? open
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-[18px] w-[18px] flex-shrink-0",
                        groupActive && "fill-current",
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            open && "rotate-180",
                          )}
                        />
                      </>
                    )}
                  </button>
                  {open && !collapsed && (
                    <div className="mt-1 ml-5 pl-3 border-l border-sidebar-border space-y-0.5">
                      {item.children.map((child) => {
                        const active = isActivePath(child.url)
                        return (
                          <NavLink
                            key={child.title}
                            to={child.url}
                            onClick={onNavigate}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-[13px] transition-all duration-150",
                              active
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-sidebar-accent",
                            )}
                          >
                            {child.title}
                          </NavLink>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            // Top-level link
            const active = isActivePath(item.url)
            return (
              <NavLink
                key={item.title}
                to={item.url!}
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
                <Icon
                  className={cn(
                    "h-[18px] w-[18px] flex-shrink-0",
                    active && "fill-current",
                  )}
                />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}

export { items }