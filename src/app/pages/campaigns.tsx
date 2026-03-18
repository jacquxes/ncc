import { useState } from "react";
import {
  Plus,
  Search,
  X,
  ChevronDown,
  Edit2,
  Target,
  Calendar,
  Users,
  DollarSign,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  initialCampaigns,
  type Campaign,
  type CampaignStatus,
} from "../data/store";
import { CampaignStatusBadge } from "../components/status-badge";

const campaignStatuses: CampaignStatus[] = ["draft", "active", "completed", "archived"];

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "all">("all");
  const [showNewModal, setShowNewModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleCreate(data: Partial<Campaign>) {
    const newCampaign: Campaign = {
      id: `camp-${String(campaigns.length + 1).padStart(3, "0")}`,
      name: data.name || "",
      description: data.description || "",
      goalAmount: data.goalAmount || 0,
      raisedAmount: 0,
      startDate: data.startDate || "",
      endDate: data.endDate || "",
      targetAudience: data.targetAudience || "All Members",
      status: data.status || "draft",
    };
    setCampaigns([newCampaign, ...campaigns]);
    setShowNewModal(false);
  }

  function handleUpdate(updated: Campaign) {
    setCampaigns(campaigns.map((c) => (c.id === updated.id ? updated : c)));
    setEditingCampaign(null);
  }

  function handleDelete(id: string) {
    setCampaigns(campaigns.filter((c) => c.id !== id));
    setMenuOpen(null);
  }

  function handleStatusChange(id: string, status: CampaignStatus) {
    setCampaigns(campaigns.map((c) => (c.id === id ? { ...c, status } : c)));
    setMenuOpen(null);
  }

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Campaigns</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Create and manage donation campaigns for your church community.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-[#0284c7] transition-colors text-[14px]"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CampaignStatus | "all")}
            className="appearance-none pl-3 pr-8 py-2 border border-border rounded-lg bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary capitalize cursor-pointer"
          >
            <option value="all">All Status</option>
            {campaignStatuses.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => {
          const pct = c.goalAmount > 0 ? Math.round((c.raisedAmount / c.goalAmount) * 100) : 0;
          return (
            <div
              key={c.id}
              className="bg-card rounded-lg border border-border shadow-sm overflow-hidden flex flex-col"
            >
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <CampaignStatusBadge status={c.status} />
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === c.id ? null : c.id)}
                      className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === c.id && (
                      <div className="absolute right-0 top-8 z-10 bg-card border border-border rounded-lg shadow-lg py-1 w-44">
                        <button
                          onClick={() => { setEditingCampaign(c); setMenuOpen(null); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-foreground hover:bg-muted"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit Campaign
                        </button>
                        {c.status === "draft" && (
                          <button
                            onClick={() => handleStatusChange(c.id, "active")}
                            className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-foreground hover:bg-muted"
                          >
                            <Target className="w-3.5 h-3.5" /> Activate
                          </button>
                        )}
                        {c.status === "active" && (
                          <button
                            onClick={() => handleStatusChange(c.id, "completed")}
                            className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-foreground hover:bg-muted"
                          >
                            <Target className="w-3.5 h-3.5" /> Mark Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-[13px] text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="mb-1">{c.name}</h3>
                <p className="text-[13px] text-muted-foreground mb-3 line-clamp-2">
                  {c.description}
                </p>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-[12px] text-muted-foreground mb-1">
                    <span>${c.raisedAmount.toLocaleString()}</span>
                    <span>${c.goalAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="text-right text-[11px] text-muted-foreground mt-0.5">
                    {pct}% funded
                  </div>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-1.5 text-[12px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {c.startDate} &ndash; {c.endDate}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {c.targetAudience}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground text-[14px]">
            No campaigns found.
          </div>
        )}
      </div>

      {/* New Campaign Modal */}
      {showNewModal && (
        <CampaignFormModal
          title="Create New Campaign"
          onClose={() => setShowNewModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <CampaignFormModal
          title="Edit Campaign"
          initialData={editingCampaign}
          onClose={() => setEditingCampaign(null)}
          onSubmit={(data) => handleUpdate({ ...editingCampaign, ...data } as Campaign)}
        />
      )}
    </div>
  );
}

/* ---- Campaign Form Modal ---- */
function CampaignFormModal({
  title,
  initialData,
  onClose,
  onSubmit,
}: {
  title: string;
  initialData?: Partial<Campaign>;
  onClose: () => void;
  onSubmit: (data: Partial<Campaign>) => void;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [goalAmount, setGoalAmount] = useState(initialData?.goalAmount || 0);
  const [startDate, setStartDate] = useState(initialData?.startDate || "");
  const [endDate, setEndDate] = useState(initialData?.endDate || "");
  const [targetAudience, setTargetAudience] = useState(initialData?.targetAudience || "All Members");
  const [status, setStatus] = useState<CampaignStatus>(initialData?.status || "draft");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name, description, goalAmount, startDate, endDate, targetAudience, status });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-card rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2>{title}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[13px] text-muted-foreground">Campaign Name</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Enter campaign name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] text-muted-foreground">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Describe the campaign..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">Goal Amount ($)</label>
              <input
                required
                type="number"
                min={0}
                value={goalAmount}
                onChange={(e) => setGoalAmount(Number(e.target.value))}
                className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CampaignStatus)}
                className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 capitalize"
              >
                {campaignStatuses.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">Start Date</label>
              <input
                required
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">End Date</label>
              <input
                required
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] text-muted-foreground">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. All Members, Youth Ministry"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border text-[14px] text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[14px] hover:bg-[#0284c7] transition-colors"
            >
              {initialData ? "Save Changes" : "Create Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
