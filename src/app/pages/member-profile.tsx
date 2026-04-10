import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Mail,
  Phone,
  Users,
  Calendar,
  Clock,
  Shield,
  Lock,
  TrendingUp,
  Heart,
  BookOpen,
  StickyNote,
  ChevronRight,
  User,
  MapPin,
  Wrench,
  Coffee,
  BarChart3,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  members,
  initialTransactions,
  type Role,
} from "../data/store";
import { useCurrentUser } from "../context/UserContext";

// ── Helpers ────────────────────────────────────────────────────────────────────
const roleColors: Record<Role, { badge: string }> = {
  Admin: { badge: "bg-red-100 text-red-700" },
  Pastor: { badge: "bg-blue-100 text-blue-700" },
  "Care Team": { badge: "bg-green-100 text-green-700" },
  "Ministry Leader": { badge: "bg-purple-100 text-purple-700" },
  Member: { badge: "bg-amber-100 text-amber-700" },
};

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatAmount(n: number) {
  return `S$${n.toLocaleString("en-SG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function membershipLength(joinDate: string) {
  const joined = new Date(joinDate);
  const now = new Date(2026, 3, 9); // April 9, 2026
  const years = Math.floor(
    (now.getTime() - joined.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
  const months = Math.floor(
    ((now.getTime() - joined.getTime()) % (1000 * 60 * 60 * 24 * 365.25)) /
      (1000 * 60 * 60 * 24 * 30.44)
  );
  if (years === 0) return `${months} month${months !== 1 ? "s" : ""}`;
  if (months === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years} year${years !== 1 ? "s" : ""} ${months} month${months !== 1 ? "s" : ""}`;
}

function formatJoinDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-SG", { day: "numeric", month: "long", year: "numeric" });
}

function formatMinistryDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-SG", { month: "short", year: "numeric" });
}

