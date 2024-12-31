import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaPlus, FaArrowUp, FaFolder, FaFile, FaHome } from "react-icons/fa";
import Sidebar from "../sidebar";
import axios from "axios";
import "./tracking.css";

function Tracking() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    // Fetch tasks for the specific project
    axios
      .get(`http://localhost:8081/tasks`, { params: { projectId } })
      .then((response) => {
        setTasks(response.data.tasks || []); // Save tasks to state
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Error fetching tasks. Please try again later.");
        setIsLoading(false);
      });
  }, [projectId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
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

  return (
    <div className="client-task-page">
      <Sidebar />
      <div className="content">
        <div className="home-icon-container">
          <FaHome className="home-icon" />
          <span className="tooltip">All Project</span>
        </div>

        <div className="navigation-buttons">
          <button className="nav-button">
            <FaChevronLeft />
            <span className="tooltip">Go back</span>
          </button>
          <button className="nav-button">
            <FaChevronRight />
          </button>
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
            className={activeTab === "posts" ? "active" : ""}
            onClick={() => handleTabClick("posts")}
          >
            Posts
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
          <h2>Tasks for Project ID: {projectId}</h2>

          {isLoading && <p>Loading tasks...</p>}

          {error && <p className="error">{error}</p>}

          {!isLoading && !error && tasks.length === 0 && <p>No tasks found.</p>}

          {!isLoading && !error && tasks.length > 0 && (
            <div className="task-list">
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Fee</th>
                    <th>Due Date</th>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.task_name}</td>
                      <td>{task.task_fee}</td>
                      <td>{task.due_date}</td>
                      <td>{task.employee}</td>
                      <td>{task.status}</td>
                      <td>{task.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tracking;