import { motion } from "framer-motion";

const coins = [...Array(12)];

const FloatingCoins = () => {
  return (
    <>
      {coins.map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: 18,
            zIndex: 2,
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
          }}
        >
          🪙
        </motion.div>
      ))}
    </>
  );
};

export default FloatingCoins;