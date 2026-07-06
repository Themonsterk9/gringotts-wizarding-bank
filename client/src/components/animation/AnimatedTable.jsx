import { motion } from "framer-motion";

const tableVariants = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const AnimatedTable = ({ children }) => {
  return (
    <motion.tbody
      variants={tableVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.tbody>
  );
};

export default AnimatedTable;