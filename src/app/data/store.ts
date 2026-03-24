// Mock data store for Church Management App

export type CaseStatus = "new" | "assigned" | "scheduled" | "completed";
export type CaseType =
  | "grief and bereavement"
  | "illness and hospital visitation"
  | "marriage and relationship issues"
  | "family and parenting struggles"
  | "spiritual crisis or faith struggles"
  | "financial or life crisis"
  | "crisis and trauma care";
export type ConfidentialityLevel = "standard" | "sensitive" | "highly confidential";
export type CampaignStatus = "draft" | "active" | "completed" | "archived";
export type Role = "Admin" | "Pastor" | "Care Team" | "Ministry Leader" | "Volunteer";
export type GivingCategory =
  | "general offering"
  | "designated offering (israel)"
  | "designated offering (outreach)"
  | "designated offering (global missions)"
  | "designated offering (others)";
export type TransactionStatus = "active" | "completed" | "archived";

export interface PastoralCase {
  id: string;
  memberId: string;
  memberName: string;
  caseType: CaseType;
  assignedPastorId: string;
  assignedPastorName: string;
  status: CaseStatus;
  confidentialityLevel: ConfidentialityLevel;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  startDate: string;
  endDate: string;
  targetAudience: string;
  status: CampaignStatus;
}

export interface GivingTransaction {
  id: string;
  memberId: string;
  memberName: string;
  phoneNumber: string;
  amount: number; // in SGD cents stored as number
  paynowId: string;
  transactionDatetime: string; // DD/MM/YYYY HH:mm
  category: GivingCategory;
  status: TransactionStatus;
}

export interface StaffMember {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
}

export interface TimelineItem {
  title: string;
  date: string;
  description: string;
}

export interface CalendarSlot {
  id: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "9:00 AM"
  endTime: string; // e.g. "10:00 AM"
  isBooked: boolean;
  bookedFor?: string; // member name if booked
}

export interface PastorSchedule {
  pastorId: string;
  slots: CalendarSlot[];
}

export const staffMembers: StaffMember[] = [
  { id: "p1", name: "Pastor James Wilson", role: "Pastor", email: "james@gracechurch.org" },
  { id: "p2", name: "Pastor Sarah Chen", role: "Pastor", email: "sarah@gracechurch.org" },
  { id: "p3", name: "Rev. Michael Torres", role: "Pastor", email: "michael@gracechurch.org" },
  { id: "ct1", name: "Deacon Ruth Adams", role: "Care Team", email: "ruth@gracechurch.org" },
  { id: "ct2", name: "Deacon Mark Johnson", role: "Care Team", email: "mark@gracechurch.org" },
  { id: "ml1", name: "Lisa Park", role: "Ministry Leader", email: "lisa@gracechurch.org" },
  { id: "a1", name: "Admin Alex Rivera", role: "Admin", email: "alex@gracechurch.org" },
];

