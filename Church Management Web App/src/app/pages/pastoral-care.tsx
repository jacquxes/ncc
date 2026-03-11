import { useState } from "react";
import {
  Plus,
  Search,
  Filter,
  X,
  ChevronDown,
  Eye,
  Edit2,
  Shield,
  ShieldAlert,
  UserPlus,
} from "lucide-react";
import {
  initialCases,
  staffMembers,
  caseTimelines,
  type PastoralCase,
  type CaseStatus,
  type CaseType,
  type ConfidentialityLevel,
} from "../data/store";
import { CaseStatusBadge } from "../components/status-badge";
import { Timeline } from "../components/timeline";
import { AssignCaseModal } from "../components/assign-case-modal";

const caseTypes: CaseType[] = ["grief", "marriage", "health", "financial", "spiritual guidance"];
const caseStatuses: CaseStatus[] = ["identified", "assigned", "active", "monitoring", "closed"];
const confidentialityLevels: ConfidentialityLevel[] = ["standard", "sensitive", "highly confidential"];
const pastors = staffMembers.filter((s) => s.role === "Pastor");

export function PastoralCare() {
  const [cases, setCases] = useState<PastoralCase[]>(initialCases);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all");
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<PastoralCase | null>(null);
  const [editingCase, setEditingCase] = useState<PastoralCase | null>(null);
  const [assigningCase, setAssigningCase] = useState<PastoralCase | null>(null);

  const filtered = cases.filter((c) => {
    const matchesSearch =
      c.memberName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedPastorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleCreateCase(data: Partial<PastoralCase>) {
    const pastor = pastors.find((p) => p.id === data.assignedPastorId);
    const newCase: PastoralCase = {
      id: `case-${String(cases.length + 1).padStart(3, "0")}`,
      memberId: `m${cases.length + 1}`,
      memberName: data.memberName || "",
      caseType: data.caseType || "spiritual guidance",
      assignedPastorId: data.assignedPastorId || "",
      assignedPastorName: pastor?.name || "",
      status: data.assignedPastorId ? "assigned" : "identified",
      confidentialityLevel: data.confidentialityLevel || "standard",
      notes: data.notes || "",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };
    setCases([newCase, ...cases]);
    setShowNewModal(false);
  }

  function handleUpdateCase(updated: PastoralCase) {
    setCases(cases.map((c) => (c.id === updated.id ? { ...updated, updatedAt: new Date().toISOString().split("T")[0] } : c)));
    setEditingCase(null);
  }

  function handleAssignCase(caseId: string, pastorId: string, pastorName: string) {
    setCases(
      cases.map((c) =>
        c.id === caseId
          ? {
              ...c,
              assignedPastorId: pastorId,
              assignedPastorName: pastorName,
              status: "assigned" as CaseStatus,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : c
      )
    );
    setAssigningCase(null);
  }

  const confIcon = (level: ConfidentialityLevel) => {
    if (level === "highly confidential") return <ShieldAlert className="w-3.5 h-3.5 text-red-500" />;
    if (level === "sensitive") return <Shield className="w-3.5 h-3.5 text-amber-500" />;
    return null;
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1>Pastoral Care</h1>
          <p className="text-[14px] text-muted-foreground mt-1">
            Manage and track pastoral care cases for church members.
          </p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-[#0284c7] transition-colors text-[14px]"
        >
          <Plus className="w-4 h-4" />
          New Case
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by member or pastor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as CaseStatus | "all")}
            className="appearance-none pl-3 pr-8 py-2 border border-border rounded-lg bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary capitalize cursor-pointer"
          >
            <option value="all">All Status</option>
            {caseStatuses.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-[13px] font-medium text-muted-foreground">Member</th>
                <th className="text-left px-4 py-3 text-[13px] font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 text-[13px] font-medium text-muted-foreground">Assigned To</th>
                <th className="text-left px-4 py-3 text-[13px] font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-[13px] font-medium text-muted-foreground">Updated</th>
                <th className="text-right px-4 py-3 text-[13px] font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-foreground">{c.memberName}</span>
                      {confIcon(c.confidentialityLevel)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[14px] text-muted-foreground capitalize">{c.caseType}</td>
                  <td className="px-4 py-3 text-[14px] text-muted-foreground">{c.assignedPastorName}</td>
                  <td className="px-4 py-3">
                    <CaseStatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-muted-foreground">{c.updatedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedCase(c)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="View case"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setAssigningCase(c)}
                        className="p-1.5 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        aria-label="Assign case"
                        title="Assign to pastor"
                      >
                        <UserPlus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCase(c)}
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Edit case"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-[14px]">
                    No cases found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Case Modal */}
      {showNewModal && (
        <CaseFormModal
          title="Create New Case"
          onClose={() => setShowNewModal(false)}
          onSubmit={handleCreateCase}
        />
      )}

      {/* Edit Case Modal */}
      {editingCase && (
        <CaseFormModal
          title="Edit Case"
          initialData={editingCase}
          onClose={() => setEditingCase(null)}
          onSubmit={(data) => handleUpdateCase({ ...editingCase, ...data } as PastoralCase)}
        />
      )}

      {/* View Case Detail */}
      {selectedCase && (
        <CaseDetailModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      )}

      {/* Assign Case Modal */}
      {assigningCase && (
        <AssignCaseModal
          caseData={assigningCase}
          allCases={cases}
          onClose={() => setAssigningCase(null)}
          onAssign={(pastorId, pastorName) => handleAssignCase(assigningCase.id, pastorId, pastorName)}
        />
      )}
    </div>
  );
}

/* ---- Case Form Modal ---- */
function CaseFormModal({
  title,
  initialData,
  onClose,
  onSubmit,
}: {
  title: string;
  initialData?: Partial<PastoralCase>;
  onClose: () => void;
  onSubmit: (data: Partial<PastoralCase>) => void;
}) {
  const [memberName, setMemberName] = useState(initialData?.memberName || "");
  const [caseType, setCaseType] = useState<CaseType>(initialData?.caseType || "spiritual guidance");
  const [assignedPastorId, setAssignedPastorId] = useState(initialData?.assignedPastorId || "");
  const [status, setStatus] = useState<CaseStatus>(initialData?.status || "identified");
  const [confidentiality, setConfidentiality] = useState<ConfidentialityLevel>(
    initialData?.confidentialityLevel || "standard"
  );
  const [notes, setNotes] = useState(initialData?.notes || "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      memberName,
      caseType,
      assignedPastorId,
      status,
      confidentialityLevel: confidentiality,
      notes,
    });
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
            <label className="text-[13px] text-muted-foreground">Member Name</label>
            <input
              required
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Enter member name"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">Case Type</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value as CaseType)}
                className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 capitalize"
              >
                {caseTypes.map((t) => (
                  <option key={t} value={t} className="capitalize">{t}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">Assign Pastor</label>
              <select
                value={assignedPastorId}
                onChange={(e) => setAssignedPastorId(e.target.value)}
                className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Unassigned</option>
                {pastors.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CaseStatus)}
                className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 capitalize"
              >
                {caseStatuses.map((s) => (
                  <option key={s} value={s} className="capitalize">{s}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[13px] text-muted-foreground">Confidentiality</label>
              <select
                value={confidentiality}
                onChange={(e) => setConfidentiality(e.target.value as ConfidentialityLevel)}
                className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 capitalize"
              >
                {confidentialityLevels.map((l) => (
                  <option key={l} value={l} className="capitalize">{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[13px] text-muted-foreground">Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="Add any notes about this case..."
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
              {initialData ? "Save Changes" : "Create Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---- Case Detail Modal ---- */
function CaseDetailModal({
  caseData,
  onClose,
}: {
  caseData: PastoralCase;
  onClose: () => void;
}) {
  const timeline = caseTimelines[caseData.id] || [
    {
      title: "Case Created",
      date: caseData.createdAt,
      description: `${caseData.caseType} case opened.`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-card rounded-xl shadow-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2>Case Details</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">
          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-[12px] text-muted-foreground mb-0.5">Member</div>
              <div className="text-[14px] font-medium">{caseData.memberName}</div>
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground mb-0.5">Case Type</div>
              <div className="text-[14px] font-medium capitalize">{caseData.caseType}</div>
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground mb-0.5">Assigned Pastor</div>
              <div className="text-[14px] font-medium">{caseData.assignedPastorName}</div>
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground mb-0.5">Status</div>
              <CaseStatusBadge status={caseData.status} />
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground mb-0.5">Confidentiality</div>
              <div className="text-[14px] font-medium capitalize">{caseData.confidentialityLevel}</div>
            </div>
            <div>
              <div className="text-[12px] text-muted-foreground mb-0.5">Created</div>
              <div className="text-[14px] font-medium">{caseData.createdAt}</div>
            </div>
          </div>

          {/* Notes */}
          {caseData.notes && (
            <div className="mb-6">
              <div className="text-[12px] text-muted-foreground mb-1">Notes</div>
              <div className="text-[14px] text-foreground bg-muted/50 rounded-lg p-3">
                {caseData.notes}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <div className="text-[13px] font-medium text-foreground mb-3">Case Timeline</div>
            <Timeline items={timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}