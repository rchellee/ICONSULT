import React from "react";
import { useParams, useNavigate } from "react-router-dom"
import "./task.css";

const ProjectTask = () => {
  const { projectId } = useParams(); // Get the project ID from the URL
  const navigate = useNavigate();

  return (
    <div>
      <button className="back-button" onClick={() => navigate("/")}>
        Back to Projects
      </button>
    </div>
  );
};

export default ProjectTask;

