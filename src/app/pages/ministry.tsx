import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  Edit2,
  Users,
  Shield,
  Plus,
  X,
  Check
} from "lucide-react";
import { initialMinistries, members, staffMembers, type Ministry, type Member, type StaffMember } from "../data/store";

// Combine members and staff to have a complete lookup directory
const allPeople = [...members, ...staffMembers.filter(s => !members.find(m => m.id === s.id))];

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export function MinistryPage() {
  const [ministries, setMinistries] = useState<Ministry[]>(initialMinistries);
  const [search, setSearch] = useState("");
  const [editingMinistry, setEditingMinistry] = useState<Ministry | null>(null);

  // For Edit Modal
  const [editLeaderId, setEditLeaderId] = useState<string>("");
  const [editMemberIds, setEditMemberIds] = useState<string[]>([]);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const filteredMinistries = useMemo(() => {
    if (!search) return ministries;
    const q = search.toLowerCase();
    return ministries.filter(
      (m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q)
    );
  }, [ministries, search]);

  const handleEditClick = (ministry: Ministry) => {
    setEditingMinistry(ministry);
    setEditName(ministry.name);
    setEditDescription(ministry.description);
    setEditLeaderId(ministry.leaderId || "");
    setEditMemberIds([...ministry.memberIds]);
  };

  const handleSave = () => {
    if (!editingMinistry) return;
    setMinistries((prev) =>
      prev.map((m) =>
        m.id === editingMinistry.id
          ? {
              ...m,
              name: editName,
              description: editDescription,
              leaderId: editLeaderId || null,
              memberIds: editMemberIds,
            }
          : m
      )
    );
    setEditingMinistry(null);
  };

  const setCreateMode = () => {
    const newMin: Ministry = {
      id: `min-${Date.now()}`,
      name: "New Ministry",
      description: "",
      leaderId: null,
      memberIds: []
    };
    handleEditClick(newMin);
  };

  const toggleMember = (id: string) => {
    setEditMemberIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto min-h-screen">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-semibold text-foreground">Ministries</h1>
          <p className="text-[14px] text-muted-foreground mt-0.5">
            Manage church ministries, assign leaders, and update members.
          </p>
        </div>
        <button
          onClick={setCreateMode}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-[13px] font-medium transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Create Ministry
        </button>
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ministries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* ── Desktop View (Table) ── */}
      <div className="hidden md:block overflow-hidden bg-card border border-border rounded-xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="px-6 py-4 text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">Ministry</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-muted-foreground uppercase tracking-wider">Leader</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-muted-foreground uppercase tracking-wider text-center">Members</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredMinistries.map((ministry) => {
              const leader = allPeople.find(p => p.id === ministry.leaderId);
              return (
                <tr key={ministry.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-[14px] font-semibold text-foreground">{ministry.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13px] text-muted-foreground max-w-sm truncate">
                      {ministry.description || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-[13px] font-medium text-foreground">
                      {leader ? leader.name : "Unassigned"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-muted px-2 py-0.5 rounded-full text-[12px] font-medium">
                      {ministry.memberIds.length}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEditClick(ministry)}
                      className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredMinistries.length === 0 && (
          <div className="py-12 text-center">
            <BookOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-[15px] font-medium text-muted-foreground">No ministries found</h3>
          </div>
        )}
      </div>

      {/* ── Mobile View (Cards) ── */}
      <div className="grid grid-cols-1 md:hidden gap-5">
        {filteredMinistries.map((ministry) => {
          const leader = allPeople.find(p => p.id === ministry.leaderId);
          return (
            <div
              key={ministry.id}
              className="bg-card rounded-xl border border-border shadow-sm flex flex-col overflow-hidden hover:border-primary/30 transition-colors"
            >
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <h3 className="text-[15px] font-semibold text-foreground leading-tight">
                        {ministry.name}
                      </h3>
                      <p className="text-[12px] text-muted-foreground mt-0.5 max-w-[200px] truncate">
                        {ministry.description || "No description provided."}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditClick(ministry)}
                    className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
                    aria-label="Edit Ministry"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Shield className="w-4 h-4" /> Leader
                    </span>
                    <span className="font-medium text-foreground text-right w-32 truncate">
                      {leader ? leader.name : "Unassigned"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> Members
                    </span>
                    <span className="font-medium text-foreground bg-muted px-2 py-0.5 rounded-full">
                      {ministry.memberIds.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filteredMinistries.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-border rounded-xl">
            <BookOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-[15px] font-medium text-muted-foreground">No ministries found</h3>
            <p className="text-[13px] text-muted-foreground/70 mt-1">
              Try adjusting your search or add a new ministry.
            </p>
          </div>
        )}
      </div>

      {/* ── Edit / Create Modal ── */}
      {editingMinistry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
            onClick={() => setEditingMinistry(null)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30 rounded-t-2xl">
              <h2 className="text-[16px] font-semibold text-foreground">
                {editingMinistry.name === "New Ministry" ? "Create Ministry" : `Edit ${editingMinistry.name}`}
              </h2>
              <button
                onClick={() => setEditingMinistry(null)}
                className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
              
              {/* General Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">
                    Ministry Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>

              {/* Roles & Members */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">
                    Ministry Leader
                  </label>
                  <select
                    value={editLeaderId}
                    onChange={(e) => setEditLeaderId(e.target.value)}
                    className="w-full px-3 py-2 bg-input-background border border-border rounded-lg text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all cursor-pointer"
                  >
                    <option value="">-- Unassigned --</option>
                    {allPeople.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-foreground mb-1.5">
                    Members ({editMemberIds.length})
                  </label>
                  <div className="border border-border rounded-lg overflow-hidden flex flex-col">
                    <div className="max-h-[200px] overflow-y-auto bg-input-background p-1 space-y-0.5">
                      {allPeople.map((person) => {
                        const isSelected = editMemberIds.includes(person.id);
                        return (
                          <div 
                            key={person.id}
                            onClick={() => toggleMember(person.id)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted cursor-pointer transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
                          >
                            <div className="relative flex items-center justify-center w-4 h-4 shrink-0 border border-border rounded-[4px] bg-card overflow-hidden">
                              {isSelected && <div className="absolute inset-0 bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                            </div>
                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 border border-border/50">
                              {initials(person.name)}
                            </div>
                            <span className="text-[13px] text-foreground flex-1 truncate">{person.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1.5">
                    Click to add or remove members from this ministry.
                  </p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/30 rounded-b-2xl flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setEditingMinistry(null)}
                className="px-4 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editName}
                className="px-4 py-2 rounded-lg text-[13px] font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