export const initialCases: PastoralCase[] = [
  {
    id: "case-000",
    memberId: "m0",
    memberName: "Sarah Tan",
    caseType: "illness and hospital visitation",
    assignedPastorId: "p1",
    assignedPastorName: "Pastor James Wilson",
    status: "scheduled",
    confidentialityLevel: "sensitive",
    notes: "Grandma in hospital. Needs prayer and someone to share the gospel with her",
    createdAt: "2026-03-12",
    updatedAt: "2026-03-16",
  },
  {
    id: "case-001",
    memberId: "m1",
    memberName: "David Thompson",
    caseType: "grief and bereavement",
    assignedPastorId: "p1",
    assignedPastorName: "Pastor James Wilson",
    status: "scheduled",
    confidentialityLevel: "sensitive",
    notes: "Recently lost a family member. Needs ongoing grief support.",
    createdAt: "2026-02-15",
    updatedAt: "2026-03-08",
  },
  {
    id: "case-002",
    memberId: "m2",
    memberName: "Maria Gonzalez",
    caseType: "marriage and relationship issues",
    assignedPastorId: "p2",
    assignedPastorName: "Pastor Sarah Chen",
    status: "assigned",
    confidentialityLevel: "highly confidential",
    notes: "Couple seeking pre-marital counseling sessions.",
    createdAt: "2026-03-01",
    updatedAt: "2026-03-05",
  },
  {
    id: "case-003",
    memberId: "m3",
    memberName: "Robert Kim",
    caseType: "illness and hospital visitation",
    assignedPastorId: "p3",
    assignedPastorName: "Rev. Michael Torres",
    status: "scheduled",
    confidentialityLevel: "standard",
    notes: "Recovering from surgery. Receiving home visits.",
    createdAt: "2026-01-20",
    updatedAt: "2026-03-10",
  },
  {
    id: "case-004",
    memberId: "m4",
    memberName: "Angela Foster",
    caseType: "financial or life crisis",
    assignedPastorId: "p1",
    assignedPastorName: "Pastor James Wilson",
    status: "new",
    confidentialityLevel: "sensitive",
    notes: "Facing job loss, requesting benevolence assistance.",
    createdAt: "2026-03-09",
    updatedAt: "2026-03-09",
  },
  {
    id: "case-005",
    memberId: "m5",
    memberName: "Thomas Brown",
    caseType: "spiritual crisis or faith struggles",
    assignedPastorId: "p2",
    assignedPastorName: "Pastor Sarah Chen",
    status: "completed",
    confidentialityLevel: "standard",
    notes: "Completed discipleship journey. Transitioned to small group.",
    createdAt: "2025-11-10",
    updatedAt: "2026-02-28",
  },
  {
    id: "case-006",
    memberId: "m6",
    memberName: "Jennifer White",
    caseType: "grief and bereavement",
    assignedPastorId: "p3",
    assignedPastorName: "Rev. Michael Torres",
    status: "scheduled",
    confidentialityLevel: "standard",
    notes: "Processing the loss of a close friend. Attending grief group.",
    createdAt: "2026-02-20",
    updatedAt: "2026-03-07",
  },
];

export const initialCampaigns: Campaign[] = [
  {
    id: "camp-001",
    name: "Easter Outreach 2026",
    description: "Community meals and gift baskets for local families in need during the Easter season.",
    goalAmount: 15000,
    raisedAmount: 9750,
    startDate: "2026-03-01",
    endDate: "2026-04-05",
    targetAudience: "All Members",
    status: "active",
  },
  {
    id: "camp-002",
    name: "Youth Summer Camp Fund",
    description: "Sponsoring youth members for the annual summer camp retreat.",
    goalAmount: 25000,
    raisedAmount: 8200,
    startDate: "2026-04-01",
    endDate: "2026-06-15",
    targetAudience: "Youth Ministry",
    status: "active",
  },
  {
    id: "camp-003",
    name: "Building Renovation Fund",
    description: "Renovating the fellowship hall and upgrading accessibility features.",
    goalAmount: 100000,
    raisedAmount: 42000,
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    targetAudience: "All Members",
    status: "active",
  },
  {
    id: "camp-004",
    name: "Christmas Missions Trip",
    description: "Supporting the annual missions trip to Central America.",
    goalAmount: 30000,
    raisedAmount: 30000,
    startDate: "2025-09-01",
    endDate: "2025-12-15",
    targetAudience: "Missions Team",
    status: "completed",
  },
  {
    id: "camp-005",
    name: "Worship Equipment Upgrade",
    description: "New sound system and projectors for the main sanctuary.",
    goalAmount: 20000,
    raisedAmount: 3500,
    startDate: "2026-05-01",
    endDate: "2026-08-31",
    targetAudience: "Worship Ministry",
    status: "draft",
  },
];

