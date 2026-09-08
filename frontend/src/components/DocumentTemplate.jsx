import React from "react";
import { QRCodeSVG } from "qrcode.react";

const cardStyle = {
  maxWidth: "900px",
  margin: "40px auto",
  fontFamily: "Arial, sans-serif",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 2px 8px rgba(0,0,0,.08)"
};

const sectionStyle = {
  marginTop: "34px"
};

const sectionTitleStyle = {
  borderBottom: "1px solid #ddd",
  paddingBottom: "10px",
  marginBottom: "18px"
};

const sectionContentStyle = {
  marginTop: 0,
  lineHeight: 1.65
};

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function formatDateTime(date) {
  if (!date) return "-";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return formatDate(date);

  return value.toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatProfessionalTitle(profession, specialty) {
  const normalize = (value) => String(value || "")
    .trim()
    .replace(/\bmedico\b/gi, "MÉDICO")
    .replace(/\bpsicologo\b/gi, "PSICÓLOGO")
    .replace(/\bpsiquiatria\b/gi, "PSIQUIATRA")
    .toUpperCase();

  const normalizedProfession = normalize(profession);
  const normalizedSpecialty = normalize(specialty);

  if (!normalizedSpecialty) return normalizedProfession;
  if (!normalizedProfession || normalizedSpecialty.includes(normalizedProfession)) {
    return normalizedSpecialty;
  }

  return `${normalizedProfession} ${normalizedSpecialty}`;
}

function getStatus(status) {
  switch (String(status).toLowerCase()) {
    case "valid":
      return {
        text: "DOCUMENTO VÁLIDO Y VERIFICADO",
        background: "#ecfdf5",
        border: "#10b981",
        color: "#059669"
      };

    case "revoked":
      return {
        text: "DOCUMENTO REVOCADO",
        background: "#fef2f2",
        border: "#ef4444",
        color: "#dc2626"
      };

    case "anulado":
    case "annulled":
    case "canceled":
    case "cancelled":
      return {
        text: "DOCUMENTO ANULADO",
        background: "#fff7ed",
        border: "#f97316",
        color: "#c2410c"
      };

    default:
      return {
        text: "DOCUMENTO",
        background: "#f9fafb",
        border: "#d1d5db",
        color: "#374151"
      };
  }
}

function Header({ code }) {
  const documentUrl = `${window.location.origin}/d/${encodeURIComponent(code)}`;

  return (
    <div style={{ textAlign: "center" }}>
      <h2
        style={{
          marginTop: 0,
          marginBottom: "15px",
          color: "#1f2937",
          fontSize: "32px",
          fontWeight: 700
        }}
      >
        Validación de Documento Profesional
      </h2>

      <div
        aria-label={`Código QR para verificar el documento ${code}`}
        style={{
          width: "180px",
          margin: "0 auto",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "10px",
          background: "#fff",
          boxSizing: "border-box"
        }}
      >
        <QRCodeSVG
          value={documentUrl}
          size={158}
          level="H"
          includeMargin={false}
          title={`Verificar documento ${code}`}
        />
      </div>

      <div
        style={{
          marginTop: "10px",
          fontWeight: "bold",
          color: "#6b7280"
        }}
      >
        {code}
      </div>

      <div
        style={{
          marginTop: "4px",
          marginBottom: "25px",
          fontSize: "12px",
          color: "#9ca3af"
        }}
      >
        Escanee para verificar la autenticidad del documento
      </div>
    </div>
  );
}

function StatusBanner({ status }) {

  const config = getStatus(status);

  return (

    <div
      style={{
        background: config.background,
        border: `1px solid ${config.border}`,
        borderRadius: "8px",
        padding: "14px",
        textAlign: "center",
        marginBottom: "25px"
      }}
    >

      <strong
        style={{
          color: config.color,
          fontSize: "16px"
        }}
      >
        {String(status).toLowerCase() === "valid" ? "✅" : "⚠️"} {config.text}
      </strong>

    </div>

  );

}

export default function DocumentTemplate({ documentData }) {

  const professional = documentData?.professional || {};
  const patient = documentData?.patient || {};
  const documentInfo = documentData?.document || {};

  const status = getStatus(documentData?.status);
  const isValid = String(documentData?.status).toLowerCase() === "valid";
  const professionalTitle = formatProfessionalTitle(
    professional.profession,
    professional.specialty
  );
  const emissionDate = documentData.createdAt || documentData.issuedAt;

  return (
    <div style={cardStyle}>

      <Header code={documentData.code} />

      <StatusBanner status={documentData.status} />

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap"
        }}
      >

        <div
          style={{
            flex: 1,
            minWidth: "250px"
          }}
        >

          <h3 style={sectionTitleStyle}>
            Profesional Responsable
          </h3>

          <p style={sectionContentStyle}>

            <strong>{professional.fullName?.toUpperCase() || "-"}</strong>

            <br />

            {professionalTitle || "-"}

            <br />

            {professional.licenseNumber}

          </p>

        </div>

        <div
          style={{
            flex: 1,
            minWidth: "250px"
          }}
        >

          <h3 style={sectionTitleStyle}>
            Datos del Paciente
          </h3>

          <p style={sectionContentStyle}>

            <strong>Nombre:</strong> {patient.fullName || "-"}

            <br />

            <strong>DNI:</strong> {patient.dni || "-"}

            <br />

            <strong>Fecha de nacimiento:</strong>{" "}
            {formatDate(patient.birthDate)}

            <br />

            <strong>Edad:</strong>{" "}
            {patient.age ? `${patient.age} años` : "-"}

          </p>

        </div>

      </div>
            <div style={sectionStyle}>

        <h3 style={sectionTitleStyle}>
          Datos del Informe o Certificado
        </h3>

        <p style={sectionContentStyle}>

          <strong>Código:</strong> {documentData.code}

          <br />

          <strong>Fecha y hora de emisión:</strong>{" "}
          {formatDateTime(emissionDate)}

          <br />

          <strong>Tipo:</strong>{" "}
          {documentInfo.type || "-"}

        </p>

      </div>

      <div style={sectionStyle}>

        <h3 style={sectionTitleStyle}>
          Tipo de Documento
        </h3>

        <p style={sectionContentStyle}>

          <strong>
            {documentInfo.type || "-"}
          </strong>

          {documentInfo.licenseFrom &&
            documentInfo.licenseTo && (
              <>

                <br />
                <br />

                <strong>
                  Período de licencia
                </strong>

                <br />

                Desde el{" "}

                <strong>
                  {formatDate(documentInfo.licenseFrom)}
                </strong>

                {" "}hasta el{" "}

                <strong>
                  {formatDate(documentInfo.licenseTo)}
                </strong>

                {" "}inclusive.

              </>
            )}

        </p>

      </div>

      <div style={sectionStyle}>

        <h3 style={sectionTitleStyle}>
          Diagnóstico (CIE-10)
        </h3>

        <p style={sectionContentStyle}>

          {documentInfo.diagnosis || "-"}

        </p>

      </div>

      <div style={sectionStyle}>

        <h3 style={sectionTitleStyle}>
          Tratamiento Farmacológico
        </h3>

        <p style={sectionContentStyle}>

          {documentInfo.treatment || "-"}

        </p>

      </div>

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>
          Indicaciones del Profesional
        </h3>

        <p style={sectionContentStyle}>
          {documentInfo.observations || "-"}
        </p>
      </div>

      <div
        style={{
          ...sectionStyle,
          textAlign: "center",
          paddingTop: "12px"
        }}
      >
        {professional.signatureUrl ? (
          <img
            src={professional.signatureUrl}
            alt={`Firma de ${professional.fullName || "profesional"}`}
            style={{
              display: "block",
              maxWidth: "220px",
              maxHeight: "100px",
              objectFit: "contain",
              margin: "0 auto 8px"
            }}
          />
        ) : (
          <div style={{ color: "#9ca3af", marginBottom: "12px" }}>
            Firma profesional no registrada
          </div>
        )}

        <div style={{ borderTop: "1px solid #374151", maxWidth: "300px", margin: "0 auto", paddingTop: "8px" }}>
          <strong>{professional.fullName?.toUpperCase() || "PROFESIONAL RESPONSABLE"}</strong>
          <br />
          <span>{professionalTitle || "-"}</span>
          <br />
          <span>{professional.licenseNumber || "-"}</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginTop: "30px"
        }}
      >
        {documentData.pdfUrl && (
          <a
            href={documentData.pdfUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: "12px 18px",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700
            }}
          >
            Abrir informe PDF
          </a>
        )}

        <button
          type="button"
          onClick={() => window.print()}
          style={{
            padding: "12px 18px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            background: "#fff",
            color: "#1f2937",
            cursor: "pointer",
            fontWeight: 700
          }}
        >
          Imprimir o guardar como PDF
        </button>
      </div>
            <div
        style={{
          marginTop: "25px",
          background: status.background,
          border: `1px solid ${status.border}`,
          borderRadius: "8px",
          padding: "18px"
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: "12px",
            color: status.color
          }}
        >
          {isValid ? "✅" : "⚠️"} Estado de Validación
        </h3>

        <p
          style={{
            marginBottom: 0,
            color: status.color,
            lineHeight: 1.6
          }}
        >
          <strong>{status.text}.</strong>

          <br />

          {isValid
            ? "La autenticidad e integridad del presente documento han sido confirmadas mediante el Sistema de Validación Electrónica (SVE)."
            : "El documento existe en el registro de SVE, pero su estado actual impide considerarlo válido o vigente."}

          <br />
          <br />

          Los datos visualizados coinciden con los registrados
          al momento de su emisión y corresponden al documento
          identificado con el código indicado en esta página.
        </p>
      </div>

      <div
        style={{
          marginTop: "30px",
          paddingTop: "15px",
          borderTop: "1px solid #e5e7eb",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "13px"
        }}
      >
        Sistema de Validación Electrónica (SVE)

        <br />

        InformesPsicologicos.com
      </div>

    </div>
  );
}
