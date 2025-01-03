import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./project.css";

const ProjectList = ({ filteredProjects, formatDate }) => {
  return (
    <div className="project-list-wrapper">
      <div className="project-list">
        {/* Top Navigation Buttons */}
        <div className="top-nav-buttons">
          <button className="nav-btn">
            <FaChevronLeft />
            <span className="tooltip">Go back</span>
          </button>
          <button className="nav-btn">
            <FaChevronRight />
          </button>
        </div>

        <div className="project-list-header">
          <h3>Project </h3>
          <h3>Client</h3>
          <h3>Progress</h3>
          <h3>Timeline</h3>
          <h3>Status</h3>
          <h3>Downpayment</h3>
          <h3>Total</h3>
          <h3>Payment Status</h3>
        </div>

        {filteredProjects.map((project) => (
          <div key={project.id} className="project-item">
            <p className="truncate" title={project.projectName}>
              {project.projectName}
            </p>
            <p className="truncate" title={project.clientName}>
              {project.clientName}
            </p>
            <p>{project.progress}</p>
            <p>
              {formatDate(project.startDate)} - {formatDate(project.endDate)}
            </p>
            <p>{project.status}</p>
            <p>{project.downpayment || "N/A"}</p>
            <p>{project.totalPayment}</p>
            <p>{project.paymentStatus}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
