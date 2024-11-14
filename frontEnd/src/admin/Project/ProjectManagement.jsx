import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./project.css";
import { FaPlus, FaBell, FaHome, FaSort } from "react-icons/fa";
import Sidebar from "../sidebar";
import pic4 from "../../Assets/pic4.png";

const ProjectManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // state to control sidebar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]); // State to hold tasks
  const [selectedProjectId, setSelectedProjectId] = useState(null); // Store selected project
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
  const filteredTasks = tasks.filter((task) => task.projectId === selectedProjectId);

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId); // Set selected project
    setSelectedTaskId(null); // Reset selected task
  };

  const handleTaskClick = (taskId) => {
    setSelectedTaskId(taskId); // Set selected task
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
          <div className="modal-overlay">
            <div className="modal-content">
              <h2 className="modal-title">Project</h2>
              <div className="modal-field">
                <label>Project Name:</label>
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Client Name:</label>
                <select
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.firstName + " " + client.lastName}
                    >
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-field">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Description:</label>
                <input
                  type="text"
                  placeholder="Enter project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="modal-actions">
                <button className="cancel-button" onClick={closeModal}>
                  Cancel
                </button>
                <button className="create-button" onClick={saveProject}>
                  {editingProjectId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
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
          <div className="project-list">
            <div className="sort-button-container">
              <button className="sort-button" onClick={toggleSortDropdown}>
                {" "}
                Sort <FaSort />{" "}
              </button>
              <button className="detail-button" onClick={showProjectCount}>
                {" "}
                Detail{" "}
              </button>
              {isSortDropdownOpen && (
                <div className="sort-dropdown">
                  <button onClick={() => requestSort("projectName")}>
                    Name
                  </button>
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
                </p>{" "}
                {/* Truncated client name */}
                <p>{project.progress}</p>
                <p>
                  {formatDate(project.startDate)} -{" "}
                  {formatDate(project.endDate)}
                </p>
                <p>{project.status}</p>
                <p>{project.action}</p>
                <div className="action-menu">
                  <button
                    className="action-menu-button"
                    onClick={() => toggleDropdown(project.id)}
                  >
                    {" "}
                    &#x22EE;{" "}
                  </button>
                  {activeDropdown === project.id && (
                    <div className="dropdown-menu">
                      <button onClick={() => handleEdit(project.id)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(project.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {projects.length > 0 && (
          <div className="project-names-section">
            <h3 className="folder-title">Folders</h3>
            {projects.map((project) => (
              <div
              key={project.id}
              className="project-name-item"
              onClick={() => handleProjectClick(project.id)}
            >
              <p className="truncate" title={project.projectName}>
                {project.projectName}
              </p>
            </div>
            ))}
          </div>
        )}

        {/* Display "+task" button when a project is selected */}
        {selectedProjectId && (
          
          <button className="create-button" onClick={openModal}>
            <FaPlus className="icon" /> Task
          </button>
          
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
