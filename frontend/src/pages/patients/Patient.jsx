import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";

export default function Patient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ sex: "", health_coverage: "", health_plan: "", credential_number: "" });

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
    setForm({
      sex: data.sex || "",
      health_coverage: data.health_coverage || "",
      health_plan: data.health_plan || "",
      credential_number: data.credential_number || ""
    });
    setLoading(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function savePatient(event) {
    event.preventDefault();
    setSaving(true);
    const { data, error } = await supabase
      .from("patients")
      .update({
        sex: form.sex || null,
        health_coverage: form.health_coverage.trim() || null,
        health_plan: form.health_plan.trim() || null,
        credential_number: form.credential_number.trim() || null
      })
      .eq("id", id)
      .select("*")
      .single();
    setSaving(false);
    if (error) {
      alert(`No se pudo actualizar el paciente: ${error.message}`);
      return;
    }
    setPatient(data);
    setEditing(false);
    alert("Datos del paciente actualizados.");
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

        <Info title="Sexo" value={patient.sex || "-"} />
        <Info title="Cobertura" value={patient.health_coverage || "-"} />
        <Info title="Plan" value={patient.health_plan || "-"} />
        <Info title="N° de credencial" value={patient.credential_number || "-"} />

        {!editing ? (
          <button onClick={() => setEditing(true)} style={{ marginTop: 24, padding: "11px 18px", background: "#087f8c", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer", fontWeight: "bold" }}>
            Editar datos de cobertura
          </button>
        ) : (
          <form onSubmit={savePatient} style={{ marginTop: 25, paddingTop: 22, borderTop: "1px solid #e5e7eb" }}>
            <EditSelect label="Sexo" name="sex" value={form.sex} onChange={handleChange} />
            <EditField label="Cobertura de salud" name="health_coverage" value={form.health_coverage} onChange={handleChange} />
            <EditField label="Plan" name="health_plan" value={form.health_plan} onChange={handleChange} />
            <EditField label="Número de credencial" name="credential_number" value={form.credential_number} onChange={handleChange} />
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <button type="submit" disabled={saving} style={{ padding: "11px 18px", background: "#087f8c", color: "#fff", border: 0, borderRadius: 6, fontWeight: "bold", cursor: "pointer" }}>{saving ? "Guardando..." : "Guardar"}</button>
              <button type="button" onClick={() => setEditing(false)} disabled={saving} style={{ padding: "11px 18px", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 6, cursor: "pointer" }}>Cancelar</button>
            </div>
          </form>
        )}

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

function EditField({ label, ...props }) {
  return <label style={{ display: "block", marginBottom: 15 }}><strong style={{ display: "block", marginBottom: 7 }}>{label}</strong><input {...props} style={{ width: "100%", padding: 11, border: "1px solid #cbd5e1", borderRadius: 6, boxSizing: "border-box" }} /></label>;
}

function EditSelect(props) {
  const { label, ...selectProps } = props;
  return <label style={{ display: "block", marginBottom: 15 }}><strong style={{ display: "block", marginBottom: 7 }}>{label}</strong><select {...selectProps} style={{ width: "100%", padding: 11, border: "1px solid #cbd5e1", borderRadius: 6, background: "#fff" }}><option value="">Seleccionar</option><option>Femenino</option><option>Masculino</option><option>No binario</option><option>Prefiere no informar</option></select></label>;
}
