/*"use client";

import { useState } from "react";
import "./sessions.css";

const initialSessions = [
  {
    id: 1,
    token: "P001",
    patient: "Kamal Perera",
    time: "09:00 AM",
    status: "Waiting"
  },
  {
    id: 2,
    token: "P002",
    patient: "Nimali Silva",
    time: "09:30 AM",
    status: "Waiting"
  },
  {
    id: 3,
    token: "P003",
    patient: "Amal Fernando",
    time: "10:00 AM",
    status: "Waiting"
  },
  {
    id: 4,
    token: "P004",
    patient: "Sanduni Perera",
    time: "10:30 AM",
    status: "Waiting"
  }
];

export default function DoctorSessionsPage() {
  const [sessions, setSessions] = useState(initialSessions);
  const [message, setMessage] = useState("");

  const callNextPatient = () => {
    const nextPatient = sessions.find(
      (session) => session.status === "Waiting"
    );

    if (!nextPatient) {
      setMessage("No waiting patients available.");
      return;
    }

    setSessions((previous) =>
      previous.map((session) =>
        session.id === nextPatient.id
          ? { ...session, status: "Called" }
          : session
      )
    );

    setMessage(`${nextPatient.patient} has been called.`);
  };

  const updateStatus = (id, newStatus) => {
    const patient = sessions.find((session) => session.id === id);

    setSessions((previous) =>
      previous.map((session) =>
        session.id === id
          ? { ...session, status: newStatus }
          : session
      )
    );

    setMessage(`${patient.patient}: ${newStatus}`);
  };

  const waitingCount = sessions.filter(
    (session) => session.status === "Waiting"
  ).length;

  const completedCount = sessions.filter(
    (session) => session.status === "Completed"
  ).length;

  const activeSession = sessions.find(
    (session) => session.status === "In Progress"
  );

  return (
    <main className="sessions-page">
      <header className="sessions-header">
        <div>
          <p className="sessions-label">MEDICHANNEL / DOCTOR</p>
          <h1>Session Management</h1>
          <p>Manage your daily patient appointments and sessions.</p>
        </div>

        <a href="/doctor/dashboard" className="sessions-back-button">
          Back to Dashboard
        </a>
      </header>

      <section className="session-summary">
        <div className="session-stat">
          <span>Total Sessions</span>
          <h2>{sessions.length}</h2>
        </div>

        <div className="session-stat">
          <span>Waiting Patients</span>
          <h2>{waitingCount}</h2>
        </div>

        <div className="session-stat">
          <span>Completed Sessions</span>
          <h2>{completedCount}</h2>
        </div>

        <div className="session-stat">
          <span>Active Session</span>
          <h2>{activeSession ? "01" : "00"}</h2>
        </div>
      </section>

      <section className="next-patient-section">
        <div>
          <h2>Patient Queue</h2>
          <p>Call the next patient when you are ready.</p>
        </div>

        <button
          className="call-next-button"
          onClick={callNextPatient}
          disabled={waitingCount === 0 || Boolean(activeSession)}
        >
          Call Next Patient
        </button>
      </section>

      {message && (
        <div className="session-message">
          {message}
        </div>
      )}

      {activeSession && (
        <section className="active-session-card">
          <div>
            <span className="active-label">CURRENT ACTIVE SESSION</span>
            <h2>{activeSession.patient}</h2>
            <p>Patient ID: {activeSession.token}</p>
          </div>

          <button
            className="complete-button"
            onClick={() =>
              updateStatus(activeSession.id, "Completed")
            }
          >
            End Session
          </button>
        </section>
      )}

      <section className="sessions-table-section">
        <div className="sessions-section-heading">
          <div>
            <h2>Today's Appointments</h2>
            <p>Patient queue and session status</p>
          </div>
        </div>

        <div className="sessions-table-wrapper">
          <table className="sessions-table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Name</th>
                <th>Appointment Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.token}</td>
                  <td>{session.patient}</td>
                  <td>{session.time}</td>
                  <td>
                    <span
                      className={`session-status ${session.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {session.status}
                    </span>
                  </td>

                  <td>
                    <div className="session-actions">
                      {session.status === "Called" && (
                        <button
                          className="start-button"
                          disabled={Boolean(activeSession)}
                          onClick={() =>
                            updateStatus(session.id, "In Progress")
                          }
                        >
                          Start Session
                        </button>
                      )}

                      {(session.status === "Waiting" ||
                        session.status === "Called") && (
                        <button
                          className="noshow-button"
                          onClick={() =>
                            updateStatus(session.id, "No-show")
                          }
                        >
                          No-show
                        </button>
                      )}

                      {session.status === "In Progress" && (
                        <button
                          className="complete-button"
                          onClick={() =>
                            updateStatus(session.id, "Completed")
                          }
                        >
                          End Session
                        </button>
                      )}

                      {session.status === "Completed" && (
                        <span className="finished-text">
                          Finished
                        </span>
                      )}

                      {session.status === "No-show" && (
                        <span className="finished-text">
                          No-show recorded
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}*/


