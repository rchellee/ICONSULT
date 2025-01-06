import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./project.css";
import { FaPlus, FaBell } from "react-icons/fa";
import Sidebar from "../sidebar";
import pic4 from "../../Assets/pic4.png";
import ProjectForm from "./ProjectForm";
import ProjectList from "./ProjectList";
import ProjectFolders from "./ProjectFolders";
import ProjectTask from "./ProjectTask";
import FormSelector from "./FormSelector";
import Topbar from "../Topbar";

const ProjectManagement = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [clients, setClients] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [contractPrice, setContractPrice] = useState("");
  const [downpayment, setDownpayment] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Not Paid");

  useEffect(() => {
    fetch("http://localhost:8081/project")
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Inspect the data structure
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

  const saveProject = () => {
    const projectData = {
      clientId,
      projectName,
      clientName,
      description,
      startDate,
      endDate,
      status: "Pending",
      contractPrice,
      downpayment,
      totalPayment:
        parseFloat(downpayment || 0) + parseFloat(contractPrice || 0),
      paymentStatus,
    };

    if (editingProjectId) {
      // Update existing project
      fetch(`http://localhost:8081/project/${editingProjectId}`, {
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
      fetch("http://localhost:8081/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      })
        .then((response) => response.json())
        .then((newProject) => {
          setProjects([...projects, newProject]);
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
      setContractPrice(projectToEdit.contractPrice || "");
      setDownpayment(projectToEdit.downpayment || "");
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

  const filteredProjects = projects.filter((project) =>
    (project.projectName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        formatDate={formatDate}
        toggleSortDropdown={toggleSortDropdown}
        isSortDropdownOpen={isSortDropdownOpen}
        requestSort={requestSort}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        onProjectClick={(projectId) => {
          console.log("Clicked Project ID:", projectId);
          setSelectedProjectId(projectId);
        }}
      />
    );
  };

  return (
    <div className="project-management-page">
      <Topbar />
      <Sidebar />
      <div className={`content-project ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="header-actions">
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
            contractPrice={contractPrice}
            setContractPrice={setContractPrice}
            setDownpayment={setDownpayment}
            clients={clients}
            onCancel={closeModal}
            onSave={saveProject}
            editingProjectId={editingProjectId}
          />
        )}
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
            <p className="no-projects-message">No projects created yet.</p>
          </div>
        ) : (
          renderProjectContent()
        )}
        {projects.length > 0 && (
          <ProjectFolders
            projects={projects}
            onProjectClick={(projectId) => setSelectedProjectId(projectId)}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;
