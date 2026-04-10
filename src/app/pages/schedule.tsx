import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Settings,
  Lock,
  CloudOff,
  User,
  RefreshCw,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCurrentUser } from "../context/UserContext";
import {
  pastorSchedules,
  checkCalendarConflicts,
  initialCases,
  type DayOfWeek,
  type WeeklyAvailability,
} from "../data/store";

// ── Constants ─────────────────────────────────────────────────────────────────
type Tab = "weekly" | "calendar";

const DAYS: DayOfWeek[] = [
  "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
];

// Calendar shows 09:00→16:00 in 1-hour slots
const CALENDAR_HOURS = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
];

// Weekly picker shows same set
const WEEKLY_HOURS = CALENDAR_HOURS;

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDisplayTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 || 12;
  return `${displayH}:${m.toString().padStart(2, "0")} ${ampm}`;
}

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

// ── Main Component ────────────────────────────────────────────────────────────
export function Schedule() {
  const { currentUser } = useCurrentUser();
  const [activeTab, setActiveTab] = useState<Tab>("calendar");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday");
  const [isSyncing, setIsSyncing] = useState(false);
  const [mobileSelectedDate, setMobileSelectedDate] = useState<string>(() => toLocalDateKey(new Date()));

  const mySchedule = useMemo(() => {
    return pastorSchedules.find((s) => s.pastorId === currentUser.id) || pastorSchedules[0];
  }, [currentUser.id]);

  const [availability, setAvailability] = useState<WeeklyAvailability>(mySchedule.weeklyAvailability);
  const [manualBlocks, setManualBlocks] = useState(mySchedule.manualBlocks);

  // ── 14-day window ────────────────────────────────────────────────────────────
  const daysWindow = useMemo<Date[]>(() => {
    const out: Date[] = [];
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const toggleWeeklySlot = (day: DayOfWeek, startTime: string) => {
    const hh = parseInt(startTime.split(":")[0]);
    const endTime = `${(hh + 1).toString().padStart(2, "0")}:00`;
    setAvailability((prev) => {
      const dayRanges = prev[day] || [];
      const exists = dayRanges.some((r) => r.start === startTime);
      if (exists) {
        return { ...prev, [day]: dayRanges.filter((r) => r.start !== startTime) };
      }
      return {
        ...prev,
        [day]: [...dayRanges, { start: startTime, end: endTime }].sort((a, b) =>
          a.start.localeCompare(b.start)
        ),
      };
    });
  };

  const toggleManualBlock = (dateStr: string, time: string, endTime: string) => {
    const exists = manualBlocks.find((b) => b.date === dateStr && b.time === time);
    if (exists) {
      setManualBlocks((prev) => prev.filter((b) => b !== exists));
    } else {
      setManualBlocks((prev) => [...prev, { date: dateStr, time, endTime }]);
    }
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1500);
  };

  // ── Slot logic ────────────────────────────────────────────────────────────────
  type SlotStatus = "available" | "booked" | "conflict" | "blocked" | "off";

  function getSlotStatus(dateStr: string, dayName: DayOfWeek, time: string): {
    status: SlotStatus;
    bookedFor?: string;
    isMemberCare: boolean;
  } {
    const ampmTime = formatDisplayTime(time);
    const bookedSlot = mySchedule.slots.find(
      (s) => s.date === dateStr && (s.time === ampmTime || s.time === ampmTime.replace(/^0/, ""))
    );

    const isWithinAvailability = (availability[dayName] || []).some(
      (r) => time >= r.start && time < r.end
    );
    const isGCalConflict = checkCalendarConflicts(dateStr, time);
    const isBlocked = manualBlocks.some((b) => b.date === dateStr && b.time === time);

    let status: SlotStatus = "available";
    if (!isWithinAvailability) status = "off";
    if (bookedSlot?.isBooked) status = "booked";
    // if (isGCalConflict) status = "conflict";
    if (isBlocked) status = "blocked";

    const isMemberCare = !!(
      bookedSlot?.bookedFor && initialCases.some((c) => c.memberName === bookedSlot.bookedFor)
    );

    return { status, bookedFor: bookedSlot?.bookedFor, isMemberCare };
  }

  // ── Legend ────────────────────────────────────────────────────────────────────
  const Legend = () => (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] font-medium text-foreground/70">
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" /> Available</span>
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" /> Booked</span>
      {/* <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-red-400 inline-block" /> Conflict</span> */}
      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-300 inline-block" /> Blocked</span>
    </div>
  );

  // ── Calendar Slot Cell ─────────────────────────────────────────────────────────
  const SlotCell = ({
    dateStr, dayName, time, compact = false,
  }: {
    dateStr: string; dayName: DayOfWeek; time: string; compact?: boolean;
  }) => {
    const hh = parseInt(time.split(":")[0]);
    const endTime = `${(hh + 1).toString().padStart(2, "0")}:00`;
    const { status, bookedFor, isMemberCare } = getSlotStatus(dateStr, dayName, time);

    const cellStyles: Record<SlotStatus, string> = {
      available: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 cursor-pointer group/slot",
      booked: "bg-blue-50 border-blue-200 cursor-default shadow-inner",
      conflict: "bg-red-50 border-red-200 cursor-default opacity-75",
      blocked: "bg-slate-100 border-slate-200 cursor-pointer hover:bg-slate-200",
      off: "bg-transparent border-border/30 cursor-not-allowed opacity-25",
    };

    const canToggle = status === "available" || status === "blocked";

    return (
      <div
        className={`border rounded-md transition-all flex items-center justify-center px-2 overflow-hidden ${compact ? "h-10" : "h-12"} ${cellStyles[status]}`}
        onClick={() => canToggle && toggleManualBlock(dateStr, time, endTime)}
      >
        {status === "booked" && (
          <div className="flex items-center gap-1.5 w-full">
            {isMemberCare ? (
              <>
                <div className="shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-2.5 h-2.5 text-blue-600" />
                </div>
                <span className="text-[10px] font-semibold text-blue-800 truncate">
                  {bookedFor}
                </span>
              </>
            ) : (
              <>
                <Calendar className="w-3 h-3 text-blue-400 shrink-0" />
                <span className="text-[9px] text-blue-600 font-medium truncate">
                  {bookedFor || "Meeting"}
                </span>
              </>
            )}
          </div>
        )}
        {status === "conflict" && (
          <div className="flex items-center gap-1 text-red-500">
            <CloudOff className="w-3 h-3 shrink-0" />
            <span className="text-[9px] font-bold uppercase tracking-tight hidden sm:inline">Conflict</span>
          </div>
        )}
        {status === "blocked" && (
          <div className="flex items-center gap-1 text-slate-400">
            <Lock className="w-3 h-3 shrink-0" />
            <span className="text-[9px] font-bold uppercase hidden sm:inline">Blocked</span>
          </div>
        )}
        {status === "available" && (
          <div className="flex items-center gap-1 text-emerald-500">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold uppercase tracking-widest opacity-0 group-hover/slot:opacity-100 transition-opacity hidden sm:inline">
              Free
            </span>
          </div>
        )}
      </div>
    );
  };

  // ── DESKTOP Grid View ─────────────────────────────────────────────────────────
  const renderDesktopGrid = () => {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {/* ── Strict Matrix Grid ── */}
          <div 
            className="grid"
            style={{ 
              minWidth: "1200px",
              gridTemplateColumns: "80px repeat(14, 1fr)",
            }}
          >
            {/* Top-left corner (sticky both ways) */}
            <div className="sticky left-0 top-0 bg-muted/30 z-30 border-b border-r border-border" />

            {/* Header: Dates */}
            {daysWindow.map((date) => {
              const dateStr = toLocalDateKey(date);
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const isToday = dateStr === toLocalDateKey(new Date());
              return (
                <div
                  key={dateStr}
                  className={`sticky top-0 z-20 py-3 text-center border-b border-r border-border bg-muted/30 ${
                    isWeekend ? "text-muted-foreground/50" : "text-foreground"
                  }`}
                >
                  <div className={`text-[10px] uppercase font-bold tracking-widest ${isWeekend ? "opacity-50" : "text-primary/70"}`}>
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div
                    className={`text-[15px] font-black mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full transition-colors ${
                      isToday ? "bg-primary text-primary-foreground shadow-sm" : ""
                    }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}

            {/* Grid Rows */}
            {CALENDAR_HOURS.map((time) => {
              const ampmTime = formatDisplayTime(time);
              return (
                <div key={time} className="contents">
                  {/* Time Label (Sticky Column 1) */}
                  <div className="sticky left-0 bg-card z-10 border-b border-r border-border flex items-center justify-center p-2 h-14">
                    <span className="text-[11px] font-bold text-muted-foreground whitespace-nowrap">
                      {ampmTime}
                    </span>
                  </div>

                  {/* 14 Slots for this hour */}
                  {daysWindow.map((date) => {
                    const dateStr = toLocalDateKey(date);
                    const dayName = DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1];
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    return (
                      <div 
                        key={dateStr} 
                        className={`p-1.5 border-b border-r border-border/40 hover:bg-muted/5 transition-colors h-14 flex items-center justify-center ${
                          isWeekend ? "bg-muted/5" : ""
                        }`}
                      >
                        <SlotCell dateStr={dateStr} dayName={dayName} time={time} compact />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ── MOBILE: Day picker + vertical slots ───────────────────────────────────────
  const renderMobileCalendar = () => {
    const selectedDate = daysWindow.find((d) => toLocalDateKey(d) === mobileSelectedDate) || daysWindow[0];
    const dayName = DAYS[selectedDate.getDay() === 0 ? 6 : selectedDate.getDay() - 1];
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    const dateStr = toLocalDateKey(selectedDate);

    const goBack = () => {
      const idx = daysWindow.findIndex((d) => toLocalDateKey(d) === mobileSelectedDate);
      if (idx > 0) setMobileSelectedDate(toLocalDateKey(daysWindow[idx - 1]));
    };
    const goFwd = () => {
      const idx = daysWindow.findIndex((d) => toLocalDateKey(d) === mobileSelectedDate);
      if (idx < daysWindow.length - 1) setMobileSelectedDate(toLocalDateKey(daysWindow[idx + 1]));
    };

    return (
      <div className="space-y-3">
        {/* Horizontal date scroller */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
          {daysWindow.map((date) => {
            const dStr = toLocalDateKey(date);
            const isSelected = dStr === mobileSelectedDate;
            const isWknd = date.getDay() === 0 || date.getDay() === 6;
            const isToday = dStr === toLocalDateKey(new Date());

            // Count bookings for this day
            const bookingCount = CALENDAR_HOURS.filter((t) => {
              const s = getSlotStatus(dStr, DAYS[date.getDay() === 0 ? 6 : date.getDay() - 1], t);
              return s.status === "booked";
            }).length;

            return (
              <button
                key={dStr}
                onClick={() => setMobileSelectedDate(dStr)}
                className={`shrink-0 flex flex-col items-center px-3 py-2.5 rounded-xl border min-w-[56px] transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-md"
                    : isWknd
                    ? "bg-muted/20 border-border/40 text-muted-foreground"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? "opacity-80" : "text-muted-foreground"}`}>
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className={`text-[18px] font-black leading-none mt-0.5 ${isToday && !isSelected ? "text-primary" : ""}`}>
                  {date.getDate()}
                </span>
                {bookingCount > 0 && (
                  <span className={`mt-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"
                  }`}>
                    {bookingCount} booked
                  </span>
                )}
                {bookingCount === 0 && !isWknd && (
                  <div className={`mt-1 w-1.5 h-1.5 rounded-full ${isSelected ? "bg-emerald-300" : "bg-emerald-400 opacity-60"}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected day title + navigation */}
        <div className="flex items-center justify-between px-1">
          <button onClick={goBack} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center">
            <div className="text-[15px] font-bold">
              {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            {isWeekend && (
              <div className="text-[11px] text-muted-foreground">No availability set for weekends</div>
            )}
          </div>
          <button onClick={goFwd} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Vertical slot list for selected day */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {CALENDAR_HOURS.map((time, idx) => {
            const ampmTime = formatDisplayTime(time);
            const hh = parseInt(time.split(":")[0]);
            const endTime = `${(hh + 1).toString().padStart(2, "0")}:00`;
            const { status, bookedFor, isMemberCare } = getSlotStatus(dateStr, dayName, time);

            const rowStyles: Record<SlotStatus, string> = {
              available: "bg-emerald-50/50 hover:bg-emerald-100/70 cursor-pointer active:bg-emerald-200",
              booked: "bg-blue-50/50 cursor-default",
              conflict: "bg-red-50/50 cursor-default opacity-80",
              blocked: "bg-slate-100/70 cursor-pointer active:bg-slate-200",
              off: "bg-transparent opacity-30 cursor-not-allowed",
            };

            const canToggle = status === "available" || status === "blocked";

            return (
              <div
                key={time}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-b-0 transition-colors ${rowStyles[status]}`}
                onClick={() => canToggle && toggleManualBlock(dateStr, time, endTime)}
              >
                {/* Time */}
                <div className="w-16 shrink-0 text-[13px] font-bold text-muted-foreground">{ampmTime}</div>

                {/* Status pill */}
                <div className="flex-1">
                  {status === "booked" && (
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                        {isMemberCare ? (
                          <User className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Calendar className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-blue-900">{bookedFor || "Meeting"}</div>
                        <div className="text-[11px] text-blue-500">{isMemberCare ? "Pastoral Care" : "Calendar Event"}</div>
                      </div>
                    </div>
                  )}
                  {status === "available" && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[13px] font-semibold">Available</span>
                    </div>
                  )}
                  {status === "conflict" && (
                    <div className="flex items-center gap-2 text-red-500">
                      <CloudOff className="w-4 h-4" />
                      <span className="text-[13px] font-semibold">Google Calendar Conflict</span>
                    </div>
                  )}
                  {status === "blocked" && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Lock className="w-4 h-4" />
                      <span className="text-[13px] font-semibold">Manually Blocked</span>
                    </div>
                  )}
                  {status === "off" && (
                    <span className="text-[12px] text-muted-foreground italic">Outside availability</span>
                  )}
                </div>

                {/* Action hint */}
                {status === "available" && (
                  <div className="shrink-0 w-8 h-8 rounded-full border border-emerald-200 flex items-center justify-center text-emerald-500">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
                {status === "blocked" && (
                  <div className="shrink-0 w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── Weekly Recurring Panel ────────────────────────────────────────────────────
  const renderWeeklyAvailability = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 bg-muted/30 border-b border-border">
          <h3 className="text-[15px] font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Set Recurring Availability
          </h3>
          <p className="text-[13px] text-muted-foreground mt-1">
            Toggle 1-hour slots to set which hours you are generally available each week.
          </p>
        </div>

        {/* Day Selector */}
        <div className="flex gap-2 p-4 overflow-x-auto border-b border-border bg-muted/10">
          {DAYS.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`shrink-0 px-4 py-2 rounded-lg border text-[13px] font-medium transition-all ${
                selectedDay === day
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border hover:border-primary/40 text-muted-foreground"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {/* Slot Grid */}
        <div className="p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {WEEKLY_HOURS.map((time) => {
              const isAvailable = (availability[selectedDay] || []).some((r) => r.start === time);
              return (
                <button
                  key={time}
                  onClick={() => toggleWeeklySlot(selectedDay, time)}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-[13px] font-medium transition-all ${
                    isAvailable
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-border hover:border-primary/20 text-muted-foreground bg-muted/30"
                  }`}
                >
                  <span className="font-bold">{formatDisplayTime(time)}</span>
                  <div className="mt-1.5 flex items-center gap-1">
                    {isAvailable ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3 opacity-40" />
                    )}
                    <span className="text-[10px] uppercase tracking-wide">
                      {isAvailable ? "Available" : "Off"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="px-5 py-2.5 rounded-xl text-[14px] font-semibold border border-border hover:bg-muted transition-all">
          Discard Changes
        </button>
        <button
          className="px-5 py-2.5 rounded-xl text-[14px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md"
          onClick={() => setActiveTab("calendar")}
        >
          Save & View Calendar
        </button>
      </div>
    </div>
  );

  // ── Calendar View ─────────────────────────────────────────────────────────────
  const renderCalendarView = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Legend />
        {/* <button
          onClick={handleSync}
          disabled={isSyncing}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[12px] font-medium transition-all ${
            isSyncing
              ? "bg-muted text-muted-foreground border-border"
              : "text-primary border-primary/20 hover:bg-primary/5"
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing…" : "Sync Google Calendar"}
        </button> */}
      </div>

      {/* Desktop: full grid */}
      <div className="hidden md:block">{renderDesktopGrid()}</div>

      {/* Mobile: day picker + vertical */}
      <div className="block md:hidden">{renderMobileCalendar()}</div>
    </div>
  );

  // ── Root ──────────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] md:text-[30px] font-bold text-foreground">My Schedule</h1>
          <p className="text-[13px] md:text-[14px] text-muted-foreground mt-1">
            Manage your pastoral availability and appointments.
          </p>
        </div>

        <div className="flex bg-muted p-1 rounded-xl shadow-inner self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeTab === "weekly"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Weekly</span> Setup
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeTab === "calendar"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
        </div>
      </div>

      {activeTab === "weekly" ? renderWeeklyAvailability() : renderCalendarView()}
    </div>
  );
}
