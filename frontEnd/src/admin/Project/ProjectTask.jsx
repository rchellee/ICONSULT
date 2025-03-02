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
  useEffect(() => {
    console.log("Project ID in ProjectTask:", projectId);
    // Fetch or perform actions based on projectId
  }, [projectId]);

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
        </div>
      </div>
    </div>
  );
};

export default ProjectTask;
