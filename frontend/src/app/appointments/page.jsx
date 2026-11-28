'use client';
import { useState, useEffect } from 'react';

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [liveQueue, setLiveQueue] = useState({});

  useEffect(() => {
    fetchAppointments();
    // WebSocket subscription for live queue updates (RT-01)
    const ws = new WebSocket('wss://api.medichannel.lk/ws-queue');
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      setLiveQueue((prev) => ({ ...prev, [update.sessionId]: update.nowServing }));
    };
    return () => ws.close();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch('/api/customer/appointments');
    const data = await res.json();
    setAppointments(data);
  };

  const handleCancel = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    const res = await fetch(`/api/appointments/${appointmentId}/cancel`, { method: 'POST' });
    if (res.ok) fetchAppointments();
  };

  return (
    <div className="container">
      <h1>My Appointments & Live Queue</h1>
      {appointments.map((apt) => {
        const currentServing = liveQueue[apt.sessionId] || apt.nowServing || 1;
        const patientsAhead = Math.max(0, apt.appointmentNumber - currentServing);

        return (
          <div key={apt.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3>{apt.doctorName} ({apt.specialisation})</h3>
                <p>Date: {apt.date} | Time: {apt.time}</p>
                <span className={`badge ${apt.type === 'PHYSICAL' ? 'badge-physical' : 'badge-online'}`}>{apt.type}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ color: 'var(--primary)', margin: 0 }}>My No: #{apt.appointmentNumber}</h2>
                <p style={{ margin: '0.2rem 0' }}>Now Serving: <strong>#{currentServing}</strong></p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Patients ahead of you: <strong>{patientsAhead}</strong></p>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              {apt.type === 'ONLINE' && apt.status === 'IN_CONSULTATION' && (
                <a href={`/consultation/${apt.id}`}><button className="btn-primary">Join Online Chat Room</button></a>
              )}
              {apt.status === 'BOOKED' && (
                <button onClick={() => handleCancel(apt.id)} style={{ background: 'var(--error)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                  Cancel Appointment
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}