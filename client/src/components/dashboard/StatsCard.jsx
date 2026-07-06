import "./StatsCard.css";
import AnimatedCounter from "../animation/AnimatedCounter";

const StatsCard = ({
  title,
  value,
  icon = "📊",
  color = "#2563eb",
}) => {
  return (
    <div
      className="stats-card"
      style={{
        borderLeft: `6px solid ${color}`,
      }}
    >
      <div className="stats-icon">
        {icon}
      </div>

      <div className="stats-content">

        <h3>{title}</h3>

        <div className="stats-value">

          <AnimatedCounter
            end={value}
            duration={2}
          />

        </div>

      </div>

    </div>
  );
};

export default StatsCard;