import './AdminHomePage.css';

function AdminHomePage() {
    return (
        <div className="admin-home-page">
            <div className="sidebar">
                <ul>
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#tasks">Tasks</a></li>
                    <li><a href="#documents">Documents</a></li>
                    <li><a href="#reports">Reports</a></li>
                    <li><a href="#calendar">Calendar</a></li>
                    <li><a href="#create">Create</a></li>
                    <li><a href="#clients">Clients</a></li>
                    <li><a href="#employees">Employees</a></li>
                    <li><a href="#survey">Survey</a></li>
                </ul>
                <button className="logout-button">Log Out</button> {/* Added Log Out button */}
            </div>
            <div className="content">
                <h2>Admin Dashboard</h2>
                <h1>Overview</h1>
            </div>
        </div>
    );
}

export default AdminHomePage;