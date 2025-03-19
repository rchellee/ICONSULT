import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import "./ReportsTab.css";

const AppointmentReports = () => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    clientId: "",
    consultationType: "",
    platform: "",
    year: "All",
    month: "All",
  });
  const [selectedReport, setSelectedReport] = useState("");

  useEffect(() => {
    fetchClients();
    fetchAppointments();
    fetchYears();
  }, [filters]);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8081/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/appointmentReports",
        {
          params: {
            startDate: filters.startDate,
            endDate: filters.endDate,
            clientId: filters.clientId,
          },
        }
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  const fetchYears = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/appointmentYears"
      );
      setYears(response.data);
    } catch (error) {
      console.error("Error fetching years", error);
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const exportPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    let currentPage = 1;
    const sections = {
      "Total Appointments": "summary-section",
      "Appointments This Month": "summary-section",
      "Appointments per Client": "appointments-client",
      "Appointments by Platform": "appointments-platform",
      "Consultation Type Overview": "appointments-consultation",
    };

    const sectionId = sections[selectedReport];
    if (!sectionId) return;
    const section = document.getElementById(sectionId);

    try {
      const canvas = await html2canvas(section, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      doc.text(selectedReport, 10, 10);
      doc.addImage(imgData, "PNG", 10, 30, 180, 0);
      doc.save("appointment-report.pdf");
    } catch (error) {
      console.error(`Error capturing ${sectionId}:`, error);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const appointmentDate = new Date(a.date);
    const appointmentYear = appointmentDate.getFullYear().toString();
    const appointmentMonth = months[appointmentDate.getMonth()];

    return (
      (filters.year === "All" || filters.year === appointmentYear) &&
      (filters.month === "All" || filters.month === appointmentMonth)
    );
  });

  const totalAppointments = filteredAppointments.length;

  const currentMonthAppointments = filteredAppointments.filter(
    (a) => new Date(a.date).getMonth() === new Date().getMonth()
  ).length;

  const appointmentsByClient = clients.map((client) => ({
    name: `${client.firstName} ${client.lastName}`,
    value: filteredAppointments.filter((a) => a.client_id === client.id).length,
  }));

  const appointmentsByPlatform = [
    { name: "In-Person", color: "#2E86C1" },
    { name: "Zoom", color: "#28B463" },
    { name: "Google Meet", color: "#D4AC0D" },
    { name: "Phone Call", color: "#A569BD" },
    { name: "Microsoft Teams", color: "#E74C3C" },
  ].map((platform) => ({
    name: platform.name,
    value: filteredAppointments.filter((a) => a.platform === platform.name)
      .length,
    color: platform.color,
  }));

  const appointmentsByConsultationType = [
    "Strategic Planning Consultation",
    "Corporate Governance Review",
    "Business Process Improvement",
    "Risk Management Consultation",
    "Organizational Development Advisory",
    "Financial Advisory",
    "Accounting Consultation",
    "Legal Advisory",
    "Tax Advisory",
    "Payroll System Setup Consultation",
    "Employee Benefits and Compliance Advisory",
    "Startup Planning",
    "Business Structuring and Licensing Advisory",
    "Business Name Registration",
    "SEC/DTI/Mayor’s Permit Assistance",
    "Compliance Consultation",
    "Follow up",
    "Others",
  ].map((type) => ({
    name: type,
    value: filteredAppointments.filter((a) => a.consultationType === type)
      .length,
  }));

  return (
    <div className="p-4">
      <div className="filter-container">
        <select
          className="filter-select"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="All">All Years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filters.month}
          onChange={(e) => setFilters({ ...filters, month: e.target.value })}
        >
          <option value="All">All Months</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 flex space-x-4">
        <select
          className="bg-gray-200 text-black px-4 py-2 rounded"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="">Select Report Type</option>
          <option value="Total Appointments">Total Appointments</option>
          <option value="Appointments This Month">
            Appointments This Month
          </option>
          <option value="Appointments per Client">
            Appointments per Client
          </option>
          <option value="Appointments by Platform">
            Appointments by Platform
          </option>
          <option value="Consultation Type Overview">
            Consultation Type Overview
          </option>
        </select>

        {selectedReport && (
          <>
            <CSVLink
              data={appointments}
              filename={`${selectedReport
                .replace(/\s+/g, "_")
                .toLowerCase()}.csv`}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Export CSV
            </CSVLink>
            <button
              onClick={exportPDF}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Export PDF
            </button>
          </>
        )}
      </div>
      <div id="summary-section">
        <div className="summary-box">
          <h2 className="summary-title">Total Appointments</h2>
          <p className="summary-value">{totalAppointments}</p>
        </div>
        <div className="summary-box">
          <h2 className="summary-title">Appointments This Month</h2>
          <p className="summary-value">{currentMonthAppointments}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div id="report-content" className="app-charts-container">
        {/* Appointments per Client */}
        {!filters.clientId && (
          <div className="app-chart-box">
            <h3 className="app-chart-title">Appointments per Client</h3>
            <p className="app-chart-description">
              Overview of client appointments in percentage format.
            </p>
            <div className="app-chart-scroll">
              <PieChart width={600} height={350}>
                <Pie
                  data={appointmentsByClient}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={({ percent }) =>
                    percent > 0 ? `${(percent * 100).toFixed(0)}%` : ""
                  }
                  animationDuration={800}
                >
                  {appointmentsByClient.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#3498DB", "#1ABC9C", "#F39C12", "#8E44AD", "#E74C3C"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        )}

        {/* Appointments by Platform */}
        <div className="app-chart-box">
          <h3 className="app-chart-title">Appointments by Platform</h3>
          <p className="app-chart-description">
            Distribution of appointments across various platforms.
          </p>
          <div className="app-chart-scroll">
            <BarChart width={700} height={350} data={appointmentsByPlatform}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
              <Legend wrapperStyle={{ paddingBottom: "10px" }} />
              <Bar dataKey="value">
                {appointmentsByPlatform.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </div>
        </div>
      </div>

      {/* Appointments by Consultation Type */}
      <div id="app-appointments-consultation" className="app-chart-box">
        <h3 className="app-chart-title">Consultation Type Overview</h3>
        <p className="app-chart-description">
          Breakdown of appointments by consultation type.
        </p>
        <div className="app-chart-scroll">
          <BarChart
            width={1400}
            height={450}
            data={appointmentsByConsultationType}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
            <XAxis
              dataKey="name"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={120}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
            <Legend wrapperStyle={{ paddingBottom: "10px" }} />
            <Bar dataKey="value">
              {appointmentsByConsultationType.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    ["#3498DB", "#1ABC9C", "#F39C12", "#8E44AD", "#E74C3C"][
                      index % 5
                    ]
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default AppointmentReports;
