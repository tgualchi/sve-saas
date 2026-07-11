import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../services/supabase";

import "./DashboardStats.css";
import StatCard from "./StatCard";

export default function DashboardStats() {

    const { user } = useAuth();

    const [stats, setStats] = useState({
        patients: 0,
        documents: 0,
        valid: 0,
        professional: 1
    });

    useEffect(() => {

        if (user) {
            loadStats();
        }

    }, [user]);

    async function loadStats() {

        try {

            const { data: professional } = await supabase
                .from("professionals")
                .select("id")
                .eq("auth_user_id", user.id)
                .single();

            if (!professional) return;

            const [{ count: patients }, { count: documents }, { count: valid }] =
                await Promise.all([

                    supabase
                        .from("patients")
                        .select("*", {
                            count: "exact",
                            head: true
                        })
                        .eq("professional_id", professional.id),

                    supabase
                        .from("documents")
                        .select("*", {
                            count: "exact",
                            head: true
                        })
                        .eq("professional_id", professional.id),

                    supabase
                        .from("documents")
                        .select("*", {
                            count: "exact",
                            head: true
                        })
                        .eq("professional_id", professional.id)
                        .eq("status", "VALIDO")

                ]);

            setStats({
                patients: patients || 0,
                documents: documents || 0,
                valid: valid || 0,
                professional: 1
            });

        } catch (error) {

            console.error(error);

        }

    }

    return (

        <section className="dashboard-stats">

            <StatCard
                icon="👤"
                title="Pacientes"
                value={stats.patients}
                subtitle="Registrados"
            />

            <StatCard
                icon="📄"
                title="Documentos"
                value={stats.documents}
                subtitle="Emitidos"
            />

            <StatCard
                icon="✔"
                title="Válidos"
                value={stats.valid}
                subtitle="Activos"
            />

            <StatCard
                icon="🏥"
                title="Profesional"
                value={stats.professional}
                subtitle="Cuenta"
            />

        </section>

    );

}