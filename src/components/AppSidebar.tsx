import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  Library,
  BarChart3,
  Users,
  MessageSquare,
  BookOpen,
  FileText,
  Images,
  PenLine,
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

type NavChild = { title: string; url: string; badge?: number }
type NavItem = {
  title: string
  icon: LucideIcon
  url?: string
  badge?: number
  children?: NavChild[]
}

type NavSection = { label: string; items: NavItem[] }

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [{ title: "Dashboard", url: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Manage Content",
    items: [
      {
        title: "Knowledge Base",
        url: "/knowledge-base",
        icon: Library,
      },
      {
        title: "Book Details",
        url: "/manage-book-details",
        icon: BookOpen,
      },
      {
        title: "Image Repository",
        url: "/image-repository",
        icon: Images,
      },
      {
        title: "Guidelines",
        url: "/manage-guidelines",
        icon: FileText,
      },
    ],
  },
  {
    label: "Evaluate",
    items: [
      {
        title: "Evaluations",
        icon: PenLine,
        children: [
          { title: "Essay Evaluation", url: "/essay-evaluation" },
          { title: "Speech Evaluation", url: "/speech-evaluation" },
          { title: "OCR Evaluation", url: "/ocr-evaluation" },
        ],
      },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
      { title: "Feedback queue", url: "/feedback-approval", icon: Inbox, badge: 7 },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Collaboration", url: "/collaboration", icon: Users },
    ],
  },
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

  const allItems = sections.flatMap((s) => s.items)

  const isGroupActive = (item: NavItem) =>
    !!item.children?.some((c) => isActivePath(c.url))

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {}
    allItems.forEach((i) => {
      if (i.children?.some((c) => isActivePath(c.url))) init[i.title] = true
    })
    return init
  })

  // Keep the group holding the active route open on route change.
  useEffect(() => {
    setOpenGroups((s) => {
      const next = { ...s }
      allItems.forEach((i) => {
        if (i.children?.some((c) => isActivePath(c.url))) next[i.title] = true
      })
      return next
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath])

  const toggleGroup = (title: string) =>
    setOpenGroups((s) => ({ ...s, [title]: !s[title] }))

  const Badge = ({ value }: { value: number }) => (
    <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-50 px-1.5 text-[11px] font-semibold text-blue-600">
      {value}
    </span>
  )

  // Active indicator — slim blue bar on the left edge of the active item.
  const ActiveBar = () => (
    <span
      aria-hidden="true"
      className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-blue-600"
    />
  )

  const itemBase =
    "relative group w-full flex items-center gap-3 rounded-[10px] text-[13.8px] font-[560] transition-[background-color,color,padding] duration-150"
  const itemPadding = collapsed ? "justify-center px-0 py-[11px]" : "px-3 py-2"
  const itemIdle =
    "text-[#1A1E26] hover:bg-[#F5F7FA] hover:text-slate-900"
  const itemActive = "bg-blue-50 text-blue-700"

  return (
    <aside
      className={cn(
        "relative h-full bg-white border-r border-[#D5DBE4] flex flex-col transition-[width] duration-300 ease-in-out",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {!hideToggle && (
        <button
          type="button"
          onClick={toggleSidebarCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "absolute -right-[15px] top-6 z-20 h-[30px] w-[30px] rounded-full border border-[#D5DBE4]",
            "bg-white text-blue-600 flex items-center justify-center",
            "transition-colors duration-200 hover:bg-blue-50",
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </button>
      )}

      <div
        className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden py-3.5",
          collapsed ? "px-3" : "px-3",
        )}
      >
        {sections.map((section, sectionIdx) => (
          <div key={section.label}>
            {collapsed ? (
              sectionIdx > 0 && (
                <div className="mx-2 my-2 h-px bg-[#D5DBE4]" aria-hidden="true" />
              )
            ) : (
              <div className={cn("px-3 pb-0.5", sectionIdx > 0 ? "pt-2.5" : "pt-0")}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8A93A2]">
                  {section.label}
                </p>
              </div>
            )}


            <nav aria-label={section.label} className="space-y-0.5">
              {section.items.map((item) => {
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
                          if (collapsed) {
                            toggleSidebarCollapsed()
                            setOpenGroups((s) => ({ ...s, [item.title]: true }))
                            return
                          }
                          toggleGroup(item.title)
                        }}
                        className={cn(
                          itemBase,
                          itemPadding,
                          groupActive
                            ? "text-blue-700"
                            : itemIdle,
                        )}
                        title={collapsed ? item.title : undefined}
                      >
                        {groupActive && <ActiveBar />}
                        <span
                          className={cn(
                            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                            collapsed && "h-9 w-9",
                            groupActive
                              ? "bg-blue-100 text-blue-600"
                              : "bg-transparent text-[#5A6675] group-hover:text-slate-800",
                          )}
                        >
                          <Icon className="h-[19px] w-[19px]" strokeWidth={1.75} />
                        </span>
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-left">{item.title}</span>
                            <ChevronDown
                              className={cn(
                                "h-3.5 w-3.5 text-slate-500 transition-transform duration-200",
                                open && "rotate-180",
                              )}
                            />
                          </>
                        )}
                      </button>

                      <div
                        className={cn(
                          "grid transition-all duration-200 ease-in-out",
                          open && !collapsed
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0",
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="ml-[27px] mt-1 space-y-0.5 border-l border-slate-200/80 pl-3">
                            {item.children.map((child) => {
                              const active = isActivePath(child.url)
                              return (
                                <NavLink
                                  key={child.title}
                                  to={child.url}
                                  onClick={onNavigate}
                                  className={cn(
                                    "relative flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] transition-all duration-150",
                                    active
                                      ? "bg-blue-50 font-semibold text-blue-700"
                                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "h-1.5 w-1.5 rounded-full transition-colors duration-150",
                                      active ? "bg-blue-600" : "bg-slate-300",
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="flex-1">{child.title}</span>
                                  {typeof child.badge === "number" && (
                                    <Badge value={child.badge} />
                                  )}
                                </NavLink>
                              )
                            })}
                          </div>
                        </div>
                      </div>
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
                      itemBase,
                      itemPadding,
                      active ? itemActive : itemIdle,
                    )}
                  >
                    {active && <ActiveBar />}
                    <span
                      className={cn(
                        "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                        collapsed && "h-9 w-9",
                        active
                          ? "bg-blue-600 text-white"
                          : "bg-transparent text-[#5A6675] group-hover:text-slate-800",
                      )}
                    >
                      <Icon className="h-[19px] w-[19px]" strokeWidth={1.75} />
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {typeof item.badge === "number" && (
                          <Badge value={item.badge} />
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </nav>
          </div>
        ))}
      </div>
    </aside>
  )
}

export { sections }
export const items = sections.flatMap((s) => s.items)
