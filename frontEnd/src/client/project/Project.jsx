import React, { useState, useEffect } from "react";
import qs from "qs";
import { useNavigate } from "react-router-dom";
import {
  FaChevronDown,
  FaChevronRight,
  FaInfoCircle,
  FaTasks,
  FaChartLine,
} from "react-icons/fa";
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

  // Function to generate color from string
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  // Function to determine text color based on background
  const getContrastColor = (hexColor) => {
    if (!hexColor) return '#FFFFFF';
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  };

  useEffect(() => {
    const loggedClientId = localStorage.getItem("clientId");
    setClientId(loggedClientId);

    if (loggedClientId) {
      axios
        .get(`http://localhost:8081/project-client/${loggedClientId}`)
        .then((response) => {
          if (Array.isArray(response.data)) {
            setProjects(response.data);

            const projectIds = response.data.map((project) => project.id);

            axios
              .get(`http://localhost:8081/tasks`, {
                params: { projectIds },
              })
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
      (task) => task.status === "Completed"
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
    setIsProjectsVisible(!isProjectsVisible);
  };

  const toggleCompletedVisibility = () => {
    setIsCompletedVisible(!isCompletedVisible);
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
            {isProjectsVisible ? <FaChevronDown /> : <FaChevronRight />}{" "}
            Projects
          </div>

          {isProjectsVisible && (
            <div className="project-grid-container">
              {projects
                .filter((project) => project.status !== "Completed")
                .map((project) => {
                  const bgColor = stringToColor(project.projectName);
                  const textColor = getContrastColor(bgColor);
                  
                  return (
                    <div
                      className="project-grid"
                      key={project.id}
                      onClick={() => handleTrackingClick(project.id)}
                    >
                      <div className="project-box">
                        <div className="project-client-header">
                          <div 
                            className="logoclient-box" 
                            style={{ 
                              backgroundColor: bgColor,
                              color: textColor
                            }}
                          >
                            {project.projectName[0]}
                          </div>
                          <h2 className="projectclient-title">{project.projectName}</h2>
                        </div>
                        <div className="project-info">
                          <p>
                            <span className="icon-with-gap">
                              <FaInfoCircle 
                                size={16} 
                                style={{ 
                                  color: '#6E5B9A'
                                }} 
                              /> 
                              {project.status}
                            </span>
                            <span className="icon-with-gap">
                              <FaTasks style={{ color: 'green' }} /> {getTaskCountForProject(project.id)}
                            </span>
                            <span className="icon-with-gap">
                              <FaChartLine style={{ color: 'red' }} /> {calculateProgress(project.id)}%
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

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
                .map((project) => {
                  const bgColor = stringToColor(project.projectName);
                  const textColor = getContrastColor(bgColor);
                  
                  return (
                    <div
                      className="project-grid"
                      key={project.id}
                      onClick={() => handleTrackingClick(project.id)}
                    >
                      <div className="project-box">
                        <div className="project-client-header">
                          <div 
                            className="logoclient-box" 
                            style={{ 
                              backgroundColor: bgColor,
                              color: textColor
                            }}
                          >
                            {project.projectName[0]}
                          </div>
                          <h2 className="projectclient-title">{project.projectName}</h2>
                        </div>
                        <div className="project-info">
                          <p>
                            <span className="icon-with-gap">
                              <FaInfoCircle /> {project.status}
                            </span>
                            <span className="icon-with-gap">
                              <FaTasks /> {getTaskCountForProject(project.id)}
                            </span>
                            <span className="icon-with-gap">
                              <FaChartLine /> {calculateProgress(project.id)}%
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Project;