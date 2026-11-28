"use client";

import { useState } from "react";
import "./payments.css";

const initialPayments = [
  {
    id: 1,
    paymentId: "PAY001",
    appointmentId: "APT001",
    patient: "Kamal Perera",
    amount: 2500,
    method: "Cash",
    date: "2026-11-13",
    status: "Paid"
  },
  {
    id: 2,
    paymentId: "PAY002",
    appointmentId: "APT002",
    patient: "Nimali Silva",
    amount: 3000,
    method: "Card",
    date: "2026-11-13",
    status: "Pending"
  },
  {
    id: 3,
    paymentId: "PAY003",
    appointmentId: "APT003",
    patient: "Amal Fernando",
    amount: 2000,
    method: "Bank Transfer",
    date: "2026-11-13",
    status: "Paid"
  },
  {
    id: 4,
    paymentId: "PAY004",
    appointmentId: "APT004",
    patient: "Sanduni Perera",
    amount: 3500,
    method: "Cash",
    date: "2026-11-13",
    status: "Paid"
  }
];

export default function PaymentsPage() {
  const [payments, setPayments] = useState(initialPayments);

  const [appointmentId, setAppointmentId] = useState("");
  const [patient, setPatient] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Cash");
  const [date, setDate] = useState("2026-11-13");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const totalRevenue = payments
    .filter(item => item.status === "Paid")
    .reduce((total, item) => total + item.amount, 0);

  const pendingAmount = payments
    .filter(item => item.status === "Pending")
    .reduce((total, item) => total + item.amount, 0);

  const paidCount = payments.filter(
    item => item.status === "Paid"
  ).length;

  const pendingCount = payments.filter(
    item => item.status === "Pending"
  ).length;

  function handleSubmit(event) {
    event.preventDefault();

    if (!appointmentId.trim() || !patient.trim() || !amount || !date) {
      alert("Please fill in all required fields.");
      return;
    }

    const paymentAmount = Number(amount);

    if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    const newPayment = {
      id: Date.now(),
      paymentId: `PAY${String(payments.length + 1).padStart(3, "0")}`,
      appointmentId: appointmentId.trim().toUpperCase(),
      patient: patient.trim(),
      amount: paymentAmount,
      method,
      date,
      status: "Pending"
    };

    setPayments(current => [...current, newPayment]);

    setAppointmentId("");
    setPatient("");
    setAmount("");
    setMethod("Cash");
    setDate("2026-11-13");

    alert("Payment record added successfully.");
  }

  function updatePaymentStatus(id, newStatus) {
    setPayments(current =>
      current.map(item =>
        item.id === id
          ? { ...item, status: newStatus }
          : item
      )
    );
  }

  const filteredPayments = payments.filter(item => {
    const matchesSearch =
      `${item.paymentId} ${item.appointmentId} ${item.patient} ${item.method}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  function formatAmount(value) {
    return `Rs. ${value.toLocaleString("en-LK")}`;
  }

  return (
    <main className="payment-page">

      <header className="payment-header">
        <div>
          <p className="payment-brand">MEDICHANNEL / MANAGER</p>
          <h1>Payment Management</h1>
          <p>Manage patient payments and payment records.</p>
        </div>

        <a href="/manager/dashboard" className="payment-back">
          Back to Dashboard
        </a>
      </header>

      {/* Payment Statistics */}

      <section className="payment-stats">

        <div className="payment-stat-card">
          <span>Total Payments</span>
          <strong>{payments.length}</strong>
        </div>

        <div className="payment-stat-card">
          <span>Total Revenue</span>
          <strong>{formatAmount(totalRevenue)}</strong>
        </div>

        <div className="payment-stat-card">
          <span>Pending Amount</span>
          <strong>{formatAmount(pendingAmount)}</strong>
        </div>

        <div className="payment-stat-card">
          <span>Paid Payments</span>
          <strong>{paidCount}</strong>
        </div>

        <div className="payment-stat-card">
          <span>Pending Payments</span>
          <strong>{pendingCount}</strong>
        </div>

      </section>

      {/* Add New Payment */}

      <section className="payment-panel">

        <h2>Add New Payment</h2>

        <p className="payment-description">
          Enter the details to create a patient payment record.
        </p>

        <form className="payment-form" onSubmit={handleSubmit}>

          <div className="payment-field">
            <label htmlFor="payment-appointment">
              Appointment ID
            </label>

            <input
              id="payment-appointment"
              value={appointmentId}
              onChange={event => setAppointmentId(event.target.value)}
              placeholder="e.g. APT005"
              required
            />
          </div>

          <div className="payment-field">
            <label htmlFor="payment-patient">
              Patient Name
            </label>

            <input
              id="payment-patient"
              value={patient}
              onChange={event => setPatient(event.target.value)}
              placeholder="Enter patient name"
              required
            />
          </div>

          <div className="payment-field">
            <label htmlFor="payment-amount">
              Amount (LKR)
            </label>

            <input
              id="payment-amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="payment-field">
            <label htmlFor="payment-method">
              Payment Method
            </label>

            <select
              id="payment-method"
              value={method}
              onChange={event => setMethod(event.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="payment-field">
            <label htmlFor="payment-date">
              Payment Date
            </label>

            <input
              id="payment-date"
              type="date"
              value={date}
              onChange={event => setDate(event.target.value)}
              required
            />
          </div>

          <div className="payment-form-actions">
            <button
              type="submit"
              className="payment-primary-button"
            >
              Add Payment
            </button>
          </div>

        </form>
      </section>

      {/* Payment Records */}

      <section className="payment-panel">

        <div className="payment-list-heading">

          <div>
            <h2>Payment Records</h2>
            <p>View and manage registered patient payments.</p>
          </div>

          <div className="payment-filters">

            <input
              className="payment-search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search patient or payment ID..."
            />

            <select
              className="payment-status-filter"
              value={filterStatus}
              onChange={event => setFilterStatus(event.target.value)}
              aria-label="Filter payments by status"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>

          </div>
        </div>

        <div className="payment-table-wrapper">

          <table className="payment-table">

            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Appointment ID</th>
                <th>Patient</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredPayments.length > 0 ? (

                filteredPayments.map(item => (

                  <tr key={item.id}>

                    <td>
                      <strong>{item.paymentId}</strong>
                    </td>

                    <td>{item.appointmentId}</td>

                    <td>{item.patient}</td>

                    <td>{formatAmount(item.amount)}</td>

                    <td>{item.method}</td>

                    <td>{item.date}</td>

                    <td>
                      <span
                        className={`payment-status ${item.status.toLowerCase()}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <select
                        className="payment-status-select"
                        value={item.status}
                        onChange={event =>
                          updatePaymentStatus(item.id, event.target.value)
                        }
                        aria-label={`Update payment status for ${item.paymentId}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td colSpan="8" className="payment-empty">
                    No payment records found.
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


