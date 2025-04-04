import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import AppointmentReports from "./AppointmentReports";
import ClientReports from "./ClientsReports";
import RevenueReports from "./RevenueReports";
import ProjectReports from "./ProjectReports";
import EmployeeReports from "./EmployeeReports";
import TaskReports from "./TaskReports";
import ReviewReports from "./ReviewReports";
import "./ReportsTab.css";

const ReportsTab = () => {
  const [reportType, setReportType] = useState("appointments");

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="reports-page-container">
        <div className="reports-main-content">
          {/* Fixed header with dropdown */}
          <div className="reports-header">
            <div className="report-type-selector">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="appointments">Appointments</option>
                <option value="clients">Clients</option>
                <option value="projects">Projects</option>
                <option value="tasks">Tasks</option>
                <option value="employees">Employees</option>
                <option value="payments">Financial</option>
              </select>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="reports-content">
            {reportType === "appointments" && <AppointmentReports />}
            {reportType === "clients" && <ClientReports />}
            {reportType === "payments" && <RevenueReports />}
            {reportType === "projects" && <ProjectReports />}
            {reportType === "tasks" && <TaskReports />}
            {reportType === "employees" && <EmployeeReports />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
