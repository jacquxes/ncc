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
export type Role = "Admin" | "Pastor" | "Care Team" | "Ministry Leader" | "Member";
export type CellGroup =
  | "Alpha"
  | "Beta"
  | "Gamma"
  | "Delta"
  | "Epsilon"
  | "Zeta"
  | "Eta"
  | "Theta";
export type GivingCategory =
  | "general offering"
  | "designated offering (israel)"
  | "designated offering (outreach)"
  | "designated offering (global missions)"
  | "designated offering (others)";
export type TransactionStatus = "paid" | "pending" | "cancelled" | "archived";
export type AttendanceType = "sunday service" | "cell group" | "event";

export interface AttendanceRecord {
  date: string; // YYYY-MM-DD
  type: AttendanceType;
  eventName?: string; // only for 'event'
  attended: boolean;
}


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

export interface GivingYearSummary {
  year: number;
  total: number;
  transactionCount: number;
}

export interface MinistryEntry {
  ministry: string;
  role: string;
  startDate: string;
  endDate?: string; // undefined = currently serving
  description: string;
}

export interface Ministry {
  id: string;
  name: string;
  description: string;
  leaderId: string | null;
  memberIds: string[];
}

export interface PastoralCareEntry {
  date: string;
  pastor: string;
  type: string;
  summary: string;
}

export interface StaffNote {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  cellGroup: CellGroup;
  joinDate: string; // YYYY-MM-DD
  profilePhotoUrl?: string;
  givingByYear: GivingYearSummary[];
  recentTransactionIds: string[]; // references initialTransactions
  ministries: MinistryEntry[];
  pastoralCareLog: PastoralCareEntry[];
  staffNotes: StaffNote[];
  skills: string[];
  interests: string[];
  homeAddress: string;
  attendance: AttendanceRecord[];
}

export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface TimeRange {
  start: string; // HH:mm
  end: string;   // HH:mm
}

export type WeeklyAvailability = Partial<Record<DayOfWeek, TimeRange[]>>;

export interface ManualBlock {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  endTime: string; // HH:mm
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
  weeklyAvailability: WeeklyAvailability;
  manualBlocks: ManualBlock[];
}

/**
 * Mock function to simulate checking against Google Calendar.
 * Returns true if there is a conflict.
 */