export const initialTransactions: GivingTransaction[] = [
  { id: "txn-001", memberId: "m1", memberName: "David Thompson", phoneNumber: "+65 9123 4567", amount: 200, paynowId: "REF-20260301-001", transactionDatetime: "01/03/2026 09:15", category: "general offering", status: "paid" },
  { id: "txn-002", memberId: "m2", memberName: "Maria Gonzalez", phoneNumber: "+65 8234 5678", amount: 500, paynowId: "REF-20260302-002", transactionDatetime: "02/03/2026 10:30", category: "designated offering (israel)", status: "paid" },
  { id: "txn-003", memberId: "m3", memberName: "Robert Kim", phoneNumber: "+65 9345 6789", amount: 150, paynowId: "REF-20260305-003", transactionDatetime: "05/03/2026 11:00", category: "designated offering (outreach)", status: "pending" },
  { id: "txn-004", memberId: "m4", memberName: "Angela Foster", phoneNumber: "+65 8456 7890", amount: 1000, paynowId: "REF-20260308-004", transactionDatetime: "08/03/2026 14:20", category: "designated offering (global missions)", status: "pending" },
  { id: "txn-005", memberId: "m5", memberName: "Thomas Brown", phoneNumber: "+65 9567 8901", amount: 80, paynowId: "REF-20260309-005", transactionDatetime: "09/03/2026 09:45", category: "general offering", status: "paid" },
  { id: "txn-006", memberId: "m6", memberName: "Jennifer White", phoneNumber: "+65 8678 9012", amount: 300, paynowId: "REF-20260310-006", transactionDatetime: "10/03/2026 16:00", category: "designated offering (others)", status: "paid" },
  { id: "txn-007", memberId: "m7", memberName: "Samuel Lee", phoneNumber: "+65 9789 0123", amount: 250, paynowId: "REF-20260312-007", transactionDatetime: "12/03/2026 08:30", category: "general offering", status: "paid" },
  { id: "txn-008", memberId: "m8", memberName: "Grace Lim", phoneNumber: "+65 8890 1234", amount: 600, paynowId: "REF-20260313-008", transactionDatetime: "13/03/2026 12:15", category: "designated offering (israel)", status: "cancelled" },
  { id: "txn-009", memberId: "m9", memberName: "Benjamin Tan", phoneNumber: "+65 9901 2345", amount: 120, paynowId: "REF-20260314-009", transactionDatetime: "14/03/2026 10:00", category: "designated offering (outreach)", status: "cancelled" },
  { id: "txn-010", memberId: "m10", memberName: "Rachel Ng", phoneNumber: "+65 8012 3456", amount: 2000, paynowId: "REF-20260315-010", transactionDatetime: "15/03/2026 09:00", category: "designated offering (global missions)", status: "paid" },
  { id: "txn-011", memberId: "m11", memberName: "Caleb Wong", phoneNumber: "+65 9123 5678", amount: 50, paynowId: "REF-20260316-011", transactionDatetime: "16/03/2026 13:30", category: "general offering", status: "paid" },
  { id: "txn-012", memberId: "m12", memberName: "Lydia Koh", phoneNumber: "+65 8234 6789", amount: 400, paynowId: "REF-20260317-012", transactionDatetime: "17/03/2026 15:45", category: "designated offering (others)", status: "paid" },
  { id: "txn-013", memberId: "m2", memberName: "Maria Gonzalez", phoneNumber: "+65 8234 5678", amount: 500, paynowId: "REF-20260318-013", transactionDatetime: "18/03/2026 09:20", category: "general offering", status: "paid" },
  { id: "txn-014", memberId: "m1", memberName: "David Thompson", phoneNumber: "+65 9123 4567", amount: 200, paynowId: "REF-20260319-014", transactionDatetime: "19/03/2026 11:10", category: "designated offering (global missions)", status: "paid" },
  { id: "txn-015", memberId: "m13", memberName: "Esther Chua", phoneNumber: "+65 9234 5679", amount: 750, paynowId: "REF-20260320-015", transactionDatetime: "20/03/2026 14:00", category: "designated offering (israel)", status: "cancelled" },
  { id: "txn-016", memberId: "m14", memberName: "Joshua Teo", phoneNumber: "+65 8345 6780", amount: 100, paynowId: "REF-20260321-016", transactionDatetime: "21/03/2026 10:30", category: "designated offering (outreach)", status: "cancelled" },
  { id: "txn-017", memberId: "m15", memberName: "Hannah Singh", phoneNumber: "+65 9456 7891", amount: 300, paynowId: "REF-20260322-017", transactionDatetime: "22/03/2026 08:45", category: "general offering", status: "paid" },
  { id: "txn-018", memberId: "m5", memberName: "Thomas Brown", phoneNumber: "+65 9567 8901", amount: 450, paynowId: "REF-20260323-018", transactionDatetime: "23/03/2026 12:00", category: "designated offering (global missions)", status: "paid" },
  { id: "txn-019", memberId: "m8", memberName: "Grace Lim", phoneNumber: "+65 8890 1234", amount: 200, paynowId: "REF-20260324-019", transactionDatetime: "24/03/2026 09:30", category: "designated offering (others)", status: "paid" },
  { id: "txn-020", memberId: "m3", memberName: "Robert Kim", phoneNumber: "+65 9345 6789", amount: 80, paynowId: "REF-20260101-020", transactionDatetime: "01/01/2026 10:00", category: "general offering", status: "paid" },
  { id: "txn-021", memberId: "m6", memberName: "Jennifer White", phoneNumber: "+65 8678 9012", amount: 500, paynowId: "REF-20260115-021", transactionDatetime: "15/01/2026 11:30", category: "designated offering (israel)", status: "paid" },
  { id: "txn-022", memberId: "m11", memberName: "Caleb Wong", phoneNumber: "+65 9123 5678", amount: 200, paynowId: "REF-20260201-022", transactionDatetime: "01/02/2026 09:00", category: "designated offering (outreach)", status: "paid" },
  { id: "txn-023", memberId: "m4", memberName: "Angela Foster", phoneNumber: "+65 8456 7890", amount: 1500, paynowId: "REF-20260215-023", transactionDatetime: "15/02/2026 14:30", category: "designated offering (global missions)", status: "paid" },
  { id: "txn-024", memberId: "m12", memberName: "Lydia Koh", phoneNumber: "+65 8234 6789", amount: 100, paynowId: "REF-20260222-024", transactionDatetime: "22/02/2026 16:00", category: "general offering", status: "paid" },
];

