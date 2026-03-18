import { useState } from "react";
import { Search, Mail, Shield } from "lucide-react";
import { staffMembers, type StaffMember, type Role } from "../data/store";

const roleColors: Record<Role, string> = {
  Admin: "bg-red-100 text-red-700",
  Pastor: "bg-blue-100 text-blue-700",
  "Care Team": "bg-green-100 text-green-700",
  "Ministry Leader": "bg-purple-100 text-purple-700",
  Volunteer: "bg-amber-100 text-amber-700",
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function Members() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = staffMembers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      <div className="mb-6">
        <h1>Staff & Members</h1>
        <p className="text-[14px] text-muted-foreground mt-1">
          View and manage church staff and their roles.
        </p>
      </div>

      <div className="relative max-w-sm mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="bg-card rounded-lg border border-border shadow-sm p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[13px] font-semibold shrink-0">
              {initials(s.name)}
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-medium text-foreground truncate">{s.name}</div>
              <div className="flex items-center gap-1 text-[12px] text-muted-foreground mt-0.5 truncate">
                <Mail className="w-3 h-3 shrink-0" />
                {s.email}
              </div>
              <span
                className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[11px] font-medium ${roleColors[s.role]}`}
              >
                <Shield className="w-3 h-3" />
                {s.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
