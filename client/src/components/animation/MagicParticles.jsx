import { motion } from "framer-motion";

const particles = [...Array(35)];

const MagicParticles = () => {
  return (
    <>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "#FFD700",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            zIndex: 1,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
          }}
        />
      ))}
    </>
  );
};

export default MagicParticles;