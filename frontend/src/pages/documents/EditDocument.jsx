import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";

const initialForm = {
  document_type: "Certificado Médico",
  diagnosis: "",
  treatment: "",
  observations: "",
  license_from: "",
  license_to: ""
};

export default function EditDocument() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [document, setDocument] = useState(null);
  const [professionalId, setProfessionalId] = useState(null);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (user) loadDocument();
  }, [user, id]);

  async function loadDocument() {
    setLoading(true);

    const { data: professional, error: professionalError } = await supabase
      .from("professionals")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (professionalError || !professional) {
      alert("No se encontró el perfil profesional.");
      navigate("/documents");
      return;
    }

    const { data, error } = await supabase
      .from("documents")
      .select("*, patients(full_name,dni)")
      .eq("id", id)
      .eq("professional_id", professional.id)
      .single();

    if (error || !data) {
      alert("Documento no encontrado o sin permiso para editarlo.");
      navigate("/documents");
      return;
    }

    setProfessionalId(professional.id);
    setDocument(data);
    setForm({
      document_type: data.document_type || "Certificado Médico",
      diagnosis: data.diagnosis || "",
      treatment: data.treatment || "",
      observations: data.observations || "",
      license_from: data.license_from || "",
      license_to: data.license_to || ""
    });
    setLoading(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (form.license_from && form.license_to && form.license_to < form.license_from) {
      alert("La fecha final no puede ser anterior a la fecha inicial.");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("documents")
      .update({
        document_type: form.document_type,
        diagnosis: form.diagnosis.trim(),
        treatment: form.treatment.trim(),
        observations: form.observations.trim(),
        license_from: form.license_from || null,
        license_to: form.license_to || null
      })
      .eq("id", id)
      .eq("professional_id", professionalId)
      .select("public_code")
      .single();

    setSaving(false);

    if (error) {
      alert(`No se pudo actualizar el documento: ${error.message}`);
      return;
    }

    alert("Documento actualizado correctamente.");
    navigate(`/d/${data.public_code}`);
  }

  if (loading) return <div style={styles.loading}>Cargando documento...</div>;

  return (
    <main style={styles.page}>
      <div style={styles.heading}>
        <div>
          <span style={styles.kicker}>Gestión documental</span>
          <h1 style={styles.title}>Editar documento</h1>
          <p style={styles.muted}>Código público: <strong>{document.public_code}</strong></p>
        </div>
        <button type="button" style={styles.secondaryButton} onClick={() => navigate("/documents")}>← Documentos</button>
      </div>

      <section style={styles.patientCard}>
        <strong>Paciente</strong>
        <div style={styles.patientName}>{document.patients?.full_name || "-"}</div>
        <span style={styles.muted}>DNI: {document.patients?.dni || "-"}</span>
        <p style={styles.notice}>El paciente, el código público y la fecha original de emisión no se modifican.</p>
      </section>

      <form style={styles.form} onSubmit={handleSubmit}>
        <FieldSelect label="Tipo de documento" name="document_type" value={form.document_type} onChange={handleChange} />
        <FieldArea label="Diagnóstico" name="diagnosis" value={form.diagnosis} onChange={handleChange} />
        <FieldArea label="Tratamiento farmacológico" name="treatment" value={form.treatment} onChange={handleChange} />
        <FieldArea label="Indicaciones del profesional" name="observations" value={form.observations} onChange={handleChange} />

        <div style={styles.dateGrid}>
          <Field label="Licencia desde" type="date" name="license_from" value={form.license_from} onChange={handleChange} />
          <Field label="Licencia hasta" type="date" name="license_to" value={form.license_to} onChange={handleChange} />
        </div>

        <div style={styles.actions}>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/documents")} disabled={saving}>Cancelar</button>
          <button type="submit" style={styles.primaryButton} disabled={saving}>{saving ? "Guardando..." : "Guardar cambios"}</button>
        </div>
      </form>
    </main>
  );
}

function Field({ label, ...props }) {
  return <label style={styles.field}><span style={styles.label}>{label}</span><input {...props} style={styles.input} /></label>;
}

function FieldArea({ label, ...props }) {
  return <label style={styles.field}><span style={styles.label}>{label}</span><textarea {...props} rows={5} style={{ ...styles.input, resize: "vertical" }} /></label>;
}

function FieldSelect({ label, ...props }) {
  return <label style={styles.field}><span style={styles.label}>{label}</span><select {...props} style={styles.input}>{["Certificado Médico", "Informe", "Constancia", "Psicodiagnóstico"].map((item) => <option key={item}>{item}</option>)}</select></label>;
}

const styles = {
  page: { maxWidth: 960, margin: "35px auto", padding: "0 18px", fontFamily: "Arial, sans-serif", color: "#183b47" },
  loading: { padding: 70, textAlign: "center", fontFamily: "Arial, sans-serif" },
  heading: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginBottom: 22 },
  kicker: { color: "#087f8c", fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1 },
  title: { margin: "8px 0", fontSize: 38 },
  muted: { color: "#64748b" },
  patientCard: { background: "#fff", border: "1px solid #d7e1e4", borderLeft: "5px solid #087f8c", borderRadius: 8, padding: 24, marginBottom: 20, boxShadow: "0 4px 15px rgba(25,54,64,.07)" },
  patientName: { fontSize: 21, fontWeight: 800, margin: "9px 0" },
  notice: { margin: "16px 0 0", paddingTop: 14, borderTop: "1px solid #e2e8f0", color: "#7c5d14", fontSize: 13 },
  form: { background: "#fff", border: "1px solid #d7e1e4", borderTop: "5px solid #087f8c", borderRadius: 8, padding: 28, boxShadow: "0 6px 20px rgba(25,54,64,.08)" },
  field: { display: "block", marginBottom: 21 },
  label: { display: "block", marginBottom: 8, fontWeight: 800 },
  input: { width: "100%", padding: 12, border: "1px solid #cbd5e1", borderRadius: 5, boxSizing: "border-box", font: "inherit", background: "#fff" },
  dateGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 },
  actions: { display: "flex", justifyContent: "flex-end", gap: 12, flexWrap: "wrap", marginTop: 12 },
  secondaryButton: { padding: "12px 20px", border: "1px solid #aebdc2", borderRadius: 5, background: "#fff", color: "#334155", fontWeight: 700, cursor: "pointer" },
  primaryButton: { padding: "12px 22px", border: 0, borderRadius: 5, background: "#087f8c", color: "#fff", fontWeight: 800, cursor: "pointer" }
};
