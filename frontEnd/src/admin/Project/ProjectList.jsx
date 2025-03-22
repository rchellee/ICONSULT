import React, { useState, useEffect, useMemo } from "react";
import ListView from "./ListView";
import AccountingLedger from "./AccountingLedger"; // Ensure this component exists
import "./ListView.css";

const ProjectList = ({
  projects,
  filteredProjects: initialFilteredProjects,
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
  // States to hold statuses and dates based on filteredProjects
  const [statuses, setStatuses] = useState({});
  const [startDates, setStartDates] = useState({});
  const [finishDates, setFinishDates] = useState({});

  // Memoize filteredProjects to avoid unnecessary updates
  const filteredProjects = useMemo(() => {
    return initialFilteredProjects;
  }, [initialFilteredProjects]);

  const [tasksInfo, setTasksInfo] = useState({});
  const [totalTasks, setTotalTasks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Update statuses, startDates, and finishDates when filteredProjects changes
  useEffect(() => {
    const newStatuses = filteredProjects.reduce((acc, project) => {
      acc[project.id] = project.status;
      return acc;
    }, {});

    const newStartDates = filteredProjects.reduce((acc, project) => {
      acc[project.id] = project.actualStart || null;
      return acc;
    }, {});

    const newFinishDates = filteredProjects.reduce((acc, project) => {
      acc[project.id] = project.actualFinish || null;
      return acc;
    }, {});

    // Only update state if the new state is different
    if (JSON.stringify(newStatuses) !== JSON.stringify(statuses)) {
      setStatuses(newStatuses);
    }
    if (JSON.stringify(newStartDates) !== JSON.stringify(startDates)) {
      setStartDates(newStartDates);
    }
    if (JSON.stringify(newFinishDates) !== JSON.stringify(finishDates)) {
      setFinishDates(newFinishDates);
    }
  }, [filteredProjects]);

  const handleProgressChange = (projectId, newProgress) => {
    fetch(`http://localhost:8081/projectStat/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ progress: newProgress }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update progress and status");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Progress updated successfully:", data);
        setFilteredProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === projectId
              ? { ...project, progress: newProgress, status: data.status }
              : project
          )
        );
      })
      .catch((error) => {
        console.error("Error updating progress:", error);
      });
  };

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
    setEditingProjectId(null);
  };

  const statusColors = {
    Ongoing: "#F06292",
    Pending: "rgb(252, 118, 118)",
    Completed: "#3b4f67",
  };

  const handleProjectClick = (projectId) => {
    console.log("Project clicked:", projectId);
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
            activeView === "accounting" ? "active" : ""
          }`}
          onClick={() => setActiveView("accounting")}
        >
          Accounting Ledger
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
            handleProgressChange={handleProgressChange}
            handleStatusChange={handleStatusChange}
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
          <AccountingLedger
            projects={projects}
            filteredProjects={filteredProjects}
            setFilteredProjects={setFilteredProjects}
            formatDate={formatDate}
            statuses={statuses}
            statusColors={statusColors}
            handleProgressChange={handleProgressChange}
            handleStatusChange={handleStatusChange}
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
