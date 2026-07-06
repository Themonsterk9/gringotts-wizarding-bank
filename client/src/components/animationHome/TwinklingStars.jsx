import { useMemo } from "react";
import "./TwinklingStars.css";

const STAR_COUNT = 140;

const TwinklingStars = () => {
  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 3,
        delay: Math.random() * 10,
        duration: 2 + Math.random() * 5,
        opacity: 0.2 + Math.random() * 0.8,
      })),
    []
  );

  return (
    <div className="stars-container">
      {stars.map((star, index) => (
        <span
          key={index}
          className="star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default TwinklingStars;