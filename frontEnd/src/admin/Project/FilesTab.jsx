import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import "./FileTabStyle.css";

const FilesTab = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [activeFileId, setActiveFileId] = useState(null); // State to manage the active file for actions

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/upload?project_id=${projectId}`
        );
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, [projectId]);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("project_id", projectId);
    formData.append("uploaded_by", "admin");

    setUploading(true);

    try {
      const response = await fetch("http://localhost:8081/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setFiles((prevFiles) => [...prevFiles, result]);
      } else {
        console.error("Error uploading file:", result.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  // Handle the visibility of the edit/delete buttons
  const toggleActions = (fileId) => {
    setActiveFileId(activeFileId === fileId ? null : fileId);
  };

  // Delete file handler
  const handleDeleteFile = async (fileId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this file?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8081/upload/${fileId}`, // Assuming the backend API supports file deletion with the fileId
        { method: "DELETE" }
      );

      if (response.ok) {
        setFiles(files.filter((file) => file.id !== fileId)); // Remove the file from the UI
        setActiveFileId(null); // Hide the action buttons after deletion
      } else {
        console.error("Error deleting file");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  return (
    <div className="files-tab-content">
      <div className="upload-section">
        <label className="upload-btn">
          + Upload
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="file-list">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Upload Date</th>
              <th>Uploaded By</th>
              {/* New column for actions */}
            </tr>
          </thead>
          <tbody>
            {files.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No files uploaded yet.
                </td>
              </tr>
            ) : (
              files.map((file) => (
                <tr key={file.id}>
                  <td className="truncate-text">
                    <a
                      href={`http://localhost:8081/uploads/${file.file_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={file.original_name}
                    >
                      {file.original_name}
                    </a>
                  </td>
                  <td>
                    {new Date(file.upload_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>{file.uploaded_by_name || "Unknown"}</td>
                  <td>
                    {/* Action button with icon */}
                    <button
                      className={`action-file ${activeFileId === file.id ? "active" : ""}`}
                      onClick={() => toggleActions(file.id)}
                    >
                      <BsThreeDotsVertical />
                    </button>

                    {activeFileId === file.id && (
                      <div className="file-actions-popup">
                        <button className="edit-file">Edit</button>
                        <button
                          className="delete-file"
                          onClick={() => handleDeleteFile(file.id)} // Call delete function on click
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FilesTab;
