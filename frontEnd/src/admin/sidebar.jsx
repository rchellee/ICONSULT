import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./admin.css";
import admin from "../assets/admin.jpg";

const Sidebar = () => {
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8081/notifications");
        const notifications = await response.json();
        const hasUnread = notifications.some((notif) => !notif.isReadAdmin);
        setHasUnreadNotifications(hasUnread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchUnreadNotifications();
  }, []);

  return (
    <div className="sidebar">
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
          <Link
            to="/notifications"
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
      </ul>
    </div>
  );
};

export default Sidebar;
