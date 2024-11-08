import { useState } from 'react';
import { Link } from 'react-router-dom';
import './project.css';
import { FaPlus, FaBell, FaHome, FaSort } from 'react-icons/fa';
import pic4 from "../../Assets/pic4.png";

function ProjectManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [clientName, setClientName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [projectCounter, setProjectCounter] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null); // To handle active dropdown
    const [searchTerm, setSearchTerm] = useState('');

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setProjectName('');
        setClientName('');
        setStartDate('');
        setEndDate('');
    };

    const createProject = () => {
        if (projectName && clientName && startDate) {
            const newProject = {
                id: projectCounter,
                projectName,
                clientName,
                progress: "0%",
                dateStart: startDate,
                dateEnd: endDate,
                status: "Pending",
            };
            setProjects([...projects, newProject]);
            setProjectCounter(projectCounter + 1);
            closeModal();
        } else {
            alert("Please fill in all fields.");
        }
    };

    const toggleSortDropdown = () => {
        setIsSortDropdownOpen((prev) => !prev);
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
        sortProjects(key, direction);
        setIsSortDropdownOpen(false); // Close dropdown after selecting
    };

    const sortProjects = (key, direction) => {
        const sortedProjects = [...projects].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'asc' ? 1 : -1;
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
            setStartDate(projectToEdit.dateStart);
            setEndDate(projectToEdit.dateEnd);
            openModal(); // Open modal to edit the project
            
        }
        toggleDropdown(null); // Close dropdown after selecting
    };

    const handleDelete = (projectId) => {
        const updatedProjects = projects.filter((project) => project.id !== projectId);
        setProjects(updatedProjects);
        toggleDropdown(null); // Close dropdown after deleting
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    const filteredProjects = projects.filter((project) =>
        project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="project-management-page">
            <div className="sidebar">
                <ul>
                    <li><Link to="/admin">Dashboard</Link></li>
                    <li><Link to="/project">Projects</Link></li>
                    <li><Link to="/reports">Reports</Link></li>
                    <li><Link to="/calendar">Calendar</Link></li>
                    <li><Link to="/create">Create</Link></li>
                    <li><Link to="/clients">Clients</Link></li>
                    <li><Link to="/employees">Employees</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                </ul>
            </div>
            <div className="content">
                <h1>Project Management</h1>
                <div className="header-actions">
                    <button className="create-button" onClick={openModal}>
                        <FaPlus className='icon' /> Create
                    </button>
                    <div className="notification-icon" style={{ cursor: 'pointer' }}>
                        <FaBell className="icon" />
                    </div>
                </div>
                {isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <h2 className="modal-title">Project</h2>
                            <div className="modal-field">
                                <label>Project Name:</label>
                                <input type="text" placeholder="Enter project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                            </div>
                            <div className="modal-field">
                                <label>Client Name:</label>
                                <input type="text" placeholder="Enter client name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                            </div>
                            <div className="modal-field">
                                <label>Date to Start the Project:</label>
                                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className="modal-field">
                                <label>Date to Finish the Project:</label>
                                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>

                            <div className="modal-actions">
                                <button className="cancel-button" onClick={closeModal}>Cancel</button>
                                <button className="create-button" onClick={createProject}>Create</button>
                            </div>
                        </div>
                    </div>
                )}
                {projects.length === 0 ? (
                    <div style={{ textAlign: 'center' }}>
                        <img src={pic4} alt="No projects created" />
                        <p className="no-projects-message" style={{ marginLeft: '300px' }}> No projects created yet. </p>
                    </div>
                ) : (
                    <div className="project-list">
                        <div className="sort-button-container">
                            <button className="sort-button" onClick={toggleSortDropdown}> Sort <FaSort /> </button>
                            <button className="detail-button" onClick={showProjectCount}> Detail </button>
                            {/* Updated Search box */}
                            <div className="search-box-container">
                                <input
                                    type="text"
                                    className="search-box"
                                    placeholder="Search project"
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                            </div>
                            {isSortDropdownOpen && (
                                <div className="sort-dropdown">
                                    <button onClick={() => requestSort('projectName')}>Name</button>
                                    <button onClick={() => requestSort('dateStart')}>Date</button>
                                </div>
                            )}
                        </div>
                        <div className="project-list-header">
                            <h3 onClick={() => requestSort('id')}>ID</h3>
                            <h3>Project Name</h3>
                            <h3>Client</h3>
                            <h3>Progress</h3>
                            <h3>Date Start</h3>
                            <h3>Date End</h3>
                            <h3>Status</h3>
                            <h3>Action</h3>
                        </div>
                        {filteredProjects.map((project, index) => (
                            <div key={project.id} className="project-item">
                                <p>{project.id}</p>
                                <p className="truncate" title={project.projectName}>{project.projectName}</p>
                                <p className="truncate" title={project.clientName}>{project.clientName}</p> {/* Truncated client name */}
                                <p>{project.progress}</p>
                                <p>{project.dateStart}</p>
                                <p>{project.dateEnd}</p>
                                <p>{project.status}</p>
                                <p>{project.action}</p>
                                <div className="action-menu">
                                    <button className="action-menu-button" onClick={() => toggleDropdown(project.id)}> &#x22EE; </button>
                                    {activeDropdown === project.id && (
                                        <div className="dropdown-menu">
                                            <button onClick={() => handleEdit(project.id)}>Edit</button>
                                            <button onClick={() => handleDelete(project.id)}>Delete</button>
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
                            <div key={project.id} className="project-name-item">
                                <p className="truncate" title={project.projectName}>{project.projectName}</p> {/* Truncated project name */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectManagement;
