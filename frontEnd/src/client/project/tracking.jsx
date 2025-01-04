import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaArrowUp,
  FaFolder,
  FaFile,
  FaHome,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import axios from "axios";
import ProjectOverview from "./ProjectOverview";
import "./tracking.css";
import Files from "./Files";
import Topbar from "../Topbar";

function Tracking() {
  const { projectId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("clientId");

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
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

  const handleNewFolderClick = () => {
    setShowNewFolderInput(true);
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleCancelCreate = () => {
    setFolderName("");
    setShowNewFolderInput(false);
  };

  const handleCreateFolder = () => {
    if (folderName) {
      const newFolder = {
        name: folderName,
        modifiedDate: new Date().toLocaleDateString(),
        modifiedBy: "Client",
        duedate: new Date().toLocaleDateString(), // Added a default due date for each folder
      };
      setFolders([...folders, newFolder]); // Add new folder to the list
      handleCancelCreate();
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
            <FaHome className="home-icon" />
            <span className="tooltip">All Project</span>
          </div>

          {/* <div className="navigation-buttons">
          <button className="nav-button" onClick={handleGoback}>
            <FaChevronLeft />
            <span className="tooltip">Go back</span>
          </button>
        </div> */}

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
              Files
            </button>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {activeTab === "overview" && (
              <ProjectOverview projectId={projectId} />
            )}
            {activeTab === "tasks" && (
              <>
                {isLoading && <p>Loading tasks...</p>}
                {error && <p className="error">{error}</p>}
                {!isLoading && !error && tasks.length === 0 && (
                  <p>No tasks found.</p>
                )}
                {!isLoading && !error && tasks.length > 0 && (
                  <div className="task-list">
                    <table className="task-table">
                      <thead>
                        <tr>
                          <th>Task</th>
                          <th>Fee</th>
                          <th>Miscellaneous</th>
                          <th>Due Date</th>
                          <th>Employee</th>
                          <th>Status</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task) => {
                          const miscellaneousItems = JSON.parse(
                            task.miscellaneous || "[]"
                          );
                          const miscellaneousDetails = miscellaneousItems
                            .map((item) => `${item.name}: ${item.fee}`)
                            .join(", ");

                          return (
                            <tr key={task.id}>
                              <td>{task.task_name}</td>
                              <td>{task.task_fee}</td>
                              <td>{miscellaneousDetails || "N/A"}</td>
                              <td>{task.due_date}</td>
                              <td>{task.employee}</td>
                              <td>{task.status}</td>
                              <td>{task.amount}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {activeTab === "files" && (
          <Files projectId={projectId} clientId={clientId} />
        )}
      </div>
    </div>
  );
}

export default Tracking;
