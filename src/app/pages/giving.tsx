import { useState, useMemo } from "react";
import {
  Search,
  TrendingUp,
  List,
  DollarSign,
  Hash,
  BarChart3,
  ChevronDown,
} from "lucide-react";
import {
  initialTransactions,
  type GivingTransaction,
  type GivingCategory,
  type TransactionStatus,
} from "../data/store";

// ── Types ─────────────────────────────────────────────────────────────────────
type ActiveView = "insights" | "transactions";
type TimePeriod = "week" | "month" | "year" | "all";

const ALL_CATEGORIES: GivingCategory[] = [
  "general offering",
  "designated offering (israel)",
  "designated offering (outreach)",
  "designated offering (global missions)",
  "designated offering (others)",
];

const CATEGORY_COLORS: Record<GivingCategory, { bar: string; badge: string }> = {
  "general offering": { bar: "bg-primary", badge: "bg-primary/10 text-primary" },
  "designated offering (israel)": { bar: "bg-violet-500", badge: "bg-violet-100 text-violet-700" },
  "designated offering (outreach)": { bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  "designated offering (global missions)": { bar: "bg-amber-500", badge: "bg-amber-100 text-amber-700" },
  "designated offering (others)": { bar: "bg-rose-400", badge: "bg-rose-100 text-rose-700" },
};

const STATUS_STYLES: Record<TransactionStatus, string> = {
  pending: "bg-green-100 text-green-700",
  paid: "bg-blue-100 text-blue-700",
  cancelled: "bg-gray-100 text-gray-500",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseDatetime(dt: string): Date {
  // Format: DD/MM/YYYY HH:mm
  const [datePart, timePart] = dt.split(" ");
  const [dd, mm, yyyy] = datePart.split("/").map(Number);
  const [h, m] = (timePart || "00:00").split(":").map(Number);
  return new Date(yyyy, mm - 1, dd, h, m);
}

function formatAmount(n: number): string {
  return `S$${n.toLocaleString("en-SG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatCategoryLabel(cat: GivingCategory): string {
  return cat
    .replace("designated offering (", "")
    .replace(")", "")
    .replace(/^./, (c) => c.toUpperCase());
}

function filterByPeriod(txns: GivingTransaction[], period: TimePeriod): GivingTransaction[] {
  if (period === "all") return txns;
  const now = new Date(2026, 2, 24); // Today: 2026-03-24
  return txns.filter((t) => {
    const d = parseDatetime(t.transactionDatetime);
    if (period === "week") {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Sunday
      return d >= weekStart;
    }
    if (period === "month") {
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    }
    if (period === "year") {
      return d.getFullYear() === now.getFullYear();
    }
    return true;
  });
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function Giving() {
  const [view, setView] = useState<ActiveView>("insights");
  const [period, setPeriod] = useState<TimePeriod>("month");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [sortField, setSortField] = useState<keyof GivingTransaction>("transactionDatetime");
  const [sortAsc, setSortAsc] = useState(false);

  // ── Insights Data ────────────────────────────────────────────────────────────
  const periodTransactions = useMemo(() => filterByPeriod(initialTransactions, period), [period]);

  const totalDonations = useMemo(
    () => periodTransactions.reduce((s, t) => s + t.amount, 0),
    [periodTransactions]
  );
  const avgPerTransaction = periodTransactions.length
    ? totalDonations / periodTransactions.length
    : 0;

  const byCategory = useMemo(() => {
    const map: Record<GivingCategory, number> = {
      "general offering": 0,
      "designated offering (israel)": 0,
      "designated offering (outreach)": 0,
      "designated offering (global missions)": 0,
      "designated offering (others)": 0,
    };
    periodTransactions.forEach((t) => (map[t.category] += t.amount));
    return ALL_CATEGORIES.map((cat) => ({ cat, total: map[cat] })).sort(
      (a, b) => b.total - a.total
    );
  }, [periodTransactions]);

  const maxCategoryTotal = byCategory[0]?.total || 1;

  // ── Transactions Data ─────────────────────────────────────────────────────────
  const filteredTransactions = useMemo(() => {
    let txns = [...initialTransactions];
    if (search) {
      const q = search.toLowerCase();
      txns = txns.filter(
        (t) =>
          t.memberName.toLowerCase().includes(q) ||
          t.paynowId.toLowerCase().includes(q) ||
          t.phoneNumber.includes(q)
      );
    }
    if (statusFilter !== "all") {
      txns = txns.filter((t) => t.status === statusFilter);
    }
    txns.sort((a, b) => {
      const va = a[sortField];
      const vb = b[sortField];
      if (typeof va === "number" && typeof vb === "number") {
        return sortAsc ? va - vb : vb - va;
      }
      const sa = String(va);
      const sb = String(vb);
      // For datetime, parse for proper sort
      if (sortField === "transactionDatetime") {
        const da = parseDatetime(sa).getTime();
        const db = parseDatetime(sb).getTime();
        return sortAsc ? da - db : db - da;
      }
      return sortAsc ? sa.localeCompare(sb) : sb.localeCompare(sa);
    });
    return txns;
  }, [search, statusFilter, sortField, sortAsc]);

  function toggleSort(field: keyof GivingTransaction) {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  }

  const SortIcon = ({ field }: { field: keyof GivingTransaction }) =>
    sortField === field ? (
      <span className={`ml-0.5 text-primary ${sortAsc ? "rotate-180 inline-block" : ""}`}>▾</span>
    ) : (
      <span className="ml-0.5 text-muted-foreground/40">▾</span>
    );

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">

      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold">Giving</h1>
        <p className="text-[14px] text-muted-foreground mt-0.5">
          Track and analyse donation activity across your church community.
        </p>
      </div>

      {/* ── Toggle Switch ── */}
      <div className="inline-flex items-center bg-muted rounded-lg p-1 mb-6 gap-0.5">
        {(["insights", "transactions"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-md text-[13px] font-medium transition-all ${view === v
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
            aria-pressed={view === v}
          >
            {v === "insights" ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <List className="w-3.5 h-3.5" />
            )}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════════════
          INSIGHTS VIEW
      ════════════════════════════════════════════════════════════ */}
      {view === "insights" && (
        <div>
          {/* Period selector */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[13px] text-muted-foreground">Period:</span>
            <div className="flex items-center bg-muted rounded-lg p-0.5 gap-0.5">
              {(
                [
                  { v: "week", label: "This Week" },
                  { v: "month", label: "This Month" },
                  { v: "year", label: "This Year" },
                  { v: "all", label: "All Time" },
                ] as const
              ).map(({ v, label }) => (
                <button
                  key={v}
                  onClick={() => setPeriod(v)}
                  className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all ${period === v
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <SummaryCard
              icon={<DollarSign className="w-4 h-4" />}
              label="Total Donations"
              value={formatAmount(totalDonations)}
              color="text-primary"
            />
            <SummaryCard
              icon={<Hash className="w-4 h-4" />}
              label="Transactions"
              value={String(periodTransactions.length)}
              color="text-violet-600"
            />
            <SummaryCard
              icon={<BarChart3 className="w-4 h-4" />}
              label="Average per Transaction"
              value={formatAmount(avgPerTransaction)}
              color="text-emerald-600"
            />
          </div>

          {/* Category breakdown */}
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-[15px] font-semibold mb-4">Giving by Category</h2>
            {periodTransactions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-[14px]">
                No donation data for this period.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {byCategory.map(({ cat, total }) => {
                  const pct = total > 0 ? (total / totalDonations) * 100 : 0;
                  const txnCount = periodTransactions.filter((t) => t.category === cat).length;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[cat].badge}`}
                          >
                            {cat === "general offering"
                              ? "General"
                              : formatCategoryLabel(cat)}
                          </span>
                          <span className="text-[12px] text-muted-foreground">
                            {txnCount} txn{txnCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[12px] text-muted-foreground">
                            {pct.toFixed(1)}%
                          </span>
                          <span className="text-[13px] font-semibold tabular-nums">
                            {formatAmount(total)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`${CATEGORY_COLORS[cat].bar} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${(total / maxCategoryTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════
          TRANSACTIONS VIEW
      ════════════════════════════════════════════════════════════ */}
      {view === "transactions" && (
        <div>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, reference, or phone…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-border rounded-lg bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as TransactionStatus | "all")
                }
                className="appearance-none pl-3 pr-8 py-2 border border-border rounded-lg bg-input-background text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary capitalize cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <span className="text-[13px] text-muted-foreground self-center whitespace-nowrap">
              {filteredTransactions.length} record{filteredTransactions.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Table — desktop */}
          <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <Th onClick={() => toggleSort("transactionDatetime")}>
                      Date &amp; Time <SortIcon field="transactionDatetime" />
                    </Th>
                    <Th onClick={() => toggleSort("memberName")}>
                      Member <SortIcon field="memberName" />
                    </Th>
                    <Th>Phone</Th>
                    <Th>Reference</Th>
                    <Th onClick={() => toggleSort("category")}>
                      Category <SortIcon field="category" />
                    </Th>
                    <Th onClick={() => toggleSort("amount")} right>
                      Amount <SortIcon field="amount" />
                    </Th>
                    <Th onClick={() => toggleSort("status")}>
                      Status <SortIcon field="status" />
                    </Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((t, i) => (
                    <tr
                      key={t.id}
                      className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${i % 2 === 0 ? "" : "bg-muted/10"
                        }`}
                    >
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {t.transactionDatetime}
                      </td>
                      <td className="px-4 py-3 font-medium">{t.memberName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.phoneNumber}</td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-[12px]">
                        {t.paynowId}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_COLORS[t.category].badge}`}
                        >
                          {t.category === "general offering"
                            ? "General"
                            : formatCategoryLabel(t.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold tabular-nums">
                        {formatAmount(t.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[t.status]}`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-muted-foreground"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards — mobile */}
          <div className="flex md:hidden flex-col gap-3">
            {filteredTransactions.map((t) => (
              <div
                key={t.id}
                className="bg-card rounded-lg border border-border p-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-[14px]">{t.memberName}</div>
                    <div className="text-[12px] text-muted-foreground">{t.phoneNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[15px]">{formatAmount(t.amount)}</div>
                    <span
                      className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${STATUS_STYLES[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium capitalize ${CATEGORY_COLORS[t.category].badge}`}
                  >
                    {t.category === "general offering"
                      ? "General"
                      : formatCategoryLabel(t.category)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {t.transactionDatetime}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  Ref: {t.paynowId}
                </div>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-[14px]">
                No transactions found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────
function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-muted ${color}`}>{icon}</div>
      <div>
        <div className="text-[12px] text-muted-foreground">{label}</div>
        <div className="text-[18px] font-bold tabular-nums">{value}</div>
      </div>
    </div>
  );
}

function Th({
  children,
  onClick,
  right,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  right?: boolean;
}) {
  return (
    <th
      onClick={onClick}
      className={`px-4 py-3 font-semibold text-[12px] text-muted-foreground uppercase tracking-wide whitespace-nowrap select-none ${right ? "text-right" : "text-left"
        } ${onClick ? "cursor-pointer hover:text-foreground transition-colors" : ""}`}
    >
      {children}
    </th>
  );
}
