import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaFile, FaFileImage } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import "./FileTabStyle.css";

const FilesTab = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [activeFileId, setActiveFileId] = useState(null);

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

  const handleNewButtonClick = () => {
    // Add functionality for the new button here
    console.log("New button clicked!");
  };

  const toggleActions = (fileId) => {
    setActiveFileId(activeFileId === fileId ? null : fileId);
  };

  const getFileIcon = (fileName) => {
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

        {/* New Button */}
        <button className="new-btn" onClick={handleNewButtonClick}>
          <FaPlus /> New
        </button>
      </div>

      <div className="file-list">
        {files.length > 0 && (
          <div className="file-list-scrollable">
            {" "}
            {/* Scrollable container */}
            <table>
              <thead>
                <tr>
                  <th>
                    <CiFileOn className="file-icon" />
                    Name
                  </th>
                  <th>Upload Date</th>
                  <th>Uploaded By</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="truncate-text">
                      <a
                        href={`http://localhost:8081/uploads/${file.file_name}`}
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
                    <td>{file.uploaded_by_name || "Unknown"}</td>
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
                          <button className="edit-btn">Edit</button>
                          <button className="delete-btn">Delete</button>
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
