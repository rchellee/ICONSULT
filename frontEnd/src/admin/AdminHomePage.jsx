import React from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import Sidebar from "../admin/sidebar";
import Topbar from "./Topbar";
import "./admin.css"; // CSS for the admin dashboard

function AdminHomePage() {
  const overviewMetrics = [
    { title: "Total Users", value: "150", link: "/admin/users" },
    { title: "Total Projects", value: "45", link: "/admin/projects" },
    { title: "Total Revenue", value: "$120,000", link: "/admin/revenue" },
    { title: "Open Issues", value: "8", link: "/admin/issues" },
  ];

  const recentActivities = [
    { action: "User John Doe signed up", time: "2 hours ago" },
    { action: "New project created by Client A", time: "4 hours ago" },
    { action: "Revenue report exported", time: "Yesterday" },
    { action: "Issue #123 marked as resolved", time: "2 days ago" },
  ];

  const quickLinks = [
    { label: "Manage Users", path: "/admin/users" },
    { label: "Manage Projects", path: "/admin/projects" },
    { label: "View Reports", path: "/admin/reports" },
    { label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="admin-home-page">
        <div className="dashboard-content-admin">
          {/* Dashboard Overview Section */}
          <div className="overview-section">
            <h2>Dashboard Overview</h2>
            <div className="metrics-container">
              {overviewMetrics.map((metric, index) => (
                <div key={index} className="metric-card">
                  <h3>{metric.title}</h3>
                  <p>{metric.value}</p>
                  <Link to={metric.link} className="view-details">
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="recent-activity-section">
            <h2>Recent Activity</h2>
            <ul className="activity-list">
              {recentActivities.map((activity, index) => (
                <li key={index}>
                  <p>{activity.action}</p>
                  <span>{activity.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Section */}
          <div className="quick-links-section">
            <h2>Quick Links</h2>
            <div className="quick-links-container">
              {quickLinks.map((link, index) => (
                <Link key={index} to={link.path} className="quick-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
