/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./client.css";
import client from "../assets/admin.jpg";

const Sidebar = () => {
  const navigate = useNavigate();
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
        <h2>Welcome back! <br />
        {clientFirstName}</h2> 
      </div>
      <ul className="sidebar-links">
      <li>
    <Link to="/client">
        <span className="material-symbols-outlined">dashboard</span>
        <h4>Dashboard</h4>
    </Link>
        </li>
        <li>
          <Link to="/projectlist">
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
          <img src={client} alt="User Profile" />
          <div className="user-detail">
            <h3>{clientFirstName} {clientLastName}</h3>
            <span>USER</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
