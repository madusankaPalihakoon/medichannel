
import AdminSidebar from "../../../components/layout/AdminSidebar";
import "./admin-layout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout-shell">
      <AdminSidebar />

      <main className="admin-layout-content">
        {children}
      </main>
    </div>
  );
}
