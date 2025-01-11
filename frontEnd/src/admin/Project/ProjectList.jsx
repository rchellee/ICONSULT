import React, { useState, useEffect } from "react";
import { MdCancel } from "react-icons/md"; // Import cancel icon
import { LuLayoutGrid } from "react-icons/lu"; // Import Grid icon
import { FaList } from "react-icons/fa"; // Import List icon
import GridView from "./GridView"; // Import GridView component
import ListView from "./ListView"; // Import ListView component
import "./ListView.css";

const ProjectList = ({
  filteredProjects,
  formatDate,
  handleEdit,
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
  const [startDates, setStartDates] = useState(
    filteredProjects.reduce((acc, project) => {
      acc[project.id] = project.actualStart || null;
      return acc;
    }, {})
  );
  const [finishDates, setFinishDates] = useState(
    filteredProjects.reduce((acc, project) => {
      acc[project.id] = project.actualFinish || null;
      return acc;
    }, {})
  );
  const [paymentstatuses, setpaymentStatuses] = useState(
    filteredProjects.reduce((ass, project) => {
      ass[project.id] = project.paymentStatus;
      return ass;
    }, {})
  );
  const [tasksInfo, setTasksInfo] = useState({});
  const [totalTasks, setTotalTasks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isGridView, setIsGridView] = useState(false);

  const handleStatusChange = (projectId, newStatus) => {
    setStatuses((prevStatuses) => ({
      ...prevStatuses,
      [projectId]: newStatus,
    }));

    fetch(`http://localhost:8081/projectStat/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update status");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Status updated successfully:", data);

        if (newStatus === "Ongoing") {
          setStartDates((prevStartDates) => ({
            ...prevStartDates,
            [projectId]: new Date(),
          }));
        } else if (newStatus === "Completed") {
          setFinishDates((prevFinishDates) => ({
            ...prevFinishDates,
            [projectId]: new Date(),
          }));
        }
      })
      .catch((error) => {
        console.error("Error updating status:", error);
      });
  };

  useEffect(() => {
    const fetchTasksInfo = async () => {
      const info = {};
      for (const project of filteredProjects) {
        try {
          const response = await fetch(
            `http://localhost:8081/admin/tasks?projectId=${project.id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }
          const data = await response.json();
          const completedTasks = data.tasks.filter(
            (task) => task.status === "Completed"
          ).length;
          info[project.id] = {
            total: data.tasks.length,
            completed: completedTasks,
          };
        } catch (error) {
          console.error("Error fetching tasks for project:", error);
          info[project.id] = { total: 0, completed: 0 };
        }
      }
      setTasksInfo(info);
    };

    fetchTasksInfo();
  }, [filteredProjects]);

  useEffect(() => {
    const fetchTotalPayments = async () => {
      const totalPayments = {};
      for (const project of filteredProjects) {
        try {
          const response = await fetch(
            `http://localhost:8081/admin/tasks?projectId=${project.id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch tasks");
          }
          const data = await response.json();

          // Calculate the total amount of tasks for the project
          const totalTaskAmount = data.tasks.reduce(
            (sum, task) => sum + (parseFloat(task.amount) || 0),
            0
          );

          // Combine contractPrice and totalTaskAmount
          totalPayments[project.id] = project.contractPrice + totalTaskAmount;
        } catch (error) {
          console.error("Error fetching total payment for project:", error);
          totalPayments[project.id] = project.contractPrice || 0;
        }
      }
      setTotalTasks(totalPayments);
    };

    fetchTotalPayments();
  }, [filteredProjects]);

  const handlePaymentStatusChange = (projectId, newPaymentStatus) => {
    const currentStatus = paymentstatuses[projectId];

    // Prevent invalid transitions
    if (
      currentStatus === "Paid" || // Cannot change once Paid
      (currentStatus === "Partial Payment" && newPaymentStatus === "Not Paid")
    ) {
      console.warn("Invalid payment status change attempt.");
      return;
    }

    setpaymentStatuses((prevpaymentStatuses) => ({
      ...prevpaymentStatuses,
      [projectId]: newPaymentStatus,
    }));

    fetch(`http://localhost:8081/paymentStat/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: newPaymentStatus }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update payment status");
        return response.json();
      })
      .then((updatedProject) => {
        console.log("Payment status updated successfully:", updatedProject);
      })
      .catch((error) => {
        console.error("Error updating payment status:", error);

        // Revert payment status on failure
        setpaymentStatuses((prevpaymentStatuses) => ({
          ...prevpaymentStatuses,
          [projectId]: currentStatus,
        }));
      });
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProjectName("");
    setClientId("");
    setClientName("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setDownpayment("");
    setEditingProjectId(null);
  };

  const statusColors = {
    Ongoing: "pink",
    Pending: "red",
    Completed: "#FFCD90", // Default color for Ongoing
  };
  const paymentstatusColors = {
    Paid: "#FFCD90",
    "Not Paid": "red",
    "Partial Payment": "pink",
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
            paymentstatuses={paymentstatuses}
            paymentstatusColors={paymentstatusColors}
            handlePaymentStatusChange={handlePaymentStatusChange}
            startDates={startDates}
            finishDates={finishDates}
            handleStartDateChange={handleStartDateChange}
            handleFinishDateChange={handleFinishDateChange}
            tasksInfo={tasksInfo}
            totalTasks={totalTasks}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleRightClick={handleRightClick}
            onProjectClick={handleProjectClick}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
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
