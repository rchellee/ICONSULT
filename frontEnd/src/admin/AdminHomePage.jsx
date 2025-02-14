import React, { useState, useEffect } from "react";
import Sidebar from "../admin/sidebar";
import Topbar from "./Topbar";
import "./admin.css";

function AdminHomePage() {
  const [clientStats, setClientStats] = useState(0);
  const [projectStats, setProjectStats] = useState(0);
  const [taskStats, setTaskStats] = useState(0);
  const [appointmentStats, setAppointmentStats] = useState(0);
  const [revenueStats, setRevenueStats] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [recentNotifications, setRecentNotifications] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [todaysTasks, setTodaysTasks] = useState([]);
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

  const fetchClientStats = async (filter) => {
    try {
      const response = await fetch(
        `http://localhost:8081/clients/stats?filter=${filter}`
      );
      const data = await response.json();
      setClientStats(data.totalClients);
    } catch (error) {
      console.error("Error fetching client stats:", error);
    }
  };
  const fetchProjectStats = async (filter) => {
    try {
      const response = await fetch(
        `http://localhost:8081/projectDashboard/stats?filter=${filter}`
      );
      const data = await response.json();
      setProjectStats(data.totalProjects);
    } catch (error) {
      console.error("Error fetching client stats:", error);
    }
  };
  const fetchTaskStats = async (filter) => {
    try {
      const response = await fetch(
        `http://localhost:8081/taskDashboard/stats?filter=${filter}`
      );
      const data = await response.json();
      setTaskStats(data.totalTasks);
    } catch (error) {
      console.error("Error fetching tasks stats:", error);
    }
  };
  const fetchAppointmentStats = async (filter) => {
    try {
      const response = await fetch(
        `http://localhost:8081/appointmentsDashboard/stats?filter=${filter}`
      );
      const data = await response.json();
      setAppointmentStats(data.totalAppointments);
    } catch (error) {
      console.error("Error fetching tasks stats:", error);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/appointmentsDashboard/upcoming"
      );
      const data = await response.json();
      setUpcomingAppointments(data.length);
    } catch (error) {
      console.error("Error fetching upcoming appointments:", error);
    }
  };
  const fetchRevenueStats = async (filter) => {
    try {
      const response = await fetch(
        `http://localhost:8081/projectDashboard/revenue?filter=${filter}`
      );
      const data = await response.json();
      setRevenueStats(data.totalRevenues);
    } catch (error) {
      console.error("Error fetching client stats:", error);
    }
  };
  const fetchRecentNotifications = async () => {
    try {
      const response = await fetch("http://localhost:8081/latest-activity");
      const data = await response.json();
      const formattedNotifications = [
        {
          type: "New Client",
          details: `Client Name: ${data.client?.firstName} ${data.client?.lastName}`,
          created_at: data.client?.created_at,
        },
        {
          type: "New Project",
          details: `Project Title: ${data.project?.projectName}, Project Description: ${data.project?.description}`,
          created_at: data.project?.created_at,
        },
        {
          type: "New Payment",
          details: `Amount: PHP ${data.payment?.amount}, Paid by: ${data.payment?.payer_name}`,
          created_at: data.payment?.created_at,
        },
        {
          type: "New Appointment",
          details: `Client: ${data.appointment?.name}, Date: ${data.appointment?.date} ${data.appointment?.time}`,
          created_at: data.appointment?.created_at,
        },
        {
          type: "New Review",
          details: `Rating: ${data.review?.rating}, Comment: ${data.review?.comment}`,
          created_at: data.review?.created_at,
        },
      ].filter((notification) => notification.details); // Exclude empty entries

      setRecentNotifications(formattedNotifications);
    } catch (error) {
      console.error("Error fetching recent notifications:", error);
    }
  };
  const fetchTodaysAppointments = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      const response = await fetch(
        `http://localhost:8081/todaysAppointments?date=${today}`
      );
      const data = await response.json();
      setTodaysAppointments(data);
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
    }
  };
  const fetchTodaysTasks = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      const response = await fetch(
        `http://localhost:8081/todaysTasks?date=${today}`
      );
      const data = await response.json();
      setTodaysTasks(data);
    } catch (error) {
      console.error("Error fetching today's appointments:", error);
    }
  };

  useEffect(() => {
    fetchClientStats("all");
    fetchProjectStats("all");
    fetchTaskStats("all");
    fetchAppointmentStats("all");
    fetchUpcomingAppointments();
    fetchRevenueStats("all");
    fetchRecentNotifications();
    fetchTodaysAppointments();
    fetchTodaysTasks();
  }, []);

  const toggleDropdown = (key) => {
    setShowDropdown(showDropdown === key ? null : key);
  };
  const handleRevenueFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setShowRevenueFilter(false);
    fetchRevenueStats(filter.toLowerCase());
  };
  const handleAppointmentFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setShowAppointmentFilter(false);

    if (filter === "Upcoming") {
      fetchUpcomingAppointments();
    } else {
      fetchAppointmentStats(filter.toLowerCase());
    }
  };
  const handleTaskFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setShowTaskFilter(false);
    fetchTaskStats(filter.toLowerCase());
  };
  const handleProjectFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setShowProjectFilter(false);
    fetchProjectStats(filter.toLowerCase());
  };
  const handleClientFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setShowClientFilter(false);
    fetchClientStats(filter.toLowerCase());
  };

  const toggleClientFilter = () => setShowClientFilter(!showClientFilter);
  const toggleProjectFilter = () => setShowProjectFilter(!showProjectFilter);
  const toggleTaskFilter = () => setShowTaskFilter(!showTaskFilter);
  const toggleAppointmentFilter = () =>
    setShowAppointmentFilter(!showAppointmentFilter);
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
                <p>{clientStats}</p>
                <div className="three-line-dropdown">
                  <button
                    className="filter-icon"
                    onClick={() => setShowClientFilter(!showClientFilter)}
                  >
                    ☰
                  </button>
                  {showClientFilter && (
                    <div className="dropdown-menu">
                      {["All", "Weekly", "Yearly", "Active", "Inactive"].map(
                        (filter) => (
                          <button
                            key={filter}
                            onClick={() => handleClientFilterSelect(filter)}
                          >
                            {filter}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Total Projects */}
              <div className="metric-card">
                <h3>Total Projects</h3>
                <p>{projectStats}</p>

                <div className="three-line-dropdown">
                  <button
                    className="filter-icon"
                    onClick={() => setShowProjectFilter(!showProjectFilter)}
                  >
                    ☰
                  </button>
                  {showProjectFilter && (
                    <div className="dropdown-menu">
                      {[
                        "All",
                        "Weekly",
                        "Yearly",
                        "Pending",
                        "Ongoing",
                        "Completed",
                        "Not Paid",
                        "Partial Payment",
                        "Paid",
                      ].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => handleProjectFilterSelect(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Total Tasks */}
              <div className="metric-card">
                <h3>Total Tasks</h3>
                <p>{taskStats}</p>
                <div className="three-line-dropdown">
                  <button
                    className="filter-icon"
                    onClick={() => setShowTaskFilter(!showTaskFilter)}
                  >
                    ☰
                  </button>
                  {showTaskFilter && (
                    <div className="dropdown-menu">
                      {[
                        "All",
                        "Weekly",
                        "Yearly",
                        "Pending",
                        "Ongoing",
                        "Completed",
                      ].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => handleTaskFilterSelect(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Total Appointments */}
              <div className="metric-card">
                <h3>Total Appointment</h3>
                <p>
                  {selectedFilter === "Upcoming"
                    ? upcomingAppointments
                    : appointmentStats}
                </p>
                <div className="three-line-dropdown">
                  <button
                    className="filter-icon"
                    onClick={() =>
                      setShowAppointmentFilter(!showAppointmentFilter)
                    }
                  >
                    ☰
                  </button>
                  {showAppointmentFilter && (
                    <div className="dropdown-menu">
                      {["All", "Weekly", "Yearly", "Upcoming"].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => handleAppointmentFilterSelect(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Total Revenue */}
              <div className="metric-card">
                <h3>Total Revenue</h3>
                <p>{revenueStats}</p>
                <div className="three-line-dropdown">
                  <button
                    className="filter-icon"
                    onClick={() => setShowRevenueFilter(!showRevenueFilter)}
                  >
                    ☰
                  </button>
                  {showRevenueFilter && (
                    <div className="dropdown-menu">
                      {["All", "Weekly", "Yearly"].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => handleRevenueFilterSelect(filter)}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid-container">
            <div className="left-column">
              <div className="left-grid">
                <div className="appointments-section">
                  <h4>Today's Appointments</h4>
                  <div className="scrollable-tasks">
                    <div className="appointments-grid">
                      {todaysAppointments.length > 0 ? (
                        todaysAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="appointment-item"
                          >
                            <p>
                              <strong>Client:</strong> {appointment.name}
                            </p>
                            <p>
                              <strong>Time:</strong> {appointment.time}
                            </p>
                            <p>
                              <strong>Mode of Consultation:</strong>{" "}
                              {appointment.platform}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No appointments scheduled for today.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tasks Due Today Section */}
                <div className="tasks-section">
                  <h4>Tasks Due Today</h4>
                  <div className="scrollable-tasks">
                    <div className="tasks-grid">
                      {todaysTasks.length > 0 ? (
                        todaysTasks.map((task) => (
                          <div key={task.id} className="task-item">
                            <p>
                              <strong>Task:</strong> {task.task_name}
                            </p>
                            <p>
                              <strong>Status:</strong> {task.status}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>No tasks due today.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column for Recent Activity */}
            <div className="right-column">
              {/* Recent Activity Section */}
              <div className="recent-activity-section">
                <h2>Recent Activity</h2>
                <ul className="activity-list">
                  {recentNotifications.length > 0 ? (
                    recentNotifications.map((notification, index) => (
                      <li key={index}>
                        <p>
                          <strong>{notification.type}</strong>:{" "}
                          {notification.details}
                        </p>
                        <span>
                          <em>
                            {new Date(notification.created_at).toLocaleString()}
                          </em>
                        </span>
                      </li>
                    ))
                  ) : (
                    <li>No recent activities.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
