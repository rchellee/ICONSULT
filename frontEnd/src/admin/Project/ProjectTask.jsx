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

const ProjectTask = ({ onBack }) => {
  const { projectId } = useParams();
  const { searchTerm } = useContext(SearchContext);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("transactions");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projectName, setProjectName] = useState("");

  // Fetch project name
  useEffect(() => {
    if (!projectId) return;

    const fetchProjectName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/project/${projectId}`
        );
        setProjectName(response.data.projectName);
      } catch (error) {
        console.error("Error fetching project name:", error);
      }
    };

    fetchProjectName();
  }, [projectId]);

  const handleTabClick = (tab) => setActiveTab(tab);

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="project-task-container">
        <div className="home-button-container"></div>
        {/* Project Name Header */}
        <div className="project-header">
          <h3 className="project-id">
            <span className="project-name">MyProject</span>
            <IoChevronForward className="chevron-icon" />
            <span className="project-name">{projectName}</span>
          </h3>
        </div>
        
        <div className="project-task-tabs">
          <button
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => handleTabClick("transactions")}
          >
            Task
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
              <Transaction 
                projectId={projectId} 
                projectName={projectName}  // Pass projectName as prop
              />
            </ErrorBoundary>
          )}
          {activeTab === "files" && <FilesTab projectId={projectId} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectTask;