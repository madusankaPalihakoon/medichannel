"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function validateLoginForm({ email, password }) {
  const errors = {};

  if (!email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address (e.g., kasun.d@example.com).";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  return errors;
}

export default function PatientLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("ashi@example.com");
  const [password, setPassword] = useState("Password@123");
  const [showPassword, setShowPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  // Hidden initially; only shows when email/password validation or login fails
  const [authError, setAuthError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const errorMessage =
    "Invalid email or password. Please check your credentials or use the Demo Patient Login below.";

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldErrors(validateLoginForm({ email, password }));
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setAuthError("");
    if (touched.email) {
      setFieldErrors(validateLoginForm({ email: value, password }));
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    setAuthError("");
    if (touched.password) {
      setFieldErrors(validateLoginForm({ email, password: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");

    const errors = validateLoginForm({ email, password });
    setTouched({ email: true, password: true });
    setFieldErrors(errors);

    // Show the top error banner if email/password format is invalid
    if (Object.keys(errors).length > 0) {
      setAuthError(errorMessage);
      return;
    }

    setSubmitting(true);
    try {
      // Replace with your real backend API endpoint if available:
      // const res = await fetch("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      if (email === "ashi@example.com" && password === "Password@123") {
        localStorage.setItem(
          "patientUser",
          JSON.stringify({ name: "Ashi Dissanayake", email })
        );
        router.push("/patient/dashboard");
      } else {
        // Show the top error banner if credentials don't match
        setAuthError(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setAuthError("");
    setFieldErrors({});
    setSubmitting(true);
    localStorage.setItem(
      "patientUser",
      JSON.stringify({ name: "Ashi Dissanayake", email: "ashi@example.com" })
    );
    setSubmitting(false);
    router.push("/patient/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f4f7f8] text-slate-900 flex flex-col">
      {/* Top White Navigation Bar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
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

          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/patient/appointments/book_appointment"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition"
            >
              <span>Book Appointment</span>
            </Link>

            <Link
              href="/patient/login"
              className="border border-teal-600 bg-teal-50 text-teal-800 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition"
            >
              Login
            </Link>

            <Link
              href="/patient/register"
              className="bg-[#0e1b26] hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-sm transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Centered Auth Card */}
      <main className="flex-1 py-12 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
          {/* Top Switch Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200/80 bg-slate-50/40">
            <div className="py-4 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 border-teal-600 text-teal-700 bg-white">
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
                  d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                />
              </svg>
              <span>Patient Login</span>
            </div>

            <Link
              href="/patient/register"
              className="py-4 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition"
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
                  d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm10-3v6m3-3h-6"
                />
              </svg>
              <span>New Patient Registration</span>
            </Link>
          </div>

          {/* Login Body */}
          <div className="p-6 sm:p-8">
            <h1 className="text-[28px] sm:text-[32px] font-extrabold tracking-tight text-slate-900 leading-tight">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-[15px] text-slate-500 mt-1.5 leading-relaxed">
              Sign in to manage appointments, track live queues, and join online consultations.
            </p>

            {/* Authentication Error Banner (Hidden until an error occurs) */}
            {authError && (
              <div
                role="alert"
                className="mt-6 rounded-xl bg-[#fdf2f4] border border-[#f8d7dc] px-4 py-3.5 flex items-center gap-3 text-[#c81e4b]"
              >
                <svg
                  className="w-5 h-5 shrink-0 text-[#d11f4e]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                </svg>
                <p className="text-[13px] sm:text-sm font-medium leading-snug">
                  {authError}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              {/* EMAIL ADDRESS */}
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2"
                >
                  EMAIL ADDRESS
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onBlur={() => handleBlur("email")}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="ashi@example.com"
                  aria-invalid={Boolean(touched.email && fieldErrors.email)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-slate-800 focus:outline-none transition ${
                    touched.email && fieldErrors.email
                      ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                      : "border-slate-200 focus:border-teal-600"
                  }`}
                />
                {touched.email && fieldErrors.email && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
                    <span>•</span>
                    <span>{fieldErrors.email}</span>
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="login-password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-500"
                  >
                    PASSWORD
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[11px] font-semibold text-teal-700 hover:underline cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onBlur={() => handleBlur("password")}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter your password"
                  aria-invalid={Boolean(touched.password && fieldErrors.password)}
                  className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-slate-800 focus:outline-none transition ${
                    touched.password && fieldErrors.password
                      ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                      : "border-slate-200 focus:border-teal-600"
                  }`}
                />
                {touched.password && fieldErrors.password && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1">
                    <span>•</span>
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#10997e] hover:bg-teal-700 disabled:opacity-60 text-white font-semibold text-sm py-3.5 rounded-xl shadow-sm transition cursor-pointer"
              >
                {submitting ? "Signing In..." : "Sign In to Patient Portal"}
              </button>
            </form>

            {/* Demo Login Footer */}
            <div className="mt-7 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="text-slate-400">Testing the portal?</span>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={submitting}
                className="font-semibold text-teal-700 hover:underline text-left sm:text-right cursor-pointer"
              >
                One-Click Demo Patient Login (Ashi Dissanayake)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}