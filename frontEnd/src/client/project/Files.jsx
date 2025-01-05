import React, { useEffect, useState } from "react";
import axios from "axios";
import "./tracking.css";

function Files({ projectId, clientId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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

  const handleFileChange = (event) => {
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
        alert("File uploaded successfully!");
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

  if (loading) {
    return <p>Loading files...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="files-tab">
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} disabled={uploading} />
        <button onClick={handleUpload} disabled={uploading || !selectedFile}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {files.length === 0 ? (
        <p>No files uploaded for this project.</p>
      ) : (
        <table className="file-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Upload Date</th>
              <th>Uploaded By</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Files;
