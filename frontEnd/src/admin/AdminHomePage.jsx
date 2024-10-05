import './AdminHomePage.css';
import ClientList from './clientlist'; // Import the updated ClientList component
import { useState } from 'react';

function AdminHomePage() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="admin-home-page">
            <div className="sidebar">
                <ul>
                    <li><a href="#calendar" onClick={() => setActiveTab('calendar')}>Calendar</a></li>
                    <li><a href="#dashboard" onClick={() => setActiveTab('dashboard')}>Dashboard</a></li>
                    <li><a href="#projects" onClick={() => setActiveTab('projects')}>Projects</a></li>
                    <li><a href="#tasks" onClick={() => setActiveTab('tasks')}>Tasks</a></li>
                    <li><a href="#create" onClick={() => setActiveTab('create')}>Create</a></li>
                    <li><a href="#clients" onClick={() => setActiveTab('clients')}>Clients</a></li>
                    <li><a href="#employees" onClick={() => setActiveTab('employees')}>Employees</a></li>
                    <li><a href="#documents" onClick={() => setActiveTab('documents')}>Documents</a></li>
                    <li><a href="#reports" onClick={() => setActiveTab('reports')}>Reports</a></li>
                </ul>
                <button className="logout-button">Log Out</button>
            </div>

            <div className="content">
                {activeTab === 'dashboard' && (
                    <>
                        <h2>Admin Dashboard</h2>
                        <h1>Overview</h1>
                    </>
                )}

                {activeTab === 'clients' && (
                    <ClientList />  // Display the ClientList component
                )}
            </div>
        </div>
    );
}

export default AdminHomePage;
