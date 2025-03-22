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

const ProjectTask = ({ onBack }) => {
  const { projectId } = useParams();
  const { searchTerm } = useContext(SearchContext);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("transactions"); // Default to "transactions" tab
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Handle tab switching
  const handleTabClick = (tab) => setActiveTab(tab);

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="project-task-container">
        <div className="home-button-container"></div>
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
          {/* Transaction History Tab */}
          {activeTab === "transactions" && (
            <ErrorBoundary>
              <Transaction projectId={projectId} />
            </ErrorBoundary>
          )}
          {/* Documents Tab */}
          {activeTab === "files" && <FilesTab projectId={projectId} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectTask;
