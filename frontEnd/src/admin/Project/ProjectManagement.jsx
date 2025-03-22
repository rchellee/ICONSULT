import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import "./project.css";
import { FaPlus } from "react-icons/fa";
import Sidebar from "../sidebar";
import pic4 from "../../assets/pic4.jpg";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import ProjectTask from "./ProjectTask";
import Topbar from "../Topbar";

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
    setFilteredProjects(filtered);
  }, [projects, searchTerm]);

  useEffect(() => {
    fetch("http://localhost:8081/project")
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
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
    setDownpayment("");
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
      status: "Pending",
    };

    fetch("http://localhost:8081/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProjectData),
    })
      .then((response) => response.json())
      .then((newProject) => {
        setProjects([...projects, newProject]);
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
        setProjects(
          projects.map((project) =>
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
        setProjects(projects.filter((project) => project.id !== projectId));
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
