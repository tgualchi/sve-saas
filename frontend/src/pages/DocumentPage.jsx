import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DocumentTemplate from "../components/DocumentTemplate";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function DocumentPage() {
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

        if (data.valid) {
          setDocumentData(data);
        } else {
          setDocumentData(null);
        }
      } catch (err) {
        console.error(err);
        setDocumentData(null);
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [code]);

  if (loading) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
          fontFamily: "Arial"
        }}
      >
        Cargando documento...
      </div>
    );
  }

  if (!documentData) {
    return (
      <div
        style={{
          padding: "60px",
          textAlign: "center",
          fontFamily: "Arial"
        }}
      >
        Documento no encontrado.
      </div>
    );
  }

  return <DocumentTemplate documentData={documentData} />;
}