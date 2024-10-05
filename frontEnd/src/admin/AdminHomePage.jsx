import './AdminHomePage.css';
import ClientList from './clientlist'; // Import the updated ClientList component
import { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link from React Router

function AdminHomePage() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="admin-home-page">
            <div className="sidebar">
                <ul>
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
                </ul>
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
