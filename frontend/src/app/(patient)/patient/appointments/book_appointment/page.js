"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";

const INITIAL_ALERTS = [
  {
    id: "ALT-1",
    type: "BOOKING ALERT",
    category: "BOOKING UPDATE",
    icon: "✔",
    title: "Queue Moving Fast — Dr. Ananya Perera",
    time: "2 mins ago",
    message:
      "Token #09 is currently being served. Your token is #12 (3 patients ahead, ~36 mins wait).",
    unread: true,
    variant: "booking",
  },
  {
    id: "ALT-2",
    type: "DELAY ALERT",
    category: "DELAY NOTICE",
    icon: "⏳",
    title: "Minor Session Delay Notice (10 mins)",
    time: "1 hour ago",
    message:
      "Dr. Rohan Silva's afternoon Neurology clinic on Nov 19 will start at 02:10 PM due to an inpatient round.",
    unread: true,
    variant: "delay",
  },
  {
    id: "ALT-3",
    type: "BOOKING ALERT",
    category: "BOOKING UPDATE",
    icon: "✔",
    title: "Online Consultation Confirmed",
    time: "Yesterday",
    message:
      "Your ONLINE session with Dr. Kavindi Jayawardena (REF-9012-NC) is confirmed for Nov 20 at 11:00 AM.",
    unread: false,
    variant: "booking",
  },
];

const SPECIALISATIONS = [
  "All Departments",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Orthopedics",
  "General Medicine",
];

const SPECIALISTS = [
  {
    id: "DR-ANANYA",
    initials: "AP",
    name: "Dr. Ananya Perera",
    speciality: "Cardiology",
    experience: "14 Years",
    fee: "LKR 3,500",
    rating: "4.9",
  },
  {
    id: "DR-KAVINDI",
    initials: "KJ",
    name: "Dr. Kavindi Jayawardena",
    speciality: "Dermatology",
    experience: "11 Years",
    fee: "LKR 3,150",
    rating: "4.8",
  },
  {
    id: "DR-ROHAN",
    initials: "RS",
    name: "Dr. Rohan Silva",
    speciality: "Neurology",
    experience: "16 Years",
    fee: "LKR 4,000",
    rating: "4.9",
  },
  {
    id: "DR-NIMAL",
    initials: "NP",
    name: "Dr. Nimal Perera",
    speciality: "Pediatrics",
    experience: "12 Years",
    fee: "LKR 3,000",
    rating: "4.8",
  },
  {
    id: "DR-THARINDU",
    initials: "TW",
    name: "Dr. Tharindu Wickramasinghe",
    speciality: "Orthopedics",
    experience: "15 Years",
    fee: "LKR 3,550",
    rating: "4.7",
  },
  {
    id: "DR-MEERA",
    initials: "MS",
    name: "Dr. Meera Subramanian",
    speciality: "General Medicine",
    experience: "10 Years",
    fee: "LKR 2,550",
    rating: "4.9",
  },
];

