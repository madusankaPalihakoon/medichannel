"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const COMPLETED_VISITS = [
  {
    id: "REF-6923-NC",
    label: "2026-10-24 — Dr. Tharindu Wickramasinghe (REF-6923-NC)",
    doctor: "Dr. Tharindu Wickramasinghe",
  },
  {
    id: "REF-6104-NC",
    label: "2026-11-05 — Dr. Meera Subramanian (REF-6104-NC)",
    doctor: "Dr. Meera Subramanian",
  },
];

const INITIAL_FEEDBACKS = [
  {
    id: "FB-1",
    doctor: "Dr. Meera Subramanian",
    timestamp: "(2026-11-05 06:15 PM)",
    rating: 5,
    status: "Status: Published",
    comment:
      "Dr. Meera was very thorough, explained all lab markers clearly, and sent the prescription right away.",
  },
];

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
    cardStyle: "bg-emerald-950/50 border-emerald-500/30",
    badgeStyle: "text-emerald-400",
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
    cardStyle: "bg-amber-950/40 border-amber-500/30",
    badgeStyle: "text-amber-400",
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
    cardStyle: "bg-teal-950/50 border-teal-500/30",
    badgeStyle: "text-teal-400",
  },
];

const PORTAL_TABS = [
  { label: "Overview", href: "/patient/overview" },
  { label: "Appointments & History (4)", href: "/patient/appointments/appointments_history" },
  { label: "Live Queue Tracker", href: "/patient/queue" },
  { label: "My Profile", href: "/patient/profile" },
  { label: "Feedback & Alerts", href: "/patient/feedback" },
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

export function NotificationsPopover({
  items,
  onMarkAllRead,
  onSelectItem,
  onClose,
  centerHref = "/portal/feedback",
}) {
  const unreadCount = items.filter((item) => item.unread).length;

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col text-slate-900">
      {/* Header */}
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

      {/* Scrollable Alert List */}
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

      {/* Bottom Action Footer */}
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

export default function FeedbackAndAlertsPage() {
  const [selectedVisit, setSelectedVisit] = useState(COMPLETED_VISITS[0].id);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACKS);
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

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const visitObj =
      COMPLETED_VISITS.find((v) => v.id === selectedVisit) || COMPLETED_VISITS[0];

    const newEntry = {
      id: `FB-${Date.now()}`,
      doctor: visitObj.doctor,
      timestamp: "(2026-11-19 09:44 AM)",
      rating,
      status: "Status: Published",
      comment: comment.trim(),
    };

    setFeedbackList((prev) => [newEntry, ...prev]);
    setComment("");
    setRating(5);
  };

  const handleTriggerAlert = (kind) => {
    const newAlertsMap = {
      called: {
        id: `ALT-${Date.now()}`,
        type: "QUEUE CALL ALERT",
        category: "QUEUE CALL ALERT",
        icon: "🔔",
        title: "You Are Next — Token #12 Called",
        time: "Just now",
        message:
          "Please proceed to Cardiology Consultation Room 02 for Dr. Ananya Perera.",
        unread: true,
        variant: "booking",
        cardStyle: "bg-emerald-950/60 border-emerald-400/50",
        badgeStyle: "text-emerald-400",
      },
      delay: {
        id: `ALT-${Date.now()}`,
        type: "DELAY ALERT",
        category: "DELAY NOTICE",
        icon: "⏳",
        title: "Clinic Schedule Delay (15 mins)",
        time: "Just now",
        message:
          "Afternoon OPD session has been shifted by 15 minutes due to an urgent ward review.",
        unread: true,
        variant: "delay",
        cardStyle: "bg-amber-950/50 border-amber-400/50",
        badgeStyle: "text-amber-400",
      },
      cancel: {
        id: `ALT-${Date.now()}`,
        type: "CANCELLATION NOTICE",
        category: "CANCELLATION NOTICE",
        icon: "✕",
        title: "Session Reschedule / Cancellation Notice",
        time: "Just now",
        message:
          "Your token is eligible for priority re-booking or a 100% automatic fee refund.",
        unread: true,
        variant: "delay",
        cardStyle: "bg-rose-950/50 border-rose-400/50",
        badgeStyle: "text-rose-400",
      },
    };

    setAlerts((prev) => [newAlertsMap[kind], ...prev]);
  };

  const handleMarkAllRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, unread: false })));
  };

  const handleSelectAlert = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unread: false } : a))
    );
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
      <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              ♥
            </div>
            <div className="leading-tight">
              <span className="block font-extrabold text-slate-900 text-base">MediChannel</span>
              <span className="block text-[10px] font-semibold tracking-wider text-teal-700 uppercase">
                Lanka Care Hospital
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
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-sm transition"
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
              <span className="text-xs font-semibold"></span>
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
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Patient Identity Banner */}
          <div className="bg-[#0a1d21]/95 border border-[#17383e] rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0d9488] text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-sm">
                AD
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    Ashi Dissanayake
                  </h1>
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

          {/* Portal Navigation Sub-Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            {PORTAL_TABS.map((tab) => {
              const isCurrent = tab.label === "Feedback & Alerts";
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`inline-flex items-center px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition border ${
                    isCurrent
                      ? "bg-[#0d9488] text-white border-teal-400/50 shadow-sm"
                      : "bg-[#0d2226]/90 text-slate-300 border-teal-500/20 hover:bg-[#133338] hover:text-white"
                  }`}
                >
                  {tab.label}
                </Link>
              );
            })}
          </div>

          {/* Two-Column Feedback & Alerts Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Rate Consultation + Submitted Feedback Status */}
            <div className="lg:col-span-6 space-y-6">
              {/* Rate Your Consultation Experience Card */}
              <form
                onSubmit={handleSubmitFeedback}
                className="bg-[#10272b]/95 rounded-3xl border border-teal-500/20 shadow-xl p-6 sm:p-7"
              >
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  Rate Your Consultation Experience
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Share feedback on your doctor and hospital experience (1–5 stars).
                </p>

                {/* Select Completed Visit */}
                <div className="mt-5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                    SELECT COMPLETED VISIT
                  </label>
                  <select
                    value={selectedVisit}
                    onChange={(e) => setSelectedVisit(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-teal-500/30 bg-[#07191c] text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-teal-400"
                  >
                    {COMPLETED_VISITS.map((visit) => (
                      <option key={visit.id} value={visit.id} className="bg-[#07191c] text-white">
                        {visit.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Stars */}
                <div className="mt-5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                    RATING (1 TO 5 STARS)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg transition cursor-pointer ${
                          star <= rating
                            ? "bg-amber-500/15 border-amber-400/50 text-amber-400"
                            : "bg-[#07191c] border-slate-700 text-slate-600"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-bold text-slate-200">{rating} / 5</span>
                  </div>
                </div>

                {/* Feedback Comment */}
                <div className="mt-5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                    FEEDBACK COMMENT
                  </label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about consultation clarity, waiting time, and care quality..."
                    className="w-full px-4 py-3 rounded-xl border border-teal-500/30 bg-[#07191c] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 transition"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-5 w-full bg-[#0d9488] hover:bg-teal-600 text-white font-semibold text-sm py-3 rounded-xl shadow-sm transition cursor-pointer"
                >
                  Submit Rating &amp; Feedback
                </button>
              </form>

              {/* Your Submitted Feedback Status Card */}
              <div className="bg-[#10272b]/95 rounded-3xl border border-teal-500/20 shadow-xl p-6 sm:p-7">
                <h2 className="text-base sm:text-lg font-extrabold text-white mb-4">
                  Your Submitted Feedback Status
                </h2>

                <div className="space-y-3.5">
                  {feedbackList.map((fb) => (
                    <div
                      key={fb.id}
                      className="bg-[#07191c]/80 border border-teal-500/20 rounded-2xl p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <span className="font-bold text-sm text-white">{fb.doctor}</span>
                          <span className="text-xs text-slate-400 ml-2">{fb.timestamp}</span>
                        </div>
                        <span className="text-[11px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                          {fb.status}
                        </span>
                      </div>

                      <div className="text-amber-400 text-xs mt-1 tracking-wider">
                        {"★".repeat(fb.rating)}
                        <span className="text-slate-600">{"★".repeat(5 - fb.rating)}</span>
                      </div>

                      <p className="text-xs text-slate-300 italic mt-2 leading-relaxed">
                        &ldquo;{fb.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Patient Notifications & Alerts */}
            <div className="lg:col-span-6">
              <div className="bg-[#10272b]/95 rounded-3xl border border-teal-500/20 shadow-xl p-6 sm:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white">
                      Patient Notifications &amp; Alerts
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">
                      Queue call alerts, delay notices, and cancellation updates.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-teal-400 hover:underline shrink-0 cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                {/* Test Real-Time Hospital Alerts Bar */}
                <div className="mt-5 bg-[#07191c]/80 border border-teal-500/20 rounded-2xl p-3.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-teal-300 mb-2.5">
                    TEST REAL-TIME HOSPITAL ALERTS
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleTriggerAlert("called")}
                      className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      + Trigger Called Alert
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTriggerAlert("delay")}
                      className="bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      + Trigger Delay Notice
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTriggerAlert("cancel")}
                      className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      + Trigger Cancellation Notice
                    </button>
                  </div>
                </div>

                {/* Alerts Feed */}
                <div className="space-y-3.5 mt-5">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-2xl border p-4 transition ${alert.cardStyle}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider ${alert.badgeStyle}`}
                        >
                          <span>{alert.icon}</span>
                          <span>{alert.type}</span>
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{alert.time}</span>
                      </div>

                      <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">{alert.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}