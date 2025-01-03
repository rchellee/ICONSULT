/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./client.css";
import client from "../assets/admin.jpg";

const Sidebar = () => {
  const navigate = useNavigate();

  // Handle logout and clear local storage
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate('/');
  };

  // Retrieve the client's name from localStorage
  const clientFirstName = localStorage.getItem("firstName");
  const clientLastName = localStorage.getItem("lastName");

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <img src={client} alt="Client Logo" />
      </div>

      <ul className="sidebar-links">
        <li>
          <Link to="/clientdashboard" data-tooltip="Home">
            <div className="material-symbols-outlined icon">home</div>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/clientproject" data-tooltip="My Projects">
            <div className="material-symbols-outlined icon">folder</div>
            <span>Projects</span>
          </Link>
        </li>
        <li>
          <Link to="/consultations" data-tooltip="Consultations">
            <div className="material-symbols-outlined icon">chat</div>
            <span>Consultations</span>
          </Link>
        </li>
        <li>
          <Link to="/client-notif" data-tooltip="Notifications">
            <div className="material-symbols-outlined icon">notifications</div>
            <span>Notifications</span>
          </Link>
        </li>
        <li>
          <Link to="/transact" data-tooltip="Transactions">
            <div className="material-symbols-outlined icon">payments</div>
            <span>Transactions</span>
          </Link>
        </li>
        <li>
          <Link to="/account-settings" data-tooltip="Settings">
            <div className="material-symbols-outlined icon">settings</div>
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
