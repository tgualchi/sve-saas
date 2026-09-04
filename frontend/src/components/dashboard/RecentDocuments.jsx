import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../services/supabase";

import "./RecentDocuments.css";

export default function RecentDocuments() {

    const { user } = useAuth();

    const navigate = useNavigate();

    const [documents, setDocuments] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if(user){

            loadDocuments();

        }

    },[user]);

    async function loadDocuments(){

        try{

            const { data: professional } = await supabase

                .from("professionals")

                .select("id")

                .eq("auth_user_id",user.id)

                .single();

            if(!professional) return;

            const { data } = await supabase

                .from("documents")

                .select(`
                    id,
                    public_code,
                    document_type,
                    issued_at,
                    status,
                    patients(
                        full_name
                    )
                `)

                .eq("professional_id",professional.id)

                .order("issued_at",{ascending:false})

                .limit(5);

            setDocuments(data || []);

        }

        finally{

            setLoading(false);

        }

    }

    function formatDate(date){

        if(!date) return "-";

        return new Date(date).toLocaleDateString("es-AR");

    }

    if(loading){

        return(

            <section className="recent-documents">

                Cargando documentos...

            </section>

        );

    }

        return (

        <section className="recent-documents">

            <div className="recent-documents-header">

                <h2>Documentos recientes</h2>

                <button
                    onClick={() => navigate("/documents")}
                >
                    Ver todos
                </button>

            </div>

            {

                documents.length === 0 ?

                (

                    <div className="recent-documents-empty">

                        Todavía no emitiste documentos.

                    </div>

                )

                :

                (

                    <table className="recent-documents-table">

                        <thead>

                            <tr>

                                <th>Código</th>

                                <th>Paciente</th>

                                <th>Tipo</th>

                                <th>Fecha</th>

                                <th>Estado</th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                documents.map(document => (

                                    <tr

                                        key={document.id}

                                        onClick={() => navigate(`/documents/${document.id}`)}

                                    >

                                        <td>

                                            <strong>

                                                {document.public_code}

                                            </strong>

                                        </td>

                                        <td>

                                            {document.patients?.full_name || "-"}

                                        </td>

                                        <td>

                                            {document.document_type}

                                        </td>

                                        <td>

                                            {formatDate(document.issued_at)}

                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    document.status === "VALIDO"
                                                        ? "recent-status valid"
                                                        : "recent-status invalid"
                                                }
                                            >

                                                {document.status}

                                            </span>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                )

            }

        </section>

    );

}