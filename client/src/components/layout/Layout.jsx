import "./Layout.css";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";
import AnimatedBackground from "../animation/AnimatedBackground";

const Layout = ({ children }) => {
  const { darkMode } = useTheme();

  return (
    <AnimatedBackground>
      <div className={`layout ${darkMode ? "dark-theme" : ""}`}>
        <Navbar />

        <div className="layout-container">
          <Sidebar />

          <main className="main-content">
            {children}
          </main>
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default Layout;