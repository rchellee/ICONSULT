import React, { useState } from "react";
import "./project.css";

const ProjectFolders = ({ projects, onProjectClick }) => {
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  return (
    <div className="project-names-section">
      <h3 className="folder-title">Folders</h3>
      <div className="folders-scroll-container">
        {projects.map((project) => (
          <div
            key={project.id}
            className="project-name-item"
            onMouseEnter={() => setHoveredProjectId(project.id)}
            onMouseLeave={() => setHoveredProjectId(null)}
          >
            <p
              className="truncate"
              title={project.projectName}
              onClick={() => onProjectClick(project.id)}
              style={{
                cursor: "pointer",
                fontWeight: hoveredProjectId === project.id ? "bold" : "normal",
              }}
            >
              {project.projectName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectFolders;
