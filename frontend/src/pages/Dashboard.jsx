import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import DashboardActions from "../components/dashboard/DashboardActions";
import RecentDocuments from "../components/dashboard/RecentDocuments";

import "./Dashboard.css";

export default function Dashboard() {

    return (

        <div className="dashboard-page">

            <DashboardHeader />

            <DashboardStats />

            <DashboardActions />

            <RecentDocuments />

            <div className="dashboard-section-header">

                <h2>Documentos recientes</h2>

                <button>
                    Ver todos
                </button>

            </div>

            <div className="dashboard-empty">

                Todavía no hay documentos para mostrar.

            </div>

        

        </div>

    );

}