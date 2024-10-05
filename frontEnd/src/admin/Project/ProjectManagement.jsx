import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './project.css'; 
import { FaPlus, FaBell } from 'react-icons/fa'; // Import the notification icon
import pic4 from "../../Assets/pic4.png"; // Go up two levels to access the Assets folder

function ProjectManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [projects, setProjects] = useState([]); // State to hold the list of projects
    const [projectName, setProjectName] = useState(''); // State for project name
    const [clientName, setClientName] = useState(''); // State for client name

    const openModal = () => {
        setIsModalOpen(true); // Open modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close modal
        setProjectName(''); // Reset project name
        setClientName(''); // Reset client name
    };

    const createProject = () => {
        if (projectName && clientName) {
            const newProject = { projectName, clientName };
            setProjects([...projects, newProject]); // Add new project to the list
            closeModal(); // Close the modal
        } else {
            alert("Please fill in both fields."); // Alert user if fields are empty
        }
    };

    return (
        <div className="project-management-page">
            {/* Sidebar */}
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

            {/* Content */}
            <div className="content">
                <h1>Projects</h1>
                <div className="header-actions">
                    {/* Create Button Wrapper */}
                    <button className="create-button" onClick={openModal}>
                        <FaPlus className='icon'/> Create
                    </button>
                    {/* Notification Icon */}
                    <div className="notification-icon" style={{ cursor: 'pointer' }}>
                        <FaBell className="icon" />
                    </div>
                </div>

                {/* Search Box Wrapper */}
                <div className="search-container">
                    <span className="search-label">Search</span>
                    <input type="text" placeholder="..." className="search-box" />
                </div>

                {/* Modal */}
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
                                    onChange={(e) => setProjectName(e.target.value)} // Update project name
                                />
                            </div>
                            <div className="modal-field">
                                <label>Client Name:</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter client name" 
                                    value={clientName} 
                                    onChange={(e) => setClientName(e.target.value)} // Update client name
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="cancel-button" onClick={closeModal}>Cancel</button>
                                <button className="create-button" onClick={createProject}>Create</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Project List */}
                <div className="project-list">
                    {projects.length > 0 ? (
                        <ul>
                            {projects.map((project, index) => (
                                <li key={index}>
                                    <strong>Project Name:</strong> {project.projectName}, <strong>Client Name:</strong> {project.clientName}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <img src={pic4} alt="No projects created" />
                            <p style={{ marginLeft: '300px' }}>No projects created yet.</p> {/* Adjust margin as needed */}
                        </div>
                    )}
                </div>

                
            </div>
        </div>
    );
}

export default ProjectManagement;
