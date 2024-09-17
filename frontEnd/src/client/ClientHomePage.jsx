import './ClientHomePage.css'; 

function ClientHomePage() {
    return (
        <div className="client-home-page">
            <div className="sidebar">
                <ul>
                    <li><a href="#my-services">My Services</a></li>
                    <li><a href="#documents">Documents</a></li>
                    <li><a href="#appointments">Appointments</a></li>
                    <li><a href="#payments">Payments</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <button className="logout-button">Log Out</button> {/* Added Log Out button */}
            </div>
            <div className="content">
                <h2>Client Dashboard</h2>
                <h1>Overview</h1>
            </div>
        </div>
    );
}

export default ClientHomePage;