export const caseTimelines: Record<string, TimelineItem[]> = {
  "case-001": [
    { title: "Case Created", date: "Feb 15, 2026", description: "Pastoral care case opened for grief support." },
    { title: "Assigned to Pastor James", date: "Feb 16, 2026", description: "Case assigned for initial counseling." },
    { title: "First Session Completed", date: "Feb 22, 2026", description: "Initial grief counseling session held." },
    { title: "Follow-up Visit", date: "Mar 1, 2026", description: "Home visit conducted. Member showing improvement." },
    { title: "Status Updated", date: "Mar 8, 2026", description: "Moved to scheduled care with weekly check-ins." },
  ],
  "case-002": [
    { title: "Case Created", date: "Mar 1, 2026", description: "Pre-marital counseling requested." },
    { title: "Assigned to Pastor Sarah", date: "Mar 2, 2026", description: "Assigned for counseling sessions." },
    { title: "Initial Meeting Scheduled", date: "Mar 5, 2026", description: "First session set for March 12." },
  ],
  "case-003": [
    { title: "Case Created", date: "Jan 20, 2026", description: "Health concern reported after surgery." },
    { title: "Care Team Notified", date: "Jan 21, 2026", description: "Meal train and visit schedule organized." },
    { title: "Recovery Progress", date: "Feb 15, 2026", description: "Member recovering well. Reduced visits." },
    { title: "Moved to Scheduled", date: "Mar 10, 2026", description: "Transitioning to periodic check-ins." },
  ],
};

