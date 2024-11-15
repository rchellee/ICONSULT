import React, { useState } from "react";
import "./project.css";

const ProjectFolders = ({ projects, tasks, onProjectClick, onTaskClick }) => {
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  return (
    <div className="project-names-section">
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
            onClick={() => onProjectClick(project.id)}
            style={{
              cursor: "pointer",
              fontWeight: hoveredProjectId === project.id ? "bold" : "normal",
            }}
          >
            {project.projectName}
          </p>
          {hoveredProjectId === project.id && (
            <div style={{ marginLeft: "20px" }}>
              {tasks
                .filter((task) => task.projectId === project.id)
                .map((task) => (
                  <p
                    key={task.id}
                    style={{ cursor: "pointer", margin: "5px 0" }}
                    onClick={() => onTaskClick(task)}
                  >
                    &gt; {task.taskName}
                  </p>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectFolders;
