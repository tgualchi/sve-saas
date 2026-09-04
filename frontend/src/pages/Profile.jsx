import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    profession: "",
    specialty: "",
    license_number: "",
    email: "",
    phone: "",
    website: "",
    logo_url: "",
    signature_url: ""
  });

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;

      const { data } = await supabase
        .from("professionals")
        .select("*")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (data) {
        setForm({
          full_name: data.full_name || "",
          profession: data.profession || "",
          specialty: data.specialty || "",
          license_number: data.license_number || "",
          email: data.email || user.email || "",
          phone: data.phone || "",
          website: data.website || "",
          logo_url: data.logo_url || "",
          signature_url: data.signature_url || ""
        });
      } else {
        setForm((prev) => ({
          ...prev,
          email: user.email || ""
        }));
      }

      setLoading(false);
    }

    loadProfile();
  }, [user]);

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

    setSaving(true);

    const payload = {
      ...form,
      auth_user_id: user.id
    };

    const { error } = await supabase
      .from("professionals")
      .upsert(payload, {
        onConflict: "auth_user_id"
      });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  }

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center" }}>
        Cargando perfil...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
        padding: "40px 20px"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          background: "#fff",
          padding: "35px",
          borderRadius: "14px",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)"
        }}
      >
        <h1 style={{ marginTop: 0 }}>Perfil Profesional</h1>

        <p style={{ color: "#6b7280", marginBottom: 30 }}>
          Complete sus datos profesionales. Esta información se usará
          automáticamente en los documentos emitidos por SVE.
        </p>

        <Field label="Nombre completo" name="full_name" value={form.full_name} onChange={handleChange} required />
        <Field label="Profesión" name="profession" value={form.profession} onChange={handleChange} required />
        <Field label="Especialidad" name="specialty" value={form.specialty} onChange={handleChange} />
        <Field label="Matrícula" name="license_number" value={form.license_number} onChange={handleChange} />
        <Field label="Email" name="email" value={form.email} onChange={handleChange} />
        <Field label="Teléfono" name="phone" value={form.phone} onChange={handleChange} />
        <Field label="Sitio web" name="website" value={form.website} onChange={handleChange} />
        <Field label="Logo URL" name="logo_url" value={form.logo_url} onChange={handleChange} />
        <Field label="Firma URL" name="signature_url" value={form.signature_url} onChange={handleChange} />

        <button
          type="submit"
          disabled={saving}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "14px",
            border: 0,
            borderRadius: "10px",
            background: "#2563eb",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          {saving ? "Guardando..." : "Guardar perfil"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, name, value, onChange, required }) {
  return (
    <label style={{ display: "block", marginBottom: 18 }}>
      <span style={{ display: "block", fontWeight: "bold", marginBottom: 8 }}>
        {label}
      </span>

      <input
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
    </label>
  );
}