// Generate mock calendar slots for pastors
function generateSlots(pastorId: string, bookedSlots: { date: string; time: string; endTime: string; member: string }[]): PastorSchedule {
  const baseDate = new Date(2026, 2, 11); // March 11, 2026 (today)
  const times = [
    { time: "9:00 AM", endTime: "10:00 AM" },
    { time: "10:00 AM", endTime: "11:00 AM" },
    { time: "11:00 AM", endTime: "12:00 PM" },
    { time: "1:00 PM", endTime: "2:00 PM" },
    { time: "2:00 PM", endTime: "3:00 PM" },
    { time: "3:00 PM", endTime: "4:00 PM" },
  ];
  const slots: CalendarSlot[] = [];
  for (let d = 0; d < 14; d++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + d);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends
    const dateStr = date.toISOString().split("T")[0];
    for (const t of times) {
      const booked = bookedSlots.find((b) => b.date === dateStr && b.time === t.time);
      slots.push({
        id: `${pastorId}-${dateStr}-${t.time}`,
        date: dateStr,
        time: t.time,
        endTime: t.endTime,
        isBooked: !!booked,
        bookedFor: booked?.member,
      });
    }
  }
  return { pastorId, slots };
}

export const pastorSchedules: PastorSchedule[] = [
  generateSlots("p1", [
    { date: "2026-03-11", time: "9:00 AM", endTime: "10:00 AM", member: "David Thompson" },
    { date: "2026-03-11", time: "2:00 PM", endTime: "3:00 PM", member: "Angela Foster" },
    { date: "2026-03-12", time: "10:00 AM", endTime: "11:00 AM", member: "Board Meeting" },
    { date: "2026-03-13", time: "9:00 AM", endTime: "10:00 AM", member: "David Thompson" },
    { date: "2026-03-13", time: "1:00 PM", endTime: "2:00 PM", member: "Staff Meeting" },
    { date: "2026-03-16", time: "11:00 AM", endTime: "12:00 PM", member: "Angela Foster" },
    { date: "2026-03-17", time: "9:00 AM", endTime: "10:00 AM", member: "Small Group Leaders" },
    { date: "2026-03-18", time: "2:00 PM", endTime: "3:00 PM", member: "David Thompson" },
    { date: "2026-03-19", time: "10:00 AM", endTime: "11:00 AM", member: "Youth Ministry" },
    { date: "2026-03-20", time: "3:00 PM", endTime: "4:00 PM", member: "Deacon Meeting" },
  ]),
  generateSlots("p2", [
    { date: "2026-03-11", time: "10:00 AM", endTime: "11:00 AM", member: "Maria Gonzalez" },
    { date: "2026-03-11", time: "3:00 PM", endTime: "4:00 PM", member: "Women's Ministry" },
    { date: "2026-03-12", time: "9:00 AM", endTime: "10:00 AM", member: "Maria Gonzalez" },
    { date: "2026-03-12", time: "1:00 PM", endTime: "2:00 PM", member: "Thomas Brown Follow-up" },
    { date: "2026-03-13", time: "11:00 AM", endTime: "12:00 PM", member: "Staff Meeting" },
    { date: "2026-03-16", time: "9:00 AM", endTime: "10:00 AM", member: "Maria Gonzalez" },
    { date: "2026-03-17", time: "2:00 PM", endTime: "3:00 PM", member: "New Member Orientation" },
    { date: "2026-03-18", time: "10:00 AM", endTime: "11:00 AM", member: "Maria Gonzalez" },
  ]),
  generateSlots("p3", [
    { date: "2026-03-11", time: "11:00 AM", endTime: "12:00 PM", member: "Robert Kim" },
    { date: "2026-03-12", time: "2:00 PM", endTime: "3:00 PM", member: "Jennifer White" },
    { date: "2026-03-13", time: "10:00 AM", endTime: "11:00 AM", member: "Robert Kim" },
    { date: "2026-03-13", time: "3:00 PM", endTime: "4:00 PM", member: "Jennifer White" },
    { date: "2026-03-16", time: "9:00 AM", endTime: "10:00 AM", member: "Hospital Visit" },
    { date: "2026-03-17", time: "1:00 PM", endTime: "2:00 PM", member: "Robert Kim" },
    { date: "2026-03-18", time: "9:00 AM", endTime: "10:00 AM", member: "Staff Meeting" },
    { date: "2026-03-19", time: "11:00 AM", endTime: "12:00 PM", member: "Jennifer White" },
    { date: "2026-03-20", time: "2:00 PM", endTime: "3:00 PM", member: "Elder Meeting" },
  ]),
];