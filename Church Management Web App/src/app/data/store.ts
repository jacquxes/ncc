// Mock data store for Church Management App

export type CaseStatus = "identified" | "assigned" | "active" | "monitoring" | "closed";
export type CaseType = "grief" | "marriage" | "health" | "financial" | "spiritual guidance";
export type ConfidentialityLevel = "standard" | "sensitive" | "highly confidential";
export type CampaignStatus = "draft" | "active" | "completed" | "archived";
export type Role = "Admin" | "Pastor" | "Care Team" | "Ministry Leader" | "Volunteer";

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
    id: "case-001",
    memberId: "m1",
    memberName: "David Thompson",
    caseType: "grief",
    assignedPastorId: "p1",
    assignedPastorName: "Pastor James Wilson",
    status: "active",
    confidentialityLevel: "sensitive",
    notes: "Recently lost a family member. Needs ongoing grief support.",
    createdAt: "2026-02-15",
    updatedAt: "2026-03-08",
  },
  {
    id: "case-002",
    memberId: "m2",
    memberName: "Maria Gonzalez",
    caseType: "marriage",
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
    caseType: "health",
    assignedPastorId: "p3",
    assignedPastorName: "Rev. Michael Torres",
    status: "monitoring",
    confidentialityLevel: "standard",
    notes: "Recovering from surgery. Receiving home visits.",
    createdAt: "2026-01-20",
    updatedAt: "2026-03-10",
  },
  {
    id: "case-004",
    memberId: "m4",
    memberName: "Angela Foster",
    caseType: "financial",
    assignedPastorId: "p1",
    assignedPastorName: "Pastor James Wilson",
    status: "identified",
    confidentialityLevel: "sensitive",
    notes: "Facing job loss, requesting benevolence assistance.",
    createdAt: "2026-03-09",
    updatedAt: "2026-03-09",
  },
  {
    id: "case-005",
    memberId: "m5",
    memberName: "Thomas Brown",
    caseType: "spiritual guidance",
    assignedPastorId: "p2",
    assignedPastorName: "Pastor Sarah Chen",
    status: "closed",
    confidentialityLevel: "standard",
    notes: "Completed discipleship journey. Transitioned to small group.",
    createdAt: "2025-11-10",
    updatedAt: "2026-02-28",
  },
  {
    id: "case-006",
    memberId: "m6",
    memberName: "Jennifer White",
    caseType: "grief",
    assignedPastorId: "p3",
    assignedPastorName: "Rev. Michael Torres",
    status: "active",
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

export const caseTimelines: Record<string, TimelineItem[]> = {
  "case-001": [
    { title: "Case Created", date: "Feb 15, 2026", description: "Pastoral care case opened for grief support." },
    { title: "Assigned to Pastor James", date: "Feb 16, 2026", description: "Case assigned for initial counseling." },
    { title: "First Session Completed", date: "Feb 22, 2026", description: "Initial grief counseling session held." },
    { title: "Follow-up Visit", date: "Mar 1, 2026", description: "Home visit conducted. Member showing improvement." },
    { title: "Status Updated", date: "Mar 8, 2026", description: "Moved to active care with weekly check-ins." },
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
    { title: "Moved to Monitoring", date: "Mar 10, 2026", description: "Transitioning to periodic check-ins." },
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