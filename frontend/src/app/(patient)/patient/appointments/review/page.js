"use client";

import React, { useState, useEffect, useMemo, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const SPECIALISTS_BY_ID = {
  "DR-ANANYA": {
    id: "DR-ANANYA",
    speciality: "Cardiology",
    name: "Dr. Ananya Perera",
    consultationFee: 3500,
  },
  "DR-KAVINDI": {
    id: "DR-KAVINDI",
    speciality: "Dermatology",
    name: "Dr. Kavindi Jayawardena",
    consultationFee: 2800,
  },
  "DR-ROHAN": {
    id: "DR-ROHAN",
    speciality: "Neurology",
    name: "Dr. Rohan Silva",
    consultationFee: 3800,
  },
  "DR-NIMAL": {
    id: "DR-NIMAL",
    speciality: "Pediatrics",
    name: "Dr. Nimal Fernando",
    consultationFee: 2500,
  },
  "DR-THARINDU": {
    id: "DR-THARINDU",
    speciality: "Orthopedics",
    name: "Dr. Tharindu Wickramasinghe",
    consultationFee: 3200,
  },
  "DR-MEERA": {
    id: "DR-MEERA",
    speciality: "General Medicine",
    name: "Dr. Meera Subramanian",
    consultationFee: 2200,
  },
};

const SESSIONS_BY_DOCTOR = {
  "DR-NIMAL": [
    {
      id: "nimal-sess-1",
      date: "2026-11-19",
      timeRange: "09:30 AM - 12:30 PM",
      nextToken: "#05",
      estConsultation: "10:50 AM",
      slotsLeft: 9,
    },
  ],
  "DR-KAVINDI": [
    {
      id: "kavindi-sess-1",
      date: "2026-11-20",
      timeRange: "10:30 AM - 01:30 PM",
      nextToken: "#06",
      estConsultation: "11:40 AM",
      slotsLeft: 7,
    },
  ],
  "DR-ROHAN": [
    {
      id: "rohan-sess-1",
      date: "2026-11-19",
      timeRange: "02:30 PM - 05:30 PM",
      nextToken: "#11",
      estConsultation: "04:00 PM",
      slotsLeft: 5,
    },
  ],
  "DR-ANANYA": [
    {
      id: "ananya-sess-1",
      date: "2026-11-19",
      timeRange: "09:30 AM - 12:30 PM",
      nextToken: "#08",
      estConsultation: "11:12 AM",
      slotsLeft: 6,
    },
  ],
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

const SERVICE_CHARGE = 350;
const MIN_REASON_LENGTH = 5;
const REASON_ERROR_MESSAGE =
  "Please briefly describe your reason for visit (at least 5 characters).";

const DOTTED_BG_STYLE = {
  backgroundColor: "#07191c",
  backgroundImage: "radial-gradient(rgba(45, 212, 191, 0.16) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

function formatLkr(amount) {
  return `LKR ${Number(amount || 0).toLocaleString("en-US")}`;
}

function ReasonFeeSummaryContent({
  isOpen = true,
  onClose,
  onBack,
  onConfirm,
  patient = {
    name: "Kasun Dissanayake",
    id: "PAT-9042",
  },
  doctor,
  session,
  mode,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openState, setOpenState] = useState(isOpen);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setOpenState(isOpen);
  }, [isOpen]);

  const activeDoctor = useMemo(() => {
    if (doctor) return doctor;
    const queryDoctor = searchParams?.get("doctor") || "DR-NIMAL";
    if (SPECIALISTS_BY_ID[queryDoctor]) {
      return SPECIALISTS_BY_ID[queryDoctor];
    }
    return SPECIALISTS_BY_ID["DR-NIMAL"];
  }, [doctor, searchParams]);

  const activeSession = useMemo(() => {
    if (session) return session;
    const doctorSessions =
      SESSIONS_BY_DOCTOR[activeDoctor?.id] || DEFAULT_SESSIONS;
    const querySession = searchParams?.get("session");
    if (querySession) {
      const matched = doctorSessions.find((s) => s.id === querySession);
      if (matched) return matched;
    }
    return doctorSessions[0];
  }, [session, activeDoctor?.id, searchParams]);

  const consultationMode = useMemo(() => {
    const raw = (
      mode ||
      searchParams?.get("mode") ||
      (activeDoctor?.id === "DR-KAVINDI" ? "ONLINE" : "PHYSICAL")
    ).toUpperCase();
    return raw === "ONLINE" ? "ONLINE" : "PHYSICAL";
  }, [mode, searchParams, activeDoctor?.id]);

  const consultationFee = activeDoctor?.consultationFee ?? 2500;
  const totalPayable = consultationFee + SERVICE_CHARGE;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      setOpenState(false);
    }
  }, [onClose]);

  useEffect(() => {
    if (!openState) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openState, handleClose]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      const query = new URLSearchParams({
        doctor: activeDoctor?.id || "DR-NIMAL",
      }).toString();
      router.push(`/patient/appointments/session?${query}`);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    const trimmedReason = reason.trim();
    if (trimmedReason.length < MIN_REASON_LENGTH) {
      setError(REASON_ERROR_MESSAGE);
      return;
    }

    setError("");
    setIsSubmitting(true);

    const payload = {
      patient,
      doctor: activeDoctor,
      session: activeSession,
      mode: consultationMode,
      reason: trimmedReason,
      consultationFee,
      serviceCharge: SERVICE_CHARGE,
      totalPayable,
    };

    try {
      if (onConfirm) {
        await onConfirm(payload);
      } else {
        const query = new URLSearchParams({
          doctor: activeDoctor?.id || "DR-NIMAL",
          session: activeSession?.id || "",
          mode: consultationMode,
          reason: trimmedReason,
          total: String(totalPayable),
          paid: "true",
        }).toString();
        router.push(`/patient/appointments/confirm_recipt?${query}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!openState) {
    return (
      <div
        style={DOTTED_BG_STYLE}
        className="min-h-screen flex flex-col items-center justify-center p-6 text-center text-white"
      >
        <div className="bg-[#08191e]/95 border border-teal-500/25 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
          <h2 className="text-lg font-extrabold text-white">
            Fee Summary Closed
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Reopen Step 3 to enter your symptoms and confirm your appointment.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setOpenState(true)}
              className="px-4 py-2.5 rounded-xl bg-[#0d9488] hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold cursor-pointer transition"
            >
              Reopen Summary Modal
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 rounded-xl border border-teal-500/30 bg-[#07191c] text-teal-200 text-xs sm:text-sm font-semibold hover:bg-[#0c262b] cursor-pointer transition"
            >
              Back to Sessions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reason-modal-title"
      style={DOTTED_BG_STYLE}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="w-full max-w-xl bg-[#08191e]/95 text-white rounded-3xl shadow-2xl border border-teal-500/25 overflow-hidden my-auto">
        {/* Dark Step Header */}
        <div className="bg-[#061317] text-white px-6 pt-5 pb-4 border-b border-teal-500/15">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-teal-400">
                STEP 3 OF 3 • OUTPATIENT &amp; TELEMEDICINE CHANNELING
              </p>
              <h2
                id="reason-modal-title"
                className="text-xl sm:text-2xl font-extrabold text-white mt-1 leading-snug"
              >
                Reason for Visit &amp; Fee Summary
              </h2>
            </div>

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-xl bg-teal-950/70 hover:bg-teal-900 border border-teal-500/25 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer shrink-0"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Full Teal Progress Bar */}
        <div className="h-1.5 w-full bg-[#0d9488]" />

        {/* Form Body */}
        <form onSubmit={handleConfirm} noValidate className="p-6 space-y-5 bg-[#08191e]/80">
          {/* Reason for Visit Textarea */}
          <div>
            <label
              htmlFor="reason-for-visit"
              className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2"
            >
              REASON FOR VISIT / PRIMARY SYMPTOMS *
            </label>
            <textarea
              id="reason-for-visit"
              rows={4}
              value={reason}
              onChange={(e) => {
                const nextValue = e.target.value;
                setReason(nextValue);
                if (error && nextValue.trim().length >= MIN_REASON_LENGTH) {
                  setError("");
                }
              }}
              placeholder="Describe your symptoms, follow-up purpose, or specific concerns for the doctor..."
              className={`w-full rounded-2xl border bg-[#07191c]/90 px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none transition resize-y ${
                error
                  ? "border-rose-400 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
                  : "border-teal-500/25 focus:border-teal-400 focus:ring-2 focus:ring-teal-500/20"
              }`}
            />
            {error && (
              <p className="mt-1.5 text-xs font-medium text-rose-400">
                {error}
              </p>
            )}
          </div>

          {/* Dark Teal Appointment & Fee Breakdown Card */}
          <div className="rounded-2xl border border-teal-500/20 bg-[#07191c]/85 p-5 space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Patient</span>
              <span className="font-bold text-white text-right">
                {patient.name} ({patient.id})
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">Consultant &amp; Mode</span>
              <span className="font-bold text-white text-right">
                {activeDoctor.name} • {consultationMode}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-400">
                Session Date &amp; Estimated Time
              </span>
              <span className="font-bold text-teal-300 text-right">
                {activeSession.date} at ~{activeSession.estConsultation}
              </span>
            </div>

            <div className="pt-2.5 border-t border-teal-500/15 space-y-2.5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300">Doctor Consultation Fee</span>
                <span className="font-semibold text-slate-200 text-right">
                  {formatLkr(consultationFee)}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-300">
                  Hospital Digital &amp; Service Charge
                </span>
                <span className="font-semibold text-slate-200 text-right">
                  {formatLkr(SERVICE_CHARGE)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-teal-500/15 flex items-center justify-between gap-4">
              <span className="text-sm sm:text-base font-extrabold text-white">
                Total Payable
              </span>
              <span className="text-base sm:text-lg font-extrabold text-teal-300 text-right">
                {formatLkr(totalPayable)}
              </span>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="pt-1 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white inline-flex items-center gap-1.5 py-2.5 px-3 rounded-xl border border-teal-500/20 bg-[#07191c]/80 hover:bg-[#0c262b] transition cursor-pointer"
            >
              <span>&lt;</span>
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0d9488] hover:bg-teal-500 disabled:opacity-60 text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-2xl shadow-sm inline-flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m6 2.25a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                {isSubmitting
                  ? "Confirming..."
                  : `Confirm & Pay ${formatLkr(totalPayable)}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ReasonFeeSummaryModal(props) {
  return (
    <Suspense
      fallback={
        <div
          style={DOTTED_BG_STYLE}
          className="fixed inset-0 flex items-center justify-center text-teal-300 text-sm"
        >
          Loading fee summary...
        </div>
      }
    >
      <ReasonFeeSummaryContent {...props} />
    </Suspense>
  );
}
