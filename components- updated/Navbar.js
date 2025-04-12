import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>BudgetWise</h1>
      <ul>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/BudgetChecker">BudgetChecker</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/logout">Logout</Link></li> {/* ✅ Added logout link */}
      </ul>
    </nav>
  );
};

export default Navbar;
