
"use client";

import { useState } from "react";
import "./audit-logs.css";

const initialLogs = [
  {
    id: 1,
    user: "Admin",
    action: "Created Staff Account",
    details: "Created Doctor account for Dr. Nimal Perera",
    date: "2026-11-17",
    time: "09:15 AM",
    status: "Success",
  },
  {
    id: 2,
    user: "Admin",
    action: "Account Deactivated",
    details: "Deactivated Manager account - Saman Silva",
    date: "2026-11-17",
    time: "10:30 AM",
    status: "Success",
  },
  {
    id: 3,
    user: "Admin",
    action: "Password Reset Requested",
    details: "Password reset requested for Amal Fernando",
    date: "2026-11-17",
    time: "11:45 AM",
    status: "Pending",
  },
  {
    id: 4,
    user: "Dr. Nimal Perera",
    action: "Login",
    details: "Doctor logged into the system",
    date: "2026-11-16",
    time: "08:30 AM",
    status: "Success",
  },
  {
    id: 5,
    user: "Saman Silva",
    action: "Login Failed",
    details: "Incorrect login credentials",
    date: "2026-11-16",
    time: "09:20 AM",
    status: "Failed",
  },
  {
    id: 6,
    user: "Admin",
    action: "Account Activated",
    details: "Activated Doctor account - Amal Fernando",
    date: "2026-11-15",
    time: "02:10 PM",
    status: "Success",
  },
];

export default function AuditLogsPage() {
  const [logs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || log.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="audit-page">
      <header className="audit-header">
        <div>
          <p className="audit-brand">MEDICHANNEL / ADMIN</p>
          <h1>Audit Logs</h1>
          <p>Monitor and review administrative activities.</p>
        </div>

        <a href="/admin/dashboard" className="audit-back">
          Back to Dashboard
        </a>
      </header>

      <section className="audit-summary">
        <div className="audit-card">
          <span>Total Activities</span>
          <h2>{logs.length}</h2>
        </div>

        <div className="audit-card">
          <span>Successful Activities</span>
          <h2>{logs.filter((log) => log.status === "Success").length}</h2>
        </div>

        <div className="audit-card">
          <span>Failed Activities</span>
          <h2>{logs.filter((log) => log.status === "Failed").length}</h2>
        </div>

        <div className="audit-card">
          <span>Pending Activities</span>
          <h2>{logs.filter((log) => log.status === "Pending").length}</h2>
        </div>
      </section>

      <section className="audit-list-section">
        <h2>Activity Records</h2>

        <div className="audit-controls">
          <input
            type="text"
            placeholder="Search user or activity..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="All">All Activities</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="audit-table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Details</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.user}</td>
                    <td>{log.action}</td>
                    <td>{log.details}</td>
                    <td>{log.date}</td>
                    <td>{log.time}</td>
                    <td>
                      <span
                        className={`audit-status ${log.status.toLowerCase()}`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="audit-empty">
                    No activity records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
