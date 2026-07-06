import { motion } from "framer-motion";

import FloatingCoins from "./FloatingCoins";
import MagicParticles from "./MagicParticles";
import FogLayer from "./FogLayer";

import "./AnimatedBackground.css";

const AnimatedBackground = ({ children }) => {
  return (
    <div className="animated-bg">

      <div className="gradient-layer" />

      <FogLayer />

      <MagicParticles />

      <FloatingCoins />

      <motion.div
        className="content-layer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
        }}
      >
        {children}
      </motion.div>

    </div>
  );
};

export default AnimatedBackground;