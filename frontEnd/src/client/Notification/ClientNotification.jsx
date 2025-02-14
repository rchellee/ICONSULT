import React, { useState, useEffect } from "react";
import "./clientNotification.css"; // Import the CSS for styling
import Sidebar from "../sidebar";
import Topbar from "../Topbar";

const ClientNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const normalizeDate = (timestamp) => new Date(timestamp).toISOString();

  // Fetch clientId from localStorage
  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    const fetchClientNotifications = async () => {
      if (!clientId) {
        console.error("Client ID is missing. Please log in again.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8081/notifications/${clientId}`
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        } else {
          console.error("Failed to fetch client notifications.");
        }
      } catch (error) {
        console.error("Error fetching client notifications:", error);
      }
    };

    fetchClientNotifications();
  }, [clientId]);

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8081/notifications/${id}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        const updatedNotifications = notifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        );
        setNotifications(updatedNotifications);
      } else {
        console.error("Failed to mark notification as read.");
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC", // Ensures consistent timezone display
    });
    return formatter.format(date);
  };

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((notification) => !notification.isRead);

  const newNotifications = filteredNotifications.filter(
    (notification) => new Date(notification.timestamp) >= startOfToday
  );

  const earlierNotifications = filteredNotifications.filter(
    (notification) => new Date(notification.timestamp) < startOfToday
  );

  return (
    <div className="client-notification-wrapper">
      <Topbar />
      <Sidebar />
      <div className="content-notification">
        <h3>Client Notifications</h3>
        <div className="filter-buttons">
          <button
            className={`filter-button ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-button ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Unread
          </button>
        </div>

        {filteredNotifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          <div className="scrollable-notifications">
            {newNotifications.length > 0 && (
              <div className="new-notifications">
                <h4>New</h4>
                <ul className="notification-list">
                  {newNotifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`notification-item ${
                        notification.isRead ? "read" : "unread"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <h4>{notification.title}</h4>
                      <p>{notification.description}</p>
                      <span className="notification-time">
                        {formatDate(notification.timestamp)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {earlierNotifications.length > 0 && (
              <div className="earlier-notifications">
                <h4>Earlier</h4>
                <ul className="notification-list">
                  {earlierNotifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`notification-item ${
                        notification.isRead ? "read" : "unread"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <h4>{notification.title}</h4>
                      <p>{notification.description}</p>
                      <span className="notification-time">
                        {formatDate(notification.timestamp)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientNotification;
