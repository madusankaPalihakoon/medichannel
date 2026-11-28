
import DoctorSidebar from "../../../components/layout/DoctorSidebar";
import "./doctor-layout.css";

export default function DoctorLayout({ children }) {
  return (
    <div className="doctor-layout-shell">
      <DoctorSidebar />

      <main className="doctor-layout-content">
        {children}
      </main>
    </div>
  );
}
