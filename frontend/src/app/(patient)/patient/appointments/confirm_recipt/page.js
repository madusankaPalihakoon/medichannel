"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const SPECIALISTS_BY_ID = {
  "DR-ANANYA": {
    name: "Dr. Ananya Perera",
    speciality: "Cardiology",
    fee: 3500,
  },
  "DR-KAVINDI": {
    name: "Dr. Kavindi Jayawardena",
    speciality: "Dermatology",
    fee: 2800,
  },
  "DR-ROHAN": {
    name: "Dr. Rohan Silva",
    speciality: "Neurology",
    fee: 3800,
  },
  "DR-NIMAL": {
    name: "Dr. Nimal Fernando",
    speciality: "Pediatrics",
    fee: 2500,
  },
  "DR-THARINDU": {
    name: "Dr. Tharindu Wickramasinghe",
    speciality: "Orthopedics",
    fee: 3200,
  },
  "DR-MEERA": {
    name: "Dr. Meera Subramanian",
    speciality: "General Medicine",
    fee: 2200,
  },
};

const SESSIONS_BY_ID = {
  "ananya-sess-1": { date: "2026-11-19", estTime: "11:12 AM", token: "#08" },
  "kavindi-sess-1": { date: "2026-11-20", estTime: "11:40 AM", token: "#06" },
  "rohan-sess-1": { date: "2026-11-19", estTime: "04:00 PM", token: "#11" },
  "nimal-sess-1": { date: "2026-11-19", estTime: "10:50 AM", token: "#05" },
  "sess-1": { date: "2026-11-19", estTime: "07:00 PM", token: "#13" },
  "sess-2": { date: "2026-11-21", estTime: "10:15 AM", token: "#05" },
};

const DOTTED_BG_STYLE = {
  backgroundColor: "#07191c",
  backgroundImage: "radial-gradient(rgba(45, 212, 191, 0.16) 1px, transparent 1px)",
  backgroundSize: "24px 24px",
};

function ConfirmReceiptContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingRef, setBookingRef] = useState("REF-5888-NC");

  useEffect(() => {
    const queryRef = searchParams?.get("ref");
    if (queryRef) {
      setBookingRef(queryRef);
      return;
    }
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setBookingRef(`REF-${randomCode}-NC`);
  }, [searchParams]);

  const receipt = useMemo(() => {
    const doctorId = searchParams?.get("doctor") || "DR-ANANYA";
    const sessionId = searchParams?.get("session") || "ananya-sess-1";
    const mode = (searchParams?.get("mode") || "PHYSICAL").toUpperCase();
    const reason = searchParams?.get("reason") || "General consultation";
    const totalParam = Number(searchParams?.get("total") || 0);
    const paid = searchParams?.get("paid") !== "false";

    const docInfo = SPECIALISTS_BY_ID[doctorId] || SPECIALISTS_BY_ID["DR-ANANYA"];
    const sesInfo = SESSIONS_BY_ID[sessionId] || SESSIONS_BY_ID["ananya-sess-1"];
    const totalAmount = totalParam > 0 ? totalParam : docInfo.fee + 350;

    return {
      appointmentNo: sesInfo.token,
      estConsultTime: sesInfo.estTime,
      consultantLabel: `${docInfo.name} (${docInfo.speciality})`,
      modeAndDate: `${mode} • ${sesInfo.date}`,
      reason,
      paymentStatus: paid
        ? `Paid (LKR ${totalAmount.toLocaleString("en-US")})`
        : "Pending",
    };
  }, [searchParams]);

  return (
    <div
      style={DOTTED_BG_STYLE}
      className="min-h-screen flex items-center justify-center p-4 text-white"
    >
      <div className="w-full max-w-md bg-[#08191e]/95 border border-teal-500/25 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-teal-500/15 pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-teal-400">
              BOOKING CONFIRMED
            </p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              Appointment Confirmation Receipt
            </h1>
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            aria-label="Close receipt"
            className="w-9 h-9 rounded-xl bg-teal-950/70 hover:bg-teal-900 border border-teal-500/25 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Checkmark & Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-teal-950/80 border border-teal-400/50 text-teal-300 flex items-center justify-center mx-auto text-xl font-bold">
            ✓
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Appointment Confirmed!
          </h2>
          <p className="text-xs text-slate-400">
            Your slot has been reserved and added to your patient dashboard.
          </p>
        </div>

        {/* Highlight Boxes */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="rounded-2xl border border-teal-500/25 bg-[#07191c]/85 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              APPOINTMENT #
            </p>
            <p className="text-sm sm:text-base font-extrabold text-teal-300 mt-1">
              {receipt.appointmentNo}
            </p>
          </div>

          <div className="rounded-2xl border border-teal-500/25 bg-[#07191c]/85 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              BOOKING REF
            </p>
            <p className="text-xs sm:text-sm font-extrabold text-white mt-1 truncate">
              {bookingRef}
            </p>
          </div>

          <div className="rounded-2xl border border-teal-500/25 bg-[#07191c]/85 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              EST. CONSULT TIME
            </p>
            <p className="text-sm sm:text-base font-extrabold text-teal-300 mt-1">
              {receipt.estConsultTime}
            </p>
          </div>
        </div>

        {/* Receipt Details */}
        <div className="rounded-2xl border border-teal-500/20 bg-[#07191c]/80 p-4 space-y-3 text-xs sm:text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Consultant</span>
            <span className="font-bold text-white text-right">
              {receipt.consultantLabel}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Mode &amp; Date</span>
            <span className="font-bold text-white text-right">
              {receipt.modeAndDate}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Reason</span>
            <span className="font-bold text-white text-right break-all max-w-[65%]">
              {receipt.reason}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 pt-2 border-t border-teal-500/15">
            <span className="text-slate-400">Payment Status</span>
            <span className="font-extrabold text-teal-300 text-right">
              {receipt.paymentStatus}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="py-3 px-4 rounded-xl bg-[#07191c] hover:bg-teal-950/70 border border-teal-500/25 text-xs sm:text-sm font-semibold text-slate-200 transition cursor-pointer"
          >
            Close Window
          </button>

          <Link
            href="/patient/dashboard"
            className="py-3 px-4 rounded-xl bg-[#0d9488] hover:bg-teal-500 text-white text-xs sm:text-sm font-semibold text-center transition"
          >
            View in My Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmReceiptPage() {
  return (
    <Suspense
      fallback={
        <div
          style={DOTTED_BG_STYLE}
          className="min-h-screen flex items-center justify-center text-teal-300 text-sm"
        >
          Loading confirmation receipt...
        </div>
      }
    >
      <ConfirmReceiptContent />
    </Suspense>
  );
}