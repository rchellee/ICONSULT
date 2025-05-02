import React, { useState, useEffect, useMemo } from "react";
import ListView from "./ListView";
import AccountingLedger from "./AccountingLedger";
import "./ListView.css";
import "./ProjectList.css";
import { FaPlus } from "react-icons/fa";
import ProjectForm from "./ProjectForm";

const ProjectList = ({
  projects,
  filteredProjects: initialFilteredProjects,
  setFilteredProjects,
  formatDate,
  handleEdit,
  handleDelete,
  toggleDropdown,
  activeDropdown,
  openModal,
  clients,
  onSave,
  editingProjectId,
  projectName,
  setProjectName,
  clientId,
  setClientId,
  clientName,
  setClientName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  description,
  setDescription,
  onCancel,
}) => {
  const [activeView, setActiveView] = useState("overview");
  const [statuses, setStatuses] = useState({});
  const [startDates, setStartDates] = useState({});
  const [finishDates, setFinishDates] = useState({});
  const [tasksInfo, setTasksInfo] = useState({});
  const [totalTasks, setTotalTasks] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = useMemo(() => {
    return initialFilteredProjects;
  }, [initialFilteredProjects]);

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
            const text = await response.text();
            console.error("Server response:", text);
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
      <div className="list-view-header">
        <div className="toggle-buttons">
          <button
            className={`toggle-button ${
              activeView === "overview" ? "active" : ""
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setActiveView("overview");
            }}
          >
            Overview
          </button>
          <button
            className={`toggle-button ${
              activeView === "accounting" ? "active" : ""
            }`}
            onClick={() => setActiveView("accounting")}
          >
            Transaction
          </button>
        </div>

        {/* Desktop button with text */}
        {activeView === "overview" && (
          <button className="create-project-btn desktop-only" onClick={openModal}>
            <FaPlus className="icon" />
            <span className="button-proj-text">New</span>
          </button>
        )}
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

      {/* Mobile floating action button */}
      {activeView === "overview" && (
        <button className="mobile-floating-btn" onClick={openModal}>
          <FaPlus className="icon" />
        </button>
      )}
    </div>
  );
};

export default ProjectList;