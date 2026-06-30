import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams
} from "react-router-dom";
import {
  CheckCircle,
  ShieldCheck,
  QrCode,
  FileCheck,
  Building2,
  CreditCard,
  Mail,
  MessageCircle,
  XCircle,
  Loader2,
  ExternalLink,
  RotateCcw,
  BadgeCheck
} from "lucide-react";
import "./styles.css";
import DocumentPage from "./pages/DocumentPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "5491124028499";
const CONTACT_EMAIL =
  import.meta.env.VITE_CONTACT_EMAIL ||
  "sistemadevalidacionelectronica@gmail.com";

const PUBLIC_CODE_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

function normalizeCode(value) {
  const clean = value.trim().toUpperCase().replace(/\s+/g, "-");

  // Nuevo formato
  if (PUBLIC_CODE_PATTERN.test(clean)) {
    return clean;
  }

  // Permite escribir el código sin guiones
  const compact = clean.replace(/-/g, "");

  if (/^[A-Z0-9]{16}$/.test(compact)) {
    return compact.match(/.{4}/g).join("-");
  }

  // Compatibilidad con certificados existentes
  const certMatch = clean.match(/^CERT[\s-]?(\d{4})[\s-]?(\d{3})$/);

  if (certMatch) {
    return `CERT-${certMatch[1]}-${certMatch[2]}`;
  }

  return null;
}

