import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFile, FaFileImage } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import "./FileTabStyle.css";

const FilesTab = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeFileId, setActiveFileId] = useState(null);
  const [clientNames, setClientNames] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });

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

  const toggleActions = (fileId) => {
    setActiveFileId(activeFileId === fileId ? null : fileId);
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

  const sortedFiles = [...files].sort((a, b) => {
    if (sortConfig.key === "name") {
      return sortConfig.direction === "asc"
        ? a.original_name.localeCompare(b.original_name)
        : b.original_name.localeCompare(a.original_name);
    }
    if (sortConfig.key === "upload_date") {
      return sortConfig.direction === "asc"
        ? new Date(a.upload_date) - new Date(b.upload_date)
        : new Date(b.upload_date) - new Date(a.upload_date);
    }
    if (sortConfig.key === "uploaded_by") {
      const nameA = clientNames[a.uploaded_by] || "Unknown";
      const nameB = clientNames[b.uploaded_by] || "Unknown";
      return sortConfig.direction === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    }
    return 0;
  });

  const changeSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  if (loading) {
    return <p className="loading">Loading files...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="files-tab-content">
      <div className="upload-section">
        <label className="upload-btn">
          <MdOutlineFileUpload /> Upload
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
      </div>

      <div className="file-list">
        {files.length > 0 && (
          <div className="file-list-scrollable">
            {" "}
            {/* Scrollable container */}
            <table>
              <thead>
                <tr>
                  <th onClick={() => changeSort("name")}>
                    <CiFileOn className="file-icon" />
                    Name{" "}
                    {sortConfig.key === "name" &&
                      (sortConfig.direction === "asc" ? (
                        <FaArrowUp />
                      ) : (
                        <FaArrowDown />
                      ))}
                  </th>
                  <th onClick={() => changeSort("upload_date")}>
                    Upload Date{" "}
                    {sortConfig.key === "upload_date" &&
                      (sortConfig.direction === "asc" ? (
                        <FaArrowUp />
                      ) : (
                        <FaArrowDown />
                      ))}
                  </th>
                  <th onClick={() => changeSort("uploaded_by")}>
                    Uploaded By{" "}
                    {sortConfig.key === "uploaded_by" &&
                      (sortConfig.direction === "asc" ? (
                        <FaArrowUp />
                      ) : (
                        <FaArrowDown />
                      ))}
                  </th>
                  <th></th>
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
                        className={`action-file ${
                          activeFileId === file.id ? "active" : ""
                        }`}
                        onClick={() => toggleActions(file.id)}
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {activeFileId === file.id && (
                        <div className="file-actions-popup click-delete-edit">
                          <button
                            className="delete-btn"
                            onClick={() => handleDelete(file.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="delete-btn"
                            onClick={() => {
                              // Triggering download by clicking the button
                              const downloadLink =
                                file.webContentLink ||
                                `http://localhost:8081/uploads/${file.original_name}`;
                              const a = document.createElement("a");
                              a.href = downloadLink;
                              a.download = file.original_name; // This will suggest a file name for the download
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a); // Clean up
                            }}
                          >
                            Download
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {files.length === 0 && (
          <div className="no-files-message">No files uploaded yet.</div>
        )}
      </div>
    </div>
  );
};

export default FilesTab;
