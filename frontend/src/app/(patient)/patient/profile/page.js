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

const INITIAL_PROFILE = {
  fullName: "Ashi Dissanayake",
  email: "ashi@example.com",
  phone: "+94 77 452 8910",
  dateOfBirth: "06/14/1991",
  bloodGroup: "O+",
  emergencyContact: "Nadeesha Dissanayake (+94 71 889 3321)",
  address: "42 Galle Road, Kalutara North, Western Province",
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const TABS = [
  { label: "Overview", href: "/patient/overview", icon: "" },
  { label: "Appointments & History (4)", href: "/patient/appointments/appointments_history", icon: "" },
  { label: "Live Queue Tracker", href: "/patient/queue", icon: "" },
  { label: "My Profile", href: "/patient/profile", icon: "" },
  { label: "Feedback & Alerts", href: "/patient/feedback", icon: "" },
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

export default function PatientProfilePage() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState(INITIAL_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);
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

  const handleEditClick = () => {
    setDraft(profile);
    setIsEditing(true);
    setSavedBanner(false);
  };

  const handleCancelEdit = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setProfile(draft);
    setIsEditing(false);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleChange = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
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
      <header className="bg-white text-slate-900 border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
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
                Lanka Care Hospital
              </span>
            </div>
          </Link>

          {/* Center Nav Links */}
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

          {/* Right Controls */}
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
      <main className="flex-1 py-7 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
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
            {TABS.map((tab) => {
              const isCurrent = tab.label === "My Profile";
              return (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition border ${
                    isCurrent
                      ? "bg-[#0d9488] text-white border-teal-400/50 shadow-sm"
                      : "bg-[#0d2226]/90 text-slate-300 border-teal-500/20 hover:bg-[#133338] hover:text-white"
                  }`}
                >
                  {tab.icon && <span className="text-xs">{tab.icon}</span>}
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>

          {savedBanner && (
            <div className="bg-emerald-950/80 border border-emerald-500/35 text-emerald-200 text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl flex items-center justify-between">
              <span>✓ Patient personal details updated successfully.</span>
              <button
                type="button"
                onClick={() => setSavedBanner(false)}
                className="text-emerald-300 hover:underline text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Patient Personal Details Card */}
          <form
            onSubmit={handleSave}
            className="bg-[#10272b]/95 text-white rounded-3xl border border-teal-500/20 shadow-xl p-6 sm:p-8"
          >
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-teal-500/15">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  Patient Personal Details
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Keep your contact and medical profile accurate for prescriptions and emergency alerts.
                </p>
              </div>

              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="inline-flex items-center justify-center gap-2 border border-teal-500/30 bg-[#07191c]/80 hover:bg-[#133338] hover:border-teal-400/50 text-teal-200 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer shrink-0"
                >
                  <span>✏️</span>
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="border border-slate-700 bg-[#07191c]/80 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#0d9488] hover:bg-teal-600 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mt-6">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                  FULL NAME
                </label>
                <input
                  type="text"
                  readOnly={!isEditing}
                  value={isEditing ? draft.fullName : profile.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition ${
                    isEditing
                      ? "bg-[#07191c] border-teal-400 text-white focus:outline-none ring-2 ring-teal-500/20"
                      : "bg-[#07191c]/75 border-teal-500/20 text-slate-200 cursor-default focus:outline-none"
                  }`}
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  readOnly={!isEditing}
                  value={isEditing ? draft.email : profile.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition ${
                    isEditing
                      ? "bg-[#07191c] border-teal-400 text-white focus:outline-none ring-2 ring-teal-500/20"
                      : "bg-[#07191c]/75 border-teal-500/20 text-slate-200 cursor-default focus:outline-none"
                  }`}
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  readOnly={!isEditing}
                  value={isEditing ? draft.phone : profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition ${
                    isEditing
                      ? "bg-[#07191c] border-teal-400 text-white focus:outline-none ring-2 ring-teal-500/20"
                      : "bg-[#07191c]/75 border-teal-500/20 text-slate-200 cursor-default focus:outline-none"
                  }`}
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                  DATE OF BIRTH
                </label>
                <input
                  type="text"
                  readOnly={!isEditing}
                  value={isEditing ? draft.dateOfBirth : profile.dateOfBirth}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  placeholder="MM/DD/YYYY"
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition ${
                    isEditing
                      ? "bg-[#07191c] border-teal-400 text-white focus:outline-none ring-2 ring-teal-500/20"
                      : "bg-[#07191c]/75 border-teal-500/20 text-slate-200 cursor-default focus:outline-none"
                  }`}
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                  BLOOD GROUP
                </label>
                <select
                  disabled={!isEditing}
                  value={isEditing ? draft.bloodGroup : profile.bloodGroup}
                  onChange={(e) => handleChange("bloodGroup", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition ${
                    isEditing
                      ? "bg-[#07191c] border-teal-400 text-white focus:outline-none ring-2 ring-teal-500/20 cursor-pointer"
                      : "bg-[#07191c]/75 border-teal-500/20 text-slate-200 cursor-default focus:outline-none appearance-none"
                  }`}
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg} className="bg-[#07191c] text-white">
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Emergency Contact */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                  EMERGENCY CONTACT
                </label>
                <input
                  type="text"
                  readOnly={!isEditing}
                  value={isEditing ? draft.emergencyContact : profile.emergencyContact}
                  onChange={(e) => handleChange("emergencyContact", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition ${
                    isEditing
                      ? "bg-[#07191c] border-teal-400 text-white focus:outline-none ring-2 ring-teal-500/20"
                      : "bg-[#07191c]/75 border-teal-500/20 text-slate-200 cursor-default focus:outline-none"
                  }`}
                />
              </div>

              {/* Residential Address (Full Width) */}
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-2">
                  RESIDENTIAL ADDRESS
                </label>
                <input
                  type="text"
                  readOnly={!isEditing}
                  value={isEditing ? draft.address : profile.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition ${
                    isEditing
                      ? "bg-[#07191c] border-teal-400 text-white focus:outline-none ring-2 ring-teal-500/20"
                      : "bg-[#07191c]/75 border-teal-500/20 text-slate-200 cursor-default focus:outline-none"
                  }`}
                />
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
