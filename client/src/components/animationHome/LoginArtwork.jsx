import { motion } from "framer-motion";

import "./LoginArtwork.css";

const LoginArtwork = () => {
  return (
    <div className="login-artwork">

      <motion.div
        className="vault-wrapper"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >

        <div className="vault-glow"></div>

        <div className="vault-door">

          <div className="vault-ring"></div>

          <div className="vault-center"></div>

        </div>

      </motion.div>

      <motion.div
        className="login-text"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: .8,
        }}
      >

        <h1>🏦 Gringotts</h1>

        <h3>Wizarding Bank</h3>

        <p>

          Enter the safest vault
          in the Wizarding World.

        </p>

      </motion.div>

    </div>
  );
};

export default LoginArtwork;