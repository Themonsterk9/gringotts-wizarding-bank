import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaMoneyBillWave,
  FaArrowCircleDown,
  FaExchangeAlt,
  FaHistory,
  FaUser,
  FaCog,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">
        Navigation
      </h2>

      <nav>
        <NavLink to="/dashboard" className="nav-item">
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/deposit" className="nav-item">
          <FaMoneyBillWave />
          <span>Deposit</span>
        </NavLink>

        <NavLink to="/withdraw" className="nav-item">
          <FaArrowCircleDown />
          <span>Withdraw</span>
        </NavLink>

        <NavLink to="/transfer" className="nav-item">
          <FaExchangeAlt />
          <span>Transfer</span>
        </NavLink>

        <NavLink to="/transactions" className="nav-item">
          <FaHistory />
          <span>Transactions</span>
        </NavLink>

        <NavLink to="/profile" className="nav-item">
          <FaUser />
          <span>Profile</span>
        </NavLink>

        <NavLink to="/settings" className="nav-item">
          <FaCog />
          <span>Settings</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;