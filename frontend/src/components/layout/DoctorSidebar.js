
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./doctor-sidebar.css";

const doctorMenu = [
  {
    title: "Dashboard",
    path: "/doctor/dashboard",
    icon: "▦",
  },
  {
    title: "My Sessions",
    path: "/doctor/sessions",
    icon: "📅",
  },
  {
    title: "Patient List",
    path: "/doctor/patients",
    icon: "👥",
  },
  {
    title: "Consultations",
    path: "/doctor/consultations",
    icon: "🩺",
  },
  {
    title: "Online Consultations",
    path: "/doctor/online-consultations",
    icon: "💻",
  },
];

export default function DoctorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="doctor-sidebar">
      <div className="doctor-sidebar-brand">
        <div className="doctor-logo">M</div>
        <div>
          <h2>MediChannel</h2>
          <span>DOCTOR PANEL</span>
        </div>
      </div>

      <nav className="doctor-navigation">
        {doctorMenu.map((item) => {
          const active =
            pathname === item.path ||
            pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`doctor-nav-link ${active ? "active" : ""}`}
            >
              <span className="doctor-nav-icon">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="doctor-sidebar-footer">
        <Link href="/login" className="doctor-logout">
          <span>↪</span>
          Logout
        </Link>
        <p>© 2026 MediChannel</p>
      </div>
    </aside>
  );
}
