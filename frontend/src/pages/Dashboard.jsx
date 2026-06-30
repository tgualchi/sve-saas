import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabase";

export default function Dashboard() {
  const { user } = useAuth();

  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <header
        style={{
          background: "#ffffff",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb"
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#111827"
            }}
          >
            Sistema de Validación Electrónica
          </h2>

          <div
            style={{
              color: "#6b7280",
              marginTop: "5px"
            }}
          >
            {user?.email}
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "10px 18px",
            border: 0,
            borderRadius: "8px",
            background: "#dc2626",
            color: "#ffffff",
            cursor: "pointer"
          }}
        >
          Cerrar sesión
        </button>
      </header>

      <div
        style={{
          maxWidth: "1200px",
          margin: "40px auto",
          padding: "0 20px"
        }}
      >
        <h1>Bienvenido a SVE</h1>

        <p>
          Desde este panel podrá administrar todos los documentos emitidos.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))",
            gap: "20px",
            marginTop: "40px"
          }}
        >
          <DashboardCard
            title="Nuevo Certificado"
            description="Emitir un nuevo certificado."
          />

          <DashboardCard
            title="Pacientes"
            description="Administrar pacientes."
          />

          <DashboardCard
            title="Certificados"
            description="Consultar documentos emitidos."
          />

          <DashboardCard
            title="Configuración"
            description="Datos del profesional."
          />
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ title, description }) {
  return (
    <div
      style={{
        background: "#ffffff",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,.06)"
      }}
    >
      <h3>{title}</h3>

      <p
        style={{
          color: "#6b7280"
        }}
      >
        {description}
      </p>
    </div>
  );
}