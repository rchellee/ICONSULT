import React, { useState } from "react";
import Sidebar from "../sidebar";
import "./tracking.css"; // Import the tracking-specific CSS

function Tracking() {
  const [activeTab, setActiveTab] = useState("posts"); // State to manage active tab
  const [showNewFolderInput, setShowNewFolderInput] = useState(false); // State to show new folder input
  const [folderName, setFolderName] = useState(""); // State to store folder name
  const [folderColor, setFolderColor] = useState("#ffffff"); // State to store folder color
  const [isCreating, setIsCreating] = useState(false); // State to manage folder creation mode

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Update active tab
  };

  const handleNewFolderClick = () => {
    setIsCreating(true); // Switch to create folder mode
    setShowNewFolderInput(true); // Show input for new folder creation
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value); // Update folder name
  };

  const handleFolderColorChange = (e) => {
    setFolderColor(e.target.value); // Update folder color
  };

  const handleCancelCreate = () => {
    setIsCreating(false); // Exit folder creation mode
    setFolderName(""); // Clear folder name
    setFolderColor("#ffffff"); // Reset folder color to default
    setShowNewFolderInput(false); // Hide the folder creation input
  };

  const handleCreateFolder = () => {
    if (folderName) {
      console.log(`New folder created: ${folderName} with color ${folderColor}`);
      setIsCreating(false); // Exit folder creation mode
      setFolderName(""); // Clear folder name input
      setFolderColor("#ffffff"); // Reset folder color to default
      setShowNewFolderInput(false); // Hide the folder creation input
    }
  };

  return (
    <div className="client-project-page">
      <Sidebar />
      <div className="content">
        {/* Tabs at the top */}
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

        {/* Content below the tabs */}
        <div className="content-area">
          {activeTab === "posts" && (
            <div className="posts">
              <h2>Track the project here</h2>
            </div>
          )}

          {activeTab === "files" && (
            <div className="files">
              {/* New, Upload, Sort, and Details buttons inside the Files tab */}
              <div className="file-actions">
                <button onClick={handleNewFolderClick}>New</button>
                <button>Upload</button>
                <button>Sort</button>
                <button>Details</button>
              </div>

              {/* Input for creating a new folder */}
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
