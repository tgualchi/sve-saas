import "./DashboardStats.css";
import StatCard from "./StatCard";

export default function DashboardStats() {

    return (

        <section className="dashboard-stats">

            <StatCard
                icon="👤"
                title="Pacientes"
                value="0"
                subtitle="Registrados"
            />

            <StatCard
                icon="📄"
                title="Documentos"
                value="0"
                subtitle="Emitidos"
            />

            <StatCard
                icon="✔"
                title="Válidos"
                value="0"
                subtitle="Activos"
            />

            <StatCard
                icon="🏥"
                title="Profesional"
                value="1"
                subtitle="Cuenta"
            />

        </section>

    );

}