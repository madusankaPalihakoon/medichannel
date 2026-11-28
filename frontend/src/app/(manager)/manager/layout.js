
import ManagerSidebar from "../../../components/layout/ManagerSidebar";
import "./manager-layout.css";

export default function ManagerLayout({ children }) {
  return (
    <div className="manager-layout-shell">
      <ManagerSidebar />

      <main className="manager-layout-content">
        {children}
      </main>
    </div>
  );
}
