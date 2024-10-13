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
            <span className="material-symbols-outlined">calendar_month</span>
            <h4>Calendar</h4>
          </Link>
        </li>
        <li>
          <Link to="/admin">
            <span className="material-symbols-outlined">dashboard</span>
            <h4>Dashboard</h4>
          </Link>
        </li>
        <li>
          <Link to="/project">
            <span className="material-symbols-outlined">folder</span>
            <h4>Projects</h4>
          </Link>
        </li>
        <li>
          <Link to="/reports">
            <span className="material-symbols-outlined">analytics</span>
            <h4>Reports</h4>
          </Link>
        </li>
        {/* <li>
          <Link to="/create">
            <span className="material-symbols-outlined">add_circle</span>
            <h4>Create</h4>
          </Link>
        </li> */}
        <li>
          <Link to="/clients">
            <span className="material-symbols-outlined">group</span>
            <h4>Clients</h4>
          </Link>
        </li>
        <li>
          <Link to="/employee">
            <span className="material-symbols-outlined">badge</span>
            <h4>Employees</h4>
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            <span className="material-symbols-outlined">logout</span>
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
