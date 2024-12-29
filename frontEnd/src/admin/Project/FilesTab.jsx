import React, { useState, useEffect } from "react";
import FileViewer from "react-file-viewer";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "./PostTab.css";

const FilesTab = ({ projectId }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

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

  // Handle file upload
  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    const formData = new FormData();
    formData.append("file", uploadedFile);
    formData.append("project_id", projectId);

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

  // Handle file removal
  const handleRemoveFile = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  // Render file viewer modal
  const handlePreviewFile = (fileObj) => {
    const fileUrl = `http://localhost:8081/uploads/${fileObj.file_name}`;
    window.open(fileUrl, "_blank");
  };

  return (
    <div className="files-tab-content">
      <h2>Manage Project Files</h2>

      {/* File Upload Section */}
      <div className="file-upload">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          disabled={uploading}
        />
        {uploading && <p>Uploading files...</p>}
      </div>

      {/* File List */}
      <div className="file-list">
        <h3>Uploaded Files:</h3>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file.id}>
                <a
                  href={`http://localhost:8081/uploads/${file.file_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {file.original_name}
                </a>
                <button onClick={() => handleRemoveFile(file.file_name)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FilesTab;
