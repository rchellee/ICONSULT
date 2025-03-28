import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import React, { useState, useEffect, useRef } from "react";
import { FaFile, FaFileImage } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { IoMdDownload } from "react-icons/io";
import "./FileTabStyle.css";
import emptyFolder from "../../assets/empty-folder.png"; // Adjusted path

const FilesTab = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [clientNames, setClientNames] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: "name", // Default sort by name
    direction: "asc", // Default ascending order
  });
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // Function to trigger file input click
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8081/files?project_id=${projectId}`
        );
        const data = await response.json();
        setFiles(data);

        const clientIds = data
          .filter((file) => file.uploaded_by !== "admin")
          .map((file) => file.uploaded_by);

        if (clientIds.length > 0) {
          const uniqueClientIds = [...new Set(clientIds)];
          const clientNamePromises = uniqueClientIds.map((clientId) =>
            fetch(`http://localhost:8081/client/${clientId}`)
              .then((res) => res.json())
              .then((client) => ({
                id: clientId,
                name: `${client.firstName} ${client.lastName}`,
              }))
          );
          const clientNamesData = await Promise.all(clientNamePromises);
          const clientNamesMap = clientNamesData.reduce((acc, { id, name }) => {
            acc[id] = name;
            return acc;
          }, {});

          setClientNames(clientNamesMap);
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setError("Failed to load files.");
      } finally {
        setLoading(false);
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

  const handleDeleteClick = (fileId) => {
    setFileToDelete(fileId);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setFileToDelete(null);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) {
      setShowDeleteConfirm(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/files/${fileToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileToDelete));
        console.log("File record deleted successfully.");
      } else {
        const errorData = await response.json();
        console.error("Error deleting file record:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting file record:", error);
    } finally {
      setShowDeleteConfirm(false);
      setFileToDelete(null);
    }
  };

  const handleRename = async (fileId, currentName) => {
    const newName = prompt("Enter new file name:", currentName);
    if (newName && newName !== currentName) {
      try {
        const response = await fetch(`http://localhost:8081/files/${fileId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ original_name: newName }),
        });

        if (response.ok) {
          setFiles((prevFiles) =>
            prevFiles.map((file) =>
              file.id === fileId ? { ...file, original_name: newName } : file
            )
          );
          console.log("File renamed successfully.");
        } else {
          const errorData = await response.json();
          console.error("Error renaming file:", errorData.message);
        }
      } catch (error) {
        console.error("Error renaming file:", error);
      }
    }
  };

  const getFileIcon = (fileName) => {
    if (!fileName) {
      return <FaFile className="file-type-icon" />;
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

  const sortedFiles = [...files].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.original_name.localeCompare(b.original_name)
        : b.original_name.localeCompare(a.original_name);
    }
    return 0;
  });

  const changeSort = (direction) => {
    setSortConfig({
      key: "name", // Always sort by name
      direction: direction, // Set the direction (asc or desc)
    });
    setShowSortOptions(false); // Hide sort options after selection
  };

  if (loading) {
    return <p className="loading">Loading files...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="files-tab-content">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <div className="delete-confirmation-header">
              <MdOutlineDeleteOutline className="delete-project-icon" />
              <h3>Confirm Deletion</h3>
            </div>
            <p>Are you sure you want to delete this file?</p>
           
            <div className="delete-confirmation-buttons">
              <button className="cancel-project-button" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-project-button" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="upload-files-section">
        {/* Upload Button */}
        <button className="upload-files-btn" onClick={handleUploadButtonClick}>
          Upload <MdOutlineFileUpload />
          {/* Hidden file input */}
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: "none" }}
            ref={fileInputRef} // Attach the ref
          />
        </button>

        {/* Sort Button */}
        <div className="sort-files">
          <button
            className="sort-files-btn"
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            Sort <FaArrowDown />
          </button>
          {showSortOptions && (
            <div className="sort-files-options">
              <button onClick={() => changeSort("asc")}>Name (A-Z)</button>
              <button onClick={() => changeSort("asc")}>Ascending</button>
              <button onClick={() => changeSort("desc")}>Descending</button>
            </div>
          )}
        </div>
      </div>

      {/* File List Table */}
      <div className="file-list">
        {files.length > 0 && (
          <div className="file-list-scrollable">
            <table>
              <thead>
                <tr>
                  <th onClick={() => changeSort("asc")} className="name-header">
                    Name
                  </th>
                  <th className="upload-date-header">Modified Date</th>
                  <th className="uploaded-by-header">Modified By</th>
                  <th className="action-files">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedFiles.map((file) => (
                  <tr key={file.id}>
                    <td className="truncate-text">
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
                      {file.uploaded_by === "admin"
                        ? "Admin"
                        : clientNames[file.uploaded_by] || "Unknown"}
                    </td>
                    <td>
                      <button
                        className="files-admin"
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
                        <IoMdDownload /> {/* Download icon */}
                      </button>
                      <button
                        className="files-admin"
                        onClick={() => handleDeleteClick(file.id)}
                      >
                        <MdOutlineDeleteOutline /> {/* Delete icon */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {files.length === 0 && (
          <div className="no-files-container">
            <img 
              src={emptyFolder} 
              alt="Empty folder" 
              className="empty-folder-image"
            />
            <div className="no-files-message">No files uploaded yet.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesTab;