import { motion } from "framer-motion";

const variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.98,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 18,
      duration: 0.6,
    },
  },

  exit: {
    opacity: 0,
    y: -30,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        width: "100%",
        minHeight: "100vh",
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;