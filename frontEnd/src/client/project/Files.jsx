import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFile, FaFileImage } from "react-icons/fa";
import { CiViewList, CiGrid31 } from "react-icons/ci";
import { BiDotsVerticalRounded } from "react-icons/bi";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./ClientFiles.css";

function Files({ projectId, clientId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [actionVisible, setActionVisible] = useState(null);
  const [userName, setUserName] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "name", // Default sorting by name
    direction: "asc", // Ascending by default
  });

  useEffect(() => {
    // Fetch files for the specific projectId
    axios
      .get("http://localhost:8081/files", {
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

  useEffect(() => {
    // Retrieve data from localStorage
    const clientId = localStorage.getItem("clientId");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (clientId && firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
    } else {
      console.warn(
        "No clientId, firstName, or lastName found in localStorage."
      );
    }
  }, []);

  const handleDelete = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:8081/files/${fileId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
        console.log("File record deleted successfully.");
      } else {
        const errorData = await response.json();
        console.error("Error deleting file record:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting file record:", error);
    }
  };

  const openFileDialog = () => {
    document.getElementById("file-input").click();
  };

  const getFileIcon = (fileName) => {
    if (!fileName) {
      return <FaFile className="file-type-icon" />; // Default icon for missing file names
    }
    const fileExtension = fileName.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "bmp"].includes(fileExtension)) {
      return <FaFileImage className="file-type-icon" />;
    } else if (
      ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(fileExtension)
    ) {
      return <FaFile className="file-type-icon" />;
    }
    return <FaFile className="file-type-icon" />;
  };

  const handleSort = (column) => {
    let direction = "asc";
    if (sortConfig.key === column && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key: column, direction });
  };

  const sortedFiles = [...files].sort((a, b) => {
    if (sortConfig.direction === "asc") {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    } else {
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    }
  });

  if (loading) {
    return <p className="loading">Loading files...</p>;
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

        {/* <div className="right-section">
          <button>Sort</button>
          <CiViewList />
          <CiGrid31 />
        </div> */}
      </div>

      <input
        type="file"
        id="file-input"
        style={{ display: "none" }}
        onChange={handleFileSelection}
        disabled={uploading}
      />

      {files.length === 0 ? (
        <p className="loading">No files uploaded for this project.</p>
      ) : (
        <>
          {/* Display files in a table */}
          <table className="file-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("original_name")}>
                  Name
                  {sortConfig.key === "original_name" &&
                    (sortConfig.direction === "asc" ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    ))}
                </th>
                <th onClick={() => handleSort("upload_date")}>
                  Upload Date
                  {sortConfig.key === "upload_date" &&
                    (sortConfig.direction === "asc" ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    ))}
                </th>
                <th onClick={() => handleSort("uploaded_by")}>
                  Uploaded By
                  {sortConfig.key === "uploaded_by" &&
                    (sortConfig.direction === "asc" ? (
                      <FaArrowUp />
                    ) : (
                      <FaArrowDown />
                    ))}
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedFiles.map((file) => (
                <tr key={file.id}>
                  <td>
                    <a
                      href={
                        file.webViewLink ||
                        `http://localhost:8081/uploads/${file.original_name}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      title={file.original_name}
                    >
                      {getFileIcon(file.original_name)} {file.original_name}
                    </a>
                  </td>
                  <td>
                    {new Date(file.upload_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    {file.uploaded_by === "admin" ? (
                      "Admin"
                    ) : (
                      <span>{userName || "Client Name"}</span>
                    )}
                  </td>
                  <td>
                    <div className="action-container">
                      <BiDotsVerticalRounded
                        onClick={() => handleActionClick(file.id)}
                        style={{ cursor: "pointer" }}
                      />
                      {actionVisible === file.id && (
                        <div className="action-options">
                          <button
                            onClick={() => {
                              const downloadLink =
                                file.webContentLink ||
                                `http://localhost:8081/uploads/${file.original_name}`;
                              const a = document.createElement("a");
                              a.href = downloadLink;
                              a.download = file.original_name;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                            }}
                          >
                            Download
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
        </>
      )}
    </div>
  );
}

export default Files;
