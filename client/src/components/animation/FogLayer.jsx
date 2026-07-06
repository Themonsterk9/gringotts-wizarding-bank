import { motion } from "framer-motion";

const FogLayer = () => {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "radial-gradient(circle,#ffffff08 0%,transparent 70%)",
        filter: "blur(40px)",
        zIndex: 0,
      }}
      animate={{
        x: [-80, 80, -80],
      }}
      transition={{
        duration: 25,
        repeat: Infinity,
      }}
    />
  );
};

export default FogLayer;