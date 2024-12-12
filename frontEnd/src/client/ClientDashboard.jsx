import React, { useState } from "react";
import Sidebar from "../client/sidebar";
import "./client.css";

function ClientDashboard() {
  const [projects, setProjects] = useState([
    { name: "Samgyup", progress: 75 },
    { name: "Coco", progress: 40 },
    { name: "Samgyupsal", progress: 90 },
    { name: "E-commerce Platform", progress: 50 },
    { name: "Marketing Campaign", progress: 20 },
    { name: "Customer Support System", progress: 65 },
    { name: "Cloud Migration", progress: 30 },
    { name: "Product Launch", progress: 80 },
    { name: "CRM Software", progress: 55 },
    { name: "Data Analytics Dashboard", progress: 60 },
  ]);

  const [tasks, setTasks] = useState([
    { name: "Need to pay tax", deadline: "2024-12-15" },
    { name: "Submit quarterly report", deadline: "2024-12-20" },
    { name: "Update client documentation", deadline: "2024-12-18" },
    { name: "Review marketing strategy", deadline: "2024-12-25" },
  ]);

  const [appointments, setAppointments] = useState([
    { date: "2024-12-10", type: "Initial Consultation", platform: "Zoom" },
  ]);

  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);
  const [showAppointmentsModal, setShowAppointmentsModal] = useState(false);
  const [showPendingTasksModal, setShowPendingTasksModal] = useState(false);

  const toggleProjectsModal = () => setShowProjectsModal(!showProjectsModal);
  const toggleTasksModal = () => setShowTasksModal(!showTasksModal);
  const toggleAppointmentsModal = () => setShowAppointmentsModal(!showAppointmentsModal);
  const togglePendingTasksModal = () => setShowPendingTasksModal(!showPendingTasksModal);

  const formatDayAndDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.toLocaleDateString(undefined, { weekday: "long" });
    const options = { month: "long", day: "numeric" };
    return `${day}, ${date.toLocaleDateString(undefined, options)}`;
  };

  const pendingTasks = tasks.filter(
    (task) => new Date(task.deadline) > new Date()
  );

  return (
    <div className="client-home-page">
      <Sidebar />
      <div className="content">
        <div className="dashboard-content">
          <h3>Dashboard</h3>
          <div className="dashboard-summary">
            <div className="card summary-card">
              <h4>Total Projects</h4>
              <p>{projects.length}</p>
            </div>
            <div className="card summary-card">
              <h4>Total Tasks</h4>
              <p>{tasks.length}</p>
            </div>
            <div className="card summary-card">
              <h4>Pending Tasks</h4>
              <p>{pendingTasks.length}</p>
            </div>
            <div className="card summary-card">
              <h4>Upcoming Appointments</h4>
              <p>{appointments.length}</p>
            </div>
          </div>
          <div className="dashboard-grid">
            {/* Ongoing Projects */}
            <div className="card ongoing-projects">
              <h3>Ongoing Projects</h3>
              <div className="projects-list">
                {projects.slice(0, 3).map((project, index) => (
                  <div className="project-item" key={index}>
                    <div className="project-details">
                      <h4>{project.name}</h4>
                      <div className="progress-bar">
                        <div
                          className="progress"
                          style={{ width: `${project.progress}%` }}
                        >
                          {project.progress}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {projects.length > 3 && (
                <button onClick={toggleProjectsModal}>
                  {showProjectsModal ? "Close" : "View More"}
                </button>
              )}
            </div>

            {/* Task Overview */}
            <div className="card task-overview">
              <h3>Task Overview</h3>
              <div className="tasks-list">
                {tasks.slice(0, 3).map((task, index) => (
                  <div className="task-item" key={index}>
                    <h4>{task.name}</h4>
                    <p>
                      <strong>Deadline:</strong> {formatDayAndDate(task.deadline)}
                    </p>
                  </div>
                ))}
              </div>
              {tasks.length > 3 && (
                <button onClick={toggleTasksModal}>
                  {showTasksModal ? "Close" : "View More"}
                </button>
              )}
            </div>

            {/* Pending Tasks */}
            <div className="card pending-tasks">
              <h3>Pending Tasks</h3>
              <div className="pending-tasks-list">
                {pendingTasks.slice(0, 3).map((task, index) => (
                  <div className="task-item" key={index}>
                    <h4>{task.name}</h4>
                    <p>
                      <strong>Deadline:</strong> {formatDayAndDate(task.deadline)}
                    </p>
                  </div>
                ))}
              </div>
              {pendingTasks.length > 3 && (
                <button onClick={togglePendingTasksModal}>
                  {showPendingTasksModal ? "Close" : "View More"}
                </button>
              )}
            </div>

            {/* Upcoming Appointments */}
            <div className="card upcoming-appointments">
              <h3>Upcoming Appointments</h3>
              <div className="appointments-list">
                {appointments.slice(0, 3).map((appointment, index) => (
                  <div className="dashboard-appointment-item" key={index}>
                    <p>
                      <strong>Date:</strong> {formatDayAndDate(appointment.date)}
                    </p>
                    <p>
                      <strong>Type:</strong> {appointment.type}
                    </p>
                    <p>
                      <strong>Platform:</strong> {appointment.platform}
                    </p>
                  </div>
                ))}
              </div>
              {appointments.length > 3 && (
                <button onClick={toggleAppointmentsModal}>
                  {showAppointmentsModal ? "Close" : "View More"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showProjectsModal && (
          <div className="modal-overlay" onClick={toggleProjectsModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>All Projects</h3>
              <ul>
                {projects.map((project, index) => (
                  <li key={index} className="project-item">
                    <h4>{project.name}</h4>
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${project.progress}%` }}
                      >
                        {project.progress}%
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showTasksModal && (
          <div className="modal-overlay" onClick={toggleTasksModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>All Tasks</h3>
              <ul>
                {tasks.map((task, index) => (
                  <li key={index} className="task-item">
                    <h4>{task.name}</h4>
                    <p>
                      <strong>Deadline:</strong> {formatDayAndDate(task.deadline)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showPendingTasksModal && (
          <div className="modal-overlay" onClick={togglePendingTasksModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>All Pending Tasks</h3>
              <ul>
                {pendingTasks.map((task, index) => (
                  <li key={index} className="task-item">
                    <h4>{task.name}</h4>
                    <p>
                      <strong>Deadline:</strong> {formatDayAndDate(task.deadline)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
