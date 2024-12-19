import React, { useState, useEffect } from "react";
import "./clientNotification.css"; // Import the CSS for styling
import Sidebar from "../sidebar";

const ClientNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

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
          `http://localhost:8081/client-notifications/${clientId}`
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
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0); // Set to midnight of today

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
      <Sidebar />
      <div className="content">
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
          <div className="notification-groups">
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
