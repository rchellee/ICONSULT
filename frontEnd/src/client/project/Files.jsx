import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiViewList, CiGrid31 } from "react-icons/ci"; // Import the icons
import { BiDotsVerticalRounded } from "react-icons/bi"; // Import the dots icon
import "./ClientFiles.css";

function Files({ projectId, clientId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [actionVisible, setActionVisible] = useState(null); // State to toggle visibility of edit/delete options

  useEffect(() => {
    // Fetch files for the specific projectId
    axios
      .get("http://localhost:8081/upload", {
        params: { project_id: projectId },
      })
      .then((response) => {
        setFiles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        setError("Failed to fetch files. Please try again.");
        setLoading(false);
      });
  }, [projectId]);

  const handleFileSelection = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("project_id", projectId);
    formData.append("uploaded_by", clientId || "admin"); // Assume 'admin' if no clientId

    axios
      .post("http://localhost:8081/upload", formData)
      .then((response) => {
        console.log("File uploaded successfully!");
        setFiles((prevFiles) => [...prevFiles, response.data]);
        setSelectedFile(null);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("Failed to upload file. Please try again.");
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const handleActionClick = (fileId) => {
    // Toggle the visibility of action options (edit/delete)
    setActionVisible(actionVisible === fileId ? null : fileId);
  };

  const handleEdit = (fileId) => {
    // Implement edit logic here
    console.log("Edit file with id:", fileId);
  };

  const handleDelete = (fileId) => {
    // Implement delete logic here
    console.log("Delete file with id:", fileId);
  };

  const openFileDialog = () => {
    document.getElementById("file-input").click();
  };

  if (loading) {
    return <p>Loading files...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="ClientFiles">
      {/* Top section with buttons */}
      <div className="top-buttons">
        <div className="left-section">
          {!selectedFile ? (
            // Show "New" button when no file is selected
            <button onClick={openFileDialog} disabled={uploading}>
              {uploading ? "Uploading..." : "New"}
            </button>
          ) : (
            // Show "Upload" button when a file is selected
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          )}
        </div>
        {selectedFile && (
          <div className="file-info">
            <p>Selected File: {selectedFile.name}</p>
          </div>
        )}

        <div className="right-section">
          <button>Sort</button>
          <CiViewList />
          <CiGrid31 />
        </div>
      </div>

      <input
        type="file"
        id="file-input"
        style={{ display: "none" }}
        onChange={handleFileSelection}
        disabled={uploading}
      />

      {files.length === 0 ? (
        <p>No files uploaded for this project.</p>
      ) : (
        <div className="table-upload-container">
          <div className="file-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Upload Date</th>
                  <th>Uploaded By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td>
                      <a
                        href={`http://localhost:8081/uploads/${file.file_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
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
                      <div className="action-container">
                        <BiDotsVerticalRounded
                          onClick={() => handleActionClick(file.id)}
                          style={{ cursor: "pointer" }}
                        />
                        {actionVisible === file.id && (
                          <div className="action-options">
                            <button onClick={() => handleEdit(file.id)}>
                              Edit
                            </button>
                            <button onClick={() => handleDelete(file.id)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Files;
