import './project.css';
import Sidebar from '../sidebar'; // Import the Sidebar component
import { useState } from 'react';
import { FaPlus, FaBell } from 'react-icons/fa'; 
import pic4 from "../../Assets/pic4.png"; 

function ProjectManagement() {
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [projects, setProjects] = useState([]); 
    const [projectName, setProjectName] = useState(''); 
    const [clientName, setClientName] = useState(''); 

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setProjectName('');
        setClientName('');
    };

    const createProject = () => {
        if (projectName && clientName) {
            const newProject = { projectName, clientName, progress: "0%", assigned: "Unassigned", status: "Pending", priority: "Low" };
            setProjects([...projects, newProject]);
            closeModal();
        } else {
            alert("Please fill in both fields.");
        }
    };

    return (
        <div className="project-management-page">
            <Sidebar /> 
            <div className="content">
                <h1>Projects</h1>
                <div className="header-actions">
                    <button className="create-button" onClick={openModal}>
                        <FaPlus className='icon'/> Create
                    </button>
                    <div className="notification-icon" style={{ cursor: 'pointer' }}>
                        <FaBell className="icon" />
                    </div>
                    <button className="add-task">
                        <FaPlus className='icon' />
                    </button>
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
                                    value={projectName} 
                                    onChange={(e) => setProjectName(e.target.value)} 
                                />
                            </div>
                            <div className="modal-field">
                                <label>Client Name:</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter client name" 
                                    value={clientName} 
                                    onChange={(e) => setClientName(e.target.value)} 
                                />
                            </div>
                            <div className="modal-actions">
                                <button className="cancel-button" onClick={closeModal}>Cancel</button>
                                <button className="create-button" onClick={createProject}>Create</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="project-list">
                    {projects.length > 0 ? (
                        projects.map((project, index) => (
                            <div className="project-item" key={index}>
                                <div className="project-name">
                                    {project.projectName}
                                </div>
                                <div className="project-table">
                                    <div className="project-table-header">
                                        <span>Progress</span>
                                        <span>Assigned</span>
                                        <span>Status</span>
                                        <span>Priority</span>
                                        <span>Client</span>
                                    </div>
                                    <div className="project-row">
                                        <span>{project.progress}</span>
                                        <span>{project.assigned}</span>
                                        <span>{project.status}</span>
                                        <span>{project.priority}</span>
                                        <span>{project.clientName}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center' }}>
                            <img src={pic4} alt="No projects created" />
                            <p className="no-projects-message">No projects created yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProjectManagement;