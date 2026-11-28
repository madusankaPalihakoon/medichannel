
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./manager-sidebar.css";

const managerMenu = [
  {
    title: "Dashboard",
    path: "/manager/dashboard",
    icon: "▦",
  },
  {
    title: "Manage Doctors",
    path: "/manager/doctors",
    icon: "👨‍⚕️",
  },
  {
    title: "Specialisations",
    path: "/manager/specialisations",
    icon: "🩺",
  },
  {
    title: "Manage Rooms",
    path: "/manager/rooms",
    icon: "🏥",
  },
  {
    title: "Manage Sessions",
    path: "/manager/sessions",
    icon: "📅",
  },
  {
    title: "Reception",
    path: "/manager/reception",
    icon: "🛎️",
  },
  {
    title: "Payments",
    path: "/manager/payments",
    icon: "💳",
  },
  {
    title: "Walk-ins",
    path: "/manager/walk-in",
    icon: "🚶",
  },
  {
    title: "Notices",
    path: "/manager/notices",
    icon: "📢",
  },
  {
    title: "Reports",
    path: "/manager/reports",
    icon: "📊",
  },
];

export default function ManagerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="manager-sidebar">
      <div className="manager-sidebar-brand">
        <div className="manager-logo">M</div>
        <div>
          <h2>MediChannel</h2>
          <span>MANAGER PANEL</span>
        </div>
      </div>

      <nav className="manager-navigation">
        {managerMenu.map((item) => {
          const active =
            pathname === item.path ||
            pathname.startsWith(item.path + "/");

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`manager-nav-link ${active ? "active" : ""}`}
            >
              <span className="manager-nav-icon">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="manager-sidebar-footer">
        <Link href="/login" className="manager-logout">
          <span>↪</span>
          Logout
        </Link>
        <p>© 2026 MediChannel</p>
      </div>
    </aside>
  );
}
