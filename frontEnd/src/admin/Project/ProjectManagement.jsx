import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./project.css";
import { FaPlus, FaBell, FaHome, FaSort } from "react-icons/fa";
import pic4 from "../../Assets/pic4.png";
import Sidebar from "../sidebar";

function ProjectManagement() {
    
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectname, setProjectName] = useState("");
  const [clientname, setClientName] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState(""); // New state for end date
  const [description, setDescription] = useState(""); // New state for description
  const [projectCounter, setProjectCounter] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8081/projects");
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
  
    fetchProjects();
  }, []);
  

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProjectName("");
    setClientName("");
    setStartDate("");
    setEndDate(""); // Reset end date
    setDescription(""); // Reset description
  };

  const createProject = async () => {
    if (projectname && clientname && start_date && end_date && description) {
      const newProject = {
        clientname,
        projectname,
        description,
        start_date,
        end_date,
        status: "Pending"
      };
  
      try {
        const response = await fetch("http://localhost:8081/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProject),
        });
  
        if (response.ok) {
          const savedProject = await response.json();
          setProjects([...projects, savedProject]);
          setProjectCounter(projectCounter + 1);
          closeModal();
        } else {
          alert("Failed to create project.");
        }
      } catch (error) {
        console.error("Error saving project:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
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
      setProjectName(projectToEdit.projectname);
      setClientName(projectToEdit.clientname);
      setStartDate(projectToEdit.dateStart);
      openModal(); // Open modal to edit the project
    }
    toggleDropdown(null); // Close dropdown after selecting
  };

  const handleDelete = (projectId) => {
    const updatedProjects = projects.filter(
      (project) => project.id !== projectId
    );
    setProjects(updatedProjects);
    toggleDropdown(null); // Close dropdown after deleting
  };

  return (
    <div className="project-management-page">
      <Sidebar />
      <div className="content">
        <h1>Projects</h1>
        {projects.length > 0 && (
          <div className="home-section">
            <FaHome className="home-icon" />
            <Link to="/home" className="home-link">
              Home
            </Link>
          </div>
        )}
        <div className="header-actions">
          <button className="create-button" onClick={openModal}>
            <FaPlus className="icon" /> Create
          </button>
          <div className="notification-icon" style={{ cursor: "pointer" }}>
            <FaBell className="icon" />
          </div>
        </div>
        <div className="search-container">
          <span className="search-label">Search</span>
          <input type="text" placeholder="..." className="search-box" />
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
                  value={projectname}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Client Name:</label>
                <input
                  type="text"
                  placeholder="Enter client name"
                  value={clientname}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={start_date}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>End Date:</label>
                <input
                  type="date"
                  value={end_date}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="modal-field">
                <label>Description:</label>
                <textarea
                  placeholder="Enter project description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-button" onClick={closeModal}>
                  Cancel
                </button>
                <button className="create-button" onClick={createProject}>
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
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
                  <button onClick={() => requestSort("projectname")}>
                    Name
                  </button>
                  <button onClick={() => requestSort("dateStart")}>Date</button>
                </div>
              )}
            </div>
            <div className="project-list-header">
              <h3 onClick={() => requestSort("id")}>ID</h3>
              <h3>Project Name</h3>
              <h3>Client</h3>
              <h3>Description</h3>
              <h3>Progress</h3>
              <h3>Timeline</h3>
              <h3>Status</h3>
              <h3>Action</h3>
            </div>
            {projects.map((project, index) => {
              const formattedstart_date = new Date(
                project.dateStart
              ).toLocaleDateString("en-US", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              });
              const formattedend_date = new Date(
                project.dateEnd
              ).toLocaleDateString("en-US", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              });

              return (
                <div key={project.id} className="project-item">
                  <p>{project.id}</p>
                  <p className="truncate" title={project.projectname}>
                    {project.projectname}
                  </p>
                  <p className="truncate" title={project.clientname}>
                    {project.clientname}
                  </p>{" "}
                  {/* Truncated client name */}
                  <p>{project.description}</p>
                  <p>{project.progress}</p>
                  {/* Display formatted start and end dates */}
                  <p>
                    {formattedstart_date} - {formattedend_date}
                  </p>{" "}
                  {/* Timeline formatted */}
                  <p>{project.status}</p>
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
              );
            })}
          </div>
        )}
        {projects.length > 0 && (
          <div className="project-names-section">
            <h3>Folders</h3>
            {projects.map((project) => (
              <div key={project.id} className="project-name-item">
                <p className="truncate" title={project.projectname}>
                  {project.projectname}
                </p>{" "}
                {/* Truncated project name */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectManagement;
