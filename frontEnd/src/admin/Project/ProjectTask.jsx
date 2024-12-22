// ProjectTask.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import "./task.css";
import "./PostTab.css";
import PostsTab from "./PostsTab"; // Import the PostsTab component

const ProjectTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("posts");
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTasks] = useState([]);

  // Handle tab switching
  const handleTabClick = (tab) => setActiveTab(tab);

  // Add new task
  const handleCreateTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowTaskForm(false);
  };

  // Cancel task form
  const handleCancelForm = () => setShowTaskForm(false);

  return (
    <div className="project-task-container">
      {/* Home Button */}
      <div className="home-button-container">
        <button className="home-button" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faHome} size="lg" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="project-task-tabs">
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

      {/* Tab Content */}
      <div className="project-task-content">
        {/* Posts Tab */}
        {activeTab === "posts" && (
          <PostsTab
            tasks={tasks}
            setShowTaskForm={setShowTaskForm}
            showTaskForm={showTaskForm}
            handleCreateTask={handleCreateTask}
            handleCancelForm={handleCancelForm}
          />
        )}

        {/* Files Tab */}
        {activeTab === "files" && (
          <div className="files-tab-content">
            <div className="files-posts">
              <h2>Manage project files</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTask;