export function checkCalendarConflicts(date: string, time: string): boolean {
  // Use a predictable but seemingly random logic for demo purposes
  // e.g., Slots at 10:00 AM on any day have a 30% chance of conflict
  const hour = parseInt(time.split(":")[0]);
  const dateHash = date.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (dateHash + hour) % 7 === 0; 
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

export const members: Member[] = [
  {
    id: "m1",
    name: "David Thompson",
    email: "david.thompson@email.com",
    phone: "+65 9123 4567",
    role: "Member",
    cellGroup: "Alpha",
    joinDate: "2020-03-15",
    givingByYear: [
      { year: 2020, total: 800, transactionCount: 8 },
      { year: 2021, total: 1200, transactionCount: 12 },
      { year: 2022, total: 1800, transactionCount: 15 },
      { year: 2023, total: 2400, transactionCount: 20 },
      { year: 2024, total: 3200, transactionCount: 24 },
      { year: 2025, total: 2800, transactionCount: 22 },
      { year: 2026, total: 400, transactionCount: 4 },
    ],
    recentTransactionIds: ["txn-001", "txn-014"],
    ministries: [
      { ministry: "Worship Team", role: "Vocalist", startDate: "2020-06-01", description: "Sunday service worship leading." },
      { ministry: "Youth Ministry", role: "Mentor", startDate: "2021-01-15", endDate: "2023-06-30", description: "Mentored youth group of 8 teens." },
      { ministry: "Cell Group", role: "Cell Leader", startDate: "2023-07-01", description: "Leading Alpha cell group of 12 members." },
    ],
    pastoralCareLog: [
      { date: "Feb 15, 2026", pastor: "Pastor James Wilson", type: "Grief & Bereavement", summary: "Initial session following family loss. Member distressed but open to counseling." },
      { date: "Feb 22, 2026", pastor: "Pastor James Wilson", type: "Follow-up Visit", summary: "Home visit. Emotional state improving. Encouraged journaling and community support." },
      { date: "Mar 1, 2026", pastor: "Pastor James Wilson", type: "Check-in Call", summary: "Brief phone call. Confirmed weekly attendance. Member feels supported by cell group." },
    ],
    staffNotes: [
      { id: "sn-001", authorName: "Admin Alex Rivera", authorRole: "Admin", content: "Member expressed interest in hosting a home group in Q3 2026. Follow up in June.", createdAt: "Mar 5, 2026" },
    ],
    skills: ["Graphic Design", "Photography", "Event Planning"],
    interests: ["Photography", "Outdoor Trekking", "Cooking"],
    homeAddress: "Block 123, Jurong West St 45, #08-12, Singapore 640123",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-03", type: "cell group", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-10", type: "cell group", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-17", type: "cell group", attended: true },
      { date: "2026-03-20", type: "event", eventName: "Worship Night", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: false },
      { date: "2026-03-24", type: "cell group", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-03-31", type: "cell group", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "m2",
    name: "Maria Gonzalez",
    email: "maria.gonzalez@email.com",
    phone: "+65 8234 5678",
    role: "Ministry Leader",
    cellGroup: "Beta",
    joinDate: "2018-09-01",
    givingByYear: [
      { year: 2018, total: 600, transactionCount: 5 },
      { year: 2019, total: 2400, transactionCount: 18 },
      { year: 2020, total: 3000, transactionCount: 22 },
      { year: 2021, total: 4200, transactionCount: 28 },
      { year: 2022, total: 5000, transactionCount: 32 },
      { year: 2023, total: 6000, transactionCount: 36 },
      { year: 2024, total: 7200, transactionCount: 40 },
      { year: 2025, total: 8400, transactionCount: 44 },
      { year: 2026, total: 1000, transactionCount: 6 },
    ],
    recentTransactionIds: ["txn-002", "txn-013"],
    ministries: [
      { ministry: "Women's Ministry", role: "Director", startDate: "2019-03-01", description: "Overseeing all women's ministry programs and events." },
      { ministry: "Worship Team", role: "Pianist", startDate: "2018-10-01", endDate: "2021-12-31", description: "Played keys for Sunday services." },
      { ministry: "Beta Cell Group", role: "Cell Leader", startDate: "2022-01-01", description: "Leading Beta cell group of 15 members." },
    ],
    pastoralCareLog: [
      { date: "Mar 1, 2026", pastor: "Pastor Sarah Chen", type: "Pre-marital Counseling", summary: "First session with couple. Discussed communication and expectations." },
      { date: "Mar 12, 2026", pastor: "Pastor Sarah Chen", type: "Pre-marital Counseling", summary: "Second session. Worked through financial planning and spiritual alignment." },
    ],
    staffNotes: [
      { id: "sn-002", authorName: "Admin Alex Rivera", authorRole: "Admin", content: "Maria is being considered for the Elder board nomination in next year's AGM.", createdAt: "Jan 20, 2026" },
      { id: "sn-003", authorName: "Pastor Sarah Chen", authorRole: "Pastor", content: "Pre-marital sessions going well. Couple shows strong spiritual foundation.", createdAt: "Mar 15, 2026" },
    ],
    skills: ["Strategic Planning", "Project Management", "Public Speaking"],
    interests: ["Reading", "Coffee Tasting", "Classical Music"],
    homeAddress: "78 Tampines Central 1, #12-05, Singapore 529543",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-03", type: "cell group", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-10", type: "cell group", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-17", type: "cell group", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-24", type: "cell group", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-03-31", type: "cell group", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "m3",
    name: "Robert Kim",
    email: "robert.kim@email.com",
    phone: "+65 9345 6789",
    role: "Member",
    cellGroup: "Gamma",
    joinDate: "2022-06-20",
    givingByYear: [
      { year: 2022, total: 400, transactionCount: 4 },
      { year: 2023, total: 1200, transactionCount: 10 },
      { year: 2024, total: 1800, transactionCount: 14 },
      { year: 2025, total: 2000, transactionCount: 16 },
      { year: 2026, total: 230, transactionCount: 2 },
    ],
    recentTransactionIds: ["txn-003", "txn-020"],
    ministries: [
      { ministry: "AV & Tech Team", role: "Sound Engineer", startDate: "2022-09-01", description: "Managing audio setup for Sunday services." },
      { ministry: "Hospitality Team", role: "Volunteer", startDate: "2023-03-01", endDate: "2024-06-30", description: "Greeter and café volunteer on Sundays." },
    ],
    pastoralCareLog: [
      { date: "Jan 20, 2026", pastor: "Rev. Michael Torres", type: "Hospital Visitation", summary: "Visited Robert post-surgery. Prayer and encouragement offered." },
      { date: "Feb 15, 2026", pastor: "Rev. Michael Torres", type: "Recovery Check-in", summary: "Follow-up call. Recovery progressing well." },
      { date: "Mar 10, 2026", pastor: "Rev. Michael Torres", type: "Home Visit", summary: "Final structured care visit. Member active in church again." },
    ],
    staffNotes: [],
    skills: ["Audio Engineering", "Electrical Wiring"],
    interests: ["Classic Cars", "Bass Fishing"],
    homeAddress: "12 Serangoon North Ave 5, #04-33, Singapore 554915",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "m4",
    name: "Angela Foster",
    email: "angela.foster@email.com",
    phone: "+65 8456 7890",
    role: "Member",
    cellGroup: "Delta",
    joinDate: "2021-01-10",
    givingByYear: [
      { year: 2021, total: 1500, transactionCount: 12 },
      { year: 2022, total: 3000, transactionCount: 20 },
      { year: 2023, total: 4500, transactionCount: 28 },
      { year: 2024, total: 5000, transactionCount: 30 },
      { year: 2025, total: 3600, transactionCount: 24 },
      { year: 2026, total: 2500, transactionCount: 10 },
    ],
    recentTransactionIds: ["txn-004", "txn-023"],
    ministries: [
      { ministry: "Outreach Team", role: "Coordinator", startDate: "2021-06-01", description: "Organising community outreach events quarterly." },
      { ministry: "Global Missions", role: "Prayer Partner", startDate: "2022-01-01", description: "Praying for and supporting overseas missionaries." },
    ],
    pastoralCareLog: [
      { date: "Mar 9, 2026", pastor: "Pastor James Wilson", type: "Financial Crisis Support", summary: "Member facing job loss. Discussed benevolence options and emotional support." },
    ],
    staffNotes: [
      { id: "sn-004", authorName: "Admin Alex Rivera", authorRole: "Admin", content: "Approved one-time benevolence grant of S$500. Refer to finance team for processing.", createdAt: "Mar 10, 2026" },
    ],
    skills: ["Community Organizing", "First Aid", "Spanish (Fluent)"],
    interests: ["Social Justice", "Gardening", "Poetry"],
    homeAddress: "221 Boon Lay Drive, #15-442, Singapore 640221",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: false },
      { date: "2026-03-03", type: "cell group", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-10", type: "cell group", attended: false },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-17", type: "cell group", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-24", type: "cell group", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-03-31", type: "cell group", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "m5",
    name: "Thomas Brown",
    email: "thomas.brown@email.com",
    phone: "+65 9567 8901",
    role: "Care Team",
    cellGroup: "Epsilon",
    joinDate: "2019-05-22",
    givingByYear: [
      { year: 2019, total: 960, transactionCount: 8 },
      { year: 2020, total: 1440, transactionCount: 12 },
      { year: 2021, total: 2160, transactionCount: 16 },
      { year: 2022, total: 2880, transactionCount: 20 },
      { year: 2023, total: 3600, transactionCount: 24 },
      { year: 2024, total: 4320, transactionCount: 28 },
      { year: 2025, total: 5040, transactionCount: 32 },
      { year: 2026, total: 530, transactionCount: 4 },
    ],
    recentTransactionIds: ["txn-005", "txn-018"],
    ministries: [
      { ministry: "Care Team", role: "Care Coordinator", startDate: "2020-02-01", description: "Coordinating pastoral care visits and follow-ups." },
      { ministry: "Discipleship Program", role: "Discipler", startDate: "2021-03-01", endDate: "2026-02-28", description: "1-on-1 discipleship with new believers." },
      { ministry: "Epsilon Cell Group", role: "Cell Member", startDate: "2019-06-01", description: "Active participant in cell group life." },
    ],
    pastoralCareLog: [
      { date: "Nov 10, 2025", pastor: "Pastor Sarah Chen", type: "Spiritual Crisis", summary: "Struggling with doubts. Began structured discipleship journey." },
      { date: "Jan 15, 2026", pastor: "Pastor Sarah Chen", type: "Discipleship Check-in", summary: "Significant spiritual growth observed. Reading scripture consistently." },
      { date: "Feb 28, 2026", pastor: "Pastor Sarah Chen", type: "Case Closure", summary: "Journey complete. Thomas transitioned to small group leadership track." },
    ],
    staffNotes: [
      { id: "sn-005", authorName: "Pastor Sarah Chen", authorRole: "Pastor", content: "Thomas is a strong candidate for cell leader training. Recommend for Q2 cohort.", createdAt: "Mar 1, 2026" },
    ],
    skills: ["Mentoring", "Bible Teaching", "Carpentry"],
    interests: ["Study of Apologetics", "Woodworking", "Marathons"],
    homeAddress: "56 Pasir Ris Grove, #06-19, Singapore 518201",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-03", type: "cell group", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-10", type: "cell group", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-17", type: "cell group", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-24", type: "cell group", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-03-31", type: "cell group", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "m6",
    name: "Jennifer White",
    email: "jennifer.white@email.com",
    phone: "+65 8678 9012",
    role: "Member",
    cellGroup: "Zeta",
    joinDate: "2023-02-14",
    givingByYear: [
      { year: 2023, total: 900, transactionCount: 8 },
      { year: 2024, total: 2400, transactionCount: 16 },
      { year: 2025, total: 3000, transactionCount: 20 },
      { year: 2026, total: 800, transactionCount: 6 },
    ],
    recentTransactionIds: ["txn-006", "txn-021"],
    ministries: [
      { ministry: "Worship Team", role: "Vocalist", startDate: "2023-04-01", description: "Sunday service choir member." },
      { ministry: "Welcome Team", role: "Greeter", startDate: "2023-02-14", endDate: "2024-12-31", description: "First-time visitor greeter and church tour guide." },
    ],
    pastoralCareLog: [
      { date: "Feb 20, 2026", pastor: "Rev. Michael Torres", type: "Grief & Bereavement", summary: "Processing loss of close friend. Attending grief support group." },
      { date: "Mar 7, 2026", pastor: "Rev. Michael Torres", type: "Follow-up", summary: "Positive progress. Actively engaged in Zeta cell group." },
    ],
    staffNotes: [],
    skills: ["Singing", "Customer Service", "Mandarin (Fluent)"],
    interests: ["Musical Theatre", "Baking", "Yoga"],
    homeAddress: "Block 89, Redhill Close, #11-102, Singapore 150089",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
    ],
  },

  {
    id: "m7",
    name: "Samuel Lee",
    email: "samuel.lee@email.com",
    phone: "+65 9789 0123",
    role: "Ministry Leader",
    cellGroup: "Eta",
    joinDate: "2017-11-05",
    givingByYear: [
      { year: 2017, total: 300, transactionCount: 2 },
      { year: 2018, total: 1800, transactionCount: 12 },
      { year: 2019, total: 2400, transactionCount: 16 },
      { year: 2020, total: 3000, transactionCount: 20 },
      { year: 2021, total: 3600, transactionCount: 24 },
      { year: 2022, total: 4800, transactionCount: 30 },
      { year: 2023, total: 6000, transactionCount: 36 },
      { year: 2024, total: 7200, transactionCount: 42 },
      { year: 2025, total: 8400, transactionCount: 48 },
      { year: 2026, total: 250, transactionCount: 2 },
    ],
    recentTransactionIds: ["txn-007"],
    ministries: [
      { ministry: "Youth Ministry", role: "Director", startDate: "2018-01-01", description: "Overseeing all youth programs (ages 13–21)." },
      { ministry: "Eta Cell Group", role: "Cell Leader", startDate: "2019-03-01", description: "Leading the Eta cell group of 18 members." },
      { ministry: "Elders Board", role: "Elder", startDate: "2023-01-01", description: "Serving on the church elders board." },
    ],
    pastoralCareLog: [],
    staffNotes: [
      { id: "sn-006", authorName: "Admin Alex Rivera", authorRole: "Admin", content: "Samuel is being considered for Associate Pastor role. Discussion in board meeting Q2.", createdAt: "Feb 5, 2026" },
    ],
    skills: ["Leadership Development", "Public Speaking", "Strategic Oversight"],
    interests: ["History", "Hiking", "Mentorship"],
    homeAddress: "15 Holland Hill, #03-01, Singapore 278735",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
    ],
  },
  {
    id: "m8",
    name: "Grace Lim",
    email: "grace.lim@email.com",
    phone: "+65 8890 1234",
    role: "Member",
    cellGroup: "Theta",
    joinDate: "2024-01-20",
    givingByYear: [
      { year: 2024, total: 1200, transactionCount: 8 },
      { year: 2025, total: 2400, transactionCount: 14 },
      { year: 2026, total: 200, transactionCount: 2 },
    ],
    recentTransactionIds: ["txn-008", "txn-019"],
    ministries: [
      { ministry: "Children's Ministry", role: "Sunday School Teacher", startDate: "2024-03-01", description: "Teaching ages 6–9 on Sunday mornings." },
    ],
    pastoralCareLog: [],
    staffNotes: [],
    skills: ["Piano", "Teaching", "Creative Writing"],
    interests: ["Classical Music", "Illustration", "Yoga"],
    homeAddress: "Block 456, Choa Chu Kang Ave 4, #07-156, Singapore 680456",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-03", type: "cell group", attended: false },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-10", type: "cell group", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-17", type: "cell group", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-24", type: "cell group", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-03-31", type: "cell group", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "p1",
    name: "Pastor James Wilson",
    email: "james@gracechurch.org",
    phone: "+65 9111 2222",
    role: "Pastor",
    cellGroup: "Alpha",
    joinDate: "2015-01-01",
    givingByYear: [
      { year: 2024, total: 5000, transactionCount: 12 },
      { year: 2025, total: 5500, transactionCount: 12 },
    ],
    recentTransactionIds: [],
    ministries: [
      { ministry: "Pastoral Board", role: "Senior Pastor", startDate: "2015-01-01", description: "Overseeing spiritual growth and vision." },
    ],
    pastoralCareLog: [],
    staffNotes: [],
    skills: ["Pastoral Care", "Theological Research", "Leadership"],
    interests: ["Theology", "Global Missions", "Reading"],
    homeAddress: "Grace Church Rectory, 1 Church Road, Singapore 123456",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "p2",
    name: "Pastor Sarah Chen",
    email: "sarah@gracechurch.org",
    phone: "+65 9222 3333",
    role: "Pastor",
    cellGroup: "Beta",
    joinDate: "2017-06-15",
    givingByYear: [
      { year: 2024, total: 4200, transactionCount: 12 },
      { year: 2025, total: 4500, transactionCount: 12 },
    ],
    recentTransactionIds: [],
    ministries: [
      { ministry: "Women's Ministry", role: "Assistant Pastor", startDate: "2017-06-15", description: "Supporting family and women's care." },
    ],
    pastoralCareLog: [],
    staffNotes: [],
    skills: ["Varies by Staff Role"],
    interests: ["Church Community"],
    homeAddress: "Staff Housing / Private Address",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "p3",
    name: "Rev. Michael Torres",
    email: "michael@gracechurch.org",
    phone: "+65 9333 4444",
    role: "Pastor",
    cellGroup: "Gamma",
    joinDate: "2012-03-10",
    givingByYear: [
      { year: 2024, total: 6000, transactionCount: 12 },
      { year: 2025, total: 6200, transactionCount: 12 },
    ],
    recentTransactionIds: [],
    ministries: [
      { ministry: "Prayer Ministry", role: "Lead Pastor", startDate: "2012-03-10", description: "Leading intercessory prayer teams." },
    ],
    pastoralCareLog: [],
    staffNotes: [],
    skills: ["Varies by Staff Role"],
    interests: ["Church Community"],
    homeAddress: "Staff Housing / Private Address",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "ct1",
    name: "Deacon Ruth Adams",
    email: "ruth@gracechurch.org",
    phone: "+65 8444 5555",
    role: "Care Team",
    cellGroup: "Delta",
    joinDate: "2019-11-20",
    givingByYear: [
      { year: 2024, total: 3000, transactionCount: 12 },
      { year: 2025, total: 3200, transactionCount: 12 },
    ],
    recentTransactionIds: [],
    ministries: [
      { ministry: "Care Team", role: "Deacon", startDate: "2019-11-20", description: "Coordinating hospital visits." },
    ],
    pastoralCareLog: [],
    staffNotes: [],
    skills: ["Varies by Staff Role"],
    interests: ["Church Community"],
    homeAddress: "Staff Housing / Private Address",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "ct2",
    name: "Deacon Mark Johnson",
    email: "mark@gracechurch.org",
    phone: "+65 8555 6666",
    role: "Care Team",
    cellGroup: "Epsilon",
    joinDate: "2018-02-14",
    givingByYear: [
      { year: 2024, total: 2800, transactionCount: 12 },
      { year: 2025, total: 3000, transactionCount: 12 },
    ],
    recentTransactionIds: [],
    ministries: [
      { ministry: "Hospitality", role: "Deacon", startDate: "2018-02-14", description: "Overseeing ushering and welcome teams." },
    ],
    pastoralCareLog: [],
    staffNotes: [],
    skills: ["Varies by Staff Role"],
    interests: ["Church Community"],
    homeAddress: "Staff Housing / Private Address",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "ml1",
    name: "Lisa Park",
    email: "lisa@gracechurch.org",
    phone: "+65 8666 7777",
    role: "Ministry Leader",
    cellGroup: "Zeta",
    joinDate: "2021-08-01",
    givingByYear: [
      { year: 2024, total: 2400, transactionCount: 12 },
      { year: 2025, total: 2600, transactionCount: 12 },
    ],
    recentTransactionIds: [],
    ministries: [
      { ministry: "Children's Ministry", role: "Director", startDate: "2021-08-01", description: "Overseeing Sunday School curriculum." },
    ],
    pastoralCareLog: [],
    staffNotes: [],
    skills: ["Varies by Staff Role"],
    interests: ["Church Community"],
    homeAddress: "Staff Housing / Private Address",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
  {
    id: "a1",
    name: "Admin Alex Rivera",
    email: "alex@gracechurch.org",
    phone: "+65 8777 8888",
    role: "Admin",
    cellGroup: "Eta",
    joinDate: "2020-05-12",
    givingByYear: [
      { year: 2024, total: 1200, transactionCount: 12 },
      { year: 2025, total: 1300, transactionCount: 12 },
    ],
    recentTransactionIds: [],
    ministries: [
      { ministry: "Church Operations", role: "Operations Manager", startDate: "2020-05-12", description: "Managing church facilities and staff." },
    ],
    pastoralCareLog: [],
    staffNotes: [],
    skills: ["Administrative Support", "Event Coordination"],
    interests: ["Organization", "Community Building"],
    homeAddress: "Admin's Private Residence",
    attendance: [
      { date: "2026-03-01", type: "sunday service", attended: true },
      { date: "2026-03-08", type: "sunday service", attended: true },
      { date: "2026-03-15", type: "sunday service", attended: true },
      { date: "2026-03-22", type: "sunday service", attended: true },
      { date: "2026-03-29", type: "sunday service", attended: true },
      { date: "2026-04-05", type: "sunday service", attended: true },
    ],
  },
];

export let initialMinistries: Ministry[] = (() => {
  const map = new Map<string, Ministry>();

  members.forEach(m => {
    m.ministries.forEach(min => {
      if (!map.has(min.ministry)) {
        map.set(min.ministry, {
          id: `min-${map.size + 1}`,
          name: min.ministry,
          description: min.description || "",
          leaderId: null,
          memberIds: []
        });
      }
      
      const ministry = map.get(min.ministry)!;
      if (!ministry.memberIds.includes(m.id)) {
        ministry.memberIds.push(m.id);
      }
      
      // Attempt to infer leader based on role keyword
      if (
        !ministry.leaderId && 
        ["director", "leader", "coordinator", "pastor", "manager", "head"].some(k => min.role.toLowerCase().includes(k))
      ) {
        ministry.leaderId = m.id;
      }
    });
  });
  
  return Array.from(map.values());
})();

export const initialCases: PastoralCase[] = [
  {
    id: "case-000",
    memberId: "m0",
    memberName: "Sarah Tan",
    caseType: "illness and hospital visitation",
    assignedPastorId: "p1",
    assignedPastorName: "Unassigned",
    status: "new",
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

// Helper to get a local YYYY-MM-DD string from a date offset
function getLocalDateStr(offsetDays: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Skip weekends to find next valid weekday offset
function nextWeekday(startOffset: number): number {
  let off = startOffset;
  while (true) {
    const d = new Date();
    d.setDate(d.getDate() + off);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) return off;
    off++;
  }
}

// Generate mock calendar slots for pastors — dates relative to today
function generateSlots(
  pastorId: string,
  bookedSlotDefs: { dayOffset: number; time: string; endTime: string; member: string }[]
): PastorSchedule {
  const times = [
    { time: "9:00 AM", endTime: "10:00 AM" },
    { time: "10:00 AM", endTime: "11:00 AM" },
    { time: "11:00 AM", endTime: "12:00 PM" },
    { time: "1:00 PM", endTime: "2:00 PM" },
    { time: "2:00 PM", endTime: "3:00 PM" },
    { time: "3:00 PM", endTime: "4:00 PM" },
  ];

  // Resolve booked slot dates from offsets
  const bookedSlots = bookedSlotDefs.map(b => ({
    ...b,
    date: getLocalDateStr(nextWeekday(b.dayOffset)),
  }));

  const slots: CalendarSlot[] = [];
  for (let d = 0; d < 14; d++) {
    const dateStr = getLocalDateStr(d);
    const dateObj = new Date(dateStr + "T12:00:00");
    const dayOfWeek = dateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue; // skip weekends
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

  // Default weekly availability: Mon-Fri 09:00-16:00
  const defaultAvailability: WeeklyAvailability = {
    Monday: [{ start: "09:00", end: "16:00" }],
    Tuesday: [{ start: "09:00", end: "16:00" }],
    Wednesday: [{ start: "09:00", end: "16:00" }],
    Thursday: [{ start: "09:00", end: "16:00" }],
    Friday: [{ start: "09:00", end: "16:00" }],
  };

  return { 
    pastorId, 
    slots, 
    weeklyAvailability: defaultAvailability,
    manualBlocks: []
  };
}

export const pastorSchedules: PastorSchedule[] = [
  generateSlots("p1", [
    // dayOffset = days from today (weekdays only via nextWeekday)
    { dayOffset: 0, time: "9:00 AM",  endTime: "10:00 AM", member: "David Thompson" },
    { dayOffset: 0, time: "2:00 PM",  endTime: "3:00 PM",  member: "Angela Foster" },
    { dayOffset: 1, time: "10:00 AM", endTime: "11:00 AM", member: "Board Meeting" },
    { dayOffset: 2, time: "9:00 AM",  endTime: "10:00 AM", member: "David Thompson" },
    { dayOffset: 2, time: "1:00 PM",  endTime: "2:00 PM",  member: "Staff Meeting" },
    { dayOffset: 3, time: "11:00 AM", endTime: "12:00 PM", member: "Angela Foster" },
    { dayOffset: 4, time: "9:00 AM",  endTime: "10:00 AM", member: "Small Group Leaders" },
    { dayOffset: 5, time: "2:00 PM",  endTime: "3:00 PM",  member: "David Thompson" },
    { dayOffset: 6, time: "10:00 AM", endTime: "11:00 AM", member: "Michael Scott" },
    { dayOffset: 7, time: "3:00 PM",  endTime: "4:00 PM",  member: "Sarah Jenkins" },
    { dayOffset: 8, time: "1:00 PM",  endTime: "2:00 PM",  member: "David Thompson" },
    { dayOffset: 9, time: "10:00 AM", endTime: "11:00 AM", member: "Angela Foster" },
  ]),
  generateSlots("p2", [
    { dayOffset: 0,  time: "10:00 AM", endTime: "11:00 AM", member: "Maria Gonzalez" },
    { dayOffset: 0,  time: "3:00 PM",  endTime: "4:00 PM",  member: "Women's Ministry" },
    { dayOffset: 1,  time: "9:00 AM",  endTime: "10:00 AM", member: "Maria Gonzalez" },
    { dayOffset: 1,  time: "1:00 PM",  endTime: "2:00 PM",  member: "Thomas Brown" },
    { dayOffset: 2,  time: "11:00 AM", endTime: "12:00 PM", member: "Staff Meeting" },
    { dayOffset: 5,  time: "9:00 AM",  endTime: "10:00 AM", member: "Maria Gonzalez" },
    { dayOffset: 6,  time: "2:00 PM",  endTime: "3:00 PM",  member: "New Members" },
    { dayOffset: 7,  time: "10:00 AM", endTime: "11:00 AM", member: "Maria Gonzalez" },
  ]),
  generateSlots("p3", [
    { dayOffset: 0,  time: "11:00 AM", endTime: "12:00 PM", member: "Robert Kim" },
    { dayOffset: 1,  time: "2:00 PM",  endTime: "3:00 PM",  member: "Jennifer White" },
    { dayOffset: 2,  time: "10:00 AM", endTime: "11:00 AM", member: "Robert Kim" },
    { dayOffset: 2,  time: "3:00 PM",  endTime: "4:00 PM",  member: "Jennifer White" },
    { dayOffset: 5,  time: "9:00 AM",  endTime: "10:00 AM", member: "Hospital Visit" },
    { dayOffset: 6,  time: "1:00 PM",  endTime: "2:00 PM",  member: "Robert Kim" },
    { dayOffset: 7,  time: "9:00 AM",  endTime: "10:00 AM", member: "Staff Meeting" },
    { dayOffset: 8,  time: "11:00 AM", endTime: "12:00 PM", member: "Jennifer White" },
    { dayOffset: 9,  time: "2:00 PM",  endTime: "3:00 PM",  member: "Elder Meeting" },
  ]),
];