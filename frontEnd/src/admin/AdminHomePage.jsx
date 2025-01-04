import { Link } from "react-router-dom"; // Import Link from React Router
import Sidebar from "../admin/sidebar";
import Topbar from "./Topbar";

function AdminHomePage() {
  return (
    <div>
      <Topbar />
      <div className="admin-home-page">
        <Sidebar />
      </div>
    </div>
  );
}

export default AdminHomePage;
