import { useNavigate } from "react-router-dom";
import "./DashboardActions.css";

function ActionCard({ title, description, onClick }) {
  return (
    <div className="action-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function DashboardActions() {
  const navigate = useNavigate();

  return (
    <section className="dashboard-actions">

      <h2>Acciones rápidas</h2>

      <p>
        Seleccione una opción para comenzar.
      </p>

      <div className="dashboard-actions-grid">

        <ActionCard
          title="Nuevo Certificado"
          description="Emitir un nuevo certificado."
          onClick={() => navigate("/patients")}
        />

        <ActionCard
          title="Pacientes"
          description="Administrar pacientes."
          onClick={() => navigate("/patients")}
        />

        <ActionCard
          title="Documentos"
          description="Consultar documentos emitidos."
          onClick={() => navigate("/documents")}
        />

        <ActionCard
          title="Configuración"
          description="Editar datos del profesional."
          onClick={() => navigate("/profile")}
        />

      </div>

    </section>
  );
}