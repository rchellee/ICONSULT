// ProjectList.js
import React from "react";
import { FaSort } from "react-icons/fa";
import "./project.css";

const ProjectList = ({
  projects,
  searchTerm,
  filteredProjects,
  formatDate,
  toggleSortDropdown,
  showProjectCount,
  isSortDropdownOpen,
  requestSort,
  activeDropdown,
  toggleDropdown,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="project-list">
      <div className="sort-button-container">
        <button className="sort-button" onClick={toggleSortDropdown}>
          Sort <FaSort />
        </button>
        <button className="detail-button" onClick={showProjectCount}>
          Detail
        </button>
        {isSortDropdownOpen && (
          <div className="sort-dropdown">
            <button onClick={() => requestSort("projectName")}>Name</button>
            <button onClick={() => requestSort("dateStart")}>Date</button>
          </div>
        )}
      </div>
      <div className="project-list-header">
        <h3>Project Name</h3>
        <h3>Client</h3>
        <h3>Progress</h3>
        <h3>Timeline</h3>
        <h3>Status</h3>
        <h3>Action</h3>
      </div>
      {filteredProjects.map((project) => (
        <div key={project.id} className="project-item">
          <p className="truncate" title={project.projectName}>
            {project.projectName}
          </p>
          <p className="truncate" title={project.clientName}>
            {project.clientName}
          </p>
          <p>{project.progress}</p>
          <p>
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </p>
          <p>{project.status}</p>
          <div className="action-project">
            <button
              className="action-menu-button"
              onClick={() => toggleDropdown(project.id)}
            >
              &#x22EE;
            </button>
            {activeDropdown === project.id && (
              <div className="dropdown-menu">
                <button onClick={() => handleEdit(project.id)}>Edit</button>
                <button onClick={() => handleDelete(project.id)}>Delete</button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
