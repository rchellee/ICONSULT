import React, { useState } from "react";
import "./notification.css"; // Import the CSS
import Sidebar from "../sidebar";

const Notification = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Payment Received",
      description: "Your payment for Project Alpha has been successfully processed.",
      timestamp: new Date().toISOString(),
      isRead: false, 
    },
    {
      id: 2,
      title: "Payment Due",
      description: "Your payment of $200 for 'Premium Subscription' is due in 3 days. Please ensure timely payment.",
      timestamp: new Date().toISOString(),
      isRead: false,
    },
    {
      id: 3,
      title: "Payment Confirmation",
      description: "Your recent payment of $120 for 'Web Hosting' has been confirme",
      timestamp: new Date().toISOString(),
      isRead: false,
    },
    {
      id: 4,
      title: "Password Reset Requested",
      description: "We received a password reset request for your account. If you didn't request this, please ignore this email.",
      timestamp: new Date().toISOString(),
      isRead: false,
    },
    {
      id: 5,
      title: "Welcome to Our Service!",
      description: "Thank you for signing up! We're excited to have you on board. Please check your email for your account details.",
      timestamp: new Date().toISOString(),
      isRead: false,
    },
    {
      id: 6,
      title: "Payment Failed",
      description: "Your payment attempt for 'SEO Optimization' could not be processed. Please try again.",
      timestamp: new Date().toISOString(),
      isRead: false,
    },
    
    
  ]);

  const markAsRead = (id) => {
    // Mark notification as read
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id
        ? { ...notification, isRead: true }
        : notification
    );
    setNotifications(updatedNotifications);
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

  return (
    
    <div className="notification-wrapper">
      <div className="content">
        <Sidebar />
        <h3>Notifications</h3>
        {notifications.length === 0 ? (
          <p className="no-notifications">No notifications available.</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification-item ${notification.isRead ? "read" : "unread"}`}
                onClick={() => markAsRead(notification.id)} // Mark notification as read
              >
                <h4>{notification.title}</h4>
                <p>{notification.description}</p>
                <span className="notification-time">
                  {formatDate(notification.timestamp)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notification;
