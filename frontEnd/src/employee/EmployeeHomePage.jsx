import './EmployeeHomePage.css';
function EmployeeHomePage() {
    return (
        <div className="employee-home-page">
            <div className="sidebar">
                <ul>
                    <li><a href="#dashboard">Dashboard</a></li>
                    <li><a href="#tasks">Task</a></li>
                    <li><a href="#documents">Documents</a></li>
                </ul>
                <button className="logout-button">Log Out</button> {/* Added Log Out button */}
            </div>
            <div className="content">
                <h2>Employee Dashboard</h2>
                <h1>Overview</h1>
            </div>
        </div>
    );
}

export default EmployeeHomePage;