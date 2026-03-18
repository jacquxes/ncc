import { NavLink, Outlet } from "react-router";
import {
  Home,
  Heart,
  Megaphone,
  Users,
  Settings,
  Church,
  ChevronLeft,
  ChevronRight,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { useCurrentUser } from "../context/UserContext";

const navItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/pastoral-care", icon: Heart, label: "Pastoral Care" },
  { to: "/campaigns", icon: Megaphone, label: "Campaigns" },
  { to: "/members", icon: Users, label: "Members" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, setCurrentUser, allUsers } = useCurrentUser();

  function handleUserChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const user = allUsers.find((u) => u.id === e.target.value);
    if (user) setCurrentUser({ id: user.id, name: user.name, role: user.role });
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar — hidden below md (768px) */}
      <aside
        className={`hidden md:flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 ${
          collapsed ? "w-16" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
          <Church className="w-6 h-6 text-primary shrink-0" />
          {!collapsed && (
            <span className="text-[15px] font-semibold text-sidebar-foreground truncate">
              Grace Church
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-2 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-[14px] ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Role switcher — sidebar footer (desktop only, hidden when collapsed) */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-2 border-t border-sidebar-border">
            <div className="flex items-center gap-1.5 mb-1.5">
              <UserCog className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                Viewing as
              </span>
            </div>
            <select
              value={currentUser.id}
              onChange={handleUserChange}
              className="w-full text-[12px] border border-border rounded-md px-2 py-1.5 bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
              aria-label="Switch active user"
            >
              {allUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} — {u.role}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Collapse toggle */}
        <div className="p-2 border-t border-sidebar-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Main content — add bottom padding on mobile to clear the bottom nav */}
      <main className="flex-1 overflow-auto pb-16 md:pb-0 flex flex-col">
        {/* Mobile role switcher strip */}
        <div className="flex md:hidden items-center gap-2 px-4 py-2 border-b border-border bg-sidebar shrink-0">
          <UserCog className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <span className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">Viewing as:</span>
          <select
            value={currentUser.id}
            onChange={handleUserChange}
            className="flex-1 min-w-0 text-[12px] border border-border rounded-md px-2 py-1 bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
            aria-label="Switch active user"
          >
            {allUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.role}
              </option>
            ))}
          </select>
        </div>
        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom navigation bar — visible only below md (768px) */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex md:hidden items-stretch bg-sidebar border-t border-sidebar-border z-50"
        aria-label="Bottom navigation"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
                <span className="truncate max-w-full leading-tight">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
