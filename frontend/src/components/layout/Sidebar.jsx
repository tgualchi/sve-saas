import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">

        <div className="sidebar-logo-icon">
          🛡️
        </div>

        <div>
          <h2>SVE</h2>
          <span>Sistema de Validación Electrónica</span>
        </div>

      </div>

      <nav className="sidebar-menu">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/patients"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          👤 Pacientes
        </NavLink>

        <NavLink
          to="/documents"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          📄 Documentos
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "sidebar-link active" : "sidebar-link"
          }
        >
          ⚙ Configuración
        </NavLink>

      </nav>

      <div className="sidebar-footer">

        <strong>SVE</strong>

        <span>v1.0.0</span>

      </div>

    </aside>
  );
}