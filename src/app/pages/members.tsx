import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  ChevronDown,
  Shield,
  Users,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";
import {
  members,
  type Role,
  type CellGroup,
} from "../data/store";

// ── Role colours ───────────────────────────────────────────────────────────────
const roleColors: Record<Role, string> = {
  Admin: "bg-red-100 text-red-700",
  Pastor: "bg-blue-100 text-blue-700",
  "Care Team": "bg-green-100 text-green-700",
  "Ministry Leader": "bg-purple-100 text-purple-700",
  Member: "bg-amber-100 text-amber-700",
};

const allRoles: (Role | "All")[] = [
  "All",
  "Admin",
  "Ministry Leader",
  "Care Team",
  "Pastor",
  "Member",
];

const allCellGroups: (CellGroup | "All")[] = [
  "All",
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Eta",
  "Theta",
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function membershipYears(joinDate: string): string {
  const joined = new Date(joinDate);
  const now = new Date(2026, 3, 9);
  const years = Math.floor(
    (now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
  if (years < 1) return "< 1 yr";
  return `${years} yr${years !== 1 ? "s" : ""}`;
}

// ── Component ──────────────────────────────────────────────────────────────────
export function Members() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [cellGroupFilter, setCellGroupFilter] = useState<CellGroup | "All">("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const matchSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q);
      const matchRole = roleFilter === "All" || m.role === roleFilter;
      const matchCell = cellGroupFilter === "All" || m.cellGroup === cellGroupFilter;
      return matchSearch && matchRole && matchCell;
    });
  }, [search, roleFilter, cellGroupFilter]);

  const hasFilters = search || roleFilter !== "All" || cellGroupFilter !== "All";

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold">Members</h1>
        <p className="text-[14px] text-muted-foreground mt-0.5">
          Browse, search, and manage church members. Click any row to view their full profile.
        </p>
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="member-search"
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            aria-label="Search members by name or email"
          />
        </div>

        {/* Role filter */}
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <select
            id="role-filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "All")}
            className="appearance-none pl-8 pr-8 py-2 border border-border rounded-lg bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
            aria-label="Filter by role"
          >
            {allRoles.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All Roles" : r}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>

        {/* Cell group filter */}
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <select
            id="cell-group-filter"
            value={cellGroupFilter}
            onChange={(e) => setCellGroupFilter(e.target.value as CellGroup | "All")}
            className="appearance-none pl-8 pr-8 py-2 border border-border rounded-lg bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
            aria-label="Filter by cell group"
          >
            {allCellGroups.map((g) => (
              <option key={g} value={g}>
                {g === "All" ? "All Cell Groups" : `${g} Group`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>

        {/* Result count + clear */}
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground self-center whitespace-nowrap">
          <span>
            {filtered.length} member{filtered.length !== 1 ? "s" : ""}
          </span>
          {hasFilters && (
            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("All");
                setCellGroupFilter("All");
              }}
              className="text-primary hover:underline text-[12px]"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Desktop Table ── */}
      <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]" role="grid" aria-label="Members table">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                  Role
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                  Cell Group
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                  Member Since
                </th>
                <th className="px-4 py-3 text-left font-semibold text-[12px] text-muted-foreground uppercase tracking-wide">
                  Email
                </th>
                <th className="w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr
                  key={m.id}
                  className={`border-b border-border last:border-0 hover:bg-primary/5 cursor-pointer transition-colors group ${
                    i % 2 === 0 ? "" : "bg-muted/10"
                  }`}
                  onClick={() => navigate(`/members/${m.id}`)}
                  tabIndex={0}
                  role="row"
                  aria-label={`View profile for ${m.name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") navigate(`/members/${m.id}`);
                  }}
                >
                  {/* Name + avatar */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0">
                        {initials(m.name)}
                      </div>
                      <span className="font-medium text-foreground">{m.name}</span>
                    </div>
                  </td>
                  {/* Role */}
                  <td className="px-4 py-3">
                    {m.role !== "Member" && (
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${roleColors[m.role]}`}
                      >
                        <Shield className="w-3 h-3" />
                        {m.role}
                      </span>
                    )}
                  </td>
                  {/* Cell Group */}
                  <td className="px-4 py-3 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      {m.cellGroup}
                    </div>
                  </td>
                  {/* Membership */}
                  <td className="px-4 py-3 text-muted-foreground">
                    {membershipYears(m.joinDate)}
                  </td>
                  {/* Email */}
                  <td className="px-4 py-3 text-muted-foreground">{m.email}</td>
                  {/* Arrow */}
                  <td className="px-3 py-3">
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-muted-foreground text-[14px]">
                    No members match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile Cards ── */}
      <div className="flex md:hidden flex-col gap-3">
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => navigate(`/members/${m.id}`)}
            className="w-full text-left bg-card border border-border rounded-xl p-4 flex items-center gap-3 hover:bg-primary/5 hover:border-primary/30 transition-all group shadow-sm"
            aria-label={`View profile for ${m.name}`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[13px] font-bold shrink-0">
              {initials(m.name)}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[14px] text-foreground truncate">{m.name}</div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                {m.role !== "Member" && (
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${roleColors[m.role]}`}
                  >
                    {m.role}
                  </span>
                )}
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {m.cellGroup}
                </span>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary shrink-0 transition-colors" />
          </button>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-[14px]">
            No members match your search.
          </div>
        )}
      </div>
    </div>
  );
}
