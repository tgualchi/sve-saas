import React from "react";

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
  marginTop: "25px"
};

const sectionTitleStyle = {
  borderBottom: "1px solid #ddd",
  paddingBottom: "8px"
};

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
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

      <img
        src="https://i.ibb.co/zVzzjG4L/Dise-o-sin-t-tulo-6.png"
        alt="QR"
        style={{
          width: "180px",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "10px",
          background: "#fff"
        }}
      />

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
        ✅ {config.text}
      </strong>

    </div>

  );

}

export default function DocumentTemplate({ documentData }) {

  const professional = documentData?.professional || {};
  const patient = documentData?.patient || {};
  const documentInfo = documentData?.document || {};

  const status = getStatus(documentData?.status);

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

          <p>

            <strong>{professional.fullName}</strong>

            <br />

            {professional.profession}

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

          <p>

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

        <p>

          <strong>Código:</strong> {documentData.code}

          <br />

          <strong>Fecha de emisión:</strong>{" "}
          {formatDate(documentData.issuedAt)}

          <br />

          <strong>Tipo:</strong>{" "}
          {documentInfo.type || "-"}

        </p>

      </div>

      <div style={sectionStyle}>

        <h3 style={sectionTitleStyle}>
          Tipo de Documento
        </h3>

        <p>

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

        <p>

          {documentInfo.diagnosis || "-"}

        </p>

      </div>

      <div style={sectionStyle}>

        <h3 style={sectionTitleStyle}>
          Tratamiento Farmacológico
        </h3>

        <p>

          {documentInfo.treatment || "-"}

        </p>

      </div>
            <div
        style={{
          marginTop: "25px",
          background: "#ecfdf5",
          border: "1px solid #10b981",
          borderRadius: "8px",
          padding: "18px"
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: "12px",
            color: "#059669"
          }}
        >
          ✅ Estado de Validación
        </h3>

        <p
          style={{
            marginBottom: 0,
            color: "#065f46",
            lineHeight: 1.6
          }}
        >
          <strong>Documento válido y verificado.</strong>

          <br />

          La autenticidad e integridad del presente documento
          han sido confirmadas mediante el Sistema de
          Validación Electrónica (SVE).

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