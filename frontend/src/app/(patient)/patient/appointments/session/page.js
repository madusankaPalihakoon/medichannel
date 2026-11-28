"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SPECIALISTS_BY_ID = {
  "DR-ANANYA": {
    id: "DR-ANANYA",
    speciality: "Cardiology",
    name: "Dr. Ananya Perera",
    fee: "LKR 3,500",
  },
  "DR-KAVINDI": {
    id: "DR-KAVINDI",
    speciality: "Dermatology",
    name: "Dr. Kavindi Jayawardena",
    fee: "LKR 3,150",
  },
  "DR-ROHAN": {
    id: "DR-ROHAN",
    speciality: "Neurology",
    name: "Dr. Rohan Silva",
    fee: "LKR 4,000",
  },
  "DR-NIMAL": {
    id: "DR-NIMAL",
    speciality: "Pediatrics",
    name: "Dr. Nimal Perera",
    fee: "LKR 3,000",
  },
  "DR-THARINDU": {
    id: "DR-THARINDU",
    speciality: "Orthopedics",
    name: "Dr. Tharindu Wickramasinghe",
    fee: "LKR 3,550",
  },
  "DR-MEERA": {
    id: "DR-MEERA",
    speciality: "General Medicine",
    name: "Dr. Meera Subramanian",
    fee: "LKR 2,550",
  },
};

const DEFAULT_SESSIONS = [
  {
    id: "sess-1",
    date: "2026-11-19",
    timeRange: "05:00 PM - 08:00 PM",
    nextToken: "#13",
    estConsultation: "07:00 PM",
    slotsLeft: 8,
  },
  {
    id: "sess-2",
    date: "2026-11-21",
    timeRange: "09:30 AM - 12:30 PM",
    nextToken: "#05",
    estConsultation: "10:15 AM",
    slotsLeft: 12,
  },
];

