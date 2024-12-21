import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./admin.css";
import admin from "../assets/admin.jpg";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={admin} alt="Admin Logo" />
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/calendar" data-tooltip="Calendar">
            <div className="material-symbols-outlined icon">calendar_month</div>
            <span>Calendar</span>
          </Link>
        </li>
        <li>
          <Link to="/admin" data-tooltip="Dashboard">
            <div className="material-symbols-outlined icon">dashboard</div>
            <span>Dashboard</span>
          </Link>
        </li>
        <li>
          <Link to="/notifications" data-tooltip="Notifications">
            <div className="material-symbols-outlined icon">notifications</div>
            <span>Notifications</span>
          </Link>
        </li>
        <li>
          <Link to="/project" data-tooltip="Projects">
            <div className="material-symbols-outlined icon">folder</div>
            <span>Projects</span>
          </Link>
        </li>
        <li>
          <Link to="/transactions" data-tooltip="Transactions">
            <div className="material-symbols-outlined icon">payments</div>
            <span>Transactions</span>
          </Link>
        </li>

        <li>
          <Link to="/reports" data-tooltip="Reports">
            <div className="material-symbols-outlined icon">analytics</div>
            <span>Reports</span>
          </Link>
        </li>
        <li>
          <Link to="/clients" data-tooltip="Clients">
            <div className="material-symbols-outlined icon">group</div>
            <span>Clients</span>
          </Link>
        </li>
        <li>
          <Link to="/employee" data-tooltip="Employees">
            <div className="material-symbols-outlined icon">badge</div>
            <span>Employees</span>
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="logout-btn"
            data-tooltip="Logout"
          >
            <div className="material-symbols-outlined icon">logout</div>
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
