import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import "./project.css";
import { FaPlus } from "react-icons/fa";
import pic4 from "../../assets/pic4.jpg";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import ProjectTask from "./ProjectTask";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";

const ProjectManagement = () => {
  const { searchTerm } = useContext(SearchContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [actualFinish, setActualFinish] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [clients, setClients] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState(projects);

  useEffect(() => {
    const filtered = projects.filter((project) =>
      [
        project.projectName,
        project.clientName,
        project.status,
        project.description,
      ].some((field) =>
        (field || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Sort projects based on the selected sort order
    let sorted = [...filtered];

    if (sortOrder === "default") {
      // Default sorting: Most recent first, except for completed projects
      sorted.sort((a, b) => {
        if (a.status === "Completed" && b.status !== "Completed") {
          return 1; // Move completed projects to the bottom
        } else if (a.status !== "Completed" && b.status === "Completed") {
          return -1; // Move non-completed projects to the top
        } else {
          // Sort by creation date (most recent first)
          return new Date(b.created_at) - new Date(a.created_at);
        }
      });
    } else if (sortOrder === "name") {
      // Sort alphabetically
      sorted.sort((a, b) => {
        const nameA = a.projectName.toLowerCase();
        const nameB = b.projectName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    } else if (sortOrder === "asc") {
      // Ascending by start date
      sorted.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
      });
    } else if (sortOrder === "desc") {
      // Descending by start date
      sorted.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB - dateA;
      });
    }

    setFilteredProjects(sorted);
  }, [projects, searchTerm, sortOrder]);

  useEffect(() => {
    fetch("http://localhost:8081/project")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => console.error("Error fetching projects:", error));

    fetch("http://localhost:8081/clients")
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
    setEditingProjectId(null);
  };

  const saveNewProject = () => {
    const newProjectData = {
      clientId,
      projectName,
      clientName,
      description,
      startDate,
      endDate,
      status: "Pending", // Default status for new projects
    };

    fetch("http://localhost:8081/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProjectData),
    })
      .then((response) => response.json())
      .then((newProject) => {
        // Update the projects state with the new project
        setProjects((prevProjects) => [...prevProjects, newProject]);
        closeModal();
      })
      .catch((error) => console.error("Error creating project:", error));
  };

  const updateExistingProject = () => {
    const updatedProjectData = {
      clientId,
      projectName,
      clientName,
      description,
      startDate,
      endDate,
      actualFinish,
    };

    fetch(`http://localhost:8081/project/${editingProjectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProjectData),
    })
      .then((response) => response.json())
      .then((updatedProject) => {
        // Update the projects state with the updated project
        setProjects((prevProjects) =>
          prevProjects.map((project) =>
            project.id === editingProjectId ? updatedProject : project
          )
        );
        closeModal();
      })
      .catch((error) => console.error("Error updating project:", error));
  };

  const handleSave = () => {
    if (editingProjectId) {
      updateExistingProject();
    } else {
      saveNewProject();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
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
    setIsSortDropdownOpen(false);
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

  const toggleDropdown = (projectId) => {
    setActiveDropdown(activeDropdown === projectId ? null : projectId);
  };

  const handleEdit = (projectId) => {
    const projectToEdit = projects.find((project) => project.id === projectId);
    if (projectToEdit) {
      setProjectName(projectToEdit.projectName);
      setClientName(projectToEdit.clientName);
      setClientId(projectToEdit.clientId);
      setStartDate(projectToEdit.startDate);
      setEndDate(projectToEdit.endDate);
      setDescription(projectToEdit.description);
      setEditingProjectId(projectId);
      openModal();
    }
    toggleDropdown(null);
  };

  const handleDelete = (projectId) => {
    fetch(`http://localhost:8081/project/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isDeleted: true }),
    })
      .then(() => {
        // Remove the deleted project from the projects state
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== projectId)
        );
        toggleDropdown(null);
      })
      .catch((error) => console.error("Error deleting project:", error));
  };

  const renderProjectContent = () => {
    if (selectedProjectId) {
      return (
        <ProjectTask
          projectId={selectedProjectId}
          onBack={() => setSelectedProjectId(null)}
        />
      );
    }
    return (
      <ProjectList
        projects={projects}
        searchTerm={searchTerm}
        filteredProjects={filteredProjects}
        setFilteredProjects={setFilteredProjects}
        formatDate={formatDate}
        toggleSortDropdown={toggleSortDropdown}
        isSortDropdownOpen={isSortDropdownOpen}
        requestSort={requestSort}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        onCancel={closeModal}
        onProjectClick={(projectId) => {
          console.log("Clicked Project ID:", projectId);
          setSelectedProjectId(projectId);
        }}
      />
    );
  };

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="project-management-page">
        <div className={`content-project ${isSidebarOpen ? "shifted" : ""}`}>
          <div className="action-container">
            <button className="create-button" onClick={openModal}>
              <FaPlus className="icon" /> New
            </button>
          </div>

          {isModalOpen && (
            <ProjectForm
              projectName={projectName}
              setProjectName={setProjectName}
              clientId={clientId}
              setClientId={setClientId}
              clientName={clientName}
              setClientName={setClientName}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              description={description}
              setDescription={setDescription}
              actualFinish={setActualFinish}
              clients={clients}
              onCancel={closeModal}
              onSave={handleSave}
              editingProjectId={editingProjectId}
            />
          )}
          {projects.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <img src={pic4} alt="No projects created" />
              <p className="no-projects-message">No projects created yet.</p>
            </div>
          ) : (
            renderProjectContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