function formatValidationDate() {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "long",
    timeStyle: "short"
  }).format(new Date());
}

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function App() {
  const [code, setCode] = useState("");
  const [validation, setValidation] = useState(null);
  const [loading, setLoading] = useState(false);

 async function validateDocument(e) {
  e.preventDefault();

  const normalized = normalizeCode(code);

  if (!normalized) {
    setValidation({
      type: "error",
      title: "Documento no encontrado",
      message: "El código ingresado no corresponde a un documento válido.",
      code: code.trim() || "-",
      validatedAt: formatValidationDate()
    });
    return;
  }

  setLoading(true);
  setValidation(null);

  try {
    const response = await fetch(`${API_URL}/api/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        code: normalized
      })
    });

    const data = await response.json();

    if (!response.ok || !data.valid) {
      setValidation({
        type: "error",
        title: "Documento no encontrado",
        message:
          data.message ||
          "El documento no existe o fue eliminado del sistema.",
        code: normalized,
        validatedAt: formatValidationDate()
      });

      return;
    }

    setValidation({
      type: "success",
      title: "Documento auténtico",
      certificate: {
        code: data.code,
        status: data.status,
        issuer: data.issuer,
        verifiedBy: "Sistema de Validación Electrónica",
        validatedAt: formatValidationDate(),
        documentUrl: data.documentUrl
      }
    });
  } catch (error) {
    setValidation({
      type: "error",
      title: "Error de conexión",
      message:
        "No fue posible comunicarse con el servidor de validación.",
      code: normalized,
      validatedAt: formatValidationDate()
    });
  } finally {
    setLoading(false);
  }
}

  function resetValidation() {
    setCode("");
    setValidation(null);
    setLoading(false);
  }

  async function createCheckout(planId) {
    try {
      const res = await fetch(`${API_URL}/api/payments/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId })
      });

      const data = await res.json();

      if (!res.ok || !data.init_point) {
        alert(data.error || "El checkout aún no está configurado.");
        return;
      }

      window.location.href = data.init_point;
    } catch {
      alert("No se pudo iniciar el pago. Verifique la configuración del backend.");
    }
  }

  return (
    <>
      <header className="header">
        <div className="container nav">
          <a href="#inicio" className="brand">
            <div className="logo">SVE</div>
            <div>
              <strong>SVE</strong>
              <span>Sistema de Validación Electrónica</span>
            </div>
          </a>

          <nav>
            <a href="#validar">Validar</a>
            <a href="#seguridad">Seguridad</a>
            <a href="#planes">Planes</a>
            <a href="#contacto">Contacto</a>
          </nav>
        </div>
      </header>

      <main id="inicio">
        <section className="hero">
          <div className="container heroGrid">
            <div>
              <div className="badge">
                <span></span>
                Plataforma SaaS de verificación documental
              </div>

              <h1>Validación electrónica profesional para documentos digitales.</h1>

              <p className="lead">
                SVE permite verificar certificados, informes y constancias mediante
                código QR o código único, sin exponer datos sensibles del titular ni
                datos profesionales en la validación pública.
              </p>

              <div className="actions">
                <a className="btn primary" href="#validar">
                  Validar documento
                </a>
                <a className="btn secondary" href="#planes">
                  Ver planes
                </a>
              </div>
            </div>

            <div className="mock">
              <div className="qr">
                <QrCode size={110} />
              </div>

              <div className="verified">
                <CheckCircle />
                Documento auténtico
              </div>

              <div className="dataRows">
                <div>
                  <span>Código</span>
                  <strong>A7KF-93XD-LP4Q-82WM</strong>
                </div>

                <div>
                  <span>Estado</span>
                  <strong className="ok">Válido</strong>
                </div>

                <div>
                  <span>Verificado por</span>
                  <strong>SVE</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="validar" className="section validatorSection">
          <div className="container validator">
            <div className="validatorIntro">
              <p className="kicker">Validación pública</p>
              <h2>Ingrese el código del documento</h2>
              <p className="muted">
                La validación pública confirma la autenticidad del documento sin
                mostrar nombre del paciente, DNI, profesional, matrícula, diagnóstico
                ni contenido clínico. Esa información solo aparece dentro del documento original.
              </p>
            </div>

            <form onSubmit={validateDocument} className="formCard">
              <label htmlFor="validation-code">Código de validación</label>

              <div className="inputRow">
                <input
                  id="validation-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="A7KF-93XD-LP4Q-82WM"
                  autoComplete="off"
                  disabled={loading}
                />

                <button className="btn primary" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="spin" size={18} />
                      Validando
                    </>
                  ) : (
                    <>
                      <BadgeCheck size={18} />
                      Validar
                    </>
                  )}
                </button>
              </div>

              {loading && (
                <div className="professionalLoader">
                  <div className="loaderRing">
                    <Loader2 className="spin" />
                  </div>
                  <div>
                    <strong>Consultando registro documental</strong>
                    <p>Verificando código público, estado y entidad emisora.</p>
                  </div>
                </div>
              )}

              {validation?.type === "success" && (
                <VerifiedDocumentCard
                  certificate={validation.certificate}
                  onReset={resetValidation}
                />
              )}

              {validation?.type === "error" && (
                <InvalidDocumentCard validation={validation} onReset={resetValidation} />
              )}
            </form>
          </div>
        </section>

        <section id="seguridad" className="section dark">
          <div className="container">
            <p className="kicker">Seguridad</p>
            <h2>Diseñado para reducir falsificaciones y proteger datos sensibles.</h2>

            <div className="featureGrid">
              <Feature
                icon={<ShieldCheck />}
                title="Validación pública segura"
                text="La consulta pública confirma autenticidad sin exponer datos personales ni profesionales."
              />

              <Feature
                icon={<FileCheck />}
                title="Código no correlativo"
                text="Cada documento usa un código público aleatorio, difícil de adivinar o enumerar."
              />

              <Feature
                icon={<Building2 />}
                title="Documento separado"
                text="El contenido completo se visualiza únicamente desde el documento original validado."
              />
            </div>
          </div>
        </section>

        <section id="planes" className="section">
          <div className="container center">
            <p className="kicker">Planes</p>
            <h2>Planes comerciales sugeridos</h2>
            <p className="muted">
              Los precios pueden modificarse luego. El botón llama al backend para
              crear el checkout de Mercado Pago.
            </p>

            <div className="pricing">
              <Plan
                name="Profesional"
                price="$19.900/mes"
                planId="professional"
                items={[
                  "50 documentos/mes",
                  "QR y código único",
                  "Soporte por email"
                ]}
                onCheckout={createCheckout}
              />

              <Plan
                featured
                name="Consultorio"
                price="$39.900/mes"
                planId="clinic"
                items={[
                  "200 documentos/mes",
                  "Personalización institucional",
                  "Soporte por WhatsApp"
                ]}
                onCheckout={createCheckout}
              />

              <Plan
                name="Institucional"
                price="$89.900/mes"
                planId="enterprise"
                items={[
                  "1.000 documentos/mes",
                  "Usuarios y roles",
                  "Implementación asistida"
                ]}
                onCheckout={createCheckout}
              />
            </div>
          </div>
        </section>

        <section id="contacto" className="section">
          <div className="container contact">
            <div>
              <p className="kicker">Contacto</p>
              <h2>Implementar SVE</h2>
              <p className="muted">
                Para consultas comerciales o soporte, comuníquese por email o WhatsApp.
              </p>
            </div>

            <div className="contactLinks">
              <a href={`mailto:${CONTACT_EMAIL}`}>
                <Mail />
                {CONTACT_EMAIL}
              </a>

              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle />
                +54 9 11 2402-8499
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer">
          © 2026 SVE · Sistema de Validación Electrónica · v1.1.0
        </div>
      </footer>
    </>
  );
}

