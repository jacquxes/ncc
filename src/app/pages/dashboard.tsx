import { 
  Heart, 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  DollarSign, 
  BarChart3 
} from "lucide-react";
import { Link } from "react-router";
import { initialCases, initialTransactions } from "../data/store";
import { CaseStatusBadge } from "../components/status-badge";

export function Dashboard() {
  const recentCases = initialCases.slice(0, 4);
  const paidTransactions = initialTransactions.filter(t => t.status === "paid");
  
  const totalRaised = paidTransactions.reduce((acc, t) => acc + t.amount, 0);
  const transactionCount = paidTransactions.length;
  
  const categoryTotals = [
    { name: "General Offering", cat: "general offering", color: "bg-blue-500" },
    { name: "Israel Outreach", cat: "designated offering (israel)", color: "bg-purple-500" },
    { name: "Local Outreach", cat: "designated offering (outreach)", color: "bg-emerald-500" },
    { name: "Global Missions", cat: "designated offering (global missions)", color: "bg-amber-500" },
    { name: "Others", cat: "designated offering (others)", color: "bg-slate-400" },
  ].map(item => {
    const amount = paidTransactions
      .filter(t => t.category === item.cat)
      .reduce((acc, t) => acc + t.amount, 0);
    return { ...item, amount };
  });

  const stats = [
    {
      label: "Scheduled Cases",
      value: initialCases.filter((c) => c.status === "scheduled").length,
      icon: Heart,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "New Cases",
      value: initialCases.filter((c) => c.status === "new").length,
      icon: AlertCircle,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Paid Transactions",
      value: transactionCount,
      icon: CheckCircle2,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Total Giving",
      value: `$${totalRaised.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-foreground">Dashboard</h1>
        <p className="text-[14px] text-muted-foreground mt-1">
          Welcome back. Here's an overview of your church management activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card rounded-lg border border-border p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-muted-foreground font-medium">{stat.label}</span>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-[24px] font-semibold text-foreground">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cases */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-[16px] font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Recent Pastoral Cases
            </h3>
            <Link
              to="/pastoral-care"
              className="text-[13px] text-primary hover:underline font-medium"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentCases.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                <div>
                  <div className="text-[14px] font-medium text-foreground">
                    {c.memberName}
                  </div>
                  <div className="text-[12px] text-muted-foreground capitalize">
                    {c.caseType} &middot; {c.assignedPastorName}
                  </div>
                </div>
                <CaseStatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Giving by Category */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-[16px] font-semibold flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              Giving by Category
            </h3>
            <Link
              to="/giving"
              className="text-[13px] text-primary hover:underline font-medium"
            >
              Details
            </Link>
          </div>
          <div className="p-4 space-y-6 text-foreground">
            {categoryTotals.map((cat) => {
              const percentage = totalRaised > 0 ? (cat.amount / totalRaised) * 100 : 0;
              return (
                <div key={cat.name} className="space-y-1.5">
                  <div className="flex justify-between items-end">
                    <span className="text-[13px] font-medium">{cat.name}</span>
                    <span className="text-[13px] font-semibold text-foreground">
                      ${cat.amount.toLocaleString()} 
                      <span className="text-[11px] text-muted-foreground font-normal ml-1.5">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`${cat.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
            
            <div className="pt-4 border-t border-border mt-4">
              <div className="flex justify-between items-center text-[13px]">
                <span className="text-muted-foreground">Highest Category</span>
                <span className="font-semibold text-primary">
                  {categoryTotals.reduce((max, curr) => curr.amount > max.amount ? curr : max, categoryTotals[0]).name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
