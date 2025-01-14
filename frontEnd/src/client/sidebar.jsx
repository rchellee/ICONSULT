import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./client.css";
import client from "../assets/admin.jpg";

const Sidebar = () => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8081/notifications");
        const notifications = await response.json();
        const hasUnread = notifications.some((notif) => !notif.isRead);
        setHasUnreadNotifications(hasUnread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchUnreadNotifications();
  }, []);

  // Handle logout and clear local storage
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/");
  };

  // Retrieve the client's name from localStorage
  const clientFirstName = localStorage.getItem("firstName");
  const clientLastName = localStorage.getItem("lastName");

  return (
    <div className="sidebar">
      <ul className="sidebar-links">
        <li>
          <Link to="/clientproject" data-tooltip="Home">
            <div className="material-symbols-outlined icon">home</div>
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="/consultations" data-tooltip="Calendar">
            <div className="material-symbols-outlined icon">calendar_month</div>
            <span>Calendar</span>
          </Link>
        </li>
        <li>
          <Link
            to="/client-notif"
            data-tooltip="Notifications"
            className="notifications-link"
          >
            <div className="material-symbols-outlined icon">
              notifications
              {hasUnreadNotifications && (
                <span className="notification-mark"></span>
              )}
            </div>
            <span>Notifications</span>
          </Link>
        </li>
        <li>
          <Link to="/transact" data-tooltip="Transactions">
            <div className="material-symbols-outlined icon">payments</div>
            <span>Transactions</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
