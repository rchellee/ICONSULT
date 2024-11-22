import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Sidebar from "../sidebar";
import "./project.css";

function Project() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleTrackingClick = () => {
    navigate("/tracking"); // Navigate to the Tracking component route
  };

  return (
    <div className="client-project-page">
      <Sidebar />
      <div className="content">
        <div className="project-grid">
          <div className="project-box" onClick={handleTrackingClick}> {/* Make box clickable */}
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
