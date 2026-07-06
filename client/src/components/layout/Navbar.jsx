import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle, FaSignOutAlt } from "react-icons/fa";

import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">

      <div className="navbar-logo">
        <Link to="/dashboard">
          🏦 Gringotts Wizarding Bank
        </Link>
      </div>

      <div className="navbar-right">

        <button className="icon-btn">
          <FaBell />
        </button>

        <div className="profile">
          <FaUserCircle size={28} />
          <span>Wizard</span>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>

    </header>
  );
};

export default Navbar;