import './AdminHomePage.css';
import { Link } from 'react-router-dom';  // Import Link from React Router

function AdminHomePage() {
    return (
        <div className="admin-home-page">
            <div className="sidebar">
                <ul>
                    <li><Link to="/admin">Dashboard</Link></li>
                    <li><Link to="/project">Projects</Link></li>  {/* Links to Project Management */}
                    <li><Link to="/reports">Reports</Link></li>
                    <li><Link to="/calendar">Calendar</Link></li>
                    <li><Link to="/create">Create</Link></li>
                    <li><Link to="/clients">Clients</Link></li>
                    <li><Link to="/employees">Employees</Link></li>
                    <li><Link to="/Logout">Logout</Link></li>
                </ul>
            </div>
            <div className="content">
                <h2>Admin Dashboard</h2>
                <h1>Overview</h1>
            </div>
        </div>
    );
}

export default AdminHomePage;
