import { motion } from "framer-motion";

const AnimatedButton = ({
  children,
  ...props
}) => {
  return (
    <motion.button
      whileHover={{
        scale: 1.05,
        boxShadow:
          "0 0 20px rgba(255,215,0,.45)",
      }}
      whileTap={{
        scale: 0.96,
      }}
      transition={{
        duration: 0.2,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;