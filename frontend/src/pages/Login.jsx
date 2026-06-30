import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const result = await supabase.auth.signInWithPassword({
  email,
  password
});

console.log(result);

const { error } = result;

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: "380px",
          background: "#fff",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,.08)"
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: "10px",
            textAlign: "center",
            color: "#111827"
          }}
        >
          SVE
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#6b7280",
            marginBottom: "30px"
          }}
        >
          Sistema de Validación Electrónica
        </p>

        <label>Correo electrónico</label>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            boxSizing: "border-box"
          }}
        />

        <label>Contraseña</label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "12px",
            marginTop: "8px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            boxSizing: "border-box"
          }}
        />

        {error && (
          <div
            style={{
              color: "#dc2626",
              marginBottom: "20px",
              fontSize: "14px"
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            border: 0,
            borderRadius: "8px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold"
          }}
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>
    </div>
  );
}