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
import "./ReportsTab.css";

const ReportsTab = () => {
  const [reportType, setReportType] = useState("appointments");

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="reports-tab-container">
        <div>
          <h2 className="text-xl font-bold mb-4">Reports</h2>

          <div className="flex space-x-4 mb-4">
            <select
              className="border p-2 text-sm w-40 ml-auto"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="appointments">Appointments Reports</option>
              <option value="clients">Clients Reports</option>
              <option value="projects">Projects Reports</option>
              <option value="tasks">Task Reports</option>
              <option value="employees">Employees Reports</option>
              <option value="payments">Financial Reports</option>
            </select>
          </div>

          {reportType === "appointments" && <AppointmentReports />}
          {reportType === "clients" && <ClientReports />}
          {reportType === "payments" && <RevenueReports />}
          {reportType === "projects" && <ProjectReports />}
          {reportType === "tasks" && <TaskReports />}
          {reportType === "employees" && <EmployeeReports />}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
