import React, { useState, useEffect } from "react";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa"; // Import icons
import Sidebar from "../sidebar";
import axios from "axios";
import "./project.css";
import Topbar from "../Topbar";

function Project() {
  const navigate = useNavigate();
  const [isProjectsVisible, setIsProjectsVisible] = useState(true);
  const [isCompletedVisible, setIsCompletedVisible] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const loggedClientId = localStorage.getItem("clientId");
    setClientId(loggedClientId);

    if (loggedClientId) {
      axios
        .get(`http://localhost:8081/project/${loggedClientId}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setProjects(response.data);

            const projectIds = response.data.map((project) => project.id);

            axios
              .get(`http://localhost:8081/tasks`, { params: { projectIds } }) // Adjust backend to accept multiple IDs if needed
              .then((taskResponse) => {
                console.log("Fetched tasks:", taskResponse.data.tasks);
                setTasks(taskResponse.data.tasks || []);
              })
              .catch((error) => console.error("Error fetching tasks:", error));
          } else {
            console.error("Unexpected response format:", response.data);
            setProjects([]);
          }
        })
        .catch((error) => console.error("Error fetching projects:", error));
    }
  }, []);

  const calculateProgress = (projectId) => {
    const projectTasks = tasks.filter((task) => task.project_id === projectId);
    const totalTasks = projectTasks.length;
    if (totalTasks === 0) return "N/A";

    const completedTasks = projectTasks.filter(
      (task) => task.status === "completed"
    ).length;
    return Math.round((completedTasks / totalTasks) * 100);
  };

  const getTaskCountForProject = (projectId) => {
    return tasks.filter((task) => task.project_id === projectId).length;
  };

  const handleTrackingClick = (projectId) => {
    navigate(`/tracking/${projectId}?clientId=${clientId}`);
  };  

  const toggleProjectsVisibility = () => {
    setIsProjectsVisible(!isProjectsVisible); // Toggle Projects section
  };

  const toggleCompletedVisibility = () => {
    setIsCompletedVisible(!isCompletedVisible); // Toggle Completed section
  };

  return (
    <div>
    <Topbar />
    <div className="client-project-page">
      <Sidebar />
      <div className="content-client-project">
        <div
          className="toggle-button-projects"
          onClick={toggleProjectsVisibility}
        >
          {isProjectsVisible ? <FaChevronDown /> : <FaChevronRight />} Projects
        </div>

        {isProjectsVisible && (
          <div className="project-grid-container">
            {projects
              .filter((project) => project.status !== "Completed")
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
                      <p>Tasks: {getTaskCountForProject(project.id)}</p>
                      <p>Progress: {calculateProgress(project.id)}%</p>
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
              .filter((project) => project.status === "Completed")
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
                      <p>Tasks: {getTaskCountForProject(project.id)}</p>
                      <p>Progress: {calculateProgress(project.id)}%</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default Project;
