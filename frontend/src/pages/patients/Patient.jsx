import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function Patient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatient();
  }, [id]);

  async function loadPatient() {
    setLoading(true);

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      alert(error.message);
      navigate("/patients");
      return;
    }

    setPatient(data);
    setLoading(false);
  }

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("es-AR");
  }

  function calculateAge(date) {
    if (!date) return "-";

    const birth = new Date(date);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    const month = today.getMonth() - birth.getMonth();

    if (
      month < 0 ||
      (month === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return `${age} años`;
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
        Cargando paciente...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        fontFamily: "Arial"
      }}
    >
      <button
        onClick={() => navigate("/patients")}
        style={{
          marginBottom: 25,
          padding: "10px 18px",
          cursor: "pointer"
        }}
      >
        ← Volver
      </button>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 3px 12px rgba(0,0,0,.08)"
        }}
      >
        <h1 style={{ marginTop: 0 }}>
          {patient.full_name}
        </h1>

        <hr />

        <Info
          title="DNI"
          value={patient.dni}
        />

        <Info
          title="Fecha de nacimiento"
          value={formatDate(patient.birth_date)}
        />

        <Info
          title="Edad"
          value={calculateAge(patient.birth_date)}
        />

        <Info
          title="Teléfono"
          value={patient.phone || "-"}
        />

        <Info
          title="Email"
          value={patient.email || "-"}
        />

      </div>

      <div
        style={{
          marginTop: 30,
          background: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 3px 12px rgba(0,0,0,.08)"
        }}
      >
        <h2>Documentos</h2>

        <p style={{ color: "#6b7280" }}>
          Todavía no existen documentos para este paciente.
        </p>

        <button
          onClick={() => navigate(`/documents/new/${patient.id}`)}
          style={{
            marginTop: 20,
            padding: "12px 20px",
            background: "#2563eb",
            color: "#fff",
            border: 0,
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          + Nuevo Documento
        </button>
      </div>
    </div>
  );
}

function Info({ title, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid #ececec"
      }}
    >
      <strong>{title}</strong>

      <span>{value}</span>
    </div>
  );
}