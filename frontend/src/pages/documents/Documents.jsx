import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";
import "./Documents.css";

export default function Documents() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  async function loadDocuments() {
    try {
      setLoading(true);

      const { data: professional, error: professionalError } = await supabase
        .from("professionals")
        .select("id")
        .eq("auth_user_id", user.id)
        .single();

      if (professionalError || !professional) {
        alert("No se encontró el perfil profesional.");
        return;
      }

      const { data, error } = await supabase
        .from("documents")
        .select(`
          *,
          patients (
            full_name,
            dni
          )
        `)
        .eq("professional_id", professional.id)
        .order("issued_at", { ascending: false });

      if (error) {
        alert(error.message);
        return;
      }

      setDocuments(data || []);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los documentos.");
    } finally {
      setLoading(false);
    }
  }

  const filteredDocuments = useMemo(() => {
    if (!search.trim()) {
      return documents;
    }

    const text = search.trim().toLowerCase();

    return documents.filter((document) => {
      const publicCode = document.public_code?.toLowerCase() || "";
      const documentType = document.document_type?.toLowerCase() || "";
      const status = document.status?.toLowerCase() || "";
      const patientName = document.patients?.full_name?.toLowerCase() || "";
      const patientDni = document.patients?.dni || "";

      return (
        publicCode.includes(text) ||
        documentType.includes(text) ||
        status.includes(text) ||
        patientName.includes(text) ||
        patientDni.includes(search.trim())
      );
    });
  }, [documents, search]);

  function formatDate(date) {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("es-AR");
  }

  if (loading) {
    return (
      <div className="documents-loading">
        Cargando documentos...
      </div>
    );
  }

  return (
    <main className="documents-page">
      <div className="documents-header">

  <div>

    <span
      style={{
        color: "#2563eb",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "1px",
        fontSize: "13px"
      }}
    >
      Gestión documental
    </span>

    <h1>Documentos</h1>

    <p>
      Administre todos los certificados e informes emitidos.
      <br />
      <strong>
        {documents.length} documento
        {documents.length !== 1 ? "s" : ""} registrado
        {documents.length !== 1 ? "s" : ""}
      </strong>
    </p>

  </div>

  <button
    type="button"
    className="documents-back-button"
    onClick={() => navigate("/dashboard")}
  >
    ← Dashboard
  </button>

</div>

      <div className="documents-search-wrapper">
        <input
          type="text"
          className="documents-search"
          placeholder="Buscar por código, paciente, DNI, tipo o estado..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {filteredDocuments.length === 0 ? (
        <div className="documents-empty">
          {documents.length === 0
            ? "No hay documentos emitidos."
            : "No se encontraron documentos con esa búsqueda."}
        </div>
      ) : (
        <div className="documents-table-wrapper">
          <table className="documents-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Paciente</th>
                <th>DNI</th>
                <th>Tipo</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {filteredDocuments.map((document) => (
                <tr
                  key={document.id}
                  onClick={() => navigate(`/documents/${document.id}`)}
                >
                  <td className="documents-code">
                    {document.public_code}
                  </td>

                  <td>
                    {document.patients?.full_name || "-"}
                  </td>

                  <td>
                    {document.patients?.dni || "-"}
                  </td>

                  <td>
                    {document.document_type || "-"}
                  </td>

                  <td>
                    {formatDate(document.issued_at)}
                  </td>

                  <td>
                    <span
                      className={
                        document.status === "VALIDO"
                          ? "documents-status documents-status-valid"
                          : "documents-status documents-status-invalid"
                      }
                    >
                      {document.status || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}