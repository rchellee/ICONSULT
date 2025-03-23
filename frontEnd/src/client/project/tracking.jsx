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
import ProjectOverview from "./ProjectOverview";
import "./tracking.css";
import Files from "./Files";
import Topbar from "../Topbar";
import ClientTask from "./ClientTask"; // Import the new ClientTask component
import axios from "axios";

function Tracking() {
  const { projectId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("clientId");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { searchTerm } = useContext(SearchContext);
  const [folders, setFolders] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch tasks for the specific project
    axios
      .get("http://localhost:8081/tasks", {
        params: { projectIds: [projectId] },
      })
      .then((response) => {
        const tasksWithFixedFee = response.data.tasks.map((task) => ({
          ...task,
          task_fee: "₱100.00", 
        }));
        setTasks(tasksWithFixedFee || []);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Error fetching tasks. Please try again later.");
        setIsLoading(false);
      });
  }, [projectId]);

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const fileMatch = files.some((file) =>
        file.original_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (fileMatch) {
        setActiveTab("files");
      }
    }
  }, [searchTerm, files]);

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
        duedate: new Date().toLocaleDateString(), 
      };
      setFolders([...folders, newFolder]); 
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
              <ClientTask projectId={projectId} tasks={tasks} />
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