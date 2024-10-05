import './AdminHomePage.css';
import ClientList from './clientlist'; // Import the updated ClientList component
import { useState } from 'react';

function AdminHomePage() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="admin-home-page">
            <div className="sidebar">
                <ul>
<<<<<<< HEAD
                    <li><Link to="/calendar">Calendar</Link></li>
                    <li><Link to="/admin">Dashboard</Link></li>
                    <li><Link to="/project">Projects</Link></li>  {/* Links to Project Management */}
                    <li><Link to="/tasks">Tasks</Link></li>
                    <li><Link to="/documents">Documents</Link></li>
<<<<<<< HEAD
=======
                    <li><Link to="/reports">Reports</Link></li>
>>>>>>> parent of a70966d (frontend)
                    <li><Link to="/calendar">Calendar</Link></li>
                    <li><Link to="/create">Create</Link></li>
                    <li><Link to="/clients">Clients</Link></li>
                    <li><Link to="/employees">Employees</Link></li>
<<<<<<< HEAD
                    <li><Link to="/reports">Reports</Link></li>
                    
=======
                    <li><Link to="/survey">Survey</Link></li>
>>>>>>> parent of a70966d (frontend)
=======
                    <li><a href="#calendar" onClick={() => setActiveTab('calendar')}>Calendar</a></li>
                    <li><a href="#dashboard" onClick={() => setActiveTab('dashboard')}>Dashboard</a></li>
                    <li><a href="#projects" onClick={() => setActiveTab('projects')}>Projects</a></li>
                    <li><a href="#tasks" onClick={() => setActiveTab('tasks')}>Tasks</a></li>
                    <li><a href="#create" onClick={() => setActiveTab('create')}>Create</a></li>
                    <li><a href="#clients" onClick={() => setActiveTab('clients')}>Clients</a></li>
                    <li><a href="#employees" onClick={() => setActiveTab('employees')}>Employees</a></li>
                    <li><a href="#documents" onClick={() => setActiveTab('documents')}>Documents</a></li>
                    <li><a href="#reports" onClick={() => setActiveTab('reports')}>Reports</a></li>
>>>>>>> parent of 6bf747d (Merge branch 'main' into cabigting)
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
