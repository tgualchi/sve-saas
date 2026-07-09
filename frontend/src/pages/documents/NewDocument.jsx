import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { generatePublicCode } from "../../utils/generatePublicCode";

export default function NewDocument() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [patient, setPatient] = useState(null);

  const [form, setForm] = useState({
    document_type: "Certificado Médico",
    diagnosis: "",
    treatment: "",
    observations: "",
    license_from: "",
    license_to: ""
  });

  useEffect(() => {
    loadPatient();
  }, []);

  async function loadPatient() {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .single();

    if (error) {
      alert("Paciente no encontrado.");
      navigate("/patients");
      return;
    }

    setPatient(data);
    setLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
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

    return age;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    try {

      const {
        data: { user }
      } = await supabase.auth.getUser();

      const {
        data: professional,
        error: professionalError
      } = await supabase
        .from("professionals")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (professionalError || !professional) {
        alert("No se encontró el profesional.");
        setSaving(false);
        return;
      }

      const publicCode = generatePublicCode();

      const { error } = await supabase
        .from("documents")
        .insert({
          professional_id: professional.id,
          patient_id: patient.id,
          public_code: publicCode,
          document_type: form.document_type,
          diagnosis: form.diagnosis,
          treatment: form.treatment,
          observations: form.observations,
          license_from: form.license_from || null,
          license_to: form.license_to || null
        });

      if (error) {
        alert(error.message);
        setSaving(false);
        return;
      }

      navigate(`/d/${publicCode}`);

    } catch (err) {

      console.error(err);

      alert("Error al emitir el documento.");

    }

    setSaving(false);
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
        onClick={() => navigate(-1)}
        style={{
          marginBottom: 25
        }}
      >
        ← Volver
      </button>

      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 30,
          boxShadow: "0 3px 12px rgba(0,0,0,.08)"
        }}
      >
        <h1>Nuevo Documento</h1>

        <hr />

        <h2>Paciente</h2>

        <p>

          <strong>{patient.full_name}</strong>

          <br />

          DNI: {patient.dni}

          <br />

          Edad: {calculateAge(patient.birth_date)} años

        </p>

      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: 25,
          background: "#fff",
          borderRadius: 12,
          padding: 30,
          boxShadow: "0 3px 12px rgba(0,0,0,.08)"
        }}
      >        <FieldSelect
          label="Tipo de documento"
          name="document_type"
          value={form.document_type}
          onChange={handleChange}
          options={[
            "Certificado Médico",
            "Informe",
            "Constancia",
            "Psicodiagnóstico"
          ]}
        />

        <FieldArea
          label="Diagnóstico"
          name="diagnosis"
          value={form.diagnosis}
          onChange={handleChange}
        />

        <FieldArea
          label="Tratamiento"
          name="treatment"
          value={form.treatment}
          onChange={handleChange}
        />

        <FieldArea
          label="Observaciones"
          name="observations"
          value={form.observations}
          onChange={handleChange}
        />

        <div
          style={{
            display: "flex",
            gap: 20
          }}
        >
          <Field
            label="Licencia desde"
            type="date"
            name="license_from"
            value={form.license_from}
            onChange={handleChange}
          />

          <Field
            label="Licencia hasta"
            type="date"
            name="license_to"
            value={form.license_to}
            onChange={handleChange}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 30
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              padding: "12px 22px",
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 22px",
              borderRadius: 8,
              border: 0,
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {saving
              ? "Emitiendo..."
              : "Emitir Documento"}
          </button>
        </div>

      </form>

    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text"
}) {
  return (
    <div
      style={{
        flex: 1,
        marginBottom: 20
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontWeight: "bold"
        }}
      >
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
      />
    </div>
  );
}

function FieldArea({
  label,
  name,
  value,
  onChange
}) {
  return (
    <div
      style={{
        marginBottom: 20
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontWeight: "bold"
        }}
      >
        {label}
      </label>

      <textarea
        rows={5}
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          resize: "vertical",
          boxSizing: "border-box"
        }}
      />
    </div>
  );
}function FieldSelect({
  label,
  name,
  value,
  onChange,
  options
}) {
  return (
    <div
      style={{
        marginBottom: 20
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontWeight: "bold"
        }}
      >
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}