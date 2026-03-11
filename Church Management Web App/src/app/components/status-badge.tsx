import type { CaseStatus, CampaignStatus } from "../data/store";

const caseStatusStyles: Record<CaseStatus, string> = {
  identified: "bg-amber-100 text-amber-700",
  assigned: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  monitoring: "bg-purple-100 text-purple-700",
  closed: "bg-gray-100 text-gray-500",
};

const campaignStatusStyles: Record<CampaignStatus, string> = {
  draft: "bg-gray-100 text-gray-600",
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  archived: "bg-gray-100 text-gray-500",
};

export function CaseStatusBadge({ status }: { status: CaseStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium capitalize ${caseStatusStyles[status]}`}
    >
      {status}
    </span>
  );
}

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium capitalize ${campaignStatusStyles[status]}`}
    >
      {status}
    </span>
  );
}
