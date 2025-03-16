import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import ErrorBoundary from "../../components/ErrorBoundary";
import { useParams, useNavigate } from "react-router-dom";
import "./Task.css";
import "./PostTab.css";
import PostsTab from "./PostsTab";
import FilesTab from "./FilesTab";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import Transaction from "./Transaction"; // Import the new Transaction component

const ProjectTask = ({ onBack }) => {
  const { projectId } = useParams();
  const { searchTerm } = useContext(SearchContext);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    console.log("Project ID in ProjectTask:", projectId);
  }, [projectId]);

  // Handle tab switching
  const handleTabClick = (tab) => setActiveTab(tab);

  const handleCreateTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowTaskForm(false);
  };

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId); // Set selected project id
  };

  const handleCancelForm = () => setShowTaskForm(false);

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="project-task-container">
        <div className="home-button-container"></div>

        {/* Tab Navigation */}
        <div className="project-task-tabs">
          {/* Tab Buttons */}
          <button
            className={activeTab === "posts" ? "active" : ""}
            onClick={() => handleTabClick("posts")}
          >
            Task
          </button>
          <button
            className={activeTab === "files" ? "active" : ""}
            onClick={() => handleTabClick("files")}
          >
            Documents
          </button>
          <button
            className={activeTab === "transactions" ? "active" : ""}
            onClick={() => handleTabClick("transactions")}
          >
            Transaction History
          </button>
        </div>

        {/* Tab Content */}
        <div className="project-task-content">
          {/* Posts Tab */}
          {activeTab === "posts" && (
            <ErrorBoundary>
              <PostsTab
                projectId={projectId}
                tasks={tasks}
                setShowTaskForm={setShowTaskForm}
                showTaskForm={showTaskForm}
                handleCreateTask={handleCreateTask}
                handleCancelForm={handleCancelForm}
                setTasks={setTasks}
              />
            </ErrorBoundary>
          )}
          {activeTab === "files" && <FilesTab projectId={projectId} />}
          {activeTab === "transactions" && (
            <ErrorBoundary>
              <Transaction projectId={projectId} />
            </ErrorBoundary>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectTask;