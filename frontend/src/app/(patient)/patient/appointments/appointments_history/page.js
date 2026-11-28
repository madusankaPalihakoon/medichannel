"use client";
import { useState, useMemo } from "react";
import Link from "next/link";

const INITIAL_BOOKINGS = [
  {
    id: "APT-8841",
    token: "Token #12",
    ref: "REF-8841-NC",
    status: "In Queue",
    category: "Upcoming",
    paymentLabel: "Payment: Paid (LKR 3,850)",
    doctor: "Dr. Ananya Perera",
    speciality: "Cardiology",
    dateLine: "Date: 2026-11-19 (09:00 AM - 12:00 PM) • Est. Time: 11:12 AM • Mode: PHYSICAL",
    reason: "Reason: Routine annual cardiac checkup and mild palpitations after exercise.",
    actions: ["cancel"],
    summary: {
      branch: "Colombo Main Hospital · Suite 204, Wing A",
      notes: "Fasting lipid panel and resting ECG ordered prior to consultation.",
    },
  },
  {
    id: "APT-9012",
    token: "Token #07",
    ref: "REF-9012-NC",
    status: "Confirmed",
    category: "Upcoming",
    paymentLabel: "Payment: Paid (LKR 3,150)",
    doctor: "Dr. Kavindi Jayawardena",
    speciality: "Dermatology",
    dateLine: "Date: 2026-11-20 (10:00 AM - 01:00 PM) • Est. Time: 11:00 AM • Mode: ONLINE",
    reason: "Reason: Follow-up on seasonal skin rash and topical treatment response.",
    actions: ["online", "cancel"],
    summary: {
      branch: "NovaCare Encrypted Telehealth Suite",
      notes: "Keep recent daylight photos of affected areas ready for video review.",
    },
  },
  {
    id: "APT-7410",
    token: "Token #05",
    ref: "REF-7410-NC",
    status: "Completed",
    category: "Completed",
    paymentLabel: "Payment: Paid (LKR 2,550)",
    doctor: "Dr. Meera Subramanian",
    speciality: "General Medicine",
    dateLine: "Date: 2026-11-05 (05:00 PM - 08:00 PM) • Est. Time: 05:40 PM • Mode: ONLINE",
    reason: "Reason: Persistent fatigue, vitamin D deficiency review, and general blood panel.",
    actions: ["summary"],
    summary: {
      diagnosis: "Mild Vitamin D insufficiency; CBC & thyroid panel within normal limits.",
      prescription: "Cholecalciferol 2000 IU once daily for 8 weeks; repeat CBC in 3 months.",
    },
  },
  {
    id: "APT-6923",
    token: "Token #09",
    ref: "REF-6923-NC",
    status: "Completed",
    category: "Completed",
    paymentLabel: "Payment: Paid (LKR 3,550)",
    doctor: "Dr. Tharindu Wickramasinghe",
    speciality: "Orthopedics",
    dateLine: "Date: 2026-10-24 (03:00 PM - 06:00 PM) • Est. Time: 05:00 PM • Mode: PHYSICAL",
    reason: "Reason: Right knee discomfort after running and mobility assessment.",
    actions: ["summary"],
    summary: {
      diagnosis: "Mild patellofemoral strain; no ligament instability.",
      prescription: "Quadriceps strengthening physiotherapy protocol; ice & NSAID PRN.",
    },
  },
];

const FILTERS = ["All", "Upcoming", "Completed", "Cancelled"];

const PORTAL_TABS = [
  { label: "Overview", href: "/patient/overview" },
  { label: "Appointments & History", href: "/patient/appointments/appointments_history" },
  { label: "Live Queue Tracker", href: "/patient/queue" },
  { label: "My Profile", href: "/patient/profile" },
  { label: "Feedback & Alerts", href: "/patient/feedback" },
];

