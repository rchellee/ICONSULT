import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./project.css";
import { FaPlus, FaBell, FaHome, FaSort } from "react-icons/fa";
import Sidebar from "../sidebar";
import pic4 from "../../Assets/pic4.png";
import TaskForm from "./TaskForm";
import ProjectList from "./ProjectList";
import ProjectForm from "./ProjectForm";
import ProjectFolders from "./ProjectFolders";
import Task from "./Task";

const ProjectManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // state to control sidebar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Store selected project
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null); // Store selected task
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectCounter, setProjectCounter] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // To handle active dropdown
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]); // Add this line
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [description, setDescription] = useState("");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);

  const openTaskForm = () => setIsTaskFormOpen(true);
  const closeTaskForm = () => setIsTaskFormOpen(false);

  const saveTaskToLocalStorage = (newTask) => {
    const updatedTasks = [
      ...tasks,
      { ...newTask, projectId: selectedProjectId },
    ];
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // useEffect for fetching projects from the server
  useEffect(() => {
    //fetch projects
    fetch("http://localhost:8081/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data); // Set the fetched data to state
      })
      .catch((error) => console.error("Error fetching projects:", error));

    // Fetch tasks for each project (assuming tasks are stored in the backend)
    fetch("http://localhost:8081/tasks")
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));

    // Fetch clients
    fetch("http://localhost:8081/clients")
      .then((response) => response.json())
      .then((data) => {
        setClients(data); // Set fetched clients to state
      })
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

  // Filter tasks by selected project
  const filteredTasks = tasks.filter(
    (task) => task.projectId === selectedProjectId
  );

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId); // Set selected project
    setSelectedTaskId(null); // Reset selected task
  };

  const handleTaskClick = () => {
    setIsTaskFormOpen(true); // Open the TaskForm
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar open/close
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProjectName("");
    setClientName("");
    setStartDate("");
    setEndDate("");
    setDescription("");
    setEditingProjectId(null); // Reset editing project ID
  };

  const saveProject = () => {
    const projectData = {
      projectName,
      clientName,
      description,
      startDate,
      endDate,
      status: "Ongoing",
    };

    if (editingProjectId) {
      // Update existing project
      fetch(`http://localhost:8081/projects/${editingProjectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      })
        .then((response) => response.json())
        .then((updatedProject) => {
          setProjects(
            projects.map((project) =>
              project.id === editingProjectId ? updatedProject : project
            )
          );
          closeModal();
        })
        .catch((error) => console.error("Error updating project:", error));
    } else {
      // Create new project
      fetch("http://localhost:8081/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      })
        .then((response) => response.json())
        .then((newProject) => {
          setProjects([...projects, newProject]);
          setProjectCounter(projectCounter + 1);
          closeModal();
        })
        .catch((error) => console.error("Error creating project:", error));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const toggleSortDropdown = () => {
    setIsSortDropdownOpen((prev) => !prev);
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    sortProjects(key, direction);
    setIsSortDropdownOpen(false); // Close dropdown after selecting
  };

  const sortProjects = (key, direction) => {
    const sortedProjects = [...projects].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    setProjects(sortedProjects);
  };

  const showProjectCount = () => {
    alert(`Total number of projects: ${projects.length}`);
  };

  const toggleDropdown = (projectId) => {
    setActiveDropdown(activeDropdown === projectId ? null : projectId);
  };

  const handleEdit = (projectId) => {
    const projectToEdit = projects.find((project) => project.id === projectId);
    if (projectToEdit) {
      setProjectName(projectToEdit.projectName);
      setClientName(projectToEdit.clientName);
      setStartDate(projectToEdit.startDate);
      setEndDate(projectToEdit.endDate);
      setDescription(projectToEdit.description);
      setEditingProjectId(projectId); // Set editing project ID
      openModal(); // Open modal to edit the project
    }
    toggleDropdown(null); // Close dropdown after selecting
  };

  const handleDelete = (projectId) => {
    fetch(`http://localhost:8081/projects/${projectId}`, {
      method: "PATCH", // Use PATCH to update the `isDeleted` field
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDeleted: true }),
    })
      .then(() => {
        setProjects(projects.filter((project) => project.id !== projectId));
        toggleDropdown(null);
      })
      .catch((error) => console.error("Error deleting project:", error));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="project-management-page">
      <Sidebar />
      <div className={`content ${isSidebarOpen ? "shifted" : ""}`}>
        <h1>Project Management</h1>
        <div className="header-actions">
          <button className="create-button" onClick={openModal}>
            <FaPlus className="icon" /> Create
          </button>
          <div className="notification-icon" style={{ cursor: "pointer" }}>
            <FaBell className="icon" />
          </div>
        </div>
        {isModalOpen && (
          <ProjectForm
            projectName={projectName}
            setProjectName={setProjectName}
            clientName={clientName}
            setClientName={setClientName}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            description={description}
            setDescription={setDescription}
            clients={clients}
            onCancel={closeModal}
            onSave={saveProject}
            editingProjectId={editingProjectId}
          />
        )}
        {/* naka display dapat sa rightside */}
        {selectedProjectId && (
          <div className="add-task-button">
            <button onClick={openTaskForm}>
              <FaPlus className="icon" /> Task
            </button>
          </div>
        )}

        {selectedTask && (
        <Task task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

        {/* Search and Sort */}
        <div className="search-box-container">
          <input
            type="text"
            className="search-box"
            placeholder="Search project"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {projects.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <img src={pic4} alt="No projects created" />
            <p className="no-projects-message" style={{ marginLeft: "300px" }}>
              {" "}
              No projects created yet.{" "}
            </p>
          </div>
        ) : (
          <ProjectList
            projects={projects}
            searchTerm={searchTerm}
            filteredProjects={filteredProjects}
            formatDate={formatDate}
            toggleSortDropdown={toggleSortDropdown}
            showProjectCount={showProjectCount}
            isSortDropdownOpen={isSortDropdownOpen}
            requestSort={requestSort}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}
        {projects.length > 0 && (
          <ProjectFolders
            projects={projects}
            tasks={tasks}
            onProjectClick={handleProjectClick}
            onTaskClick={(task) => setSelectedTask(task)} // Pass function to set selected task
          />
        )}
      </div>
      {/* TaskForm Modal */}
      {isTaskFormOpen && (
        <TaskForm onClose={closeTaskForm} onSave={saveTaskToLocalStorage} />
      )}
    </div>
  );
};

export default ProjectManagement;
