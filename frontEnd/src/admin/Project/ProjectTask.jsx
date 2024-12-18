import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons"; // Import the home icon
import "./task.css";

const ProjectTask = () => {
  const { projectId } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate();

  // State for active tab
  const [activeTab, setActiveTab] = useState("posts");

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="project-task-container">
      {/* Home Icon Button */}
      <div className="home-button-container">
      <button className="home-button" onClick={() => navigate("/")}>
        <FontAwesomeIcon icon={faHome} size="lg" /> {/* Home icon */}
      </button>
      </div>

      {/* Tabs */}
      <div className="project-task-tabs">
        <button
          className={activeTab === "posts" ? "active-tab" : ""}
          onClick={() => handleTabClick("posts")}
        >
          Posts
        </button>
        <button
          className={activeTab === "files" ? "active-tab" : ""}
          onClick={() => handleTabClick("files")}
        >
          Files
        </button>
      </div>

      {/* Content Area */}
      <div className="project-task-content">
        {activeTab === "posts" && (
          <div className="posts-tab-content">
            <div className="project-posts">
              <h2>Track the project posts here</h2>
            </div>
          </div>
        )}

        {activeTab === "files" && (
          <div className="files-tab-content">
            <h2>Manage project files</h2>
            <p>Upload, view, and organize project-related files here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTask;
