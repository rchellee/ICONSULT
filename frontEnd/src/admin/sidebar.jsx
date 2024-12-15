/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./admin.css";
import admin from "../assets/admin.jpg";

const Sidebar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate('/');
  };
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={admin} alt="Admin Logo" />
        <h2>Admin</h2> {/* Appears when sidebar is expanded */}
      </div>
      <ul className="sidebar-links">
        <li>
          <Link to="/calendar">
            <div className="material-symbols-outlined">calendar_month</div>
            <h4>Calendar</h4>
          </Link>
        </li>
        <li>
          <Link to="/admin">
            <div className="material-symbols-outlined">dashboard</div>
            <h4>Dashboard</h4>
          </Link>
        </li>
        <li>
          <Link to="/notifications">
            <div className="material-symbols-outlined">notifications</div>
            <h4>Notification</h4>
          </Link>
        </li>
        <li>
          <Link to="/project">
            <div className="material-symbols-outlined">folder</div>
            <h4>Projects</h4>
          </Link>
        </li>
        <li>
          <Link to="/reports">
            <div className="material-symbols-outlined">analytics</div>
            <h4>Reports</h4>
          </Link>
        </li>
        <li>
          <Link to="/clients">
            <div className="material-symbols-outlined">group</div>
            <h4>Clients</h4>
          </Link>
        </li>
        <li>
          <Link to="/employee">
            <div className="material-symbols-outlined">badge</div>
            <h4>Employees</h4>
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            <div className="material-symbols-outlined">logout</div>
            <h4>Logout</h4>
          </button>
        </li>
      </ul>

      <div className="user-account">
        <div className="user-profile">
          <img src={admin} alt="User Profile" />
          <div className="user-detail">
            <h3>John Doe</h3>
            <span>Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
