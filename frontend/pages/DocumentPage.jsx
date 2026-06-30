import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}


function DocumentPage() {
  const { code } = useParams();

  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocument() {
      try {
        const response = await fetch(`${API_URL}/api/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            code
          })
        });

        const data = await response.json();

        console.log(response.status);
        console.log(data);

        if (data.valid) {
          setDocumentData(data);
        } else {
          setDocumentData(null);
        }
      } catch (error) {
        setDocumentData(null);
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [code]);

  if (loading) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        Cargando documento...
      </div>
    );
  }

  if (!documentData) {
    return (
      <div style={{ padding: "60px", textAlign: "center" }}>
        Documento no encontrado.
      </div>
    );
  }

  return (
  <div
    style={{
      maxWidth: "900px",
      margin: "40px auto",
      fontFamily: "Arial, sans-serif",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "30px",
      boxShadow: "0 2px 8px rgba(0,0,0,.08)"
    }}
  >
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
        {documentData.code}
      </div>

      <div
        style={{
          fontSize: "12px",
          color: "#9ca3af",
          marginTop: "4px",
          marginBottom: "25px"
        }}
      >
        Escanee para verificar la autenticidad del documento
      </div>
    </div>

    <div
      style={{
        background: "#ecfdf5",
        border: "1px solid #10b981",
        borderRadius: "8px",
        padding: "14px",
        textAlign: "center",
        marginBottom: "25px"
      }}
    >
      <strong
        style={{
          color: "#059669",
          fontSize: "16px"
        }}
      >
        ✅ DOCUMENTO VÁLIDO Y VERIFICADO
      </strong>
    </div>

    <div
      style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
      }}
    >
      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
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
    <h3
      style={{
        borderBottom: "1px solid #ddd",
        paddingBottom: "8px"
      }}
    >
      Profesional Responsable
    </h3>

    <p>
      <strong>{documentData.professional?.fullName}</strong>
      <br />
      {documentData.professional?.profession}
      <br />
      {documentData.professional?.licenseNumber}
    </p>
  </div>

  <div
    style={{
      flex: 1,
      minWidth: "250px"
    }}
  >
    <h3
  style={{
    borderBottom: "1px solid #ddd",
    paddingBottom: "8px"
  }}
>
  Datos del Paciente
</h3>

<p>
  <strong>Nombre:</strong> {documentData.patient?.fullName}
  <br />

  <strong>DNI:</strong> {documentData.patient?.dni}
  <br />

  <strong>Fecha de nacimiento:</strong>{" "}
{formatDate(documentData.patient?.birthDate)}
  <br />

  <strong>Edad:</strong> {documentData.patient?.age} años
</p>

</div> {/* ← Acá termina la columna del paciente */}

</div> {/* ← Acá termina el display:flex */}

<div style={{ marginTop: "25px" }}>
  <h3
    style={{
      borderBottom: "1px solid #ddd",
      paddingBottom: "8px"
    }}
  >
    Datos del Informe o Certificado
  </h3>

  <p>
    <strong>Código:</strong> {documentData.code}
    <br />

    <strong>Fecha de emisión:</strong> {formatDate(documentData.issuedAt)}
    <br />

    <strong>Tipo:</strong> {documentData.document?.type || "-"}
  </p>
</div>

{/* ← ACÁ PEGÁS EL NUEVO BLOQUE */}

<div style={{ marginTop: "25px" }}>
  <h3
    style={{
      borderBottom: "1px solid #ddd",
      paddingBottom: "8px"
    }}
  >
    Tipo de Documento
  </h3>

  <p>
    <strong>{documentData.document?.type || "-"}</strong>

    {documentData.document?.licenseFrom &&
      documentData.document?.licenseTo && (
        <>
          <br />
          <br />

          <strong>Período de licencia:</strong>
          <br />

          Desde el{" "}
          <strong>
            {formatDate(documentData.document.licenseFrom)}
          </strong>

          {" "}hasta el{" "}

          <strong>
            {formatDate(documentData.document.licenseTo)}
          </strong>

          {" "}inclusive.
        </>
      )}
  </p>
</div>
    </div>
  </div>
);
}

export default DocumentPage;