export default function AppointmentsHistoryPage() {
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedSummary, setSelectedSummary] = useState(null);

  const visibleBookings = useMemo(() => {
    if (activeFilter === "All") return bookings;
    return bookings.filter((b) => b.category === activeFilter);
  }, [bookings, activeFilter]);

  const handleCancelBooking = (id) => {
    setBookings((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Cancelled",
              category: "Cancelled",
              actions: [],
            }
          : item
      )
    );
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "In Queue":
        return "bg-sky-950/80 text-sky-300 border-sky-500/30";
      case "Confirmed":
        return "bg-teal-950/80 text-teal-300 border-teal-500/30";
      case "Completed":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-500/30";
      case "Cancelled":
        return "bg-rose-950/80 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div
      className="min-h-screen bg-[#07191c] text-white flex flex-col"
      style={{
        backgroundImage: "radial-gradient(rgba(45, 212, 191, 0.16) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Top White Navigation Bar */}
      <header className="bg-white text-slate-900 border-b border-slate-200/80 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.5 12h2l1-2 1.5 4 1-2h1.5"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="block font-extrabold text-slate-900 text-base tracking-tight">
                MediChannel
              </span>
              <span className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                LANKA CARE HOSPITAL
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
            <Link href="/" className="px-3.5 py-2 rounded-xl hover:bg-slate-50 transition">
              Home
            </Link>
            <Link href="/doctors" className="px-3.5 py-2 rounded-xl hover:bg-slate-50 transition">
              Find Doctors
            </Link>
            <Link
              href="/specialisations"
              className="px-3.5 py-2 rounded-xl hover:bg-slate-50 transition"
            >
              Specialisations
            </Link>
            <Link href="/sessions" className="px-3.5 py-2 rounded-xl hover:bg-slate-50 transition">
              Sessions
            </Link>
            <Link href="/notices" className="px-3.5 py-2 rounded-xl hover:bg-slate-50 transition">
              Notices &amp; Info
            </Link>
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link
              href="/patient/appointments/book_appointment"
              className="inline-flex items-center gap-1.5 bg-[#0d9488] hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition whitespace-nowrap"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Book Appointment</span>
            </Link>

            <Link
              href="/portal/feedback"
              aria-label="Notifications"
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                2
              </span>
            </Link>

            <Link
              href="/patient/profile"
              className="hidden sm:inline-flex items-center gap-2 border border-teal-500/40 bg-[#0b1b20] text-white rounded-full pl-1.5 pr-3 py-1 text-xs font-semibold transition whitespace-nowrap"
            >
              <span className="w-6 h-6 rounded-lg bg-[#0d8a7a] text-white font-extrabold text-[11px] flex items-center justify-center">
                AD
              </span>
              <span className="bg-teal-950 text-teal-300 border border-teal-500/30 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                Portal
              </span>
            </Link>

            <Link
              href="/patient/login"
              aria-label="Sign Out"
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-7 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Patient Identity Banner */}
          <div className="bg-[#0a1d21]/95 border border-[#17383e] rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0d9488] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm">
                AD
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-lg sm:text-xl font-extrabold text-white">
                    Ashi Dissanayake
                  </h2>
                  <span className="text-[11px] font-bold bg-[#10292f] text-teal-300 border border-teal-500/30 px-2.5 py-0.5 rounded-md">
                    PAT-9042
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-300 mt-1">
                  <span className="font-semibold text-rose-400">Blood Group: O+</span>
                  <span className="text-slate-500">•</span>
                  <span>+94 77 452 8910</span>
                  <span className="text-slate-500">•</span>
                  <span>ashi@example.com</span>
                </div>
              </div>
            </div>

            <Link
              href="/patient/appointments/book_appointment"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0d9488] hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition shrink-0"
            >
              <span>+ New Appointment</span>
            </Link>
          </div>

          {/* Portal Sub-Tabs Bar */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            {PORTAL_TABS.map((tab) => {
              const isCurrent = tab.label === "Appointments & History";
              const labelText = isCurrent
                ? `Appointments & History (${bookings.length})`
                : tab.label;

              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition border ${
                    isCurrent
                      ? "bg-[#0d9488] text-white border-[#14b8a6] shadow-sm"
                      : "bg-[#0a1d21]/95 text-slate-300 border-[#17383e] hover:bg-[#10292f] hover:text-white"
                  }`}
                >
                  <span>{labelText}</span>
                </Link>
              );
            })}
          </div>

          {/* Appointments & Booking History Container Card */}
          <div className="bg-[#0a1d21]/95 rounded-3xl border border-[#17383e] shadow-2xl p-6 sm:p-8">
            {/* Header + Filter Buttons */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#17383e]">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Appointments &amp; Booking History
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  View appointment statuses, payment receipts, online consultation summaries, or cancel upcoming bookings.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {FILTERS.map((filter) => {
                  const active = activeFilter === filter;
                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                        active
                          ? "bg-[#0d9488] text-white border-[#14b8a6] shadow-sm"
                          : "bg-[#071619] hover:bg-[#10292f] text-slate-300 border-[#17383e]"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Booking Cards Stack */}
            <div className="space-y-4 mt-6">
              {visibleBookings.length === 0 ? (
                <div className="border border-[#17383e] bg-[#071619]/80 rounded-2xl p-10 text-center text-sm text-slate-400">
                  No appointments found in the <strong className="text-white">{activeFilter}</strong> category.
                </div>
              ) : (
                visibleBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-[#17383e] hover:border-teal-500/50 rounded-2xl p-5 bg-[#071619]/90 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      {/* Top Meta Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold bg-[#10292f] text-slate-200 border border-[#1e464d] px-2.5 py-0.5 rounded-md">
                          {booking.token}
                        </span>
                        <span className="text-xs font-medium text-slate-400">
                          {booking.ref}
                        </span>
                        <span
                          className={`text-xs font-bold border px-2.5 py-0.5 rounded-full ${getStatusBadgeStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                        <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-500/30 px-2.5 py-0.5 rounded-md">
                          {booking.paymentLabel}
                        </span>
                      </div>

                      {/* Doctor & Speciality */}
                      <h2 className="text-base sm:text-lg font-extrabold text-white pt-0.5">
                        {booking.doctor}{" "}
                        <span className="font-semibold text-teal-400">
                          - {booking.speciality}
                        </span>
                      </h2>

                      {/* Date, Est Time & Mode */}
                      <p className="text-xs text-slate-300 font-medium">{booking.dateLine}</p>

                      {/* Reason */}
                      <p className="text-xs text-slate-400">{booking.reason}</p>
                    </div>

                    {/* Right Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                      {booking.actions.includes("online") && (
                        <Link
                          href={`/consult/${booking.ref}`}
                          className="inline-flex items-center gap-1.5 bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
                        >
                          <span>📹</span>
                          <span>Join Online Room</span>
                        </Link>
                      )}

                      {booking.actions.includes("summary") && (
                        <button
                          type="button"
                          onClick={() => setSelectedSummary(booking)}
                          className="inline-flex items-center gap-1.5 bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
                        >
                          <span>📄</span>
                          <span>Consultation &amp; Rx</span>
                        </button>
                      )}

                      {booking.actions.includes("cancel") && (
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking.id)}
                          className="border border-rose-500/30 bg-rose-950/50 hover:bg-rose-950/80 text-rose-300 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Consultation & Rx Modal */}
      {selectedSummary && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#0a1d21] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#17383e] text-white">
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#17383e]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">
                  {selectedSummary.ref} · {selectedSummary.token}
                </span>
                <h3 className="text-lg font-extrabold text-white mt-0.5">
                  {selectedSummary.doctor} — {selectedSummary.speciality}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSummary(null)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs sm:text-sm text-slate-300">
              <p className="text-xs text-slate-400">{selectedSummary.dateLine}</p>
              <div className="bg-[#071619] rounded-2xl p-4 border border-[#17383e]">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Clinical Summary
                </span>
                <p className="mt-1 text-slate-100">{selectedSummary.summary?.diagnosis}</p>
              </div>
              <div className="bg-teal-950/50 rounded-2xl p-4 border border-teal-500/25">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-teal-300">
                  Prescription &amp; Care Plan
                </span>
                <p className="mt-1 text-slate-100">{selectedSummary.summary?.prescription}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSummary(null)}
                className="bg-[#0d9488] hover:bg-teal-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition cursor-pointer"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}