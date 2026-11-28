
import "./dashboard.css";

export default function AdminDashboard() {
  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="admin-brand">MEDICHANNEL / ADMIN</p>
          <h1>Admin Dashboard</h1>
          <p>Manage system users and administrative activities.</p>
        </div>
      </header>

      <section className="admin-welcome">
        <h2>Welcome, Admin!</h2>
        <p>
          Manage staff accounts and monitor administrative activities
          through the MediChannel system.
        </p>
      </section>

      <section className="admin-management">
        <h2>Administration</h2>

        <div className="admin-card-grid">
          <a href="/admin/users" className="admin-card">
            <span>👥</span>
            <h3>User Management</h3>
            <p>Create and manage staff accounts.</p>
          </a>

          <a href="/admin/audit-logs" className="admin-card">
            <span>📋</span>
            <h3>Audit Log</h3>
            <p>View administrative activity records.</p>
          </a>
        </div>
      </section>
    </main>
  );
}

