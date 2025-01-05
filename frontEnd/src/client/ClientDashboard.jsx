import React, { useState } from "react";
import Sidebar from "../client/sidebar";
import Topbar from "./Topbar";
import Modal from "../components/Modal";
import "./client.css";

function ClientDashboard() {
  const [projects] = useState([
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

  const [tasks] = useState([
    { name: "Need to pay tax", deadline: "2024-12-15" },
    { name: "Submit quarterly report", deadline: "2024-12-20" },
    { name: "Update client documentation", deadline: "2024-12-18" },
    { name: "Review marketing strategy", deadline: "2024-12-25" },
  ]);

  const [appointments] = useState([
    { date: "2024-12-10", type: "Initial Consultation", platform: "Zoom" },
  ]);

  const [modalContent, setModalContent] = useState(null);

  const formatDayAndDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.toLocaleDateString(undefined, { weekday: "long" });
    const options = { month: "long", day: "numeric" };
    return `${day}, ${date.toLocaleDateString(undefined, options)}`;
  };

  const pendingFeedback = tasks.filter((task) =>
    task.name.toLowerCase().includes("feedback")
  );

  const pendingPayments = tasks.filter((task) =>
    task.name.toLowerCase().includes("pay") || task.name.toLowerCase().includes("payment")
  );

  const openModal = (title, content) => {
    setModalContent({ title, content });
  };

  const closeModal = () => {
    setModalContent(null);
  };

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
                <span onClick={() => openModal("All Projects", projects.map(project => (
                  <div key={project.name}>
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
                )))}>
                  See More
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
                    <p>Deadline: {formatDayAndDate(task.deadline)}</p>
                  </div>
                ))}
              </div>
              {tasks.length > 3 && (
                <span onClick={() => openModal("All Tasks", tasks.map(task => (
                  <div key={task.name}>
                    <p>{task.name}</p>
                    <p>Deadline: {formatDayAndDate(task.deadline)}</p>
                  </div>
                )))}>
                  See More
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        {modalContent && (
          <Modal title={modalContent.title} onClose={closeModal}>
            {modalContent.content}
          </Modal>
        )}
      </div>
    </div>
  );
}

export default ClientDashboard;
