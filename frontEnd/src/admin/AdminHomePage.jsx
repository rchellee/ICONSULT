import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../admin/sidebar";
import Topbar from "./Topbar";
import "./admin.css";

function AdminHomePage() {
  const [totalClients, setTotalClients] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [filter, setFilter] = useState("weekly");
  const [statusFilter, setStatusFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTotalClients = async (filter) => {
    try {
      const response = await fetch(
        `http://localhost:8081/clientsDashboard/count?filter=${filter}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalClients(data.total);
    } catch (error) {
      console.error("Error fetching total clients:", error);
    }
  };

  const fetchTotalProjects = async (filter, status) => {
    try {
      const response = await fetch(
        `http://localhost:8081/projectsDashboard/count?filter=${filter}&status=${status}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalProjects(data.total);
    } catch (error) {
      console.error("Error fetching total projects:", error);
    }
  };

  const fetchTotalTasks = async (filter, status) => {
    try {
      const response = await fetch(
        `http://localhost:8081/tasksDashboard/count?filter=${filter}&status=${status}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalTasks(data.total);
    } catch (error) {
      console.error("Error fetching total tasks:", error);
    }
  };

  const fetchUpcomingAppointments = async (filter, status) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:8081/appointmentsDashboard/count?filter=${filter}&status=${status}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setUpcomingAppointments(data.total);
    } catch (error) {
      setError("Failed to load data. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetching with both filter and status
  useEffect(() => {
    fetchTotalClients(filter);
    fetchTotalProjects(filter, statusFilter);
    fetchTotalTasks(filter, statusFilter);
    fetchUpcomingAppointments(filter, "upcoming");
  }, [filter, statusFilter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
  };

  const handleAppointmentStatusChange = (newAppointmentStatus) => {
    setStatusAppointmentFilter(newAppointmentStatus);
  };

  const overviewMetrics = [
    { title: "Total Clients", value: totalClients, link: "/admin/clients" },
    { title: "Total Projects", value: totalProjects, link: "/admin/projects" },
    { title: "Total Tasks", value: totalTasks, link: "/admin/tasks" },
    {
      title: "Upcoming Appointments",
      value: upcomingAppointments,
      link: "/admin/appointments",
    },
    { title: "Total Revenue", value: "$120,000", link: "/admin/revenue" },
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
          <div className="overview-section">
            <h2>Dashboard Overview</h2>
            <div className="filter-buttons">
              <button onClick={() => handleFilterChange("weekly")}>
                Weekly
              </button>
              <button onClick={() => handleFilterChange("monthly")}>
                Monthly
              </button>
              <button onClick={() => handleFilterChange("yearly")}>
                Yearly
              </button>
            </div>
            <div className="status-buttons">
              <button onClick={() => handleStatusChange("")}>All</button>
              <button onClick={() => handleStatusChange("Ongoing")}>
                Ongoing Projects
              </button>
              <button onClick={() => handleStatusChange("Pending" || "pending")}>
                Pending Projects
              </button>
              <button onClick={() => handleStatusChange("Completed" || "completed")}>
                Completed Projects
              </button>
            </div>
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
