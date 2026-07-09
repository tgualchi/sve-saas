import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";

export default function NewPatient() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    dni: "",
    birth_date: "",
    phone: "",
    email: ""
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) return;

    if (!form.full_name.trim()) {
      alert("Ingrese el nombre del paciente.");
      return;
    }

    if (!form.dni.trim()) {
      alert("Ingrese el DNI.");
      return;
    }

    setSaving(true);

    try {
      // Buscar profesional
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

      // Verificar paciente duplicado
      const { data: existingPatient } = await supabase
        .from("patients")
        .select("id")
        .eq("professional_id", professional.id)
        .eq("dni", form.dni)
        .maybeSingle();

      if (existingPatient) {
        alert("Ya existe un paciente con ese DNI.");
        return;
      }

      // Guardar paciente
      const { error } = await supabase
        .from("patients")
        .insert({
          professional_id: professional.id,
          full_name: form.full_name.trim(),
          dni: form.dni.trim(),
          birth_date: form.birth_date || null,
          phone: form.phone.trim(),
          email: form.email.trim()
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Paciente creado correctamente.");

      navigate("/patients");

    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        background: "#fff",
        padding: "35px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,.08)",
        fontFamily: "Arial"
      }}
    >
      <h1 style={{ marginTop: 0 }}>
        Nuevo Paciente
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "30px"
        }}
      >
        Complete los datos básicos del paciente.
      </p>

      <form onSubmit={handleSubmit}>

        <Field
          label="Nombre completo"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
        />

        <Field
          label="DNI"
          name="dni"
          value={form.dni}
          onChange={handleChange}
          required
        />

        <Field
          label="Fecha de nacimiento"
          type="date"
          name="birth_date"
          value={form.birth_date}
          onChange={handleChange}
        />

        <Field
          label="Teléfono"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <Field
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <div
          style={{
            display: "flex",
            gap: "15px",
            marginTop: "30px"
          }}
        >
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: "12px 20px",
              background: "#2563eb",
              color: "#fff",
              border: 0,
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {saving ? "Guardando..." : "Guardar Paciente"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/patients")}
            style={{
              padding: "12px 20px",
              background: "#e5e7eb",
              border: 0,
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Cancelar
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
  required,
  type = "text"
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
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
        required={required}
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          boxSizing: "border-box"
        }}
      />
    </div>
  );
}