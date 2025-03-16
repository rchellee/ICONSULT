import React, { useState, useEffect } from "react";
import ListView from "./ListView";
import PaymentView from "./PaymentView"; // Ensure this component exists
import "./ListView.css";

const ProjectList = ({
  projects,
  filteredProjects,
  setFilteredProjects,
  formatDate,
  handleEdit,
  handleDelete,
  toggleDropdown,
  activeDropdown,
}) => {
  // Toggle state for switching views
  const [activeView, setActiveView] = useState("overview");

  // Other states for project details
  const [projectName, setProjectName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [downpayment, setDownpayment] = useState("");

  // States to hold statuses and dates based on filteredProjects
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
    filteredProjects.reduce((acc, project) => {
      acc[project.id] = project.paymentStatus || "Not Paid";
      return acc;
    }, {})
  );

  const [tasksInfo, setTasksInfo] = useState({});
  const [totalTasks, setTotalTasks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Update statuses, startDates, finishDates, and paymentstatuses when filteredProjects changes
  useEffect(() => {
    setStatuses(
      filteredProjects.reduce((acc, project) => {
        acc[project.id] = project.status;
        return acc;
      }, {})
    );
    setStartDates(
      filteredProjects.reduce((acc, project) => {
        acc[project.id] = project.actualStart || null;
        return acc;
      }, {})
    );
    setFinishDates(
      filteredProjects.reduce((acc, project) => {
        acc[project.id] = project.actualFinish || null;
        return acc;
      }, {})
    );
    setpaymentStatuses(
      filteredProjects.reduce((acc, project) => {
        acc[project.id] = project.paymentStatus || "Not Paid";
        return acc;
      }, {})
    );
  }, [filteredProjects]);

  // Function to handle status changes
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

  // Fetch tasks info for each project
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

  // Fetch total payments for each project
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
          const totalTaskAmount = data.tasks.reduce(
            (sum, task) => sum + (parseFloat(task.amount) || 0),
            0
          );
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

  // Function to handle payment status changes
  const handlePaymentStatusChange = (projectId, newPaymentStatus) => {
    const currentStatus = paymentstatuses[projectId];
    const currentDate =
      newPaymentStatus === "Paid" ? new Date().toISOString() : null;

    setpaymentStatuses((prevpaymentStatuses) => ({
      ...prevpaymentStatuses,
      [projectId]: newPaymentStatus,
    }));

    fetch(`http://localhost:8081/paymentStat/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentStatus: newPaymentStatus,
        paymentDate: currentDate,
      }),
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
        setpaymentStatuses((prevpaymentStatuses) => ({
          ...prevpaymentStatuses,
          [projectId]: currentStatus,
        }));
      });
  };

  // Functions to handle date changes
  const handleStartDateChange = (projectId, date) => {
    setStartDates((prevStartDates) => ({
      ...prevStartDates,
      [projectId]: date,
    }));
  };

  const handleFinishDateChange = (projectId, date) => {
    setFinishDates((prevFinishDates) => ({
      ...prevFinishDates,
      [projectId]: date,
    }));
  };

  // Modal handling functions
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

  // Color mappings for statuses
  const statusColors = {
    Ongoing: "#F06292",
    Pending: "rgb(252, 118, 118)",
    Completed: "#3b4f67",
  };

  const paymentstatusColors = {
    Paid: "#3b4f67",
    "Not Paid": "rgb(252, 118, 118)",
    "Partial Payment": "#74C69D",
  };

  const handleProjectClick = (projectId) => {
    console.log("Project clicked:", projectId);
    // Add your logic here (e.g., show modal or additional details)
  };

  return (
    <div className="project-list-wrapper">
      {/* Toggle Buttons */}
      <div className="toggle-buttons">
        <button
          className={`toggle-button ${
            activeView === "overview" ? "active" : ""
          }`}
          onClick={() => setActiveView("overview")}
        >
          Overview
        </button>
        <button
          className={`toggle-button ${
            activeView === "payment" ? "active" : ""
          }`}
          onClick={() => setActiveView("payment")}
        >
          Transaction Status
        </button>
      </div>

      <div className="project-list">
        {activeView === "overview" ? (
          <ListView
            projects={projects}
            filteredProjects={filteredProjects}
            setFilteredProjects={setFilteredProjects}
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
            onProjectClick={handleProjectClick}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
          />
        ) : (
          <PaymentView
            projects={projects}
            filteredProjects={filteredProjects}
            setFilteredProjects={setFilteredProjects}
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
            onProjectClick={handleProjectClick}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectList;