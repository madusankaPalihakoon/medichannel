"use client";
import { useState, useRef, useEffect } from "react";
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

const CONSULT_SESSIONS = [
  {
    id: "REF-9012-NC",
    label: "2026-11-20 — Dr. Kavindi Jayawardena (Confirmed)",
    doctorName: "Dr. Kavindi Jayawardena",
    initials: "KJ",
    speciality: "Dermatology",
    credentials: "MBBS, MD (Dermatology)",
    department: "Dermatology Department",
    refCode: "REF-9012-NC",
    dateStr: "2026-11-20",
    diagnosis: "Mild Contact Dermatitis & Epidermal Barrier Dryness",
    clinicalNotes:
      "Visual tele-dermatoscopy confirms resolving erythema on bilateral forearms and wrists. No signs of secondary bacterial infection. Continue gentle fragrance-free cleansing and barrier repair therapy.",
    followUp: "Review in 2 weeks or sooner if pruritus worsens.",
    medications: [
      {
        medication: "Ceramide + Hyaluronic Barrier Cream",
        dosage: "Apply generously",
        frequency: "Twice daily after wash",
        duration: "14 Days",
      },
      {
        medication: "Hydrocortisone 1% Topical Cream",
        dosage: "Thin layer on red patches",
        frequency: "Once at night",
        duration: "5 Days",
      },
      {
        medication: "Cetirizine Dihydrochloride",
        dosage: "10mg Tablet",
        frequency: "Once at bedtime (if itchy)",
        duration: "7 Days",
      },
    ],
    initialMessages: [
      {
        id: "msg-1",
        sender: "doctor",
        text: "Good morning Kasun! Welcome to the MediChannel encrypted telemedicine room. I have reviewed your previous dermatology notes.",
        time: "10:58 AM",
        status: "",
      },
      {
        id: "msg-2",
        sender: "patient",
        text: "Good morning Dr. Kavindi! Thank you. The redness has reduced significantly, though there is mild dryness around my wrists.",
        time: "10:59 AM",
        status: "Read",
      },
      {
        id: "msg-3",
        sender: "doctor",
        text: "That is encouraging progress. Could you confirm if you are still applying the ceramide barrier cream twice daily?",
        time: "11:00 AM",
        status: "",
      },
    ],
  },
];

function MediChannelLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div
        className={`${
          compact ? "w-10 h-10 rounded-xl" : "w-12 h-12 rounded-2xl"
        } bg-[#148b7e] text-white flex items-center justify-center shadow-sm shrink-0 print:bg-[#148b7e] print:text-white`}
        style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
      >
        <svg
          className={compact ? "w-5 h-5" : "w-6 h-6"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 20.25s-7.5-4.78-9.75-10.12C.55 6.18 3.25 2.75 7.1 2.75c2.15 0 3.9 1.05 4.9 2.55 1-1.5 2.75-2.55 4.9-2.55 3.85 0 6.55 3.43 4.85 7.38C19.5 15.47 12 20.25 12 20.25z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 11.75h2.2l1.1-2.2 1.6 4.4 1.2-2.2h2.2"
          />
        </svg>
      </div>
      <div className="leading-tight">
        <span
          className={`block font-extrabold tracking-tight text-white print:text-slate-900 ${
            compact ? "text-base" : "text-lg sm:text-xl"
          }`}
        >
          MediChannel
        </span>
        <span className="block text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-400 print:text-slate-500">
          LANKA CARE HOSPITAL
        </span>
      </div>
    </div>
  );
}

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

export default function OnlineConsultationRoom() {
  const activeSession = CONSULT_SESSIONS[0];
  const [selectedSessionId, setSelectedSessionId] = useState(activeSession.id);
  const [messages, setMessages] = useState(activeSession.initialMessages);
  const [draftMessage, setDraftMessage] = useState("");
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

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!draftMessage.trim()) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: "patient",
        text: draftMessage.trim(),
        time: formattedTime,
        status: "Sent",
      },
    ]);
    setDraftMessage("");
  };

  const handlePrintSummary = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div
      className="min-h-screen bg-[#07191c] text-white flex flex-col print:bg-white print:text-slate-900"
      style={{
        backgroundImage: "radial-gradient(rgba(45, 212, 191, 0.16) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* Top White Navigation Bar */}
      <header className="bg-white text-slate-900 border-b border-slate-200/80 sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#148b7e] text-white flex items-center justify-center shadow-sm">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.25s-7.5-4.78-9.75-10.12C.55 6.18 3.25 2.75 7.1 2.75c2.15 0 3.9 1.05 4.9 2.55 1-1.5 2.75-2.55 4.9-2.55 3.85 0 6.55 3.43 4.85 7.38C19.5 15.47 12 20.25 12 20.25z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.5 11.75h2.2l1.1-2.2 1.6 4.4 1.2-2.2h2.2"
                />
              </svg>
            </div>
            <div className="leading-tight">
              <span className="block font-extrabold text-slate-900 text-base tracking-tight">
                MediChannel
              </span>
              <span className="block text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
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

      {/* Main Content */}
      <main className="flex-1 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Dark Consultation Header Banner */}
          <div className="bg-[#0d2226]/95 text-white rounded-3xl p-4 sm:p-5 border border-teal-500/25 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 print:hidden">
            <div className="flex items-center gap-3.5">
              <Link
                href="/portal/appointments"
                aria-label="Back to Appointments"
                className="w-9 h-9 rounded-full bg-[#07191c] hover:bg-[#133338] border border-teal-500/25 flex items-center justify-center text-sm font-bold transition shrink-0"
              >
                ‹
              </Link>

              <div>
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                  <span className="inline-flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Connected • End-to-End Encrypted
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-slate-300">Ref: {activeSession.refCode}</span>
                </div>

                <h1 className="text-base sm:text-xl font-extrabold text-white mt-0.5">
                  Online Consultation with {activeSession.doctorName} ({activeSession.speciality})
                </h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <select
                value={selectedSessionId}
                onChange={(e) => setSelectedSessionId(e.target.value)}
                className="bg-[#07191c] border border-teal-500/25 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl focus:outline-none focus:border-teal-400"
              >
                {CONSULT_SESSIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handlePrintSummary}
                className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition cursor-pointer"
              >
                <span>🖨️</span>
                <span>Print Summary</span>
              </button>
            </div>
          </div>

          {/* Two-Column Consultation Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Encrypted Telemedicine Chat */}
            <div className="lg:col-span-5 bg-[#0d2226]/95 text-white rounded-3xl border border-teal-500/20 shadow-lg overflow-hidden flex flex-col print:hidden">
              <div className="p-4 sm:p-5 border-b border-teal-500/15 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {activeSession.initials}
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-white">
                    {activeSession.doctorName}
                  </h2>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 mt-0.5">
                    <span>✓ Verified Clinician</span>
                    <span className="text-slate-500">•</span>
                    <span>Online</span>
                  </div>
                </div>
              </div>

              <div className="px-4 sm:px-5 pt-4">
                <div className="bg-[#07191c]/85 border border-teal-500/20 rounded-xl px-3 py-2 text-[11px] text-slate-300 text-center">
                  🔒 Messages &amp; clinical attachments are encrypted with TLS 1.3
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                {messages.map((msg) => {
                  const isPatient = msg.sender === "patient";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        isPatient ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isPatient
                            ? "bg-teal-600 text-white rounded-br-sm"
                            : "bg-[#07191c]/90 text-slate-200 border border-teal-500/20 rounded-bl-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 px-1">
                        <span>{msg.time}</span>
                        {msg.status && (
                          <>
                            <span>•</span>
                            <span className="text-teal-300 font-semibold">{msg.status}</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-teal-500/15 bg-[#07191c]/60 flex items-center gap-2.5 mt-auto"
              >
                <input
                  type="text"
                  value={draftMessage}
                  onChange={(e) => setDraftMessage(e.target.value)}
                  placeholder="Type your message to the doctor..."
                  className="flex-1 bg-[#07191c] border border-teal-500/25 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-400"
                />
                <button
                  type="submit"
                  aria-label="Send Message"
                  className="w-10 h-10 rounded-xl bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-sm transition cursor-pointer shrink-0"
                >
                  ➤
                </button>
              </form>
            </div>

            {/* Right Column: Digital Consultation Summary & E-Prescription */}
            <div className="lg:col-span-7 bg-[#0d2226]/95 text-white rounded-3xl border border-teal-500/20 shadow-lg p-6 sm:p-8 space-y-6 print:bg-white print:text-slate-900 print:border-slate-200">
              {/* Summary Top Header with MediChannel Print Logo */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-teal-500/15 print:border-slate-200">
                <div className="space-y-1.5">
                  <MediChannelLogo />
                  <p className="text-xs text-slate-300 print:text-slate-500">
                    Digital Consultation Summary &amp; E-Prescription
                  </p>
                </div>

                <div className="sm:text-right text-xs">
                  <div className="font-bold text-slate-200 print:text-slate-800">
                    Ref: {activeSession.refCode}
                  </div>
                  <div className="text-slate-400 mt-0.5 print:text-slate-500">
                    Date: {activeSession.dateStr}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#07191c]/80 border border-teal-500/20 rounded-2xl p-4 text-xs print:bg-slate-50 print:border-slate-200">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-400 print:text-slate-400">
                    PATIENT DETAILS
                  </span>
                  <div className="font-bold text-sm text-white mt-1 print:text-slate-900">
                    Asha Dissanayake
                  </div>
                  <div className="text-slate-300 mt-0.5 print:text-slate-600">
                    ID: PAT-9042 • Blood Group: O+
                  </div>
                  <div className="text-slate-300 mt-0.5 print:text-slate-600">
                    Phone: +94 77 452 8910
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-teal-400 print:text-slate-400">
                    ATTENDING CONSULTANT
                  </span>
                  <div className="font-bold text-sm text-white mt-1 print:text-slate-900">
                    {activeSession.doctorName}
                  </div>
                  <div className="text-slate-300 mt-0.5 print:text-slate-600">
                    {activeSession.credentials}
                  </div>
                  <div className="text-slate-300 mt-0.5 print:text-slate-600">
                    {activeSession.department}
                  </div>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  PRIMARY DIAGNOSIS
                </span>
                <div className="text-sm sm:text-base font-extrabold text-white print:text-slate-900">
                  {activeSession.diagnosis}
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  CLINICAL NOTES &amp; ADVICE
                </span>
                <div className="bg-[#07191c]/80 border border-teal-500/20 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 leading-relaxed print:bg-slate-50 print:border-slate-200 print:text-slate-700">
                  {activeSession.clinicalNotes}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-teal-400 text-sm print:text-teal-700">📋</span>
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200 print:text-slate-800">
                      PRESCRIBED MEDICATIONS (RX)
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full print:bg-emerald-50 print:text-emerald-700 print:border-emerald-200">
                    ✓ Digitally Signed
                  </span>
                </div>

                <div className="overflow-x-auto border border-teal-500/20 rounded-2xl print:border-slate-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#07191c] border-b border-teal-500/20 text-[10px] font-bold uppercase tracking-wider text-slate-400 print:bg-slate-50 print:border-slate-200 print:text-slate-500">
                        <th className="py-3 px-4">MEDICATION</th>
                        <th className="py-3 px-4">DOSAGE</th>
                        <th className="py-3 px-4">FREQUENCY</th>
                        <th className="py-3 px-4">DURATION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-teal-500/10 print:divide-slate-100">
                      {activeSession.medications.map((rx, idx) => (
                        <tr key={idx} className="hover:bg-[#07191c]/50 print:hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-bold text-white print:text-slate-900">
                            {rx.medication}
                          </td>
                          <td className="py-3 px-4 text-slate-300 print:text-slate-600">
                            {rx.dosage}
                          </td>
                          <td className="py-3 px-4 text-slate-300 print:text-slate-600">
                            {rx.frequency}
                          </td>
                          <td className="py-3 px-4 font-semibold text-teal-300 whitespace-nowrap print:text-teal-700">
                            {rx.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pt-4 border-t border-teal-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:border-slate-100">
                <p className="text-xs text-slate-300 print:text-slate-600">
                  <strong className="text-white print:text-slate-900">Follow-up Plan:</strong>{" "}
                  {activeSession.followUp}
                </p>

                <button
                  type="button"
                  onClick={handlePrintSummary}
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer shrink-0 print:hidden"
                >
                  <span>🖨️</span>
                  <span>Print Consultation Summary</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dark Footer */}
      <footer className="bg-[#08131d] text-slate-300 mt-auto border-t border-slate-800 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="mb-3">
              <MediChannelLogo compact />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              JCI-accredited multi-specialty tertiary care hospital delivering compassionate clinical
              excellence, real-time outpatient digital queues, and secure telemedicine.
            </p>
            <div className="mt-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-slate-900 border border-teal-500/30 text-teal-300 px-3 py-1.5 rounded-lg">
                🛡️ ISO 9001 &amp; JCI Accredited Facility
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              PATIENT SERVICES
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/doctors" className="hover:text-teal-400 transition">
                  Find a Specialist
                </Link>
              </li>
              <li>
                <Link href="/sessions" className="hover:text-teal-400 transition">
                  OPD &amp; Telemedicine Sessions
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-teal-400 transition">
                  Book an Appointment
                </Link>
              </li>
              <li>
                <Link href="/portal/queue" className="hover:text-teal-400 transition">
                  Live Queue Tracker
                </Link>
              </li>
              <li>
                <Link href="/notices" className="hover:text-teal-400 transition">
                  Hospital Notices &amp; Accreditation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              CENTERS OF EXCELLENCE
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/doctors?speciality=Cardiology" className="hover:text-teal-400 transition">
                  Cardiology Institute
                </Link>
              </li>
              <li>
                <Link href="/doctors?speciality=Dermatology" className="hover:text-teal-400 transition">
                  Dermatology Institute
                </Link>
              </li>
              <li>
                <Link href="/doctors?speciality=Neurology" className="hover:text-teal-400 transition">
                  Neurology Institute
                </Link>
              </li>
              <li>
                <Link href="/doctors?speciality=Pediatrics" className="hover:text-teal-400 transition">
                  Pediatrics Institute
                </Link>
              </li>
              <li>
                <Link href="/doctors?speciality=Orthopedics" className="hover:text-teal-400 transition">
                  Orthopedics Institute
                </Link>
              </li>
              <li>
                <Link
                  href="/doctors?speciality=General%20Medicine"
                  className="hover:text-teal-400 transition"
                >
                  General Medicine Institute
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              CONTACT &amp; HOURS
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <p>📍 No. 148, Hospital Avenue, Western Province, Sri Lanka</p>
              <p className="text-teal-400 font-semibold">
                📞 General: +94 11 269 1100 | Emergency: 1990
              </p>
              <p>✉️ care@medichannel.lk</p>
              <p className="pt-1">
                🕒 <strong className="text-slate-200">OPD Clinics:</strong> 07:30 AM – 09:30 PM
                <br />
                <span className="pl-5 block text-slate-400">
                  Emergency &amp; Pharmacy: 24 Hours / 7 Days
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 py-4 px-4 sm:px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto">
          <span>© 2026 MediChannel — Lanka Care Hospital. All rights reserved.</span>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:underline">
              HIPAA &amp; Patient Privacy Compliant
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Care
            </Link>
            <Link href="/telemedicine" className="hover:underline">
              Telemedicine Guidelines
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
