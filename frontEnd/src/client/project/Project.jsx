import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../sidebar";
import "./project.css";

function Project() {
  return (
    <div className="client-project-page">
      <Sidebar />
      <div className="content">
        <h1>Project</h1>
      </div>
    </div>
  );
}

export default Project;
