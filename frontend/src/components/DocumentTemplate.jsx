import React from "react";
import { QRCodeSVG } from "qrcode.react";

const VALIDATOR_URL = "https://sve.informespsicologicos.com/";
function formatDate(value) {
  if (!value) return "-";

  const dateOnly = String(value).slice(0, 10);
  const match = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (match) {
    const [, year, month, day] = match;
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" });
}
const formatDateTime = (v) => v ? new Date(v).toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";

function formatTitle(profession, specialty) {
  const fix = (v) => String(v || "").trim().replace(/\bmedico\b/gi, "MÉDICO").replace(/\bpsicologo\b/gi, "PSICÓLOGO").replace(/\bpsiquiatria\b/gi, "PSIQUIATRA").toUpperCase();
  const p = fix(profession), s = fix(specialty);
  if (!s) return p;
  return !p || s.includes(p) ? s : `${p} ${s}`;
}

function licenseDays(from, to) {
  if (!from || !to) return null;
  const start = new Date(`${String(from).slice(0, 10)}T00:00:00`);
  const end = new Date(`${String(to).slice(0, 10)}T00:00:00`);
  const days = Math.round((end - start) / 86400000) + 1;
  return Number.isFinite(days) && days >= 0 ? days : null;
}

function statusConfig(value) {
  const status = String(value || "").toLowerCase();
  if (status === "valid") return { label: "VÁLIDO", icon: "✓", color: "#059669", soft: "#ecfdf5", border: "#86efac" };
  if (status === "revoked") return { label: "REVOCADO", icon: "!", color: "#dc2626", soft: "#fef2f2", border: "#fca5a5" };
  if (["anulado", "annulled", "canceled", "cancelled"].includes(status)) return { label: "ANULADO", icon: "!", color: "#c2410c", soft: "#fff7ed", border: "#fdba74" };
  return { label: "SIN ESTADO", icon: "?", color: "#475569", soft: "#f8fafc", border: "#cbd5e1" };
}

function InfoRow({ label, value }) {
  return <div className="sveDocRow"><span>{label}</span><strong>{value || "-"}</strong></div>;
}

function ContentCard({ icon, title, children, tone = "blue" }) {
  return <section className="sveDocCard sveDocContentCard"><div className={`sveDocSectionIcon ${tone}`}>{icon}</div><div className="sveDocSectionBody"><h2>{title}</h2><div className="sveDocText">{children || "-"}</div></div></section>;
}

export default function DocumentTemplate({ documentData }) {
  const professional = documentData?.professional || {};
  const patient = documentData?.patient || {};
  const info = documentData?.document || {};
  const status = statusConfig(documentData?.status);
  const title = formatTitle(professional.profession, professional.specialty);
  const days = licenseDays(info.licenseFrom, info.licenseTo);
  const isValid = String(documentData?.status).toLowerCase() === "valid";

  return <div className="sveDocPage">
    <style>{`
      .sveDocPage{--navy:#10214a;--blue:#315bea;--muted:#667085;--line:#e3e8f1;max-width:1120px;margin:24px auto;padding:0 18px 32px;font-family:Inter,Arial,sans-serif;color:var(--navy);box-sizing:border-box}.sveDocPage *{box-sizing:border-box}
      .sveDocToolbar{display:flex;justify-content:space-between;align-items:center;gap:18px;margin-bottom:22px;color:#697386;font-size:14px}.sveDocBreadcrumb{display:flex;gap:10px;align-items:center}.sveDocBack,.sveDocButton{border:1px solid #cfd7e6;background:#fff;color:#263755;border-radius:8px;padding:11px 16px;font-weight:700;text-decoration:none;cursor:pointer}.sveDocCard{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 24px rgba(15,34,72,.07)}
      .sveDocHeader{padding:28px 32px;display:grid;grid-template-columns:1fr auto;gap:30px}.sveDocIdentity{display:flex;gap:20px;align-items:center}.sveDocLogo{width:78px;height:78px;border-radius:14px;display:grid;place-items:center;background:linear-gradient(145deg,#315bea,#13265c);color:#fff;font-size:25px;font-weight:900}.sveDocHeader h1{font-size:29px;margin:0 0 8px}.sveDocSubtitle{color:var(--muted);margin:0}.sveDocMeta{display:grid;grid-template-columns:minmax(240px,1fr) minmax(180px,.7fr);gap:26px;margin:25px 0 0 98px}.sveDocMeta small,.sveDocLicense small,.sveDocCode small{display:block;color:var(--muted);margin-bottom:8px}.sveDocMeta strong{font-size:17px}.sveDocStatus{display:inline-flex;align-items:center;gap:10px;height:max-content;border-radius:10px;padding:14px 18px;font-size:19px;font-weight:900}
      .sveDocTwoColumns{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px}.sveDocInfo{padding:24px}.sveDocInfoTitle{display:flex;gap:12px;align-items:center;margin-bottom:14px}.sveDocInfoTitle i,.sveDocSectionIcon{width:44px;height:44px;border-radius:13px;display:grid;place-items:center;background:#eef2ff;color:#315bea;font-style:normal;font-size:20px;font-weight:800;flex:0 0 auto}.sveDocInfo h2,.sveDocContentCard h2{font-size:19px;margin:0}.sveDocPersonName{font-size:21px;margin:4px 0 12px}.sveDocProfession{color:var(--muted);font-weight:700;margin:-5px 0 12px}.sveDocRow{display:flex;justify-content:space-between;gap:20px;padding:13px 0;border-top:1px solid var(--line)}.sveDocRow span{color:var(--muted)}.sveDocRow strong{text-align:right}
      .sveDocContentCard{display:flex;gap:18px;padding:22px 24px;margin-top:20px}.sveDocSectionIcon.green{background:#e8f8ef;color:#16a36a}.sveDocSectionIcon.purple{background:#f0eaff;color:#7657df}.sveDocSectionBody{flex:1;min-width:0}.sveDocText{margin-top:12px;color:#44516b;line-height:1.7;white-space:pre-line}.sveDocLicense{display:grid;grid-template-columns:1fr 1fr 1fr;margin-top:14px}.sveDocLicense div{padding:6px 22px;border-left:1px solid var(--line)}.sveDocLicense div:first-child{padding-left:0;border-left:0}.sveDocLicense strong{font-size:17px}
      .sveDocVerification{display:grid;grid-template-columns:auto 1fr minmax(250px,.8fr);gap:26px;align-items:center;padding:24px;margin-top:20px}.sveDocQr{padding:10px;background:#fff;border:1px solid var(--line);border-radius:10px}.sveDocQrLabel{font-size:12px;text-align:center;margin-top:7px}.sveDocCode strong{display:block;font-size:16px;margin-bottom:12px;word-break:break-word}.sveDocCode p{margin:0;color:var(--muted);font-size:13px;line-height:1.55}.sveDocSignature{text-align:center}.sveDocSignature img{display:block;max-width:240px;max-height:115px;object-fit:contain;margin:0 auto 8px}.sveDocSignatureMissing{color:#98a2b3;margin:25px 0}.sveDocSignatureLine{border-top:1px solid #9aa5b8;padding-top:9px}.sveDocSignatureLine strong,.sveDocSignatureLine span{display:block;margin-top:4px}.sveDocSignatureLine span{font-size:13px;color:#526078}
      .sveDocActions{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;margin-top:22px}.sveDocButton.primary{background:#315bea;color:#fff;border-color:#315bea;min-width:260px}.sveDocValidationState{margin-top:20px;padding:17px 20px;border-radius:10px;border:1px solid;font-size:14px;line-height:1.6}.sveDocFooter{text-align:center;color:#7b879d;font-size:12px;margin-top:24px}
      @media(max-width:760px){.sveDocPage{padding:0 10px 24px}.sveDocBreadcrumb{display:none}.sveDocHeader{grid-template-columns:1fr;padding:22px}.sveDocIdentity{align-items:flex-start}.sveDocLogo{width:60px;height:60px}.sveDocHeader h1{font-size:23px}.sveDocMeta{grid-template-columns:1fr;margin:22px 0 0}.sveDocStatus{justify-self:start}.sveDocTwoColumns{grid-template-columns:1fr}.sveDocInfo{padding:20px}.sveDocRow{flex-direction:column;gap:5px}.sveDocRow strong{text-align:left}.sveDocLicense{grid-template-columns:1fr}.sveDocLicense div,.sveDocLicense div:first-child{padding:10px 0;border-left:0;border-top:1px solid var(--line)}.sveDocVerification{grid-template-columns:1fr;text-align:center}.sveDocQr{margin:auto}.sveDocButton{width:100%}}
      @media print{body{background:#fff!important}.sveDocPage{max-width:none;margin:0;padding:0}.sveDocToolbar,.sveDocActions{display:none!important}.sveDocCard{box-shadow:none;break-inside:avoid}.sveDocContentCard,.sveDocTwoColumns,.sveDocVerification{margin-top:12px}}
    `}</style>

    <div className="sveDocToolbar"><div className="sveDocBreadcrumb"><span>Inicio</span><b>›</b><span>Validación</span><b>›</b><strong>Documento</strong></div><a className="sveDocBack" href={VALIDATOR_URL}>← Volver al validador</a></div>
    <section className="sveDocCard sveDocHeader"><div><div className="sveDocIdentity"><div className="sveDocLogo">SVE</div><div><h1>Documento Profesional</h1><p className="sveDocSubtitle">{info.type || "Informe o certificado profesional"}</p></div></div><div className="sveDocMeta"><div><small>Código</small><strong>{documentData?.code || "-"}</strong></div><div><small>Emitido</small><strong>{formatDateTime(documentData?.createdAt || documentData?.issuedAt)}</strong></div></div></div><div className="sveDocStatus" style={{color:status.color,background:status.soft,border:`1px solid ${status.border}`}}><span>{status.icon}</span>{status.label}</div></section>

    <div className="sveDocTwoColumns">
      <section className="sveDocCard sveDocInfo"><div className="sveDocInfoTitle"><i>♙</i><h2>Datos del paciente</h2></div><h3 className="sveDocPersonName">{patient.fullName || "-"}</h3><InfoRow label="DNI" value={patient.dni}/><InfoRow label="Fecha de nacimiento" value={formatDate(patient.birthDate)}/><InfoRow label="Edad" value={patient.age ? `${patient.age} años` : "-"}/><InfoRow label="Sexo" value={patient.sex}/><InfoRow label="Cobertura" value={patient.healthCoverage}/><InfoRow label="Plan" value={patient.healthPlan}/><InfoRow label="N° de credencial" value={patient.credentialNumber}/></section>
      <section className="sveDocCard sveDocInfo"><div className="sveDocInfoTitle"><i>✚</i><h2>Profesional responsable</h2></div><h3 className="sveDocPersonName">Dr. {professional.fullName || "-"}</h3><p className="sveDocProfession">{title || "-"}</p><InfoRow label="Matrícula profesional" value={professional.licenseNumber}/><InfoRow label="Especialidad" value={professional.specialty || professional.profession}/><InfoRow label="Institución" value={professional.institution}/><InfoRow label="Correo electrónico" value={professional.email}/><InfoRow label="Teléfono" value={professional.phone}/><InfoRow label="CUIL" value={professional.cuil}/><InfoRow label="Código profesional" value={professional.professionalCode}/></section>
    </div>

    <ContentCard icon="▣" title="Diagnóstico (CIE-10)" tone="purple">{info.diagnosis}</ContentCard>
    <ContentCard icon="◇" title="Tratamiento farmacológico" tone="green">{info.treatment}</ContentCard>
    <ContentCard icon="≡" title="Indicaciones del profesional">{info.observations}</ContentCard>
    <section className="sveDocCard sveDocContentCard"><div className="sveDocSectionIcon">▣</div><div className="sveDocSectionBody"><h2>Licencia / Validez</h2><div className="sveDocLicense"><div><small>Desde</small><strong>{formatDate(info.licenseFrom)}</strong></div><div><small>Hasta</small><strong>{formatDate(info.licenseTo)}</strong></div><div><small>Duración</small><strong>{days === null ? "-" : `${days} días`}</strong></div></div></div></section>

    <section className="sveDocCard sveDocVerification"><div><div className="sveDocQr"><QRCodeSVG value={VALIDATOR_URL} size={132} level="H" title="Abrir el validador SVE"/></div><div className="sveDocQrLabel">Validar documento</div></div><div className="sveDocCode"><small>Código público</small><strong>{documentData?.code || "-"}</strong><p>La autenticidad e integridad de este documento puede verificarse en SVE mediante su código único.</p></div><div className="sveDocSignature">{professional.signatureUrl ? <img src={professional.signatureUrl} alt={`Firma de ${professional.fullName || "profesional"}`}/> : <div className="sveDocSignatureMissing">Firma profesional no registrada</div>}<div className="sveDocSignatureLine"><strong>Dr. {professional.fullName || "Profesional responsable"}</strong><span>{title || "-"}</span><span>{professional.licenseNumber || "-"}</span></div></div></section>
    <div className="sveDocValidationState" style={{color:status.color,background:status.soft,borderColor:status.border}}><strong>{status.label}.</strong> {isValid ? "Los datos visualizados coinciden con el registro de SVE al momento de su emisión." : "El documento permanece registrado, pero su estado actual impide considerarlo válido o vigente."}</div>
    <div className="sveDocActions">{documentData?.pdfUrl && <a className="sveDocButton primary" href={documentData.pdfUrl} target="_blank" rel="noreferrer">Abrir informe PDF</a>}<button type="button" className="sveDocButton primary" onClick={() => window.print()}>▣ Imprimir o guardar como PDF</button><a className="sveDocButton" href={VALIDATOR_URL}>← Volver al validador</a></div>
    <div className="sveDocFooter">Sistema de Validación Electrónica (SVE) · InformesPsicologicos.com</div>
  </div>;
}
