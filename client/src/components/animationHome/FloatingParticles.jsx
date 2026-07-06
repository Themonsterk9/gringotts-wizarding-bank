import "./FloatingParticles.css";

const PARTICLES = Array.from({ length: 45 });

const FloatingParticles = () => {
  return (
    <div className="particles-container">
      {PARTICLES.map((_, index) => (
        <span
          key={index}
          className="magic-particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 18}s`,
            animationDuration: `${14 + Math.random() * 16}s`,
            opacity: 0.2 + Math.random() * 0.5,
            width: `${2 + Math.random() * 5}px`,
            height: `${2 + Math.random() * 5}px`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;