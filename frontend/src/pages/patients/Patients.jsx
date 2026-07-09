import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function Patients() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) {
      loadPatients();
    }
  }, [user]);

  async function loadPatients() {
    try {
      setLoading(true);

      const { data: professional, error: professionalError } =
        await supabase
          .from("professionals")
          .select("id")
          .eq("auth_user_id", user.id)
          .single();

      if (professionalError || !professional) {
        alert("No se encontró el perfil profesional.");
        return;
      }

      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("professional_id", professional.id)
        .order("full_name");

      if (error) {
        alert(error.message);
        return;
      }

      setPatients(data || []);
    } finally {
      setLoading(false);
    }
  }

  const filteredPatients = useMemo(() => {
    if (!search.trim()) return patients;

    const text = search.toLowerCase();

    return patients.filter((patient) => {
      return (
        patient.full_name.toLowerCase().includes(text) ||
        patient.dni.includes(search)
      );
    });
  }, [patients, search]);

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("es-AR");
  }

  if (loading) {
    return (
      <div
        style={{
          padding: 60,
          textAlign: "center",
          fontFamily: "Arial"
        }}
      >
        Cargando pacientes...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>Pacientes</h1>

          <p
            style={{
              color: "#6b7280",
              marginTop: 6
            }}
          >
            Total: {patients.length} paciente{patients.length !== 1 && "s"}
          </p>
        </div>

        <button
          onClick={() => navigate("/patients/new")}
          style={{
            padding: "12px 20px",
            background: "#2563eb",
            color: "#fff",
            border: 0,
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          + Nuevo Paciente
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o DNI..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          marginBottom: 25,
          boxSizing: "border-box"
        }}
      />

      {filteredPatients.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 40,
            textAlign: "center",
            border: "1px solid #e5e7eb"
          }}
        >
          {patients.length === 0
            ? "No hay pacientes registrados."
            : "No se encontraron pacientes con esa búsqueda."}
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#fff",
            borderRadius: 12,
            overflow: "hidden"
          }}
        >
          <thead
            style={{
              background: "#f3f4f6"
            }}
          >
            <tr>
              <th
                align="left"
                style={{ padding: "15px" }}
              >
                Nombre
              </th>

              <th
                align="left"
                style={{ padding: "15px" }}
              >
                DNI
              </th>

              <th
                align="left"
                style={{ padding: "15px" }}
              >
                Fecha de nacimiento
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((patient) => (
              <tr
                key={patient.id}
                onClick={() => navigate(`/patients/${patient.id}`)}
                style={{
                  cursor: "pointer",
                  borderTop: "1px solid #e5e7eb"
                }}
              >
                <td style={{ padding: "15px" }}>
                  {patient.full_name}
                </td>

                <td style={{ padding: "15px" }}>
                  {patient.dni}
                </td>

                <td style={{ padding: "15px" }}>
                  {formatDate(patient.birth_date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}