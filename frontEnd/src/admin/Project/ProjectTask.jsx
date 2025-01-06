import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import "./task.css";
import "./PostTab.css";
import PostsTab from "./PostsTab";
import FilesTab from "./FilesTab";

const ProjectTask = ({ projectId, onBack }) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);
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
  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId); // Set selected project id
  };

  const handleCancelForm = () => setShowTaskForm(false);
  useEffect(() => {
    console.log("Project ID in ProjectTask:", projectId);
    // Fetch or perform actions based on projectId
  }, [projectId]);

  return (
    <div className="project-task-container">
      <div className="home-button-container">
        {/*<button className="home-button" onClick={() => navigate("/admin")}>
          <FontAwesomeIcon icon={faHome} size="lg" />
        </button>*/}
      </div>


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
          <PostsTab
            projectId={projectId}
            tasks={tasks}
            setTasks={setTasks}
            setShowTaskForm={setShowTaskForm}
            showTaskForm={showTaskForm}
            handleCreateTask={handleCreateTask}
            handleCancelForm={handleCancelForm}
          />
        )}
        {activeTab === "files" && <FilesTab projectId={projectId} />}
      </div>
    </div>
  );
};

export default ProjectTask;
