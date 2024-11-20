import React from "react";
import Sidebar from "../sidebar";
import "./project.css";

function Project() {
  return (
    <div className="client-project-page">
      <Sidebar />
      <div className="content">
        <div className="project-grid">
          <div className="project-box">
            <div className="project-header">
              <div className="logo-box">P1</div>
              <h2 className="project-title">Project 1</h2>
            </div>
            <div className="project-info">
              <p>Status: On-going</p>
              <p>Progress: 10%</p>
            </div>
          </div>
          {/* Add more project boxes as needed */}
        </div>
      </div>
    </div>
  );
}

export default Project;