function VerifiedDocumentCard({ certificate, onReset }) {
  return (
    <article className="verificationCard verifiedCard">
      <div className="verificationHeader">
        <div className="verificationIcon successIcon">
          <CheckCircle />
        </div>

        <div>
          <p className="eyebrow">Documento auténtico</p>
          <h3>Este documento fue verificado correctamente por SVE.</h3>
        </div>
      </div>

      <div className="verificationGrid">
        <ValidationRow label="Código" value={certificate.code} />
        <ValidationRow label="Estado" value={certificate.status} highlight />
        <ValidationRow label="Emitido por" value={certificate.issuer} />
        <ValidationRow label="Verificado por" value={certificate.verifiedBy} />
        <ValidationRow
          label="Fecha y hora de validación"
          value={certificate.validatedAt}
        />
      </div>

      <div className="privacyNotice">
        La validación pública no muestra datos del paciente, profesional, matrícula,
        diagnóstico ni contenido del documento.
      </div>

      <div className="verificationActions">
        {certificate.documentUrl && (
          <a
            className="btn primary"
           href={`/d/${certificate.code}`}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink size={18} />
            Ver documento original
          </a>
        )}

        <button type="button" className="btn secondary" onClick={onReset}>
          <RotateCcw size={18} />
          Validar otro documento
        </button>
      </div>
    </article>
  );
}

function InvalidDocumentCard({ validation, onReset }) {
  return (
    <article className="verificationCard invalidCard">
      <div className="verificationHeader">
        <div className="verificationIcon errorIcon">
          <XCircle />
        </div>

        <div>
          <p className="eyebrow">Documento no validado</p>
          <h3>No fue posible validar el documento.</h3>
        </div>
      </div>

      <div className="verificationGrid">
        <ValidationRow label="Código ingresado" value={validation.code} />
        <ValidationRow label="Estado" value="NO VALIDADO" danger />
        <ValidationRow label="Verificado por" value="Sistema de Validación Electrónica" />
        <ValidationRow
          label="Fecha y hora de validación"
          value={validation.validatedAt}
        />
      </div>

      <p className="invalidMessage">{validation.message}</p>

      <div className="verificationActions">
        <button type="button" className="btn secondary" onClick={onReset}>
          <RotateCcw size={18} />
          Validar otro documento
        </button>
      </div>
    </article>
  );
}

function ValidationRow({ label, value, highlight, danger }) {
  return (
    <div className="validationRow">
      <span>{label}</span>
      <strong className={highlight ? "validText" : danger ? "dangerText" : ""}>
        {value}
      </strong>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <article className="feature">
      {icon}
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function Plan({ name, price, items, planId, onCheckout, featured }) {
  return (
    <article className={`plan ${featured ? "featured" : ""}`}>
      {featured && <div className="popular">Recomendado</div>}

      <h3>{name}</h3>
      <p className="price">{price}</p>

      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <button className="btn primary" onClick={() => onCheckout(planId)}>
        <CreditCard size={18} />
        Contratar
      </button>
    </article>
  );
}

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>

        {/* Sitio público */}
        <Route path="/" element={<App />} />

        {/* Documento público */}
        <Route path="/d/:code" element={<DocumentPage />} />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
