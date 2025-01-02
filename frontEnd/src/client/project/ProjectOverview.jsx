// ProjectOverview.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function ProjectOverview({ projectId }) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch project details
    axios
      .get(`http://localhost:8081/project/${projectId}`)
      .then((response) => {
        setProject(response.data.project); // Assuming the API returns the project under 'project'
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Error fetching project details. Please try again later.");
        setIsLoading(false);
      });
  }, [projectId]);

  if (isLoading) return <p>Loading project overview...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="project-overview">
      <h2>Project Overview</h2>
      {project ? (
        <div>
          <p><strong>Project Name:</strong> {project.name}</p>
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Contract Price:</strong> ${project.contractPrice}</p>
          <p><strong>Total Payment:</strong> ${project.totalPayment}</p>
          <p><strong>Due Date:</strong> {project.dueDate}</p>
          <p><strong>Status:</strong> {project.status}</p>
        </div>
      ) : (
        <p>No project details found.</p>
      )}
    </div>
  );
}

export default ProjectOverview;
