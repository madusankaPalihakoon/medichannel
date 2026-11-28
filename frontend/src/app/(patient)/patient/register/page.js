"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function validateRegistrationForm(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "Enter at least 3 characters for your full name.";
  }

  if (!values.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = "Phone number is required.";
  } else if (!/^\+?[0-9\s-]{9,15}$/.test(values.phoneNumber.trim())) {
    errors.phoneNumber = "Enter a valid phone number (e.g., +94 77 123 4567).";
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = "Date of birth is required.";
  } else {
    const [year, month, day] = values.dateOfBirth.split("-").map(Number);
    const dobDate = new Date(year, month - 1, day);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (Number.isNaN(dobDate.getTime()) || dobDate >= todayStart) {
      errors.dateOfBirth = "Date of birth must be in the past.";
    }
  }

  if (!values.address.trim()) {
    errors.address = "Residential address is required.";
  } else if (values.address.trim().length < 5) {
    errors.address = "Please enter a complete street address and city.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(values.password)) {
    errors.password = "Include at least one letter and one number.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export default function PatientRegistrationPage() {
  const router = useRouter();

  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    bloodGroup: "O+",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field, value) => {
    const nextValues = { ...formValues, [field]: value };
    setFormValues(nextValues);
    setServerError("");

    if (touched[field] || (field === "password" && touched.confirmPassword)) {
      setFieldErrors(validateRegistrationForm(nextValues));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setFieldErrors(validateRegistrationForm(formValues));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    const allTouched = {
      fullName: true,
      email: true,
      phoneNumber: true,
      dateOfBirth: true,
      address: true,
      password: true,
      confirmPassword: true,
    };
    setTouched(allTouched);

    const errors = validateRegistrationForm(formValues);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      // Replace with your real backend API call if available:
      // const res = await fetch("/api/auth/register", { method: "POST", body: JSON.stringify(formValues) });
      const { confirmPassword, password, ...patientProfile } = formValues;
      localStorage.setItem("patientUser", JSON.stringify(patientProfile));
      router.push("/patient/portal");
    } catch (err) {
      setServerError("Unable to complete registration. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const errorCount = Object.keys(fieldErrors).filter((k) => touched[k]).length;

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
              href="/book"
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition"
            >
              <span></span>
              <span>Book Appointment</span>
            </Link>

            <Link
              href="/patient/login"
              className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition"
            >
              Login
            </Link>

            <Link
              href="/patient/register"
              className="bg-teal-600 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl shadow-sm transition"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Centered Registration Card */}
      <main className="flex-1 py-10 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden">
          {/* Top Switch Tabs */}
          <div className="grid grid-cols-2 border-b border-slate-200/80 bg-[#f8fafb]">
            <Link
              href="/patient/login"
              className="py-4 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 border-r border-slate-200/70 border-b-transparent text-[#64748b] hover:text-slate-800 hover:bg-slate-100/60 transition"
            >
              <svg
                className="w-4 h-4 shrink-0 text-[#64748b]"
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
            </Link>

            <div className="py-4 px-4 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border-b-2 border-[#0d9488] text-[#0f766e] bg-white">
              <svg
                className="w-4 h-4 shrink-0 text-[#0d9488]"
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
            </div>
          </div>

          {/* Registration Form Body */}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-extrabold text-slate-900">Create Patient Account</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Register once for seamless hospital channeling and digital health records.
            </p>

            {/* Validation / Server Summary Banner */}
            {(serverError || errorCount > 0) && (
              <div
                role="alert"
                className="mt-5 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3.5 text-xs text-rose-800"
              >
                <p className="font-bold text-rose-900">
                  {serverError
                    ? "Registration Error"
                    : `Please fix ${errorCount} validation ${
                        errorCount === 1 ? "issue" : "issues"
                      } below:`}
                </p>
                {serverError && <p className="mt-1 text-rose-700">{serverError}</p>}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              {/* FULL NAME * */}
              <div>
                <label
                  htmlFor="reg-full-name"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                >
                  FULL NAME *
                </label>
                <input
                  id="reg-full-name"
                  type="text"
                  value={formValues.fullName}
                  onBlur={() => handleBlur("fullName")}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="e.g., Dilshan Perera"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition ${
                    touched.fullName && fieldErrors.fullName
                      ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                      : "border-slate-200 focus:border-teal-600"
                  }`}
                />
                {touched.fullName && fieldErrors.fullName && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    • {fieldErrors.fullName}
                  </p>
                )}
              </div>

              {/* EMAIL * & PHONE NUMBER * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-email"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                  >
                    EMAIL *
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={formValues.email}
                    onBlur={() => handleBlur("email")}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="dilshan@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition ${
                      touched.email && fieldErrors.email
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                        : "border-slate-200 focus:border-teal-600"
                    }`}
                  />
                  {touched.email && fieldErrors.email && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      • {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-phone"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                  >
                    PHONE NUMBER *
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={formValues.phoneNumber}
                    onBlur={() => handleBlur("phoneNumber")}
                    onChange={(e) => handleChange("phoneNumber", e.target.value)}
                    placeholder="+94 77 123 4567"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition ${
                      touched.phoneNumber && fieldErrors.phoneNumber
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                        : "border-slate-200 focus:border-teal-600"
                    }`}
                  />
                  {touched.phoneNumber && fieldErrors.phoneNumber && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      • {fieldErrors.phoneNumber}
                    </p>
                  )}
                </div>
              </div>

              {/* DATE OF BIRTH * & BLOOD GROUP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-dob"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                  >
                    DATE OF BIRTH *
                  </label>
                  <input
                    id="reg-dob"
                    type="date"
                    value={formValues.dateOfBirth}
                    onBlur={() => handleBlur("dateOfBirth")}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-800 focus:outline-none transition ${
                      touched.dateOfBirth && fieldErrors.dateOfBirth
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                        : "border-slate-200 focus:border-teal-600"
                    }`}
                  />
                  {touched.dateOfBirth && fieldErrors.dateOfBirth && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      • {fieldErrors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-blood-group"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                  >
                    BLOOD GROUP
                  </label>
                  <select
                    id="reg-blood-group"
                    value={formValues.bloodGroup}
                    onChange={(e) => handleChange("bloodGroup", e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-teal-600 transition"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* ADDRESS * */}
              <div>
                <label
                  htmlFor="reg-address"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                >
                  ADDRESS *
                </label>
                <input
                  id="reg-address"
                  type="text"
                  value={formValues.address}
                  onBlur={() => handleBlur("address")}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Street address, City"
                  className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition ${
                    touched.address && fieldErrors.address
                      ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                      : "border-slate-200 focus:border-teal-600"
                  }`}
                />
                {touched.address && fieldErrors.address && (
                  <p className="mt-1 text-xs font-medium text-rose-600">
                    • {fieldErrors.address}
                  </p>
                )}
              </div>

              {/* PASSWORD * & CONFIRM PASSWORD * */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                  >
                    PASSWORD *
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    value={formValues.password}
                    onBlur={() => handleBlur("password")}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="Min. 8 characters"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition ${
                      touched.password && fieldErrors.password
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                        : "border-slate-200 focus:border-teal-600"
                    }`}
                  />
                  {touched.password && fieldErrors.password && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      • {fieldErrors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-confirm-password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5"
                  >
                    CONFIRM PASSWORD *
                  </label>
                  <input
                    id="reg-confirm-password"
                    type="password"
                    value={formValues.confirmPassword}
                    onBlur={() => handleBlur("confirmPassword")}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="Re-enter password"
                    className={`w-full px-4 py-2.5 rounded-xl border bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition ${
                      touched.confirmPassword && fieldErrors.confirmPassword
                        ? "border-rose-400 bg-rose-50/30 focus:border-rose-500"
                        : "border-slate-200 focus:border-teal-600"
                    }`}
                  />
                  {touched.confirmPassword && fieldErrors.confirmPassword && (
                    <p className="mt-1 text-xs font-medium text-rose-600">
                      • {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-3 bg-[#10997e] hover:bg-teal-700 disabled:opacity-60 text-white font-semibold text-sm py-3.5 rounded-xl shadow-sm transition cursor-pointer"
              >
                {submitting ? "Creating Account..." : "Complete Registration"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
