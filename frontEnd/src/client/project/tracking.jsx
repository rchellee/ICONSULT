import React from "react";
import Sidebar from "../sidebar";
import "./project.css";

function Tracking() {
  return (
    <div className="client-project-page">
      <Sidebar />
      <div className="content">
        <h1>Tracking Page</h1>
        {/* Add Tracking-specific content here */}
      </div>
    </div>
  );
}

export default Tracking;
