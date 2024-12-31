import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa"; // Import icons
import Sidebar from "../sidebar";
import axios from "axios";
import "./project.css";

function Project() {
  const navigate = useNavigate();
  const [isProjectsVisible, setIsProjectsVisible] = useState(true);
  const [isCompletedVisible, setIsCompletedVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const loggedClientId = localStorage.getItem("clientId");
    console.log("Logged Client ID:", loggedClientId); // Debugging log
    setClientId(loggedClientId);

    if (loggedClientId) {
      axios
        .get(`http://localhost:8081/project/${loggedClientId}`)
        .then((response) => {
          console.log("API Response:", response.data);
          if (Array.isArray(response.data)) {
            setProjects(response.data);
          } else {
            console.error("Unexpected response format:", response.data);
            setProjects([]);
          }
        })
        .catch((error) => console.error("Error fetching projects:", error));
    }
  }, []);

  const handleTrackingClick = (projectId) => {
    navigate(`/tracking/${projectId}`);
  };

  const toggleProjectsVisibility = () => {
    setIsProjectsVisible(!isProjectsVisible); // Toggle Projects section
  };

  const toggleCompletedVisibility = () => {
    setIsCompletedVisible(!isCompletedVisible); // Toggle Completed section
  };

  return (
    <div className="client-project-page">
      <Sidebar />
      <div className="content">
        <div
          className="toggle-button-projects"
          onClick={toggleProjectsVisibility}
        >
          {isProjectsVisible ? <FaChevronDown /> : <FaChevronRight />} Projects
        </div>

        {isProjectsVisible && (
          <div className="project-grid-container">
            {projects
              .filter((project) => project.status !== "completed")
              .map((project) => (
                <div
                  className="project-grid"
                  key={project.id}
                  onClick={() => handleTrackingClick(project.id)}
                >
                  <div className="project-box">
                    <div className="project-header">
                      <div className="logo-box">{project.projectName[0]}</div>
                      <h2 className="project-title">{project.projectName}</h2>
                    </div>
                    <div className="project-info">
                      <p>Status: {project.status}</p>
                      <p>Progress: {project.progress || "N/A"}%</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Completed Toggle Section with a separate class */}
        <div
          className="toggle-button-completed"
          onClick={toggleCompletedVisibility}
        >
          {isCompletedVisible ? <FaChevronDown /> : <FaChevronRight />}{" "}
          Completed
        </div>

        {isCompletedVisible && (
          <div className="project-grid-container">
            {projects
              .filter((project) => project.status === "completed")
              .map((project) => (
                <div className="project-grid" key={project.id}>
                  <div className="project-box">
                    <div className="project-header">
                      <div className="logo-box">{project.projectName[0]}</div>
                      <h2 className="project-title">{project.projectName}</h2>
                    </div>
                    <div className="project-info">
                      <p>Status: {project.status}</p>
                      <p>Progress: 100%</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Project;
