import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdCancel } from "react-icons/md"; // Import cancel icon
import "./project.css";
import { Pending } from "@mui/icons-material";

const ProjectList = ({
  filteredProjects,
  formatDate,
  handleDelete,
  onEdit,
  toggleDropdown,
  activeDropdown,
}) => {
  const [statuses, setStatuses] = useState(
    filteredProjects.reduce((acc, project) => {
      acc[project.id] = project.status; // Initialize the status from filteredProjects
      return acc;
    }, {})
  );

  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedProject, setSelectedProject] = useState(null); // Selected project for actions

  const handleStatusChange = (projectId, newStatus) => {
    setStatuses((prevStatuses) => ({
      ...prevStatuses,
      [projectId]: newStatus, // Update the status when changed
    }));
  };

  const statusColors = {
    Ongoing: "pink",
    Pending: "red",
    Completed:  "#FFCD90"// Default color for Ongoing
  };

  const handleRightClick = (e, projectId) => {
    e.preventDefault(); // Prevent the default context menu
    setSelectedProject(projectId); // Store the selected project ID
    setShowModal(true); // Show the confirmation modal
  };

  const handleContextMenuAction = (action) => {
    if (action === "delete") {
      handleDelete(selectedProject); // Trigger delete action
    } else if (action === "edit") {
      onEdit(selectedProject); // Trigger edit action
    }
    setShowModal(false); // Close the modal after action
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal without any action
  };

  return (
    <div className="project-list-wrapper">
      <div className="project-list">
        {/* Top Navigation Buttons */}

        <div className="project-list-header">
          <h3>Project</h3>
          <h3>Client</h3>
          <h3>Progress</h3>
          <h3>Timeline</h3>
          <h3>Status</h3>
          <h3>Downpayment</h3>
          <h3>Total</h3>
          <h3>Payment Status</h3>
          
        </div>

        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="project-item"
            onContextMenu={(e) => handleRightClick(e, project.id)} // Add right-click handler
          >
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
            <select
              value={statuses[project.id]}
              onChange={(e) => handleStatusChange(project.id, e.target.value)}
              className={`status-dropdown $(
                statuses[project.id] === "Pending"
                  ? "status-pending"
                  : statuses[project.id] === "Completed"
                  ? "status-completed"
                  : ""
              )`}
              style={{
                backgroundColor: statusColors[statuses[project.id]] || "pink",
              }}
            >
              <option value="Ongoing">Ongoing</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <p>{project.downpayment || "N/A"}</p>
            <p>{project.totalPayment}</p>
            <p>{project.paymentStatus}</p>

            {/* Action Dropdown Button */}
            <div className="action-project">
              <button
                className="action-menu-button"
                onClick={() => toggleDropdown(project.id)}
              >
                &#x22EE;
              </button>
              {activeDropdown === project.id && (
                <div className="dropdown-menu">
                  <button onClick={() => onEdit(project.id)}>Edit</button>
                  <button onClick={() => handleDelete(project.id)}>Move to Trash</button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Confirmation Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <MdCancel className="cancel-icon" onClick={closeModal} />
              </div>
              <button onClick={() => handleContextMenuAction("edit")}>Edit</button>
              <button onClick={() => handleContextMenuAction("delete")}>Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
