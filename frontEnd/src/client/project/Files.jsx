import React, { useEffect, useState } from "react";
import axios from "axios";

function Files({ projectId, clientId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <p>Loading files...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="files-tab">
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
