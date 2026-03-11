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
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/pastoral-care", icon: Heart, label: "Pastoral Care" },
  { to: "/campaigns", icon: Megaphone, label: "Campaigns" },
  { to: "/members", icon: Users, label: "Members" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-200 ${
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

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
