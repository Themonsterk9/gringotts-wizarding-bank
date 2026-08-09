import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const AnimatedInput = ({
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  required = false,
  style = {},
  ...props
}) => {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  const baseInputStyle = {
    width: "100%",
    padding: isPassword ? "14px 48px 14px 16px" : "14px 16px",
    borderRadius: "10px",
    border: "1px solid rgba(255,215,0,0.35)",
    outline: "none",
    fontSize: "16px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",
    backdropFilter: "blur(10px)",
    marginBottom: isPassword ? "0px" : "16px",
    boxSizing: "border-box",
    ...style,
  };

  const inputElement = (
    <motion.input
      type={inputType}
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
      style={baseInputStyle}
      {...props}
    />
  );

  if (!isPassword) {
    return inputElement;
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        marginBottom: "16px",
      }}
    >
      {inputElement}
      <button
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        title={showPassword ? "Hide password" : "Show password"}
        onClick={(e) => {
          e.preventDefault();
          setShowPassword((prev) => !prev);
        }}
        style={{
          position: "absolute",
          right: "14px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "#ffd700",
          cursor: "pointer",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px",
          zIndex: 2,
          outline: "none",
        }}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

export default AnimatedInput;