// import React from 'react';
import Sidebar from '../client/sidebar';// Import the Sidebar component
import ClientHomePage from "./ClientHomePage";


function Dashboard() {
    const handleAddAppointment = () => {
        console.log("Add Appointment button clicked");
    };

    return (
        <div className="dashboard-page">
            <Sidebar /> {/* Sidebar sa gilid */}
            <div className="dashboard-content">
                <h2>Dashboard</h2>

                <div className="appointment-section">
                    <button onClick={handleAddAppointment}>Add Appointment</button>
                </div>

                <div className="section">
                    <h3>Upcoming Appointments</h3>
                    <p>No upcoming appointments. Schedule one now!</p>
                </div>
                <div className="section">
                    <h3>Recent Projects or Progress</h3>
                    <p>Project XYZ - 75% complete</p>
                </div>
                <div className="section">
                    <h3>Notifications</h3>
                    <p>No new notifications</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;