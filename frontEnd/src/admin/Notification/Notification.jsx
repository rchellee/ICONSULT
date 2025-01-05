import React, { useState, useEffect } from "react";
import "./notification.css"; // Import the CSS
import Sidebar from "../sidebar";
import Topbar from "../Topbar";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const normalizeDate = (timestamp) => new Date(timestamp).toISOString();

  useEffect(() => {
    // Fetch notifications from the database
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8081/notifications");
        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      // Update notification on the server
      const response = await fetch(
        `http://localhost:8081/notifications/${id}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        // Update the local state only after server update succeeds
        const updatedNotifications = notifications.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        );
        setNotifications(updatedNotifications);
      } else {
        console.error("Error marking notification as read");
      }
    } catch (error) {
      console.error("Error updating notification:", error);
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

  const now = new Date();
  const newNotifications = filteredNotifications.filter(
    (notification) => new Date(notification.timestamp) >= startOfToday
  );

  const earlierNotifications = filteredNotifications.filter(
    (notification) => new Date(notification.timestamp) < startOfToday
  );

  return (
    <div className="notification-wrapper">
      <Topbar />
      <Sidebar />
      <div className="content-notification">
        <h3>Notifications</h3>
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
        <div className="scrollable-notifications">
          {filteredNotifications.length === 0 ? (
            <p className="no-notifications">No notifications available.</p>
          ) : (
            <div className="notification-groups">
              <>
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
                          <div className="notification-time">
                            {formatDate(notification.timestamp)}
                          </div>
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
                          <div className="notification-time">
                            {formatDate(notification.timestamp)}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