"use client";

import { useState } from "react";
import "./sessions.css";

const initialSessions = [
  {
    id: 1,
    token: "P001",
    patient: "Kamal Perera",
    time: "09:00 AM",
    status: "Waiting"
  },
  {
    id: 2,
    token: "P002",
    patient: "Nimali Silva",
    time: "09:30 AM",
    status: "Waiting"
  },
  {
    id: 3,
    token: "P003",
    patient: "Amal Fernando",
    time: "10:00 AM",
    status: "Waiting"
  },
  {
    id: 4,
    token: "P004",
    patient: "Sanduni Perera",
    time: "10:30 AM",
    status: "Waiting"
  }
];

export default function DoctorSessionsPage() {
  const [sessions, setSessions] = useState(initialSessions);
  const [message, setMessage] = useState("");

  const waitingCount = sessions.filter(
    (session) => session.status === "Waiting"
  ).length;

  const completedCount = sessions.filter(
    (session) => session.status === "Completed"
  ).length;

  const activeSession = sessions.find(
    (session) => session.status === "In Progress"
  );

  const updateStatus = (id, newStatus) => {
    const patient = sessions.find(
      (session) => session.id === id
    );

    if (!patient) return;

    if (
      newStatus === "In Progress" &&
      activeSession &&
      activeSession.id !== id
    ) {
      setMessage("Please end the current active session first.");
      return;
    }

    setSessions((previous) =>
      previous.map((session) =>
        session.id === id
          ? { ...session, status: newStatus }
          : session
      )
    );

    setMessage(`${patient.patient}: ${newStatus}`);
  };

  return (
    <main className="sessions-page">

      {/* Header */}
      <header className="sessions-header">
        <div>
          <p className="sessions-label">
            MEDICHANNEL / DOCTOR
          </p>

          <h1>Session Management</h1>

          <p>
            Manage your daily patient appointments and sessions.
          </p>
        </div>

        <a
          href="/doctor/dashboard"
          className="sessions-back-button"
        >
          Back to Dashboard
        </a>
      </header>

      {/* Summary Cards */}
      <section className="session-summary">

        <div className="session-stat">
          <span>Total Sessions</span>
          <h2>{sessions.length}</h2>
        </div>

        <div className="session-stat">
          <span>Waiting Patients</span>
          <h2>{waitingCount}</h2>
        </div>

        <div className="session-stat">
          <span>Completed Sessions</span>
          <h2>{completedCount}</h2>
        </div>

        <div className="session-stat">
          <span>Active Session</span>
          <h2>{activeSession ? "01" : "00"}</h2>
        </div>

      </section>

      {/* Message */}
      {message && (
        <div className="session-message">
          {message}
        </div>
      )}

      {/* Active Session */}
      {activeSession && (
        <section className="active-session-card">

          <div>
            <span className="active-label">
              CURRENT ACTIVE SESSION
            </span>

            <h2>{activeSession.patient}</h2>

            <p>
              Patient ID: {activeSession.token}
            </p>
          </div>

          <button
            className="complete-button"
            onClick={() =>
              updateStatus(activeSession.id, "Completed")
            }
          >
            End Session
          </button>

        </section>
      )}

      {/* Appointments Table */}
      <section className="sessions-table-section">

        <div className="sessions-section-heading">
          <div>
            <h2>Today's Appointments</h2>

            <p>
              View patient appointments and manage session status.
            </p>
          </div>
        </div>

        <div className="sessions-table-wrapper">

          <table className="sessions-table">

            <thead>
              <tr>
                <th>Token</th>
                <th>Patient Name</th>
                <th>Appointment Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {sessions.map((session) => (

                <tr key={session.id}>

                  <td>{session.token}</td>

                  <td>{session.patient}</td>

                  <td>{session.time}</td>

                  <td>
                    <span
                      className={`session-status ${session.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {session.status}
                    </span>
                  </td>

                  <td>
                    <div className="session-actions">

                      {session.status === "Waiting" && (
                        <>
                          <button
                            className="start-button"
                            disabled={
                              Boolean(activeSession)
                            }
                            onClick={() =>
                              updateStatus(
                                session.id,
                                "In Progress"
                              )
                            }
                          >
                            Start Session
                          </button>

                          <button
                            className="noshow-button"
                            onClick={() =>
                              updateStatus(
                                session.id,
                                "No-show"
                              )
                            }
                          >
                            No-show
                          </button>
                        </>
                      )}

                      {session.status === "In Progress" && (
                        <button
                          className="complete-button"
                          onClick={() =>
                            updateStatus(
                              session.id,
                              "Completed"
                            )
                          }
                        >
                          End Session
                        </button>
                      )}

                      {session.status === "Completed" && (
                        <span className="finished-text">
                          Finished
                        </span>
                      )}

                      {session.status === "No-show" && (
                        <span className="finished-text">
                          No-show recorded
                        </span>
                      )}

                    </div>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </main>
  );
}