function SelectSessionConsultationContent({
  isOpen = true,
  onClose,
  onBack,
  onContinue,
  doctor = {
    id: "DR-MEERA",
    speciality: "General Medicine",
    name: "Dr. Meera Subramanian",
    fee: "LKR 2,550",
  },
  sessions = DEFAULT_SESSIONS,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeDoctor = useMemo(() => {
    const queryDoctorId = searchParams?.get("doctor");
    if (queryDoctorId && SPECIALISTS_BY_ID[queryDoctorId]) {
      return SPECIALISTS_BY_ID[queryDoctorId];
    }
    return doctor;
  }, [searchParams, doctor]);

  const safeSessions =
    Array.isArray(sessions) && sessions.length > 0 ? sessions : DEFAULT_SESSIONS;

  const [openState, setOpenState] = useState(isOpen);
  const [selectedSessionId, setSelectedSessionId] = useState(
    safeSessions[0]?.id || ""
  );
  const [consultationMode, setConsultationMode] = useState("PHYSICAL");

  useEffect(() => {
    setOpenState(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (
      safeSessions.length > 0 &&
      !safeSessions.some((s) => s.id === selectedSessionId)
    ) {
      setSelectedSessionId(safeSessions[0].id);
    }
  }, [safeSessions, selectedSessionId]);

  const selectedSession =
    safeSessions.find((s) => s.id === selectedSessionId) || safeSessions[0];
  const activeIndex = Math.max(
    0,
    safeSessions.findIndex((s) => s.id === selectedSession?.id)
  );
  const progressPercent =
    safeSessions.length > 1
      ? Math.round(((activeIndex + 1) / safeSessions.length) * 100)
      : 55;

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setOpenState(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/patient/appointments/book_appointment");
    }
  };

  const handleContinue = () => {
    const payload = {
      doctor: activeDoctor,
      session: selectedSession,
      mode: consultationMode,
    };
    if (onContinue) {
      onContinue(payload);
    } else {
      const query = new URLSearchParams({
        doctor: activeDoctor?.id || activeDoctor?.name || "DR-MEERA",
        session: selectedSession?.id || "",
        mode: consultationMode,
      }).toString();
      router.push(`/patient/appointments/review?${query}`);
    }
  };

  const backdropStyle = {
    backgroundImage:
      "radial-gradient(rgba(45, 212, 191, 0.16) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  };

  if (!openState) {
    return (
      <div
        style={backdropStyle}
        className="min-h-screen bg-[#07191c] flex flex-col items-center justify-center p-6 text-center text-white"
      >
        <div className="bg-[#10272b]/95 border border-teal-500/20 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
          <h2 className="text-lg font-extrabold text-white">
            Session Selection Closed
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Reopen Step 2 to choose an available clinic session and consultation
            mode.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setOpenState(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold cursor-pointer transition"
            >
              Reopen Session Modal
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-teal-500/25 bg-[#07191c]/80 text-teal-200 text-xs sm:text-sm font-semibold hover:bg-[#08191e] cursor-pointer transition"
            >
              Back to Specialists
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-[#07191c]/90 backdrop-blur-[2px] flex items-center justify-center p-4"
      style={backdropStyle}
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-modal-title"
    >
      <div className="w-full max-w-xl bg-[#10272b]/95 text-white rounded-3xl shadow-2xl border border-teal-500/20 overflow-hidden">
        {/* Dark Step Header */}
        <div className="bg-[#08191e] text-white px-6 pt-5 pb-4 border-b border-teal-500/15 relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-teal-400">
                STEP 2 OF 3 • OUTPATIENT &amp; TELEMEDICINE CHANNELING
              </p>
              <h2
                id="session-modal-title"
                className="text-xl sm:text-2xl font-extrabold text-white mt-1 leading-snug"
              >
                Select Session &amp; Consultation Mode
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Teal Progress Indicator Bar */}
          <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0d9488] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Doctor & Fee Summary Card */}
          <div className="rounded-2xl border border-teal-500/20 bg-[#07191c]/75 px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-teal-300">
                {activeDoctor?.speciality || "General Medicine"}
              </p>
              <p className="text-base font-extrabold text-white mt-0.5">
                {activeDoctor?.name || "Consultant"}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm sm:text-base font-extrabold text-white">
                {activeDoctor?.fee || "LKR 2,550"}
              </p>
            </div>
          </div>

          {/* SELECT AVAILABLE SESSION */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2.5">
              SELECT AVAILABLE SESSION
            </p>
            <div className="space-y-2.5">
              {safeSessions.map((session) => {
                const isSelected = session.id === selectedSession?.id;
                return (
                  <button
                    key={session.id}
                    type="button"
                    onClick={() => setSelectedSessionId(session.id)}
                    className={`w-full text-left rounded-2xl border px-5 py-4 transition cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? "border-teal-400 bg-[#07191c] ring-1 ring-teal-400/30"
                        : "border-teal-500/20 bg-[#07191c]/65 hover:border-teal-500/40"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-extrabold text-white">
                        {session.date} • {session.timeRange}
                      </p>
                      <p className="text-xs text-slate-300 mt-1">
                        Next Token:{" "}
                        <span className="font-bold text-teal-300">
                          {session.nextToken}
                        </span>{" "}
                        • Est. Consultation:{" "}
                        <span className="font-bold text-white">
                          {session.estConsultation}
                        </span>
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 shrink-0">
                      {session.slotsLeft} left
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CHOOSE CONSULTATION MODE */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2.5">
              CHOOSE CONSULTATION MODE (PHYSICAL OR ONLINE)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* PHYSICAL */}
              <button
                type="button"
                onClick={() => setConsultationMode("PHYSICAL")}
                className={`text-left rounded-2xl border p-4 transition cursor-pointer relative ${
                  consultationMode === "PHYSICAL"
                    ? "border-teal-400 bg-[#07191c] ring-1 ring-teal-400/30"
                    : "border-teal-500/20 bg-[#07191c]/65 hover:border-teal-500/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-950/80 border border-teal-500/30 text-teal-300 flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 21h18M5 21V7l7-4 7 4v14M9 10h2m2 0h2M9 14h2m2 0h2"
                      />
                    </svg>
                  </div>
                  {consultationMode === "PHYSICAL" && (
                    <span className="w-5 h-5 rounded-full border border-teal-400 text-teal-300 flex items-center justify-center text-[11px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-white mt-2.5">
                  PHYSICAL
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  In-person hospital visit
                </p>
              </button>

              {/* ONLINE */}
              <button
                type="button"
                onClick={() => setConsultationMode("ONLINE")}
                className={`text-left rounded-2xl border p-4 transition cursor-pointer relative ${
                  consultationMode === "ONLINE"
                    ? "border-teal-400 bg-[#07191c] ring-1 ring-teal-400/30"
                    : "border-teal-500/20 bg-[#07191c]/65 hover:border-teal-500/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-950/80 border border-sky-500/30 text-sky-300 flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {consultationMode === "ONLINE" && (
                    <span className="w-5 h-5 rounded-full border border-teal-400 text-teal-300 flex items-center justify-center text-[11px] font-bold">
                      ✓
                    </span>
                  )}
                </div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-white mt-2.5">
                  ONLINE
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Encrypted video &amp; chat room
                </p>
              </button>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1.5 py-2 px-1 transition cursor-pointer"
            >
              <span>&lt;</span>
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="bg-[#0d9488] hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold px-5 py-3 rounded-xl shadow-sm inline-flex items-center gap-2 transition cursor-pointer"
            >
              <span>Review &amp; Reason</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SelectSessionConsultationModal(props) {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-[#07191c] flex items-center justify-center text-teal-300 text-sm">
          Loading session options...
        </div>
      }
    >
      <SelectSessionConsultationContent {...props} />
    </Suspense>
  );
}