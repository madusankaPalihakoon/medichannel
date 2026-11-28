
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "./admin-sidebar.css";

const adminMenu = [
  {
    title: "Dashboard",
    path: "/admin/dashboard",
    icon: "▦",
  },
  {
    title: "User Management",
    path: "/admin/users",
    icon: "👥",
  },
  {
    title: "Audit Logs",
    path: "/admin/audit-logs",
    icon: "📋",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <div className="admin-logo">M</div>
        <div>
          <h2>MediChannel</h2>
          <span>ADMIN PANEL</span>
        </div>
      </div>

      <div className="admin-profile">
        <div className="admin-avatar">A</div>
        <div>
          <strong>Administrator</strong>
          <span>System Admin</span>
        </div>
      </div>

      <div className="admin-menu-heading">MAIN MENU</div>

      <nav className="admin-navigation">
        {adminMenu.map((item, index) => {
          const active = pathname === item.path;

          return (
            <Link
              key={index}
              href={item.path}
              className={`admin-nav-link ${active ? "active" : ""}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="admin-sidebar-footer">
        <Link href="/login" className="admin-logout">
          <span>↪</span>
          Logout
        </Link>
        <p>© 2026 MediChannel</p>
      </div>
    </aside>
  );
}
