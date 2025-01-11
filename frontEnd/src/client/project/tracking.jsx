import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import axios from "axios";
import ProjectOverview from "./ProjectOverview";
import "./tracking.css";
import Files from "./Files";
import Topbar from "../Topbar";
import Task from "./Task";  

function Tracking() {
  const { projectId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("clientId");

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [folderName, setFolderName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "tasks") {
      // Fetch tasks for the specific project
      axios
        .get("http://localhost:8081/tasks", {
          params: { projectIds: [projectId] },
        })
        .then((response) => {
          setTasks(response.data.tasks || []);
          setIsLoading(false);
        })
        .catch((err) => {
          setError("Error fetching tasks. Please try again later.");
          setIsLoading(false);
        });
    }
  }, [projectId, activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "overview") {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleGoback = () => {
    navigate("/clientproject");
  };

  return (
    <div>
      <Topbar />
      <div className="client-task-page">
        <Sidebar />
        <div className="content">
          <div
            className="home-icon-container"
            onClick={() => navigate("/clientproject")}
          >
            <span className="tooltip">All Project</span>
          </div>

          {/* Search Box */}
          <div className="search-box-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => handleTabClick("overview")}
            >
              Overview
            </button>
            <button
              className={activeTab === "tasks" ? "active" : ""}
              onClick={() => handleTabClick("tasks")}
            >
              Tasks
            </button>
            <button
              className={activeTab === "files" ? "active" : ""}
              onClick={() => handleTabClick("files")}
            >
              Documents
            </button>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {activeTab === "overview" && <ProjectOverview projectId={projectId} />}
            {activeTab === "tasks" && (
              <Task tasks={tasks} isLoading={isLoading} error={error} />
            )}
          </div>
        </div>
        {activeTab === "files" && <Files projectId={projectId} clientId={clientId} />}
      </div>
    </div>
  );
}

export default Tracking;
