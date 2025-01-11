import React, { useState } from "react";
import { MdCancel } from "react-icons/md"; // Import cancel icon
import { LuLayoutGrid } from "react-icons/lu"; // Import Grid icon
import { FaList } from "react-icons/fa"; // Import List icon
import GridView from "./GridView"; // Import GridView component
import ListView from "./ListView"; // Import ListView component
import "./ListView.css";

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

  const [startDates, setStartDates] = useState(
    filteredProjects.reduce((acc, project) => {
      acc[project.id] = project.actualStartDate || null; // Initialize with existing actual start date
      return acc;
    }, {})
  );
  const [finishDates, setFinishDates] = useState(
    filteredProjects.reduce((acc, project) => {
      acc[project.id] = project.actualFinishDate || null; // Initialize with existing actual finish date
      return acc;
    }, {})
  );

  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedProject, setSelectedProject] = useState(null); // Selected project for actions
  const [isGridView, setIsGridView] = useState(false); // State to control grid or list view

  const handleStatusChange = (projectId, newStatus) => {
    setStatuses((prevStatuses) => ({
      ...prevStatuses,
      [projectId]: newStatus, // Update the status when changed
    }));
  };

  const handleStartDateChange = (projectId, date) => {
    setStartDates((prevStartDates) => ({
      ...prevStartDates,
      [projectId]: date, // Update the start date for the specific project
    }));
  };

  const handleFinishDateChange = (projectId, date) => {
    setFinishDates((prevFinishDates) => ({
      ...prevFinishDates,
      [projectId]: date, // Update the finish date for the specific project
    }));
  };

  const statusColors = {
    Ongoing: "pink",
    Pending: "red",
    Completed: "#FFCD90", // Default color for Ongoing
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

  // Toggle between grid and list view
  const toggleLayout = (layout) => {
    if (layout === "grid") {
      setIsGridView(true);
    } else {
      setIsGridView(false);
    }
  };

  const handleProjectClick = (projectId) => {
    console.log("Project clicked:", projectId);
    // Add your logic here, such as navigating to a project details page or displaying a modal
  };

  return (
    <div className="project-list-wrapper">
      <div className="layout-toggle-icons">
        <LuLayoutGrid onClick={() => toggleLayout("list")} /> {/* grid */}
        <FaList onClick={() => toggleLayout("grid")} /> {/* list Icon */}
      </div>

      <div className="project-list">
        {/* Conditionally render grid or table layout */}
        {isGridView ? (
          <GridView
            filteredProjects={filteredProjects}
            formatDate={formatDate}
            statuses={statuses}
            statusColors={statusColors}
            handleStatusChange={handleStatusChange}
            startDates={startDates}
            finishDates={finishDates}
            handleStartDateChange={handleStartDateChange}
            handleFinishDateChange={handleFinishDateChange}
          />
        ) : (
          <ListView
            filteredProjects={filteredProjects}
            formatDate={formatDate}
            statuses={statuses}
            statusColors={statusColors}
            handleStatusChange={handleStatusChange}
            startDates={startDates}
            finishDates={finishDates}
            handleStartDateChange={handleStartDateChange}
            handleFinishDateChange={handleFinishDateChange}
            handleRightClick={handleRightClick}
            onProjectClick={handleProjectClick}
          />
        )}

        {/* Confirmation Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <MdCancel className="cancel-icon" onClick={closeModal} />
              </div>
              <button onClick={() => handleContextMenuAction("edit")}>
                Edit
              </button>
              <button onClick={() => handleContextMenuAction("delete")}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
