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
  const [totalRevenue, setTotalRevenue] = useState("$0");

  // Mock function to simulate fetching data
  const fetchData = () => {
    setTimeout(() => {
      setTotalClients(120); // Example mock data
      setTotalProjects(45); // Example mock data
      setTotalTasks(80); // Example mock data
      setUpcomingAppointments(15); // Example mock data
      setTotalRevenue("$120,000"); // Example mock data
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Example recent activities
  const recentActivities = [
    { action: "New client added: Client A", time: "2 hours ago" },
    { action: "Task 'Finish Project X' updated to 'Completed'", time: "4 hours ago" },
    { action: "New project 'Project Alpha' initiated", time: "Yesterday" },
    { action: "Employee 'John Doe' completed training", time: "2 days ago" },
    { action: "New invoice generated for Client B", time: "3 days ago" },
    { action: "Revenue report for Q1 finalized", time: "5 days ago" },
    { action: "Upcoming meeting scheduled with Client C", time: "1 week ago" },
    { action: "Employee 'Jane Doe' promoted to Manager", time: "2 weeks ago" },
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
              <div className="metric-card">
                <h3>Total Clients</h3>
                <p>{totalClients}</p>
                <Link to="/admin/clients" className="see-more-link">
                  See More
                </Link>
              </div>
              <div className="metric-card">
                <h3>Total Projects</h3>
                <p>{totalProjects}</p>
                <Link to="/admin/projects" className="see-more-link">
                  See More
                </Link>
              </div>
              <div className="metric-card">
                <h3>Total Tasks</h3>
                <p>{totalTasks}</p>
                <Link to="/admin/tasks" className="see-more-link">
                  See More
                </Link>
              </div>
              <div className="metric-card">
                <h3>Upcoming Appointments</h3>
                <p>{upcomingAppointments}</p>
                <Link to="/admin/appointments" className="see-more-link">
                  See More
                </Link>
              </div>
              <div className="metric-card">
                <h3>Total Revenue</h3>
                <p>{totalRevenue}</p>
                <Link to="/admin/revenue" className="see-more-link">
                  See More
                </Link>
              </div>
            </div>
          </div>

          {/* Filters for Activity */}
          <div className="filters-section">
            <h2>Filters</h2>
            <div className="filter-buttons">
              <button>All</button>
              <button>Weekly</button>
              <button>Monthly</button>
              <button>Yearly</button>
            </div>
            <div className="filter-buttons">
              <button>All Projects</button>
              <button>Ongoing Projects</button>
              <button>Pending Tasks</button>
              <button>Completed</button>
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
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
