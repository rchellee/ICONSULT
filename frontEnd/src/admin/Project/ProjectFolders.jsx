import React, { useState } from "react";
import "./project.css";

const ProjectFolders = ({ projects, onProjectClick, fontSize = "14px" }) => {
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  return (
    <div className="project-names-section">
      
      <div className="folders-scroll-container">
      <h3 className="folder-title">Folders</h3>
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
              onClick={() => {
                if (project.id) {
                  onProjectClick(project.id);
                } else {
                  console.error("Project ID is undefined");
                }
              }}
              style={{
                cursor: "pointer",
                fontSize: "16px"  // Applying the custom font size
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
