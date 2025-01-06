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
      acc[project.id] = project.status;
      return acc;
    }, {})
  );

  const [paymentstatuses, setpaymentStatuses] = useState(
    filteredProjects.reduce((ass, project) => {
      ass[project.id] = project.paymentStatus;
      return ass;
    }, {})
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleStatusChange = (projectId, newStatus) => {
    // Update status locally
    setStatuses((prevStatuses) => ({
      ...prevStatuses,
      [projectId]: newStatus,
    }));

    // Send update to the database
    fetch(`http://localhost:8081/projectStat/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
        return response.json();
      })
      .then((updatedProject) => {
        console.log("Status updated successfully:", updatedProject);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        // Revert the status locally if the update fails
        setStatuses((prevStatuses) => ({
          ...prevStatuses,
          [projectId]: filteredProjects.find((p) => p.id === projectId).status,
        }));
      });
  };

  const handlePaymentStatusChange = (projectId, newpaymentStatus) => {
    // Update paymentstatus locally
    setpaymentStatuses((prevpaymentStatuses) => ({
      ...prevpaymentStatuses,
      [projectId]: newpaymentStatus,
    }));

    // Send update to the database
    fetch(`http://localhost:8081/paymentStat/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: newpaymentStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
        return response.json();
      })
      .then((updatedProject) => {
        console.log("Payment Status updated successfully:", updatedProject);
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        // Revert the status locally if the update fails
        setpaymentStatuses((prevpaymentStatuses) => ({
          ...prevpaymentStatuses,
          [projectId]: filteredProjects.find((p) => p.id === projectId).paymentStatus,
        }));
      });
  };

  const statusColors = {
    Ongoing: "pink",
    Pending: "red",
    Completed: "#FFCD90",
  };
  const paymentstatusColors = {
    Paid: "green",
    "Not Paid": "gray",
    "Partial Payment": "yellow",
  };

  const handleRightClick = (e, projectId) => {
    e.preventDefault();
    setSelectedProject(projectId);
    setShowModal(true);
  };

  const handleContextMenuAction = (action) => {
    if (action === "delete") {
      handleDelete(selectedProject);
    } else if (action === "edit") {
      onEdit(selectedProject);
    }
    setShowModal(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="project-list-wrapper">
      <div className="project-list">
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
            onContextMenu={(e) => handleRightClick(e, project.id)}
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
              value={statuses[project.id] || "Pending"}
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
              <option value="Pending">Pending</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            <p>{project.downpayment || "N/A"}</p>
            <p>{project.totalPayment}</p>
            <select
              value={paymentstatuses[project.id] || "Not Paid"}
              onChange={(e) => handlePaymentStatusChange(project.id, e.target.value)}
              className={`paymentstatus-dropdown $(
                paymentstatuses[project.id] === "Partial Payment"
                  ? "paymentstatus-partialPayment"
                  : paymentstatuses[project.id] === "Paid"
                  ? "paymentstatus-paid"
                  : ""
              )`}
              style={{
                backgroundColor: paymentstatusColors[paymentstatuses[project.id]] || "pink",
              }}
            >
              <option value="Not Paid">Not Paid</option>
              <option value="Partial Payment">Partial Payment</option>
              <option value="Paid">Paid</option>
            </select>
            {/* <p>{project.paymentStatus}</p> */}

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
                  <button onClick={() => handleDelete(project.id)}>
                    Move to Trash
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
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
