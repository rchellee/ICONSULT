import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaPlus, FaArrowUp } from "react-icons/fa";
import Sidebar from "../sidebar";
import "./tracking.css";

function Tracking() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderColor, setFolderColor] = useState("#ffffff");
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNewFolderClick = () => {
    setIsCreating(true);
    setShowNewFolderInput(true);
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleFolderColorChange = (e) => {
    setFolderColor(e.target.value);
  };

  const handleCancelCreate = () => {
    setIsCreating(false);
    setFolderName("");
    setFolderColor("#ffffff");
    setShowNewFolderInput(false);
  };

  const handleCreateFolder = () => {
    if (folderName) {
      console.log(`New folder created: ${folderName} with color ${folderColor}`);
      setIsCreating(false);
      setFolderName("");
      setFolderColor("#ffffff");
      setShowNewFolderInput(false);
    }
  };

  const goBackToProjects = () => {
    navigate("/projects");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update search term
  };

  return (
    <div className="client-project-page">
      <Sidebar />
      <div className="content">
        <div className="back-icon" onClick={goBackToProjects}>
          <FaChevronLeft /> All Projects
        </div>

        {/* Container for the search box */}
        <div className="search-box-container">
          {/* Search Box */}
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="tabs">
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

        <div className="content-area">
          {activeTab === "posts" && (
            <div className="posts">
              <h2>Track the project here</h2>
            </div>
          )}

          {activeTab === "files" && (
            <div className="files">
              <div className="file-actions">
                <button onClick={handleNewFolderClick}>
                  <FaPlus style={{ marginRight: "5px" }} /> New
                </button>
                <button>
                  <FaArrowUp style={{ marginRight: "5px" }} /> Upload
                </button>
                <button>Sort</button>
                <button>Details</button>
              </div>

              {showNewFolderInput && (
                <div className="new-folder-input">
                  <h3>Create a Folder</h3>
                  <div className="input-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={folderName}
                      onChange={handleFolderNameChange}
                      placeholder="Enter your folder name"
                    />
                  </div>
                  <div className="input-group">
                    <label>Folder Color</label>
                    <input
                      type="color"
                      value={folderColor}
                      onChange={handleFolderColorChange}
                    />
                  </div>
                  <div className="button-group">
                    <button onClick={handleCreateFolder}>Create</button>
                    <button onClick={handleCancelCreate}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tracking;
