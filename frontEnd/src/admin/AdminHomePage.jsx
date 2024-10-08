import './AdminHomePage.css';
import { Link } from 'react-router-dom';  // Import Link from React Router
import Sidebar from '../admin/sidebar';// Import the Sidebar component

function AdminHomePage() {
    return (
        //sidebar
        <div className="admin-home-page">
            <Sidebar /> 

      
        </div>
    );
}

export default AdminHomePage;
