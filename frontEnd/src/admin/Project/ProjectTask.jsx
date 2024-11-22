import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const ProjectTask = () => {
  const { projectId } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate();

  return (
    <div>
      <h1>Project Details</h1>
      <p>Details for Project ID: {projectId}</p>
      <button onClick={() => navigate("/")}>Back to Projects</button>
    </div>
  );
};

export default ProjectTask;
