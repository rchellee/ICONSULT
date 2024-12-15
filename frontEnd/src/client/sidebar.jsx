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
        <h2>Welcome back! <br />
        {clientFirstName}</h2> 
      </div>
      
      <ul className="sidebar-links">
        <li>
          <Link to="/clientdashboard">
            <div className="material-symbols-outlined">home</div>
            <h4>Home</h4>
          </Link>
        </li>
        <li>
          <Link to="/clientproject">
          <div className="material-symbols-outlined">folder</div>
            <h4>My Projects</h4>
          </Link>
        </li>
        <li>
          <Link to="/consultations">
            <div className="material-symbols-outlined">analytics</div>
            <h4>Consultations</h4>
          </Link>
        </li>
        <li>
          <Link to="/payment">
            <div className="material-symbols-outlined">analytics</div>
            <h4>Payment</h4>
          </Link>
        </li>
        <li>
          <Link to="/account-settings">
            <div className="material-symbols-outlined">settings</div>
            <h4>Settings</h4>
          </Link>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn">
            <div className="material-symbols-outlined">logout</div>
            <h4>Logout</h4>
          </button>
        </li>
      </ul>

    </div>
  );
};

export default Sidebar;
