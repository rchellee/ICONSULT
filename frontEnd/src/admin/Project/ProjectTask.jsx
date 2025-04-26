import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useParams, useNavigate } from "react-router-dom";
import "./Task.css";
import "./PostTab.css";
import FilesTab from "./FilesTab";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import Transaction from "./Transaction";
import axios from "axios";
import { IoChevronForward } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import noTaskIllust from "../../assets/no-task-illust.png"; // Import the image

const ProjectTask = ({ onBack }) => {
  const { projectId } = useParams();
  const { searchTerm } = useContext(SearchContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("transactions");
  const [projectName, setProjectName] = useState("");
  const [showCreateButton, setShowCreateButton] = useState(true);
  const [hasTasks, setHasTasks] = useState(false); // New state to track if tasks exist

  // Fetch project name
  useEffect(() => {
    if (!projectId) return;

    const fetchProjectName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/project/${projectId}`
        );
        setProjectName(response.data.projectName);
        
        // Check if project has tasks
        const tasksResponse = await axios.get(
          `http://localhost:8081/admin/tasks?projectId=${projectId}`
        );
        setHasTasks(tasksResponse.data.tasks.length > 0);
      } catch (error) {
        console.error("Error fetching project data:", error);
        setHasTasks(false);
      }
    };

    fetchProjectName();
  }, [projectId]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Hide create button when on Documents tab
    setShowCreateButton(tab === "transactions");
  };

  const handleCreateTask = () => {
    navigate(`/create-task`, {
      state: {
        projectId: projectId,
      },
    });
  };

  // Function to update hasTasks state when tasks are modified
  const handleTasksUpdate = (taskCount) => {
    setHasTasks(taskCount > 0);
  };

  return (
    <div className="project-task-page">
      <Topbar />
      <Sidebar />
      <div className="project-task-container">
        {/* Project Header with Breadcrumbs and Create Button */}
        <div className="project-header">
          <h3 className="project-id">
            <span className="project-name">Project</span>
            <IoChevronForward className="chevron-icon" />
            <span className="project-name" style={{  color: '#000' }}>
              {projectName}
            </span>
          </h3>
          
          {showCreateButton && (
  <>
    <button
      className="create-task-button"
      onClick={handleCreateTask}
    >
      <FaPlus className="icon" /> Create 
    </button>
    <button
      className="create-task-button-mobile"
      onClick={handleCreateTask}
    >
      <FaPlus className="icon" />
    </button>
  </>
)}
        </div>

        {/* Tab Navigation */}
        <div className="project-task-tabs">
          <button
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => handleTabClick("transactions")}
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
        
        {/* Tab Content */}
        <div className="project-task-content">
          {activeTab === "transactions" && (
            <ErrorBoundary>
              {hasTasks ? (
                <Transaction 
                  projectId={projectId}
                  projectName={projectName}
                  onTasksUpdate={handleTasksUpdate}
                />
              ) : (
                <div className="no-tasks-message">
                  <img 
                    src={noTaskIllust} 
                    alt="No tasks created" 
                    className="no-task-illustration"
                  />
                  <p>No tasks created yet.</p>
                </div>
              )}
            </ErrorBoundary>
          )}
          {activeTab === "files" && (
            <FilesTab 
              projectId={projectId} 
              projectName={projectName}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTask;