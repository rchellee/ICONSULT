
import React, { useState } from "react";
import Sidebar from "../client/sidebar";
import "./client.css";
import Topbar from "./Topbar";

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
  const [showPendingPaymentsModal, setShowPendingPaymentsModal] = useState(false);

  const toggleProjectsModal = () => setShowProjectsModal(!showProjectsModal);
  const toggleTasksModal = () => setShowTasksModal(!showTasksModal);
  const toggleAppointmentsModal = () => setShowAppointmentsModal(!showAppointmentsModal);
  const togglePendingTasksModal = () => setShowPendingTasksModal(!showPendingTasksModal);
  const togglePendingPaymentsModal = () => setShowPendingPaymentsModal(!showPendingPaymentsModal);

  const formatDayAndDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.toLocaleDateString(undefined, { weekday: "long" });
    const options = { month: "long", day: "numeric" };
    return `${day}, ${date.toLocaleDateString(undefined, options)}`;
  };

  const pendingFeedback = tasks.filter(
    (task) => task.name.toLowerCase().includes("feedback")
  );

  const pendingPayments = tasks.filter(
    (task) => task.name.toLowerCase().includes("pay") || task.name.toLowerCase().includes("payment")
  );

  return (
    
    <div>
    <Topbar />
      <Sidebar />
      <div className="content-client">
        <div className="dashboard-content">
          <div className="dashboard-summary">
            <div className="card summary-card">
              <p>Total Projects</p>
              <p>{projects.length}</p>
            </div>
            <div className="card summary-card">
              <p>Total Tasks</p>
              <p>{tasks.length}</p>
            </div>
            <div className="card summary-card">
              <p>Pending Feedback</p>
              <p>{pendingFeedback.length}</p>
            </div>
            <div className="card summary-card">
              <p>Pending Payments</p>
              <p>{pendingPayments.length}</p>
            </div>
            <div className="card summary-card">
              <p>Upcoming Appointments</p>
              <p>{appointments.length}</p>
            </div>
          </div>
          <div className="dashboard-grid">
            {/* Ongoing Projects */}
            <div className="card ongoing-projects">
              <p>Ongoing Projects</p>
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
                <span onClick={toggleProjectsModal}>
                  {showProjectsModal ? "Close" : "See more"}
                </span>
              )}
            </div>

            {/* Task Overview */}
            <div className="card task-overview">
              <p>Task Overview</p>
              <div className="tasks-list">
                {tasks.slice(0, 3).map((task, index) => (
                  <div className="task-item" key={index}>
                    <p>{task.name}</p>
                    <p>
                      Deadline: {formatDayAndDate(task.deadline)}
                    </p>
                  </div>
                ))}
              </div>
              {tasks.length > 3 && (
                <span onClick={toggleTasksModal}>
                  {showTasksModal ? "Close" : "See More"}
                </span>
              )}
            </div>

            {/* Pending Feedback */}
            <div className="card pending-feedback">
              <p>Pending Feedback</p>
              <div className="pending-feedback-list">
                {pendingFeedback.slice(0, 3).map((task, index) => (
                  <div className="task-item" key={index}>
                    <p>{task.name}</p>
                    <p>
                      Deadline: {formatDayAndDate(task.deadline)}
                    </p>
                  </div>
                ))}
              </div>
              {pendingFeedback.length > 3 && (
                <span onClick={togglePendingTasksModal}>
                  {showPendingTasksModal ? "Close" : "See More"}
                </span>
              )}
            </div>

            {/* Pending Payments */}
            <div className="card pending-payments">
              <p>Pending Payments</p>
              <div className="pending-payments-list">
                {pendingPayments.slice(0, 3).map((task, index) => (
                  <div className="task-item" key={index}>
                    <p>{task.name}</p>
                    <p>
                      Deadline: {formatDayAndDate(task.deadline)}
                    </p>
                  </div>
                ))}
              </div>
              {pendingPayments.length > 3 && (
                <span onClick={togglePendingPaymentsModal}>
                  {showPendingPaymentsModal ? "Close" : "See More"}
                </span>
              )}
            </div>

            {/* Upcoming Appointments */}
            <div className="card upcoming-appointments">
              <p>Upcoming Appointments</p>
              <div className="appointments-list">
                {appointments.slice(0, 3).map((appointment, index) => (
                  <div className="dashboard-appointment-item" key={index}>
                    <p>
                      Date: {formatDayAndDate(appointment.date)}
                    </p>
                    <p>
                      Type: {appointment.type}
                    </p>
                    <p>
                      Platform: {appointment.platform}
                    </p>
                  </div>
                ))}
              </div>
              {appointments.length > 3 && (
                <button onClick={toggleAppointmentsModal}>
                  {showAppointmentsModal ? "Close" : "See More"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        {showProjectsModal && (
          <div className="modal-overlay" onClick={toggleProjectsModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p>All Projects</p>
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
              <p>All Tasks</p>
              <ul>
                {tasks.map((task, index) => (
                  <li key={index} className="task-item">
                    <p>{task.name}</p>
                    <p>
                      Deadline:{formatDayAndDate(task.deadline)}
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
              <p>All Pending Feedback</p>
              <ul>
                {pendingFeedback.map((task, index) => (
                  <li key={index} className="task-item">
                    <p>{task.name}</p>
                    <p>
                      Deadline: {formatDayAndDate(task.deadline)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showPendingPaymentsModal && (
          <div className="modal-overlay" onClick={togglePendingPaymentsModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <p>All Pending Payments</p>
              <ul>
                {pendingPayments.map((task, index) => (
                  <li key={index} className="task-item">
                    <p>{task.name}</p>
                    <p>
                      Deadline: {formatDayAndDate(task.deadline)}
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