// ── Staff-Only Wrapper ─────────────────────────────────────────────────────────
function StaffOnlySection({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <section
      className="rounded-xl border border-violet-200 bg-violet-50/50 dark:bg-violet-950/10 dark:border-violet-800/40 overflow-hidden"
      aria-label={`${title} — Staff Only`}
    >
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-violet-200 dark:border-violet-800/40">
        <div className="flex items-center gap-2.5">
          <span className="text-violet-500">{icon}</span>
          <h2 className="text-[15px] font-semibold text-foreground">{title}</h2>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full dark:bg-violet-900/40 dark:text-violet-300">
          <Lock className="w-3 h-3" />
          Staff Only
        </span>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function MemberProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useCurrentUser();

  const member = members.find((m) => m.id === id);

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
        <User className="w-12 h-12 opacity-30" />
        <p className="text-[15px]">Member not found.</p>
        <button
          onClick={() => navigate("/members")}
          className="text-primary text-[14px] hover:underline"
        >
          Back to Members
        </button>
      </div>
    );
  }

  const isStaff =
    currentUser.role === "Pastor" ||
    currentUser.role === "Admin" ||
    currentUser.role === "Care Team";

  const [activeTab, setActiveTab] = useState<"overview" | "giving" | "ministries" | "care" | "notes" | "attendance">("overview");

  // Giving data
  const maxGiving = Math.max(...member.givingByYear.map((g) => g.total), 1);
  const totalLifetimeGiving = member.givingByYear.reduce((s, g) => s + g.total, 0);
  const recentTxns = initialTransactions.filter((t) =>
    member.recentTransactionIds.includes(t.id)
  );

  const roleStyle = roleColors[member.role];

  return (
    <div className="p-4 md:p-6 max-w-[1100px] mx-auto">
      {/* ── Back button ── */}
      <button
        onClick={() => navigate("/members")}
        className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors mb-5 group"
        aria-label="Back to Members"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Members
      </button>

      {/* ════════════════════════════════════
          HEADER CARD
      ════════════════════════════════════ */}
      <div className="bg-card rounded-xl border border-border shadow-sm mb-6 overflow-hidden">
        {/* Gradient banner */}
        <div className="h-24 bg-gradient-to-br from-primary/80 via-primary to-primary/60" />

        <div className="px-5 pb-5">
          {/* Avatar — overlapping banner */}
          <div className="-mt-10 mb-4">
            <div className="w-20 h-20 rounded-full bg-primary text-white flex items-center justify-center text-[26px] font-bold border-4 border-card shadow-md">
              {initials(member.name)}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Name + role + cell group */}
            <div>
              <h1 className="text-[22px] font-bold text-foreground leading-tight">
                {member.name}
              </h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                {member.role !== "Member" && (
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${roleStyle.badge}`}
                  >
                    <Shield className="w-3 h-3" />
                    {member.role}
                  </span>
                )}
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {member.cellGroup} Cell Group
                </span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 text-[13px]">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <div className="text-[11px] text-muted-foreground">Joined</div>
                  <div className="font-medium text-foreground">{formatJoinDate(member.joinDate)}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <div className="text-[11px] text-muted-foreground">Membership</div>
                  <div className="font-medium text-foreground">{membershipLength(member.joinDate)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact row */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 pt-4 border-t border-border text-[13px]">
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {member.email}
            </a>
            <a
              href={`tel:${member.phone}`}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              {member.phone}
            </a>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              {member.homeAddress}
            </div>
          </div>

          {/* Tags row */}
          <div className="flex flex-wrap gap-x-8 gap-y-4 mt-4 pt-4 border-t border-border">
            {/* Skills */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                <Wrench className="w-2.5 h-2.5" /> Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {member.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-primary/5 text-primary text-[11px] font-medium border border-primary/10">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                <Coffee className="w-2.5 h-2.5" /> Interests
              </span>
              <div className="flex flex-wrap gap-1.5">
                {member.interests.map((i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-100 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/30">
                    {i}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          TABBED LAYOUT (Desktop) & STACKED (Mobile)
      ════════════════════════════════════ */}
      
      {/* ── Mobile View (Stacked) ── */}
      <div className="flex flex-col xl:hidden gap-6">
        {/* Quick Info Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Quick Info
          </h3>
          <div className="flex flex-col gap-3 text-[13px]">
            <Row label="Cell Group" value={`${member.cellGroup} Group`} />
            <Row label="Role" value={member.role} />
            <Row label="Member Since" value={formatJoinDate(member.joinDate)} />
            <Row label="Years of Membership" value={membershipLength(member.joinDate)} />
            <Row label="Ministries" value={`${member.ministries.length} served`} />
            {isStaff && (
              <Row
                label="Pastoral Sessions"
                value={`${member.pastoralCareLog.length} recorded`}
              />
            )}
          </div>
        </div>

        {/* Giving Summary */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-5">
          <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Giving Summary
          </h3>
          <div className="flex flex-col gap-3 text-[13px]">
            <Row label="Lifetime Total" value={formatAmount(totalLifetimeGiving)} />
            <Row
              label="This Year"
              value={formatAmount(
                member.givingByYear.find((g) => g.year === 2026)?.total ?? 0
              )}
            />
            <Row
              label="Transactions"
              value={`${member.givingByYear.reduce((s, g) => s + g.transactionCount, 0)}`}
            />
          </div>
        </div>

        {/* ── ATTENDANCE ── */}
        <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
            <BarChart3 className="w-4 h-4 text-orange-500" />
            <h2 className="text-[15px] font-semibold">Weekly Attendance</h2>
          </div>
          <div className="p-5">
            <AttendanceContent member={member} />
          </div>
        </section>

        {/* ── MINISTRIES ── */}
        <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <h2 className="text-[15px] font-semibold">Ministries</h2>
          </div>

          <div className="p-5">
            {member.ministries.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">No ministry records.</p>
            ) : (
              <div className="relative flex flex-col gap-0">
                {/* Timeline line */}
                <div className="absolute left-[9px] top-3 bottom-3 w-px bg-border" />

                {member.ministries.map((m, i) => (
                  <div key={i} className="flex gap-4 pb-5 last:pb-0 relative">
                    {/* Dot */}
                    <div
                      className={`w-4.5 h-4.5 mt-0.5 shrink-0 rounded-full border-2 z-10 ${
                        m.endDate
                          ? "bg-muted border-border"
                          : "bg-emerald-500 border-emerald-500"
                      }`}
                      style={{ minWidth: "18px", height: "18px" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <div className="text-[13px] font-semibold text-foreground">
                            {m.ministry}
                          </div>
                          <div className="text-[12px] text-primary font-medium">{m.role}</div>
                        </div>
                        <div className="text-[11px] text-muted-foreground whitespace-nowrap">
                          {formatMinistryDate(m.startDate)}
                          {m.endDate ? (
                            <> → {formatMinistryDate(m.endDate)}</>
                          ) : (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[10px]">
                              Currently serving
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-0.5">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── PASTORAL CARE — Staff only ── */}
        {isStaff && (
          <div className="flex flex-col gap-4">
            <StaffOnlySection
              title="Pastoral Care"
              icon={<Heart className="w-4 h-4" />}
            >
              {member.pastoralCareLog.length === 0 ? (
                <p className="text-[13px] text-muted-foreground">No pastoral care records.</p>
              ) : (
                <div className="relative flex flex-col gap-0">
                  <div className="absolute left-[9px] top-3 bottom-3 w-px bg-violet-200 dark:bg-violet-800/40" />
                  {member.pastoralCareLog.map((entry, i) => (
                    <div key={i} className="flex gap-4 pb-5 last:pb-0">
                      <div
                        className="mt-0.5 shrink-0 rounded-full bg-violet-500 z-10"
                        style={{ minWidth: "18px", height: "18px" }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-start justify-between gap-1">
                          <div>
                            <div className="text-[13px] font-semibold text-foreground">
                              {entry.type}
                            </div>
                            <div className="text-[12px] text-violet-600 dark:text-violet-400 font-medium">
                              {entry.pastor}
                            </div>
                          </div>
                          <div className="text-[11px] text-muted-foreground">{entry.date}</div>
                        </div>
                        <p className="text-[12px] text-muted-foreground mt-0.5">{entry.summary}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </StaffOnlySection>
            {member.pastoralCareLog.length > 0 && (
              <button
                onClick={() => navigate("/pastoral-care")}
                className="flex items-center justify-between w-full bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/40 rounded-xl p-4 text-[13px] text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="font-medium">View active care cases</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* ── GIVING HISTORY ── */}
        <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-border">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h2 className="text-[15px] font-semibold">Giving History</h2>
          </div>

          <div className="p-5">
            {/* Summary stat */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[12px] text-muted-foreground">Lifetime Total</div>
                <div className="text-[24px] font-bold text-foreground tabular-nums">
                  {formatAmount(totalLifetimeGiving)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-muted-foreground">Years on Record</div>
                <div className="text-[20px] font-bold text-muted-foreground tabular-nums">
                  {member.givingByYear.length}
                </div>
              </div>
            </div>

            {/* Year chart */}
            <div className="flex flex-col gap-2.5">
              {member.givingByYear.map((g) => (
                <div key={g.year}>
                  <div className="flex items-center justify-between mb-1 text-[12px]">
                    <span className="font-medium text-foreground">{g.year}</span>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <span>{g.transactionCount} txns</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        {formatAmount(g.total)}
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(g.total / maxGiving) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent transactions */}
            {recentTxns.length > 0 && (
              <div className="mt-5 pt-4 border-t border-border">
                <div className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Recent Transactions
                </div>
                <div className="flex flex-col gap-2">
                  {recentTxns.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between text-[13px] py-2 border-b border-border/50 last:border-0"
                    >
                      <div>
                        <div className="font-medium capitalize">
                          {t.category === "general offering"
                            ? "General Offering"
                            : t.category
                                .replace("designated offering (", "")
                                .replace(")", "")
                                .replace(/^./, (c) => c.toUpperCase())}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {t.transactionDatetime} · {t.paynowId}
                        </div>
                      </div>
                      <div className="font-bold tabular-nums">{formatAmount(t.amount)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── STAFF NOTES — Staff only ── */}

        {isStaff && (
          <StaffOnlySection
            title="Staff Notes"
            icon={<StickyNote className="w-4 h-4" />}
          >
            {member.staffNotes.length === 0 ? (
              <p className="text-[13px] text-muted-foreground italic">No staff notes recorded.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {member.staffNotes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-violet-200 dark:border-violet-800/40 bg-white dark:bg-violet-950/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[13px] font-semibold text-foreground">
                          {note.authorName}
                        </span>
                        <span className="text-[11px] text-muted-foreground ml-2">
                          ({note.authorRole})
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {note.createdAt}
                      </span>
                    </div>
                    <p className="text-[13px] text-foreground leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </StaffOnlySection>
        )}
      </div>

      {/* ── Desktop View (Tabs) ── */}
      <div className="hidden xl:flex flex-col gap-6">
        <div className="flex bg-muted p-1 rounded-xl shadow-inner max-w-fit">
          {[
            { id: "overview", label: "Overview", icon: User },
            { id: "attendance", label: "Attendance", icon: BarChart3 },
            { id: "ministries", label: "Ministries", icon: BookOpen },
            ...(isStaff ? [{ id: "care", label: "Pastoral Care", icon: Heart }] : []),
            { id: "giving", label: "Giving History", icon: TrendingUp },
            ...(isStaff ? [{ id: "notes", label: "Staff Notes", icon: StickyNote }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {["care", "notes"].includes(tab.id) && (
                <Lock className="w-3 h-3 ml-1 text-violet-500" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {activeTab === "overview" && (
            <div className="grid grid-cols-2 gap-8 p-6">
              <div>
                <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Quick Info
                </h3>
                <div className="flex flex-col gap-4 text-[14px]">
                  <Row label="Cell Group" value={`${member.cellGroup} Group`} />
                  <Row label="Role" value={member.role} />
                  <Row label="Member Since" value={formatJoinDate(member.joinDate)} />
                  <Row label="Years of Membership" value={membershipLength(member.joinDate)} />
                  <Row label="Ministries" value={`${member.ministries.length} served`} />
                  {isStaff && (
                    <Row
                      label="Pastoral Sessions"
                      value={`${member.pastoralCareLog.length} recorded`}
                    />
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Giving Summary
                </h3>
                <div className="flex flex-col gap-4 text-[14px]">
                  <Row label="Lifetime Total" value={formatAmount(totalLifetimeGiving)} />
                  <Row
                    label="This Year"
                    value={formatAmount(
                      member.givingByYear.find((g) => g.year === 2026)?.total ?? 0
                    )}
                  />
                  <Row
                    label="Transactions"
                    value={`${member.givingByYear.reduce((s, g) => s + g.transactionCount, 0)}`}
                  />
                </div>
                {isStaff && member.pastoralCareLog.length > 0 && (
                  <button
                    onClick={() => navigate("/pastoral-care")}
                    className="flex mt-6 items-center justify-between w-full bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800/40 rounded-xl p-4 text-[13px] text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      <span className="font-medium">View active care cases</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === "attendance" && (
            <div>
              <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                <h2 className="text-[16px] font-semibold">Attendance History & Trends</h2>
              </div>
              <div className="p-6">
                <AttendanceContent member={member} />
              </div>
            </div>
          )}

          {activeTab === "giving" && (
            <div>
              <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-[16px] font-semibold">Giving History</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[13px] text-muted-foreground">Lifetime Total</div>
                    <div className="text-[26px] font-bold text-foreground tabular-nums">
                      {formatAmount(totalLifetimeGiving)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] text-muted-foreground">Years on Record</div>
                    <div className="text-[22px] font-bold text-muted-foreground tabular-nums">
                      {member.givingByYear.length}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {member.givingByYear.map((g) => (
                    <div key={g.year}>
                      <div className="flex items-center justify-between mb-1.5 text-[13px]">
                        <span className="font-medium text-foreground">{g.year}</span>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span>{g.transactionCount} txns</span>
                          <span className="font-semibold text-foreground tabular-nums">
                            {formatAmount(g.total)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2.5 bg-muted rounded-full">
                        <div
                          className="h-2.5 rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${(g.total / maxGiving) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {recentTxns.length > 0 && (
                  <div className="mt-8 pt-5 border-t border-border">
                    <div className="text-[13px] font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                      Recent Transactions
                    </div>
                    <div className="flex flex-col gap-3">
                      {recentTxns.map((t) => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between text-[14px] py-2 border-b border-border/50 last:border-0"
                        >
                          <div>
                            <div className="font-medium capitalize">
                              {t.category === "general offering"
                                ? "General Offering"
                                : t.category
                                    .replace("designated offering (", "")
                                    .replace(")", "")
                                    .replace(/^./, (c) => c.toUpperCase())}
                            </div>
                            <div className="text-[12px] text-muted-foreground mt-0.5">
                              {t.transactionDatetime} · {t.paynowId}
                            </div>
                          </div>
                          <div className="font-bold tabular-nums">{formatAmount(t.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "ministries" && (
            <div>
              <div className="flex items-center gap-2.5 px-6 py-5 border-b border-border">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                <h2 className="text-[16px] font-semibold">Ministries</h2>
              </div>
              <div className="p-6">
                {member.ministries.length === 0 ? (
                  <p className="text-[14px] text-muted-foreground">No ministry records.</p>
                ) : (
                  <div className="relative flex flex-col gap-0">
                    <div className="absolute left-[9px] top-3 bottom-3 w-px bg-border" />
                    {member.ministries.map((m, i) => (
                      <div key={i} className="flex gap-5 pb-6 last:pb-0 relative">
                        <div
                          className={`w-5 h-5 mt-0.5 shrink-0 rounded-full border-2 z-10 ${
                            m.endDate
                              ? "bg-muted border-border"
                              : "bg-emerald-500 border-emerald-500"
                          }`}
                          style={{ minWidth: "20px", height: "20px" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <div className="text-[15px] font-semibold text-foreground">
                                {m.ministry}
                              </div>
                              <div className="text-[13px] text-primary font-medium mt-0.5">{m.role}</div>
                            </div>
                            <div className="text-[13px] text-muted-foreground whitespace-nowrap">
                              {formatMinistryDate(m.startDate)}
                              {m.endDate ? (
                                <> → {formatMinistryDate(m.endDate)}</>
                              ) : (
                                <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold text-[11px]">
                                  Currently serving
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-[14px] text-muted-foreground mt-1.5">{m.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "care" && isStaff && (
            <div>
              <div className="flex items-center justify-between px-6 py-5 border-b border-violet-200 dark:border-violet-800/40 bg-violet-50/50 dark:bg-violet-950/10">
                <div className="flex items-center gap-2.5">
                  <Heart className="w-5 h-5 text-violet-500" />
                  <h2 className="text-[16px] font-semibold text-foreground">Pastoral Care</h2>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full dark:bg-violet-900/40 dark:text-violet-300">
                  <Lock className="w-3 h-3" />
                  Staff Only
                </span>
              </div>
              <div className="p-6">
                {member.pastoralCareLog.length === 0 ? (
                  <p className="text-[14px] text-muted-foreground">No pastoral care records.</p>
                ) : (
                  <div className="relative flex flex-col gap-0">
                    <div className="absolute left-[9px] top-3 bottom-3 w-px bg-violet-200 dark:bg-violet-800/40" />
                    {member.pastoralCareLog.map((entry, i) => (
                      <div key={i} className="flex gap-5 pb-6 last:pb-0">
                        <div
                          className="mt-1 shrink-0 rounded-full bg-violet-500 z-10"
                          style={{ minWidth: "20px", height: "20px" }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-1">
                            <div>
                              <div className="text-[15px] font-semibold text-foreground">
                                {entry.type}
                              </div>
                              <div className="text-[13px] text-violet-600 dark:text-violet-400 font-medium">
                                {entry.pastor}
                              </div>
                            </div>
                            <div className="text-[13px] text-muted-foreground">{entry.date}</div>
                          </div>
                          <p className="text-[14px] text-muted-foreground mt-1.5">{entry.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "notes" && isStaff && (
            <div>
              <div className="flex items-center justify-between px-6 py-5 border-b border-violet-200 dark:border-violet-800/40 bg-violet-50/50 dark:bg-violet-950/10">
                <div className="flex items-center gap-2.5">
                  <StickyNote className="w-5 h-5 text-violet-500" />
                  <h2 className="text-[16px] font-semibold text-foreground">Staff Notes</h2>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-violet-700 bg-violet-100 px-2.5 py-1 rounded-full dark:bg-violet-900/40 dark:text-violet-300">
                  <Lock className="w-3 h-3" />
                  Staff Only
                </span>
              </div>
              <div className="p-6">
                {member.staffNotes.length === 0 ? (
                  <p className="text-[14px] text-muted-foreground italic">No staff notes recorded.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {member.staffNotes.map((note) => (
                      <div
                        key={note.id}
                        className="rounded-lg border border-violet-200 dark:border-violet-800/40 bg-white dark:bg-violet-950/20 p-5"
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <span className="text-[14px] font-semibold text-foreground">
                              {note.authorName}
                            </span>
                            <span className="text-[12px] text-muted-foreground ml-2">
                              ({note.authorRole})
                            </span>
                          </div>
                          <span className="text-[12px] text-muted-foreground whitespace-nowrap">
                            {note.createdAt}
                          </span>
                        </div>
                        <p className="text-[14px] text-foreground leading-relaxed">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Small helper ───────────────────────────────────────────────────────────────
function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

function AttendanceContent({ member }: { member: any }) {
  // Group attendance by week (Sunday to Saturday)
  const attendanceByWeek = useMemo(() => {
    const weeksMap = new Map<string, { sunday: boolean; cell: boolean; event: boolean; weekStart: string }>();
    
    member.attendance.forEach((rec: any) => {
      const date = new Date(rec.date);
      const day = date.getDay();
      const diff = date.getDate() - day; // Back to Sunday
      const sundayDate = new Date(date);
      sundayDate.setDate(diff);
      sundayDate.setHours(0, 0, 0, 0);
      const weekKey = sundayDate.toISOString().split("T")[0];

      if (!weeksMap.has(weekKey)) {
        weeksMap.set(weekKey, { sunday: false, cell: false, event: false, weekStart: weekKey });
      }
      
      const week = weeksMap.get(weekKey)!;
      if (rec.attended) {
        if (rec.type === "sunday service") week.sunday = true;
        if (rec.type === "cell group") week.cell = true;
        if (rec.type === "event") week.event = true;
      }
    });

    return Array.from(weeksMap.values()).sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  }, [member.attendance]);

  return (
    <div className="space-y-8">
      {/* ── Attendance Graph ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Attendance Trends (Last 6 Weeks)</h4>
          <div className="flex gap-4 text-[11px] font-medium">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-primary" /> Sunday</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Cell</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-400" /> Event</span>
          </div>
        </div>
        
        <div className="flex items-end gap-2 h-40 pt-4 border-b border-l border-border px-4">
          {attendanceByWeek.slice(0, 6).reverse().map((week) => (
            <div key={week.weekStart} className="flex-1 flex flex-col justify-end gap-1 group relative">
              {/* Tooltip hint */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20 shadow-xl">
                Week of {new Date(week.weekStart).toLocaleDateString("en-SG", { day: 'numeric', month: 'short' })}
              </div>
              
              {week.event && <div className="w-full h-8 bg-orange-400 rounded-sm hover:brightness-110 transition-all cursor-help" />}
              {week.cell && <div className="w-full h-10 bg-emerald-500 rounded-sm hover:brightness-110 transition-all cursor-help" />}
              {week.sunday && <div className="w-full h-12 bg-primary rounded-sm hover:brightness-110 transition-all cursor-help" />}
              
              {!week.event && !week.cell && !week.sunday && <div className="w-full h-1 bg-muted rounded-full mb-1 opacity-50" />}
              
              <div className="text-[9px] text-muted-foreground font-bold mt-2 text-center rotate-45 origin-left whitespace-nowrap">
                {new Date(week.weekStart).toLocaleDateString("en-SG", { day: 'numeric', month: 'short' })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Attendance Listing ── */}
      <div className="hidden xl:block">
        <h4 className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Detailed Records</h4>
        <div className="border border-border rounded-xl overflow-hidden bg-muted/5">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="px-4 py-3 font-bold text-foreground">Date</th>
                <th className="px-4 py-3 font-bold text-foreground">Type</th>
                <th className="px-4 py-3 font-bold text-foreground text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {member.attendance.slice().sort((a: any, b: any) => b.date.localeCompare(a.date)).map((rec: any, i: number) => (
                <tr key={i} className="hover:bg-muted/10 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    {new Date(rec.date).toLocaleDateString("en-SG", { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize">{rec.type}</span>
                    {rec.eventName && <span className="text-[11px] text-muted-foreground ml-2">({rec.eventName})</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {rec.attended ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-bold dark:bg-emerald-950/20">
                        <CheckCircle2 className="w-3 h-3" /> Attended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-500 bg-red-50 px-2 py-0.5 rounded-full text-[11px] font-bold dark:bg-red-950/20">
                        <XCircle className="w-3 h-3" /> Absent
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
