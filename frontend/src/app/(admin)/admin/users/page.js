
"use client";

import { useState } from "react";
import "./users.css";

const initialUsers = [
  {
    id: 1,
    name: "Dr. Nimal Perera",
    email: "nimal@gmail.com",
    role: "Doctor",
    status: "Active",
  },
  {
    id: 2,
    name: "Saman Silva",
    email: "saman@gmail.com",
    role: "Manager",
    status: "Active",
  },
  {
    id: 3,
    name: "Amal Fernando",
    email: "amal@gmail.com",
    role: "Doctor",
    status: "Inactive",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Doctor");
  const [message, setMessage] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  function addUser(event) {
    event.preventDefault();

    const emailExists = users.some(
      (user) => user.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (emailExists) {
      setMessage("This email address already exists.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      status: "Active",
    };

    setUsers((previousUsers) => [...previousUsers, newUser]);
    setName("");
    setEmail("");
    setRole("Doctor");
    setMessage("Staff account added successfully.");
  }

  function toggleStatus(id) {
    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              status:
                user.status === "Active" ? "Inactive" : "Active",
            }
          : user
      )
    );

    setMessage("Account status updated.");
  }

  function openResetPassword(user) {
    setSelectedUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setResetMessage("");
    setMessage("");
  }

  function closeResetPassword() {
    setSelectedUser(null);
    setNewPassword("");
    setConfirmPassword("");
    setResetMessage("");
  }

  function handlePasswordReset(event) {
    event.preventDefault();

    if (newPassword.length < 8) {
      setResetMessage("Password must contain at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetMessage("Passwords do not match.");
      return;
    }

    // Frontend demonstration only.
    // Connect this action to the Spring Boot password reset API
    // before using it with real staff accounts.

    setResetMessage(
      "Password validation successful. Backend API connection is required to update the actual account password."
    );

    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="users-page">
      <header className="users-header">
        <div>
          <p className="users-brand">MEDICHANNEL / ADMIN</p>
          <h1>User Management</h1>
          <p>Create and manage staff accounts.</p>
        </div>

        <a href="/admin/dashboard" className="users-back">
          Back to Dashboard
        </a>
      </header>

      <section className="users-form-section">
        <h2>Create Staff Account</h2>

        <form onSubmit={addUser} className="users-form">
          <div className="users-field">
            <label>Staff Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter staff name"
              required
            />
          </div>

          <div className="users-field">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="users-field">
            <label>Staff Role</label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
            >
              <option value="Doctor">Doctor</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="users-add-button">
            Create Account
          </button>
        </form>

        {message && <p className="users-message">{message}</p>}
      </section>

      <section className="users-list-section">
        <h2>Staff Accounts</h2>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={
                        user.status === "Active"
                          ? "users-status active"
                          : "users-status inactive"
                      }
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <div className="users-actions">
                      <button
                        type="button"
                        className="users-status-button"
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === "Active"
                          ? "Deactivate"
                          : "Activate"}
                      </button>

                      <button
                        type="button"
                        className="users-reset-button"
                        onClick={() => openResetPassword(user)}
                      >
                        Reset Password
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <div className="reset-modal-overlay">
          <div
            className="reset-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
          >
            <button
              type="button"
              className="reset-close"
              onClick={closeResetPassword}
              aria-label="Close"
            >
              &times;
            </button>

            <h2 id="reset-title">Reset Password</h2>

            <p>
              Set a new password for this staff account.
            </p>

            <div className="reset-user-info">
              <strong>{selectedUser.name}</strong>
              <span>{selectedUser.email}</span>
              <span>{selectedUser.role}</span>
            </div>

            <form onSubmit={handlePasswordReset}>
              <div className="users-field">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="Enter new password"
                  minLength={8}
                  required
                />
              </div>

              <div className="users-field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm new password"
                  minLength={8}
                  required
                />
              </div>

              {resetMessage && (
                <p className="reset-message" role="status">
                  {resetMessage}
                </p>
              )}

              <div className="reset-modal-actions">
                <button
                  type="button"
                  className="reset-cancel-button"
                  onClick={closeResetPassword}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="users-reset-button"
                >
                  Confirm Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
