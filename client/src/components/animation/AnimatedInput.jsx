import { motion } from "framer-motion";

const AnimatedInput = ({
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  required = false,
  ...props
}) => {
  return (
    <motion.input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      whileFocus={{
        scale: 1.02,
        boxShadow: "0 0 20px rgba(255,215,0,0.45)",
      }}
      transition={{
        duration: 0.2,
      }}
      style={{
        width: "100%",
        padding: "14px 16px",
        borderRadius: "10px",
        border: "1px solid rgba(255,215,0,0.35)",
        outline: "none",
        fontSize: "16px",
        background: "rgba(255,255,255,0.08)",
        color: "#fff",
        backdropFilter: "blur(10px)",
        marginBottom: "16px",
        boxSizing: "border-box",
      }}
      {...props}
    />
  );
};

export default AnimatedInput;