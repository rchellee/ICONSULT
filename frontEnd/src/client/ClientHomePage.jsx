// import { Link } from 'react-router-dom';  // Import Link from React Router
import Sidebar from '../client/sidebar';
import Dashboard from './Appointment/Appointment';

function ClientHomePage() {
    return (
        <div className="client-home-page">
            <Sidebar />
            <div className="dashboard-content">
                <Dashboard />
            </div>
        </div>
    );
}

export default ClientHomePage;

//Upcoming Appointments: Display any scheduled appointments or consultations with date and time details.
//Recent Projects or Progress: Show a summary of active projects with a brief status update or task completion percentage.
//Notifications: Include recent updates, such as task completions or new documents shared by the consultant.
//Quick Actions: Add buttons for common tasks like scheduling a new appointment, viewing recent reports, or accessing shared documents.
