import { motion } from "framer-motion";

const rowVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};

const AnimatedRow = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <motion.tr
      variants={rowVariants}
      whileHover={{
        scale: 1.01,
        backgroundColor: "rgba(255,215,0,0.08)",
      }}
      transition={{
        duration: 0.2,
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.tr>
  );
};

export default AnimatedRow;