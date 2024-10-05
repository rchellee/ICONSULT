import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './project.css'; 

function ProjectManagement() {
    return (
        <div className="project-management-page">
            {/* Sidebar */}
            <div className="sidebar">
                <ul>
                    <li><Link to="/admin">Dashboard</Link></li>
                    <li><Link to="/project">Projects</Link></li>  {/* Ensures proper routing within the app */}
                    <li><Link to="/tasks">Tasks</Link></li>
                    <li><Link to="/documents">Documents</Link></li>
                    <li><Link to="/reports">Reports</Link></li>
                    <li><Link to="/calendar">Calendar</Link></li>
                </ul>
            </div>

            {/* Content */}
            <div className="content">
                <h1>Project Management</h1>
                <p>Welcome to the Project Management page!</p>
            </div>
        </div>
    );
}

export default ProjectManagement;
