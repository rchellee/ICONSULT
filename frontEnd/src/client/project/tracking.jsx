import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus, FaArrowUp, FaFolder, FaFile, FaHome } from "react-icons/fa";
import Sidebar from "../sidebar";
import "./tracking.css";

function Tracking() {
  const [activeTab, setActiveTab] = useState("posts");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [folders, setFolders] = useState([]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleNewFolderClick = () => {
    setShowNewFolderInput(true);
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleCancelCreate = () => {
    setFolderName("");
    setShowNewFolderInput(false);
  };

  const handleCreateFolder = () => {
    if (folderName) {
      const newFolder = {
        name: folderName,
        modifiedDate: new Date().toLocaleDateString(),
        modifiedBy: "Client",
        duedate: new Date().toLocaleDateString(), // Added a default due date for each folder
      };
      setFolders([...folders, newFolder]); // Add new folder to the list
      handleCancelCreate();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="client-project-page">
      <Sidebar />
      <div className="content">
        {/* Home Icon */}
        <div className="home-icon-container">
          <FaHome className="home-icon" />
          <span className="tooltip">All Project</span>
        </div>

        <div className="navigation-buttons">
          <button className="nav-button">
            <FaChevronLeft />
            <span className="tooltip">Go back</span>
          </button>
          <button className="nav-button">
            <FaChevronRight />
          </button>
        </div>

        {/* Search Box */}
        <div className="search-box-container">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        {/* Tabs */}
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

        {/* Content Area */}
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
                <button>Edit in Grid View</button>
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
                  <div className="button-group">
                    <button onClick={handleCreateFolder}>Create</button>
                    <button onClick={handleCancelCreate}>Cancel</button>
                  </div>
                </div>
              )}

              {/* Table of Folders */}
              <div className="folder-list">
                {folders.length > 0 ? (
                  <table className="folder-table no-vertical-lines">
                    <thead>
                      <tr>
                        <th>
                          <FaFile style={{ marginRight: "20px" }} /> Name
                        </th>
                        <th>Modified</th>
                        <th>Modified by</th>
                      </tr>
                    </thead>
                    <tbody>
                      {folders.map((folder, index) => (
                        <tr key={index}>
                          <td className="icon-name">
                            <FaFolder className="icon" style={{ marginRight: "20px" }} />
                            <span className="truncate" title={folder.name}>
                              {folder.name}
                            </span>
                          </td>
                          <td>{folder.modifiedDate}</td>
                          <td>{folder.modifiedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No files created yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tracking;
