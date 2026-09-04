import { useParams, useNavigate } from "react-router-dom";
import "./Document.css";

export default function Document() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <main className="document-page">
      <div className="document-card">
        <h1>Ficha del Documento</h1>

        <p>
          <strong>ID:</strong> {id}
        </p>

        <p>
          Esta es una versión temporal para comprobar que la navegación funciona.
        </p>

        <button
          className="document-button"
          onClick={() => navigate("/documents")}
        >
          Volver
        </button>
      </div>
    </main>
  );
}