import { motion } from "framer-motion";

const AnimatedCard = ({ children, className = "" }) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.45,
      }}
      whileHover={{
        y: -4,
      }}
      style={{
        width: "100%",
      }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;