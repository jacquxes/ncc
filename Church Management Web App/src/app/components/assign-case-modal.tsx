import { useState, useMemo } from "react";
import {
  X,
  User,
  Calendar,
  Briefcase,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  staffMembers,
  pastorSchedules,
  initialCases,
  type StaffMember,
  type PastoralCase,
  type CalendarSlot,
} from "../data/store";
import { CaseStatusBadge } from "./status-badge";

const pastors = staffMembers.filter((s) => s.role === "Pastor");

interface AssignCaseModalProps {
  caseData: PastoralCase;
  allCases: PastoralCase[];
  onClose: () => void;
  onAssign: (pastorId: string, pastorName: string, bookedSlot?: CalendarSlot) => void;
}

type Step = "select-pastor" | "review-schedule" | "confirm";

export function AssignCaseModal({ caseData, allCases, onClose, onAssign }: AssignCaseModalProps) {
  const [step, setStep] = useState<Step>("select-pastor");
  const [selectedPastor, setSelectedPastor] = useState<StaffMember | null>(
    caseData.assignedPastorId ? pastors.find((p) => p.id === caseData.assignedPastorId) || null : null
  );
  const [selectedSlot, setSelectedSlot] = useState<CalendarSlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  // Get cases for a specific pastor
  function getCasesForPastor(pastorId: string) {
    return allCases.filter((c) => c.assignedPastorId === pastorId && c.id !== caseData.id);
  }

  // Get schedule for selected pastor
  const pastorSchedule = useMemo(() => {
    if (!selectedPastor) return null;
    return pastorSchedules.find((s) => s.pastorId === selectedPastor.id);
  }, [selectedPastor]);

  // Get unique dates from schedule
  const availableDates = useMemo(() => {
    if (!pastorSchedule) return [];
    const dates = [...new Set(pastorSchedule.slots.map((s) => s.date))];
    return dates.sort();
  }, [pastorSchedule]);

  // Get slots for selected date
  const slotsForDate = useMemo(() => {
    if (!pastorSchedule || !selectedDate) return [];
    return pastorSchedule.slots.filter((s) => s.date === selectedDate);
  }, [pastorSchedule, selectedDate]);

  function formatDate(dateStr: string) {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  function formatDateLong(dateStr: string) {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  }

  function handleSelectPastor(pastor: StaffMember) {
    setSelectedPastor(pastor);
    setSelectedSlot(null);
    setSelectedDate("");
    setStep("review-schedule");
  }

  function handleConfirm() {
    if (selectedPastor) {
      onAssign(selectedPastor.id, selectedPastor.name, selectedSlot || undefined);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-card rounded-xl shadow-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            {step !== "select-pastor" && (
              <button
                onClick={() => {
                  if (step === "confirm") setStep("review-schedule");
                  else setStep("select-pastor");
                }}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2>
                {step === "select-pastor" && "Assign Case"}
                {step === "review-schedule" && "Pastor Schedule"}
                {step === "confirm" && "Confirm Assignment"}
              </h2>
              <p className="text-[13px] text-muted-foreground mt-0.5">
                {step === "select-pastor" && `Assigning care for ${caseData.memberName}`}
                {step === "review-schedule" && `Review ${selectedPastor?.name}'s workload & availability`}
                {step === "confirm" && "Review and confirm the assignment details"}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted text-muted-foreground" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted/30 shrink-0">
          {(["select-pastor", "review-schedule", "confirm"] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] ${
                  step === s
                    ? "bg-primary text-primary-foreground"
                    : (["select-pastor", "review-schedule", "confirm"].indexOf(step) > i)
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {["select-pastor", "review-schedule", "confirm"].indexOf(step) > i ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-[12px] ${step === s ? "text-foreground" : "text-muted-foreground"}`}>
                {s === "select-pastor" && "Select Pastor"}
                {s === "review-schedule" && "Review Schedule"}
                {s === "confirm" && "Confirm"}
              </span>
              {i < 2 && <div className="w-6 h-px bg-border mx-1" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === "select-pastor" && (
            <PastorSelectionStep
              pastors={pastors}
              allCases={allCases}
              currentCaseId={caseData.id}
              selectedPastorId={selectedPastor?.id}
              onSelect={handleSelectPastor}
            />
          )}

          {step === "review-schedule" && selectedPastor && (
            <ScheduleReviewStep
              pastor={selectedPastor}
              cases={getCasesForPastor(selectedPastor.id)}
              availableDates={availableDates}
              selectedDate={selectedDate}
              slotsForDate={slotsForDate}
              selectedSlot={selectedSlot}
              onSelectDate={setSelectedDate}
              onSelectSlot={setSelectedSlot}
              formatDate={formatDate}
            />
          )}

          {step === "confirm" && selectedPastor && (
            <ConfirmStep
              caseData={caseData}
              pastor={selectedPastor}
              selectedSlot={selectedSlot}
              formatDateLong={formatDateLong}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-5 border-t border-border shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border text-[14px] text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          {step === "review-schedule" && (
            <button
              onClick={() => setStep("confirm")}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[14px] hover:bg-[#0284c7] transition-colors"
            >
              Continue
            </button>
          )}
          {step === "confirm" && (
            <button
              onClick={handleConfirm}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[14px] hover:bg-[#0284c7] transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Confirm Assignment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---- Step 1: Pastor Selection ---- */
function PastorSelectionStep({
  pastors,
  allCases,
  currentCaseId,
  selectedPastorId,
  onSelect,
}: {
  pastors: StaffMember[];
  allCases: PastoralCase[];
  currentCaseId: string;
  selectedPastorId?: string;
  onSelect: (pastor: StaffMember) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {pastors.map((pastor) => {
        const cases = allCases.filter((c) => c.assignedPastorId === pastor.id && c.id !== currentCaseId);
        const activeCases = cases.filter((c) => c.status === "active" || c.status === "assigned");
        const schedule = pastorSchedules.find((s) => s.pastorId === pastor.id);
        const totalSlots = schedule?.slots.length || 0;
        const bookedSlots = schedule?.slots.filter((s) => s.isBooked).length || 0;
        const availableSlots = totalSlots - bookedSlots;
        const loadPercent = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

        const loadColor =
          loadPercent > 60 ? "text-red-500" : loadPercent > 35 ? "text-amber-500" : "text-green-600";
        const loadBg =
          loadPercent > 60 ? "bg-red-500" : loadPercent > 35 ? "bg-amber-500" : "bg-green-500";

        return (
          <button
            key={pastor.id}
            onClick={() => onSelect(pastor)}
            className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-sm ${
              selectedPastorId === pastor.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-[14px] font-medium text-foreground">{pastor.name}</div>
                  <div className="text-[12px] text-muted-foreground">{pastor.email}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground mt-1" />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[12px] text-muted-foreground">
                  <span className="text-foreground font-medium">{activeCases.length}</span> active cases
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[12px] text-muted-foreground">
                  <span className="text-foreground font-medium">{availableSlots}</span> slots free
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className={`text-[12px] font-medium ${loadColor}`}>{loadPercent}% booked</span>
              </div>
            </div>

            {/* Load bar */}
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${loadBg}`} style={{ width: `${loadPercent}%` }} />
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ---- Step 2: Schedule Review ---- */
function ScheduleReviewStep({
  pastor,
  cases,
  availableDates,
  selectedDate,
  slotsForDate,
  selectedSlot,
  onSelectDate,
  onSelectSlot,
  formatDate,
}: {
  pastor: StaffMember;
  cases: PastoralCase[];
  availableDates: string[];
  selectedDate: string;
  slotsForDate: CalendarSlot[];
  selectedSlot: CalendarSlot | null;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slot: CalendarSlot | null) => void;
  formatDate: (d: string) => string;
}) {
  const activeCases = cases.filter((c) => c.status !== "closed");

  return (
    <div className="flex flex-col gap-5">
      {/* Pastor caseload overview */}
      <div>
        <h3 className="flex items-center gap-2 mb-3">
          <Briefcase className="w-4 h-4 text-primary" />
          Current Caseload ({activeCases.length} active)
        </h3>
        {activeCases.length === 0 ? (
          <div className="text-[13px] text-muted-foreground bg-muted/50 rounded-lg p-3">
            No active cases assigned to this pastor.
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-3 py-2 text-[12px] text-muted-foreground">Member</th>
                  <th className="text-left px-3 py-2 text-[12px] text-muted-foreground">Type</th>
                  <th className="text-left px-3 py-2 text-[12px] text-muted-foreground">Status</th>
                  <th className="text-left px-3 py-2 text-[12px] text-muted-foreground">Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeCases.map((c) => (
                  <tr key={c.id}>
                    <td className="px-3 py-2 text-[13px]">{c.memberName}</td>
                    <td className="px-3 py-2 text-[13px] text-muted-foreground capitalize">{c.caseType}</td>
                    <td className="px-3 py-2">
                      <CaseStatusBadge status={c.status} />
                    </td>
                    <td className="px-3 py-2 text-[12px] text-muted-foreground">{c.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Calendar booking */}
      <div>
        <h3 className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-primary" />
          Book a Contact Slot
        </h3>
        <p className="text-[13px] text-muted-foreground mb-3">
          Select a date and time to schedule the initial contact with the member.
        </p>

        {/* Date selector - horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {availableDates.map((date) => {
            const schedule = pastorSchedules.find((s) => s.pastorId === pastor.id);
            const daySlots = schedule?.slots.filter((s) => s.date === date) || [];
            const freeCount = daySlots.filter((s) => !s.isBooked).length;

            return (
              <button
                key={date}
                onClick={() => {
                  onSelectDate(date);
                  onSelectSlot(null);
                }}
                className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-lg border transition-all text-center min-w-[80px] ${
                  selectedDate === date
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <span className="text-[12px] text-muted-foreground">{formatDate(date).split(",")[0]}</span>
                <span className="text-[14px] font-medium text-foreground">
                  {formatDate(date).split(" ")[1]} {formatDate(date).split(" ")[2]}
                </span>
                <span className={`text-[11px] mt-0.5 ${freeCount > 3 ? "text-green-600" : freeCount > 1 ? "text-amber-500" : "text-red-500"}`}>
                  {freeCount} free
                </span>
              </button>
            );
          })}
        </div>

        {/* Time slots for selected date */}
        {selectedDate && (
          <div className="grid grid-cols-2 gap-2">
            {slotsForDate.map((slot) => (
              <button
                key={slot.id}
                disabled={slot.isBooked}
                onClick={() => onSelectSlot(selectedSlot?.id === slot.id ? null : slot)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all text-left ${
                  slot.isBooked
                    ? "border-border bg-muted/50 cursor-not-allowed opacity-60"
                    : selectedSlot?.id === slot.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-[13px]">
                    {slot.time} - {slot.endTime}
                  </span>
                </div>
                {slot.isBooked ? (
                  <span className="text-[11px] text-muted-foreground truncate max-w-[100px]">{slot.bookedFor}</span>
                ) : selectedSlot?.id === slot.id ? (
                  <Check className="w-4 h-4 text-primary" />
                ) : (
                  <span className="text-[11px] text-green-600">Available</span>
                )}
              </button>
            ))}
          </div>
        )}

        {!selectedDate && (
          <div className="flex items-center gap-2 text-[13px] text-muted-foreground bg-muted/50 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Select a date above to view available time slots.
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Step 3: Confirm ---- */
function ConfirmStep({
  caseData,
  pastor,
  selectedSlot,
  formatDateLong,
}: {
  caseData: PastoralCase;
  pastor: StaffMember;
  selectedSlot: CalendarSlot | null;
  formatDateLong: (d: string) => string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="text-[13px] text-primary mb-2 flex items-center gap-2">
          <Check className="w-4 h-4" />
          Assignment Summary
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[12px] text-muted-foreground">Member</div>
            <div className="text-[14px] font-medium">{caseData.memberName}</div>
          </div>
          <div>
            <div className="text-[12px] text-muted-foreground">Case Type</div>
            <div className="text-[14px] font-medium capitalize">{caseData.caseType}</div>
          </div>
          <div>
            <div className="text-[12px] text-muted-foreground">Assigned Pastor</div>
            <div className="text-[14px] font-medium">{pastor.name}</div>
          </div>
          <div>
            <div className="text-[12px] text-muted-foreground">Contact Email</div>
            <div className="text-[14px] font-medium">{pastor.email}</div>
          </div>
        </div>
      </div>

      {selectedSlot ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="text-[13px] text-green-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Scheduled Contact
          </div>
          <div className="text-[14px] font-medium text-green-900">
            {formatDateLong(selectedSlot.date)}
          </div>
          <div className="text-[13px] text-green-700 mt-1">
            {selectedSlot.time} - {selectedSlot.endTime}
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="text-[13px] text-amber-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            No contact slot booked. The pastor can schedule the initial contact later.
          </div>
        </div>
      )}

      <div className="text-[13px] text-muted-foreground bg-muted/50 rounded-lg p-3">
        The case status will be updated to <span className="font-medium text-foreground">"assigned"</span> and{" "}
        {pastor.name} will be notified of this assignment.
      </div>
    </div>
  );
}
