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

    let sorted = [...filtered];
    if (sortOrder === "default") {
      sorted.sort((a, b) => {
        if (a.status === "Completed" && b.status !== "Completed") return 1;
        if (a.status !== "Completed" && b.status === "Completed") return -1;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    } else if (sortOrder === "name") {
      sorted.sort((a, b) => {
        const nameA = a.projectName.toLowerCase();
        const nameB = b.projectName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    } else if (sortOrder === "asc") {
      sorted.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (sortOrder === "desc") {
      sorted.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    }

    setFilteredProjects(sorted);
  }, [projects, searchTerm, sortOrder]);

  useEffect(() => {
    fetch("http://localhost:8081/project")
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error("Error fetching projects:", error));

    fetch("http://localhost:8081/clients")
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const openModal = () => setIsModalOpen(true);

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
      status: "Pending",
    };

    fetch("http://localhost:8081/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProjectData),
    })
      .then((response) => response.json())
      .then((newProject) => {
        setProjects((prev) => [...prev, newProject]);
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
        setProjects((prev) =>
          prev.map((project) =>
            project.id === editingProjectId ? updatedProject : project
          )
        );
        closeModal();
      })
      .catch((error) => console.error("Error updating project:", error));
  };

  const handleSave = () => {
    editingProjectId ? updateExistingProject() : saveNewProject();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const toggleSortDropdown = () => setIsSortDropdownOpen((prev) => !prev);

  const requestSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    sortProjects(key, direction);
    setIsSortDropdownOpen(false);
  };

  const sortProjects = (key, direction) => {
    const sorted = [...projects].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setProjects(sorted);
  };

  const toggleDropdown = (projectId) => {
    setActiveDropdown(activeDropdown === projectId ? null : projectId);
  };

  const handleEdit = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      setProjectName(project.projectName);
      setClientName(project.clientName);
      setClientId(project.clientId);
      setStartDate(project.startDate);
      setEndDate(project.endDate);
      setDescription(project.description);
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
        setProjects((prev) => prev.filter((project) => project.id !== projectId));
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
        filteredProjects={filteredProjects}
        setFilteredProjects={setFilteredProjects}
        formatDate={formatDate}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        toggleDropdown={toggleDropdown}
        activeDropdown={activeDropdown}
        openModal={openModal}
        clients={clients}
        onSave={handleSave}
        editingProjectId={editingProjectId}
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
        onCancel={closeModal}
      />
    );
  };

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="project-management-page">
        <div className={`content-project ${isSidebarOpen ? "shifted" : ""}`}>
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