"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

const PORTAL_TABS = [
  { label: "Overview", href: "/patient/overview", icon: "" },
  { label: "Appointments & History (4)", href: "/patient/appointments/appointments_history", icon: "" },
  { label: "Live Queue Tracker", href: "/patient/queue", icon: "" },
  { label: "My Profile", href: "/patient/profile", icon: "" },
  { label: "Feedback & Alerts", href: "/patient/feedback", icon: "" },
];

const INITIAL_SERVING = 9;
const YOUR_TOKEN = 12;
const AVG_MINS_PER_PATIENT = 12;
const WS_URL = process.env.NEXT_PUBLIC_QUEUE_WS_URL || "";

function formatToken(num) {
  return `#${String(num).padStart(2, "0")}`;
}

function formatEstimatedSlot(waitMinutes) {
  const target = new Date(Date.now() + waitMinutes * 60 * 1000);
  return target.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatTimeStamp(date = new Date()) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function LiveQueueTrackerPage() {
  const [servingNumber, setServingNumber] = useState(INITIAL_SERVING);
  const [wsConnected, setWsConnected] = useState(true);
  const [wsMode, setWsMode] = useState(WS_URL ? "live-socket" : "simulated-stream");
  const [autoStream, setAutoStream] = useState(false);
  const [lastSync, setLastSync] = useState("Just now");

  const socketRef = useRef(null);

  const patientsAhead = Math.max(0, YOUR_TOKEN - servingNumber);
  const estWaitingMins = patientsAhead * AVG_MINS_PER_PATIENT;
  const isYourTurn = servingNumber >= YOUR_TOKEN;
  const progressPercent = Math.min(
    100,
    Math.round((servingNumber / YOUR_TOKEN) * 100)
  );

  const advanceQueue = useCallback(() => {
    setServingNumber((prev) => (prev >= YOUR_TOKEN ? INITIAL_SERVING : prev + 1));
    setLastSync(formatTimeStamp());
  }, []);

  const resetQueue = () => {
    setServingNumber(INITIAL_SERVING);
    setLastSync(formatTimeStamp());
  };

  // Connect to real WebSocket server when NEXT_PUBLIC_QUEUE_WS_URL is set
  useEffect(() => {
    if (!wsConnected || !WS_URL) {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    setWsMode("live-socket");
    const ws = new WebSocket(WS_URL);
    socketRef.current = ws;

    ws.onopen = () => {
      setLastSync(formatTimeStamp());
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (typeof payload.servingNumber === "number") {
          setServingNumber(payload.servingNumber);
          setLastSync(formatTimeStamp());
        }
      } catch {
        const parsed = Number(event.data);
        if (!Number.isNaN(parsed)) {
          setServingNumber(parsed);
          setLastSync(formatTimeStamp());
        }
      }
    };

    ws.onclose = () => {
      setWsMode("simulated-stream");
    };

    return () => {
      ws.close();
    };
  }, [wsConnected]);

  // Auto-stream simulation when enabled
  useEffect(() => {
    if (!wsConnected || !autoStream) return;
    const timer = setInterval(() => {
      advanceQueue();
    }, 4000);
    return () => clearInterval(timer);
  }, [wsConnected, autoStream, advanceQueue]);

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
                NovaCare
              </span>
              <span className="block text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                Medical Center
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
              href="/portal"
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
              const isCurrent = tab.label === "Live Queue Tracker";
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

          {/* WebSocket Connection & Simulation Control Bar */}
          <div className="bg-[#0d2226]/95 rounded-2xl border border-teal-500/20 shadow-lg px-4 sm:px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  wsConnected
                    ? "bg-emerald-950/70 text-emerald-300 border-emerald-500/30"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    wsConnected ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
                  }`}
                />
                {wsConnected
                  ? wsMode === "live-socket"
                    ? "Live WebSocket Connected"
                    : "WebSocket Stream Ready (Simulated)"
                  : "WebSocket Disconnected"}
              </span>

              <span className="text-xs text-slate-400">Last sync: {lastSync}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setWsConnected((prev) => {
                    const next = !prev;
                    if (!next) setAutoStream(false);
                    return next;
                  });
                }}
                className="border border-teal-500/25 bg-[#07191c]/80 hover:bg-[#133338] text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                {wsConnected ? "Disconnect WS" : "Connect WS"}
              </button>

              <button
                type="button"
                disabled={!wsConnected}
                onClick={() => setAutoStream((prev) => !prev)}
                className={`border text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer disabled:opacity-40 ${
                  autoStream
                    ? "bg-teal-950/80 border-teal-400/50 text-teal-300"
                    : "border-teal-500/25 bg-[#07191c]/80 hover:bg-[#133338] text-slate-200"
                }`}
              >
                {autoStream ? "Pause Auto-Stream" : "Enable Auto-Stream"}
              </button>

              <button
                type="button"
                onClick={resetQueue}
                className="border border-teal-500/25 bg-[#07191c]/80 hover:bg-[#133338] text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={advanceQueue}
                className="inline-flex items-center gap-1.5 bg-[#0d9488] hover:bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition cursor-pointer"
              >
                <span>↻</span>
                <span>Simulate Next Patient</span>
              </button>
            </div>
          </div>

          {/* Dark Live Outpatient Queue Monitor Card */}
          <div className="bg-[#10272b]/95 text-white rounded-3xl border border-teal-500/25 shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Monitor Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-teal-400">
                  LIVE OUTPATIENT QUEUE MONITOR
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Dr. Ananya Perera — Cardiology
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  Suite 204, Wing A • Session: 2026-11-19 (09:00 AM - 12:00 PM)
                </p>
              </div>

              <span className="inline-block self-start bg-[#07191c]/90 border border-teal-500/25 text-teal-200 text-xs font-semibold px-3.5 py-1.5 rounded-xl">
                Ref: REF-8841-NC
              </span>
            </div>

            {isYourTurn && (
              <div className="bg-emerald-950/80 border border-emerald-400/40 text-emerald-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold">
                Your token ({formatToken(YOUR_TOKEN)}) is now being called. Please proceed to Suite 204, Wing A.
              </div>
            )}

            {/* 4 Queue Status Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Current Serving */}
              <div className="bg-[#07191c]/85 border border-teal-500/20 rounded-2xl p-5 text-center flex flex-col justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  CURRENT SERVING NUMBER
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white my-3">
                  {formatToken(servingNumber)}
                </div>
                <div className="text-xs text-slate-300">Inside Consultation Room</div>
              </div>

              {/* Your Appointment Number */}
              <div className="bg-[#07191c]/85 border border-emerald-500/35 rounded-2xl p-5 text-center flex flex-col justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  YOUR APPOINTMENT NUMBER
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white my-3">
                  {formatToken(YOUR_TOKEN)}
                </div>
                <div className="text-xs font-semibold text-emerald-400">
                  {isYourTurn ? "Now Serving" : "Active Token"}
                </div>
              </div>

              {/* Patients Ahead */}
              <div className="bg-[#07191c]/85 border border-teal-500/20 rounded-2xl p-5 text-center flex flex-col justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  PATIENTS AHEAD
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white my-3">
                  {patientsAhead}
                </div>
                <div className="text-xs text-slate-300">
                  {patientsAhead === 0 ? "You are next" : "Before your turn"}
                </div>
              </div>

              {/* Estimated Waiting Time */}
              <div className="bg-[#07191c]/85 border border-teal-500/20 rounded-2xl p-5 text-center flex flex-col justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  EST. WAITING TIME
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white my-3">
                  {estWaitingMins}
                  <span className="text-xl font-bold text-slate-300 ml-0.5">m</span>
                </div>
                <div className="text-xs text-slate-300">
                  Est. Slot: {formatEstimatedSlot(estWaitingMins)}
                </div>
              </div>
            </div>

            {/* Queue Progress Bar */}
            <div className="bg-[#07191c]/85 border border-teal-500/20 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs font-semibold mb-2.5">
                <span className="text-slate-200">
                  Queue Progress to Token {formatToken(YOUR_TOKEN)}
                </span>
                <span className="text-emerald-400 font-bold">{progressPercent}%</span>
              </div>

              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
