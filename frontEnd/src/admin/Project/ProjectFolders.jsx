import React from "react";
import "./project.css";

const ProjectFolders = ({ projects, tasks, onProjectClick, onTaskClick }) => {
  return (
    <div className="project-names-section">
      <h3 className="folder-title">Folders</h3>
      {projects.map((project) => (
        <div
          key={project.id}
          className="project-name-item"
          onClick={() => onProjectClick(project.id)}
        >
          <p className="truncate" title={project.projectName}>
            {project.projectName}
          </p>
          {tasks
            .filter((task) => task.projectId === project.id)
            .map((task) => (
              <p
                key={task.id}
                style={{ paddingLeft: "20px", cursor: "pointer" }}
                onClick={() => onTaskClick(task)}
              >
                &gt; {task.taskName}
              </p>
            ))}
        </div>
      ))}
    </div>
  );
};

export default ProjectFolders;
