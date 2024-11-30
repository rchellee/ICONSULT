import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../sidebar"; // Adjust the path as needed
import "./consultation.css"; // Add CSS for the button

const Consultation = () => {
  return (
    <div className="client-home-page">
      <Sidebar />
      <div className="content">
        <h1>Appointment</h1>
        <div className="button-container">
          <Link to="/appointments/new" className="new-appointment-button">
            <button>+ Add New Appointment</button>
          </Link>
        </div>
        
      </div>
    </div>
  );
};
export default Consultation;
