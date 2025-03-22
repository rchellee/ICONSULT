import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import { useParams, useLocation } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
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
import ClientTask from "./ClientTask"; // Import the ClientTask component

function Tracking() {
  const { projectId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("clientId");
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { searchTerm } = useContext(SearchContext);
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

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      // Check if search term matches a task name or file name
      const taskMatch = tasks.some((task) =>
        task.task_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const fileMatch = files.some((file) =>
        file.original_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (taskMatch) {
        setActiveTab("tasks");
      } else if (fileMatch) {
        setActiveTab("files");
      }
    }
  }, [searchTerm, tasks, files]);

  const formatDueDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
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

  return (
    <div>
      <Topbar />
      <div className="client-task-page">
        <Sidebar />
        <div className="content-tracking">
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
                    {/* Task Cards */}
                    <div className="task-cards">
                      {tasks.map((task) => (
                        <ClientTask key={task.id} task={task} />
                      ))}
                    </div>
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