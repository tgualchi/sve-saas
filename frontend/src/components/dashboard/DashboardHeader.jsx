import "./DashboardHeader.css";
import { useAuth } from "../../contexts/AuthContext";

export default function DashboardHeader() {
  const { user, signOut } = useAuth();

  const hour = new Date().getHours();

  let greeting = "Buenas noches";

  if (hour >= 6 && hour < 12) greeting = "Buenos días";
  else if (hour >= 12 && hour < 20) greeting = "Buenas tardes";

  return (
    <header className="dashboard-header">

      <div className="dashboard-header-left">

        <span className="dashboard-welcome">
          {greeting}
        </span>

        <h1>
          Bienvenido a SVE
        </h1>

        <p>
          {user?.email}
        </p>

      </div>

      <div className="dashboard-header-right">

        <button className="notification-button">
          🔔
        </button>

        <button
          className="logout-button"
          onClick={signOut}
        >
          Cerrar sesión
        </button>

      </div>

    </header>
  );
}