function NotificationIcon({ variant }) {
  if (variant === "delay") {
    return (
      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-500 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-500 flex items-center justify-center shrink-0">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75m6 2.25a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
  );
}

function NotificationsPopover({
  items,
  onMarkAllRead,
  onSelectItem,
  onClose,
  centerHref = "/portal/feedback",
}) {
  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col text-slate-900">
      <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-snug">
              Notifications
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {unreadCount} unread hospital alerts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onMarkAllRead}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline transition cursor-pointer"
          >
            Mark all read
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications"
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[410px] overflow-y-auto bg-slate-50/40">
        {items.map((item) => {
          const isHighlighted = item.unread;
          return (
            <div
              key={item.id}
              onClick={() => onSelectItem(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  onSelectItem(item.id);
                }
              }}
              className={`rounded-2xl border p-4 transition cursor-pointer ${
                isHighlighted
                  ? "bg-white border-teal-400/80 shadow-xs"
                  : "bg-white/90 border-slate-200/80 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <NotificationIcon variant={item.variant || "booking"} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.category || item.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">
                      {item.time}
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 mt-0.5 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <Link
          href={centerHref}
          onClick={onClose}
          className="block w-full text-center bg-[#08131d] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold py-3.5 rounded-xl shadow-sm transition"
        >
          Open Notification &amp; Feedback Center
        </Link>
      </div>
    </div>
  );
}

export default function SelectSpecialisationDoctorPage() {
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [modalOpen, setModalOpen] = useState(true);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = alerts.filter((a) => a.unread).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
  };

  const handleSelectAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unread: false } : a))
    );
  };

  const filteredDoctors = useMemo(() => {
    if (selectedDept === "All Departments") return SPECIALISTS;
    return SPECIALISTS.filter((doc) => doc.speciality === selectedDept);
  }, [selectedDept]);

  const activeDoctor = useMemo(() => {
    if (!selectedDoctorId) return null;
    return filteredDoctors.find((d) => d.id === selectedDoctorId) || null;
  }, [filteredDoctors, selectedDoctorId]);

  const handleSelectDept = (dept) => {
    setSelectedDept(dept);
    setSelectedDoctorId("");
  };

  const isDoctorSelected = Boolean(activeDoctor);

  return (
    <div
      className="min-h-screen bg-[#07191c] text-white flex flex-col"
      style={{
        backgroundImage: "radial-gradient(rgba(45, 212, 191, 0.16) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Top White Navigation Bar */}
      <header className="bg-white text-slate-900 border-b border-slate-200/80 sticky top-0 z-30">
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

          <div className="flex items-center gap-3">
            <Link
              href="/patient/appointments/book_appointment"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition"
            >
              <span>Book Appointment</span>
            </Link>

            {/* Notification Bell + Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setIsNotifOpen((prev) => !prev)}
                aria-label="Notifications"
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer inline-flex items-center justify-center"
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
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="fixed sm:absolute right-4 sm:right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[420px] z-50">
                  <NotificationsPopover
                    items={alerts}
                    onMarkAllRead={handleMarkAllRead}
                    onSelectItem={handleSelectAlert}
                    onClose={() => setIsNotifOpen(false)}
                    centerHref="/portal/feedback"
                  />
                </div>
              )}
            </div>

            <Link
              href="/patient/profile"
              className="hidden sm:flex items-center gap-2 border border-slate-200 bg-[#0e1b26] text-white rounded-xl px-2.5 py-1.5"
            >
              <span className="w-7 h-7 rounded-lg bg-teal-600 text-white text-xs font-bold flex items-center justify-center">
                AD
              </span>
              <span className="text-[10px] font-bold bg-teal-600/30 text-teal-300 px-2 py-0.5 rounded-md">
                Portal
              </span>
            </Link>

            <button
              type="button"
              aria-label="Sign Out"
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition cursor-pointer"
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
            </button>
          </div>
        </div>
      </header>

      {/* Main Channeling Workspace */}
      <main className="flex-1 py-8 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          {!modalOpen ? (
            <div className="bg-[#10272b]/95 text-white rounded-3xl border border-teal-500/20 shadow-xl p-8 text-center space-y-4">
              <h1 className="text-xl font-extrabold text-white">
                Outpatient &amp; Telemedicine Channeling
              </h1>
              <p className="text-sm text-slate-300">
                Start channeling by selecting a clinical department and consultant specialist.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="bg-[#0d9488] hover:bg-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
              >
                Open Channeling Wizard (Step 1 of 3)
              </button>
            </div>
          ) : (
            <div className="bg-[#10272b]/95 text-white rounded-3xl border border-teal-500/20 shadow-2xl overflow-hidden">
              {/* Dark Step Header */}
              <div className="bg-[#08191e] text-white px-6 sm:px-8 pt-6 pb-5 border-b border-teal-500/15 relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400">
                      STEP 1 OF 3 • OUTPATIENT &amp; TELEMEDICINE CHANNELING
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                      Select Specialisation &amp; Doctor
                    </h1>
                  </div>

                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close Channeling Wizard"
                    className="w-9 h-9 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-white flex items-center justify-center text-sm font-bold transition cursor-pointer shrink-0"
                  >
                    ✕
                  </button>
                </div>

                {/* Step Progress Bar */}
                <div className="mt-5 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-teal-500 rounded-full" />
                </div>
              </div>

              {/* Wizard Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* 1. Filter by Specialisation */}
                <div>
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-teal-300 mb-3">
                    1. FILTER BY SPECIALISATION
                  </h2>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {SPECIALISATIONS.map((dept) => {
                      const isSelected = selectedDept === dept;
                      return (
                        <button
                          key={dept}
                          type="button"
                          onClick={() => handleSelectDept(dept)}
                          className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer ${
                            isSelected
                              ? "bg-[#0d9488] text-white shadow-sm"
                              : "bg-[#07191c]/80 text-slate-300 border border-teal-500/20 hover:border-teal-400/50 hover:text-white"
                          }`}
                        >
                          {dept}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Choose Specialist */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-teal-300">
                      2. CHOOSE SPECIALIST
                    </h2>
                    {activeDoctor && (
                      <span className="text-xs font-semibold text-teal-300">
                        Selected: <strong className="text-white">{activeDoctor.name}</strong>
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {filteredDoctors.map((doc) => {
                      const isChosen = activeDoctor?.id === doc.id;
                      return (
                        <div
                          key={doc.id}
                          onClick={() =>
                            setSelectedDoctorId((prev) => (prev === doc.id ? "" : doc.id))
                          }
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedDoctorId((prev) => (prev === doc.id ? "" : doc.id));
                            }
                          }}
                          className={`rounded-2xl border p-4 sm:p-5 flex items-center justify-between gap-4 transition cursor-pointer ${
                            isChosen
                              ? "border-teal-400 bg-[#07191c] shadow-sm ring-1 ring-teal-400/30"
                              : "border-teal-500/20 bg-[#07191c]/65 hover:border-teal-500/40"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-teal-950/80 border border-teal-500/30 text-teal-300 font-extrabold text-sm flex items-center justify-center shrink-0">
                              {doc.initials}
                            </div>
                            <div>
                              <div className="text-base sm:text-lg font-extrabold text-white">
                                {doc.name}
                              </div>
                              <div className="text-xs sm:text-sm text-slate-300 mt-0.5">
                                {doc.speciality} • {doc.experience}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-base sm:text-lg font-extrabold text-white">
                              {doc.fee}
                            </div>
                            <div className="text-xs font-bold text-amber-400 mt-0.5">
                              ★ {doc.rating}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Continue to Sessions CTA (not active until a specialist is selected) */}
                <div className="pt-3 border-t border-teal-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-300">
                    {activeDoctor ? (
                      <span>
                        Ready for <strong className="text-white">{activeDoctor.name}</strong> ({activeDoctor.fee})
                      </span>
                    ) : (
                      <span className="text-slate-400">Select a specialist to continue</span>
                    )}
                  </div>

                  <Link
                    href={
                      activeDoctor
                        ? `/patient/appointments/session?doctor=${encodeURIComponent(activeDoctor.id)}`
                        : "/patient/appointments/session"
                    }
                    aria-disabled={!isDoctorSelected}
                    tabIndex={isDoctorSelected ? 0 : -1}
                    onClick={(e) => {
                      if (!isDoctorSelected) e.preventDefault();
                    }}
                    className={`inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold px-6 py-3.5 rounded-2xl shadow-sm transition shrink-0 ${
                      isDoctorSelected
                        ? "bg-[#0d9488] hover:bg-teal-500 text-white cursor-pointer"
                        : "bg-slate-800/90 text-slate-400 border border-slate-700/80 opacity-55 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    <span>Continue to Sessions</span>
                    <span>›</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
    </div>
  );
}
