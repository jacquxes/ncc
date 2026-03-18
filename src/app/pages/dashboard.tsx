import { Heart, Megaphone, Users, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import { initialCases, initialCampaigns } from "../data/store";
import { CaseStatusBadge, CampaignStatusBadge } from "../components/status-badge";

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
    label: "Active Campaigns",
    value: initialCampaigns.filter((c) => c.status === "active").length,
    icon: Megaphone,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Total Raised",
    value: `$${initialCampaigns.reduce((s, c) => s + c.raisedAmount, 0).toLocaleString()}`,
    icon: TrendingUp,
    color: "text-purple-600 bg-purple-50",
  },
];

export function Dashboard() {
  const recentCases = initialCases.slice(0, 4);
  const activeCampaigns = initialCampaigns.filter((c) => c.status === "active");

  return (
    <div className="p-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1>Dashboard</h1>
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
              <span className="text-[13px] text-muted-foreground">{stat.label}</span>
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
            <h3>Recent Pastoral Cases</h3>
            <Link
              to="/pastoral-care"
              className="text-[13px] text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentCases.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4">
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

        {/* Active Campaigns */}
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3>Active Campaigns</h3>
            <Link
              to="/campaigns"
              className="text-[13px] text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activeCampaigns.map((c) => {
              const pct = Math.round((c.raisedAmount / c.goalAmount) * 100);
              return (
                <div key={c.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[14px] font-medium text-foreground">
                      {c.name}
                    </div>
                    <CampaignStatusBadge status={c.status} />
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-1.5">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[12px] text-muted-foreground">
                    <span>${c.raisedAmount.toLocaleString()} raised</span>
                    <span>{pct}% of ${c.goalAmount.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
