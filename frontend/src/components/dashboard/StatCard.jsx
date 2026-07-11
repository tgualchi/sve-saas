import "./StatCard.css";

export default function StatCard({

    icon,
    title,
    value,
    subtitle

}) {

    return (

        <div className="stat-card">

            <div className="stat-icon">

                {icon}

            </div>

            <div>

                <h3>{title}</h3>

                <h2>{value}</h2>

                <span>{subtitle}</span>

            </div>

        </div>

    );

}