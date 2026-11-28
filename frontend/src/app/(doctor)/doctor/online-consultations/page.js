
"use client";

import { useState } from "react";
import "./online-consultations.css";

const initialPatients = [
  {
    id: 1,
    appointmentId: "MC-2026-101",
    name: "Nimal Perera",
    age: 35,
    gender: "Male",
    date: "2026-11-23",
    time: "09:30 AM",
    type: "Online",
    status: "Waiting",
    reason: "Fever and headache",
  },
  {
    id: 2,
    appointmentId: "MC-2026-102",
    name: "Kamal Silva",
    age: 42,
    gender: "Male",
    date: "2026-11-23",
    time: "10:00 AM",
    type: "Online",
    status: "Ongoing",
    reason: "Blood pressure follow-up",
  },
  {
    id: 3,
    appointmentId: "MC-2026-103",
    name: "Amali Fernando",
    age: 28,
    gender: "Female",
    date: "2026-11-23",
    time: "10:30 AM",
    type: "Online",
    status: "Completed",
    reason: "Skin allergy consultation",
  },
];

export default function OnlineConsultationsPage() {
  const [patients, setPatients] = useState(initialPatients);
  const [selectedPatient, setSelectedPatient] = useState(initialPatients[1]);
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "Patient",
      text: "Hello Doctor, I am ready for the consultation.",
    },
    {
      sender: "Doctor",
      text: "Hello! Please tell me about your symptoms.",
    },
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const updateStatus = (patientId, newStatus) => {
    setPatients((current) =>
      current.map((patient) =>
        patient.id === patientId
          ? { ...patient, status: newStatus }
          : patient
      )
    );

    setSelectedPatient((current) =>
      current && current.id === patientId
        ? { ...current, status: newStatus }
        : current
    );
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setNotes("");
    setDiagnosis("");
    setPrescription("");
    setMessages([]);
    setSavedMessage("");
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!messageInput.trim()) return;

    setMessages((current) => [
      ...current,
      { sender: "Doctor", text: messageInput.trim() },
    ]);

    setMessageInput("");
  };

  const saveConsultation = (e) => {
    e.preventDefault();

    if (!selectedPatient) return;

    setSavedMessage(
      "Consultation details saved in this demo session."
    );
  };

  const filteredPatients = patients.filter((patient) =>
    `${patient.name} ${patient.appointmentId}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const waitingCount = patients.filter(
    (p) => p.status === "Waiting"
  ).length;

  const ongoingCount = patients.filter(
    (p) => p.status === "Ongoing"
  ).length;

  const completedCount = patients.filter(
    (p) => p.status === "Completed"
  ).length;

  return (
    <main className="online-page">
      <div className="online-header">
        <div>
          <p className="online-breadcrumb">DOCTOR / ONLINE CONSULTATIONS</p>
          <h1>Online Consultations</h1>
          <p className="online-subtitle">
            Manage and conduct your online patient consultations.
          </p>
        </div>

        <div className="online-date">
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      <section className="online-stats">
        <div className="online-stat-card">
          <span>Total Patients</span>
          <strong>{patients.length}</strong>
        </div>

        <div className="online-stat-card waiting-stat">
          <span>Waiting</span>
          <strong>{waitingCount}</strong>
        </div>

        <div className="online-stat-card ongoing-stat">
          <span>Ongoing</span>
          <strong>{ongoingCount}</strong>
        </div>

        <div className="online-stat-card completed-stat">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>
      </section>

      <section className="online-workspace">
        <div className="online-patient-panel">
          <div className="panel-heading">
            <div>
              <h2>Patient List</h2>
              <p>Online appointments</p>
            </div>
            <span className="patient-count">{patients.length}</span>
          </div>

          <input
            className="patient-search"
            type="text"
            placeholder="Search patient or appointment ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="patient-list">
            {filteredPatients.map((patient) => (
              <button
                type="button"
                key={patient.id}
                className={`patient-item ${
                  selectedPatient?.id === patient.id ? "selected" : ""
                }`}
                onClick={() => selectPatient(patient)}
              >
                <div className="patient-item-top">
                  <div className="patient-avatar">
                    {patient.name.charAt(0)}
                  </div>

                  <div className="patient-item-info">
                    <strong>{patient.name}</strong>
                    <small>{patient.appointmentId}</small>
                  </div>
                </div>

                <div className="patient-item-bottom">
                  <span>{patient.time}</span>
                  <span className={`status-badge ${patient.status.toLowerCase()}`}>
                    {patient.status}
                  </span>
                </div>
              </button>
            ))}

            {filteredPatients.length === 0 && (
              <p className="empty-patients">No patients found.</p>
            )}
          </div>
        </div>

        <div className="online-main-panel">
          {!selectedPatient ? (
            <div className="no-patient">
              <h2>Select a Patient</h2>
              <p>Choose a patient from the list to view consultation details.</p>
            </div>
          ) : (
            <>
              <div className="selected-patient-header">
                <div>
                  <span className="section-label">PATIENT DETAILS</span>
                  <h2>{selectedPatient.name}</h2>
                  <p>
                    {selectedPatient.appointmentId} · {selectedPatient.age} years ·{" "}
                    {selectedPatient.gender}
                  </p>
                </div>

                <span
                  className={`status-badge large-status ${selectedPatient.status.toLowerCase()}`}
                >
                  {selectedPatient.status}
                </span>
              </div>

              <div className="appointment-details">
                <div>
                  <span>Appointment Date</span>
                  <strong>{selectedPatient.date}</strong>
                </div>

                <div>
                  <span>Appointment Time</span>
                  <strong>{selectedPatient.time}</strong>
                </div>

                <div>
                  <span>Consultation Type</span>
                  <strong>{selectedPatient.type}</strong>
                </div>

                <div>
                  <span>Reason for Visit</span>
                  <strong>{selectedPatient.reason}</strong>
                </div>
              </div>

              <div className="consultation-actions">
                {selectedPatient.status === "Waiting" && (
                  <button
                    className="start-btn"
                    onClick={() =>
                      updateStatus(selectedPatient.id, "Ongoing")
                    }
                  >
                    Start Consultation
                  </button>
                )}

                {selectedPatient.status === "Ongoing" && (
                  <button
                    className="end-btn"
                    onClick={() =>
                      updateStatus(selectedPatient.id, "Completed")
                    }
                  >
                    End Consultation
                  </button>
                )}

                {selectedPatient.status === "Completed" && (
                  <span className="completed-message">
                    Consultation completed
                  </span>
                )}
              </div>

              <div className="online-video-panel">
                <div className="video-icon">▣</div>
                <h3>Online Video Consultation</h3>
                <p>
                  Video calling is not connected yet. A video meeting
                  service must be integrated to conduct live video calls.
                </p>
                <span className="video-pending">Video integration pending</span>
              </div>

              <div className="consultation-grid">
                <div className="consultation-card">
                  <h3>Patient Chat</h3>
                  <p className="card-description">
                    Communicate with the selected patient.
                  </p>

                  <div className="chat-messages">
                    {messages.length === 0 && (
                      <p className="chat-empty">
                        No messages yet. Start the conversation.
                      </p>
                    )}

                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`chat-message ${
                          message.sender === "Doctor" ? "doctor-message" : ""
                        }`}
                      >
                        <small>{message.sender}</small>
                        <p>{message.text}</p>
                      </div>
                    ))}
                  </div>

                  <form className="chat-form" onSubmit={sendMessage}>
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button type="submit">Send</button>
                  </form>
                </div>

                <form
                  className="consultation-card medical-form"
                  onSubmit={saveConsultation}
                >
                  <h3>Medical Notes</h3>
                  <p className="card-description">
                    Record consultation information.
                  </p>

                  <label>Diagnosis</label>
                  <textarea
                    placeholder="Enter diagnosis..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />

                  <label>Consultation Notes</label>
                  <textarea
                    placeholder="Enter medical notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />

                  <label>Prescription</label>
                  <textarea
                    placeholder="Enter prescription details..."
                    value={prescription}
                    onChange={(e) => setPrescription(e.target.value)}
                  />

                  <button
                    className="save-btn"
                    type="submit"
                    disabled={selectedPatient.status !== "Ongoing"}
                  >
                    Save Consultation
                  </button>

                  {selectedPatient.status !== "Ongoing" && (
                    <small className="form-hint">
                      Start the consultation before saving medical details.
                    </small>
                  )}

                  {savedMessage && (
                    <p className="save-message">{savedMessage}</p>
                  )}
                </form>
              </div>
            </>
          )}
        </div>
      </section>

      <p className="online-demo-note">
        Demo version: Patient details, chat messages and consultation notes
        are temporary sample data. Database and real-time video/chat
        integration are still required.
      </p>
    </main>
  );
}
