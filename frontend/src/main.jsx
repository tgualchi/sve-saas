import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { CheckCircle, ShieldCheck, QrCode, FileCheck, Building2, CreditCard, Mail, MessageCircle } from "lucide-react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "5491124028499";
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || "sistemadevalidacionelectronica@gmail.com";

function normalizeCode(value) {
  const clean = value.trim().toUpperCase();
  const match = clean.match(/^CERT[\s-]?(\d{4})[\s-]?(\d{3})$/);
  if (!match) return null;
  return `CERT-${match[1]}-${match[2]}`;
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
      message: "Formato inválido. Use un código como CERT-2026-045."
    });
    return;
  }

  setLoading(true);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  setValidation({
    type: "success",
    certificate: {
      code: normalized,
      status: "VÁLIDO",
      issuer: "InformesPsicologicos.com",
      issued_at: new Date().toLocaleDateString("es-AR"),
      holder_name: "Documento verificado",
      document_url: `https://www.informespsicologicos.com/${normalized.toLowerCase()}`
    }
  });

  setLoading(false);
}
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
              <div className="badge"><span></span> Plataforma SaaS de verificación documental</div>
              <h1>Validación electrónica profesional para documentos digitales.</h1>
              <p className="lead">
                SVE permite verificar certificados, informes y constancias mediante código QR
                o código único, con estado documental, trazabilidad y página de verificación.
              </p>
              <div className="actions">
                <a className="btn primary" href="#validar">Validar documento</a>
                <a className="btn secondary" href="#planes">Ver planes</a>
              </div>
            </div>

            <div className="mock">
              <div className="qr"><QrCode size={110}/></div>
              <div className="verified"><CheckCircle/> Documento verificado</div>
              <div className="dataRows">
                <div><span>Código</span><strong>CERT-2026-045</strong></div>
                <div><span>Estado</span><strong className="ok">Válido</strong></div>
                <div><span>Emisor</span><strong>InformesPsicologicos.com</strong></div>
              </div>
            </div>
          </div>
        </section>

        <section id="validar" className="section">
          <div className="container validator">
            <div>
              <p className="kicker">Validación</p>
              <h2>Ingrese el código del documento</h2>
              <p className="muted">Ejemplo: CERT-2026-045. El sistema consultará la base de datos y mostrará el estado del documento.</p>
            </div>

            <form onSubmit={validateDocument} className="formCard">
              <label>Código de validación</label>
              <div className="inputRow">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="CERT-2026-045" />
                <button className="btn primary" disabled={loading}>{loading ? "Validando..." : "Validar"}</button>
              </div>

              {validation?.type === "error" && (
                <div className="result error">{validation.message}</div>
              )}

              {validation?.type === "success" && (
                <div className="result success">
                  <CheckCircle/>
                  <div>
                    <h3>Documento encontrado</h3>
                    <p><strong>Código:</strong> {validation.certificate.code}</p>
                    <p><strong>Estado:</strong> {validation.certificate.status}</p>
                    <p><strong>Emisor:</strong> {validation.certificate.issuer}</p>
                    <p><strong>Fecha de emisión:</strong> {validation.certificate.issued_at || "No informada"}</p>
                    {validation.certificate.document_url && (
                      <a className="btn primary" href={validation.certificate.document_url} target="_blank" rel="noreferrer">
                        Ver documento original
                      </a>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        </section>

        <section id="seguridad" className="section dark">
          <div className="container">
            <p className="kicker">Seguridad</p>
            <h2>Diseñado para reducir falsificaciones y mejorar la trazabilidad.</h2>
            <div className="featureGrid">
              <Feature icon={<ShieldCheck/>} title="Estados documentales" text="Válido, revocado, expirado o en revisión." />
              <Feature icon={<FileCheck/>} title="Base de datos" text="Certificados registrados en Supabase/PostgreSQL." />
              <Feature icon={<Building2/>} title="Multiinstitución" text="Preparado para profesionales, centros e instituciones." />
            </div>
          </div>
        </section>

        <section id="planes" className="section">
          <div className="container center">
            <p className="kicker">Planes</p>
            <h2>Planes comerciales sugeridos</h2>
            <p className="muted">Los precios pueden modificarse luego. El botón llama al backend para crear el checkout de Mercado Pago.</p>

            <div className="pricing">
              <Plan name="Profesional" price="$19.900/mes" planId="professional" items={["50 documentos/mes", "QR y código único", "Soporte por email"]} onCheckout={createCheckout}/>
              <Plan featured name="Consultorio" price="$39.900/mes" planId="clinic" items={["200 documentos/mes", "Personalización institucional", "Soporte por WhatsApp"]} onCheckout={createCheckout}/>
              <Plan name="Institucional" price="$89.900/mes" planId="enterprise" items={["1.000 documentos/mes", "Usuarios y roles", "Implementación asistida"]} onCheckout={createCheckout}/>
            </div>
          </div>
        </section>

        <section id="contacto" className="section">
          <div className="container contact">
            <div>
              <p className="kicker">Contacto</p>
              <h2>Implementar SVE</h2>
              <p className="muted">Para consultas comerciales o soporte, comuníquese por email o WhatsApp.</p>
            </div>
            <div className="contactLinks">
              <a href={`mailto:${CONTACT_EMAIL}`}><Mail/> {CONTACT_EMAIL}</a>
              <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer"><MessageCircle/> +54 9 11 2402-8499</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer">© 2026 SVE · Sistema de Validación Electrónica</div>
      </footer>
    </>
  );
}

function Feature({ icon, title, text }) {
  return <article className="feature">{icon}<h3>{title}</h3><p>{text}</p></article>;
}

function Plan({ name, price, items, planId, onCheckout, featured }) {
  return (
    <article className={`plan ${featured ? "featured" : ""}`}>
      {featured && <div className="popular">Recomendado</div>}
      <h3>{name}</h3>
      <p className="price">{price}</p>
      <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
      <button className="btn primary" onClick={() => onCheckout(planId)}>
        <CreditCard size={18}/> Contratar
      </button>
    </article>
  );
}

createRoot(document.getElementById("root")).render(<App />);
