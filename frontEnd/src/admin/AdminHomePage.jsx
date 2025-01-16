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

  // States to control dropdown visibility for each card
  const [showDropdown, setShowDropdown] = useState(null);
  const [showClientFilter, setShowClientFilter] = useState(false);
  const [showProjectFilter, setShowProjectFilter] = useState(false);
  const [showTaskFilter, setShowTaskFilter] = useState(false);
  const [showAppointmentFilter, setShowAppointmentFilter] = useState(false);
  const [showRevenueFilter, setShowRevenueFilter] = useState(false);
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("All");
  const [selectedTaskFilter, setSelectedTaskFilter] = useState("All");
  const [selectedClientFilter, setSelectedClientFilter] = useState("All");


  // Mock function to simulate fetching data
  const fetchData = () => {
    setTimeout(() => {
      setTotalClients(120);
      setTotalProjects(45);
      setTotalTasks(80);
      setUpcomingAppointments(15);
      setTotalRevenue("$120,000");
    }, 1000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleDropdown = (key) => {
    setShowDropdown(showDropdown === key ? null : key);
  };
  const handleTaskFilterSelect = (filter) => {
    setSelectedTaskFilter(filter);
    setShowTaskFilter(false);  // Close the dropdown after selecting
  };
  const handleProjectFilterSelect = (filter) => {
    setSelectedProjectFilter(filter);
    setShowProjectFilter(false);  // Close the dropdown after selecting
  };
  const handleClientFilterSelect = (filter) => {
    setSelectedClientFilter(filter);
    setShowClientFilter(false);  // Close the dropdown after selecting
  };

  const toggleClientFilter = () => setShowClientFilter(!showClientFilter);
  const toggleProjectFilter = () => setShowProjectFilter(!showProjectFilter);
  const toggleTaskFilter = () => setShowTaskFilter(!showTaskFilter);
  const toggleAppointmentFilter = () => setShowAppointmentFilter(!showAppointmentFilter);
  const toggleRevenueFilter = () => setShowRevenueFilter(!showRevenueFilter);

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="admin-home-page">
        <div className="dashboard-content-admin">
          {/* Dashboard Overview Section */}
          <div className="overview-section">
            <h4>Dashboard</h4>
            <div className="metrics-container">
              {/* Total Clients */}
              <div className="metric-card">
                <h3>Total Clients</h3>
                <p>{totalClients}</p>
                <div className="three-line-dropdown">
                  <button className="filter-icon" onClick={toggleClientFilter}>
                    ☰
                  </button>
                  {showClientFilter && (
                    <div className="dropdown-menu">
                      <button>All</button>
                      <button>Weekly</button>
                      <button>Monthly</button>
                      <button>Yearly</button>
                    </div>
                     )}
                     <button className="client-button" onClick={() => toggleDropdown("clientStatus")}>
                           {selectedClientFilter} <span>&#9662;</span>
                         </button>
                         {showDropdown === "clientStatus" && (
                              <div className="dropdown-menu">
                              <button onClick={() => handleClientFilterSelect("All")}>All</button>
                              <button onClick={() => handleClientFilterSelect("Active")}>Active</button>
                              <button onClick={() => handleClientFilterSelect("Inactive")}>Inactive</button>
                      
                            </div>
                         )}
                </div>
              </div>

              {/* Total Projects */}
              <div className="metric-card">
                <h3>Total Projects</h3>
                <p>{totalProjects}</p>
                <div className="three-line-dropdown">
                  <button className="filter-icon" onClick={toggleProjectFilter}>
                    ☰
                  </button>
                  {showProjectFilter && (
                    <div className="dropdown-menu">
                      <button>All</button>
                      <button>Weekly</button>
                      <button>Monthly</button>
                      <button>Yearly</button>
                    </div>
                     )}
                     <button className="project-button" onClick={() => toggleDropdown("projectStatus")}>
                           {selectedProjectFilter} <span>&#9662;</span>
                         </button>
                         {showDropdown === "projectStatus" && (
                              <div className="dropdown-menu">
                              <button onClick={() => handleProjectFilterSelect("All")}>All</button>
                              <button onClick={() => handleProjectFilterSelect("Ongoing")}>Ongoing</button>
                              <button onClick={() => handleProjectFilterSelect("Pending")}>Pending</button>
                              <button onClick={() => handleProjectFilterSelect("Completed")}>Completed</button>
                            </div>
                         )}
                </div>
              </div>

              {/* Total Tasks */}
              <div className="metric-card">
                <h3>Total Tasks</h3>
                <p>{totalTasks}</p>
                <div className="three-line-dropdown">
                  <button className="filter-icon" onClick={toggleTaskFilter}>
                    ☰
                  </button>
                  {showTaskFilter && (
                       <div className="dropdown-menu">
                       <button>All</button>
                       <button>Weekly</button>
                       <button>Monthly</button>
                       <button>Yearly</button>
                     </div>
              
           )}
              <button className="task-button" onClick={() => toggleDropdown("taskStatus")}>
                    {selectedTaskFilter} <span>&#9662;</span>
                  </button>
                  {showDropdown === "taskStatus" && (
                       <div className="dropdown-menu">
                       <button onClick={() => handleTaskFilterSelect("All")}>All</button>
                       <button onClick={() => handleTaskFilterSelect("Ongoing")}>Ongoing</button>
                       <button onClick={() => handleTaskFilterSelect("Pending")}>Pending</button>
                       <button onClick={() => handleTaskFilterSelect("Completed")}>Completed</button>
                     </div>
                  )}
                </div>
              </div>

              {/* Total Appointments */}
              <div className="metric-card">
                <h3>Total Appointments</h3>
                <p>{upcomingAppointments}</p>
                <div className="three-line-dropdown">
                  <button className="filter-icon" onClick={toggleAppointmentFilter}>
                    ☰
                  </button>
                  {showAppointmentFilter && (
                    <div className="dropdown-menu">
                      <button>All</button>
                      <button>Weekly</button>
                      <button>Monthly</button>
                      <button>Yearly</button>
                      <button>Upcoming</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Revenue */}
              <div className="metric-card">
                <h3>Total Revenue</h3>
                <p>{totalRevenue}</p>
                <div className="three-line-dropdown">
                  <button className="filter-icon" onClick={toggleRevenueFilter}>
                    ☰
                  </button>
                  {showRevenueFilter && (
                    <div className="dropdown-menu">
                      <button>All</button>
                      <button>Weekly</button>
                      <button>Monthly</button>
                      <button>Yearly</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid-container">
  <div className="filters-section">
    <h4>Today's Appointments</h4>
    <div className="appointments-grid">
      <div className="appointment-item">
        <p><strong>Client:</strong> John Doe</p>
        <p><strong>Time:</strong> 10:00 AM</p>
        <p><strong>Location:</strong> Office</p>
      </div>
      <div className="appointment-item">
        <p><strong>Client:</strong> Jane Smith</p>
        <p><strong>Time:</strong> 11:00 AM</p>
        <p><strong>Location:</strong> Conference Room</p>
      </div>
    </div>

    <h4>Tasks Due Today</h4>
    <div className="tasks-grid">
      <div className="task-item">
        <p><strong>Task:</strong> Complete Project Report</p>
        <p><strong>Due:</strong> 12:00 PM</p>
        <p><strong>Status:</strong> Pending</p>
      </div>
      <div className="task-item">
        <p><strong>Task:</strong> Finalize Budget Proposal</p>
        <p><strong>Due:</strong> 3:00 PM</p>
        <p><strong>Status:</strong> Pending</p>
      </div>
    </div>
  </div>

  {/* Recent Activity Section */}
  <div className="recent-activity-section">
    <h2>Recent Activity</h2>
    <ul className="activity-list">
      {[
        { action: "New client added: Client A", time: "2 hours ago" },
        { action: "Task 'Finish Project X' updated to 'Completed'", time: "4 hours ago" },
        { action: "New project 'Project Alpha' initiated", time: "Yesterday" },
        { action: "Employee 'John Doe' completed training", time: "2 days ago" },
        { action: "New invoice generated for Client B", time: "3 days ago" },
        { action: "Revenue report for Q1 finalized", time: "5 days ago" },
        { action: "Upcoming meeting scheduled with Client C", time: "1 week ago" },
        { action: "Employee 'Jane Doe' promoted to Manager", time: "2 weeks ago" },
      ].map((activity, index) => (
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
    </div>
  );
}

export default AdminHomePage;