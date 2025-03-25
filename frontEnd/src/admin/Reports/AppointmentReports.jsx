import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

  const formatAppointmentsthisMonthCSV = () => {
    let csvData = [];

    // Add headers
    csvData.push([
      "Client Name",
      "Date",
      "Time",
      "Email",
      "Consultation Type",
      "Company Name",
      "Platform",
    ]);

    // Filter appointments for the current month
    const currentMonthAppointments = appointments.filter((a) => {
      const appointmentDate = new Date(a.date);
      return (
        appointmentDate.getMonth() === new Date().getMonth() &&
        appointmentDate.getFullYear() === new Date().getFullYear()
      );
    });

    // Populate CSV data
    currentMonthAppointments.forEach((a) => {
      csvData.push([
        a.name,
        a.date,
        a.time,
        a.email,
        a.consultationType,
        a.companyName,
        a.platform,
      ]);
    });

    return csvData;
  };
  const formatAppointmentsPerClientCSV = () => {
    let csvData = [];

    clients.forEach((client) => {
      const clientAppointments = appointments.filter(
        (a) => a.client_id === client.id
      );

      if (clientAppointments.length > 0) {
        csvData.push([`${client.firstName} ${client.lastName}`]); // Add client name as a row
        csvData.push([
          "Date",
          "Time",
          "Email",
          "Consultation Type",
          "Company Name",
        ]); // Headers

        clientAppointments.forEach((a) => {
          csvData.push([
            a.date,
            a.time,
            a.email,
            a.consultationType,
            a.companyName,
          ]);
        });

        csvData.push([]); // Blank row for spacing
      }
    });

    return csvData;
  };
  const formatAppointmentsByPlatformCSV = () => {
    let csvData = [];

    const platforms = [
      "In-Person",
      "Zoom",
      "Google Meet",
      "Phone Call",
      "Microsoft Teams",
    ];

    platforms.forEach((platform) => {
      const platformAppointments = appointments.filter(
        (a) => a.platform === platform
      );

      if (platformAppointments.length > 0) {
        csvData.push([platform]); // Add platform name as a row
        csvData.push([
          "Name",
          "Date",
          "Time",
          "Email",
          "Consultation Type",
          "Company Name",
        ]); // Headers

        platformAppointments.forEach((a) => {
          csvData.push([
            a.name,
            a.date,
            a.time,
            a.email,
            a.consultationType,
            a.companyName,
          ]);
        });

        csvData.push([]); // Blank row for spacing
      }
    });

    return csvData;
  };
  const formatConsultationTypeCSV = () => {
    let csvData = [];

    const consultationTypes = [
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
    ];

    consultationTypes.forEach((type) => {
      const typeAppointments = appointments.filter(
        (a) => a.consultationType === type
      );

      if (typeAppointments.length > 0) {
        csvData.push([type]); // Add consultation type as a row
        csvData.push([
          "Name",
          "Date",
          "Time",
          "Email",
          "Consultation Type",
          "Company Name",
        ]); // Headers

        typeAppointments.forEach((a) => {
          csvData.push([
            a.name,
            a.date,
            a.time,
            a.email,
            a.consultationType,
            a.companyName,
          ]);
        });

        csvData.push([]); // Blank row for spacing
      }
    });

    return csvData;
  };

  const exportPDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4");
    doc.setFontSize(11);
    doc.text(selectedReport, 10, 10);

    let yPos = 20;

    const chartElement = document.getElementById("chart-container");

    if (chartElement) {
      try {
        // Capture chart as an image
        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL("image/png");

        // Add image to the PDF
        doc.addImage(imgData, "PNG", 10, yPos, 120, 80);
        yPos += 90; // Adjust position for the table
      } catch (error) {
        console.error("Error capturing chart:", error);
      }
    }

    if (selectedReport === "Total Appointments") {
      const headers = [
        [
          "Client Name",
          "Date",
          "Time",
          "Email",
          "Contact",
          "Consultation Type",
          "Description",
          "Company Name",
          "Platform",
          "Date Created",
        ],
      ];
      const data = appointments.map((a) => [
        a.name,
        a.date,
        a.time,
        a.email,
        a.contact,
        a.consultationType,
        a.additionalInfo,
        a.companyName,
        a.platform,
        a.created_at,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: headers,
        body: data,
        styles: { fontSize: 10 },
      });
    }

    if (selectedReport === "Appointments This Month") {
      // Filter appointments for the current month
      const currentMonthAppointments = appointments.filter((a) => {
        const appointmentDate = new Date(a.date);
        return (
          appointmentDate.getMonth() === new Date().getMonth() &&
          appointmentDate.getFullYear() === new Date().getFullYear()
        );
      });

      const headers = [
        ["Date", "Time", "Email", "Consultation Type", "Company Name"],
      ];
      const data = currentMonthAppointments.map((a) => [
        a.date,
        a.time,
        a.email,
        a.consultationType,
        a.companyName,
      ]);

      autoTable(doc, {
        startY: yPos,
        head: headers,
        body: data,
        styles: { fontSize: 10 },
      });
    }

    if (selectedReport === "Appointments per Client") {
      clients.forEach((client) => {
        const clientAppointments = appointments.filter(
          (a) => a.client_id === client.id
        );

        if (clientAppointments.length > 0) {
          doc.setFontSize(12);
          doc.text(`${client.firstName} ${client.lastName}`, 10, yPos);
          yPos += 10;

          const headers = [
            ["Date", "Time", "Email", "Consultation Type", "Company Name"],
          ];
          const data = clientAppointments.map((a) => [
            a.date,
            a.time,
            a.email,
            a.consultationType,
            a.companyName,
          ]);

          autoTable(doc, {
            startY: yPos,
            head: headers,
            body: data,
            styles: { fontSize: 10 },
          });
          yPos = doc.lastAutoTable.finalY + 10;
        }
      });
    }

    if (selectedReport === "Appointments by Platform") {
      const platforms = [
        "In-Person",
        "Zoom",
        "Google Meet",
        "Phone Call",
        "Microsoft Teams",
      ];

      platforms.forEach((platform) => {
        const platformAppointments = appointments.filter(
          (a) => a.platform === platform
        );

        if (platformAppointments.length > 0) {
          doc.setFontSize(12);
          doc.text(platform, 10, yPos);
          yPos += 10;

          const headers = [
            [
              "Name",
              "Date",
              "Time",
              "Email",
              "Consultation Type",
              "Company Name",
            ],
          ];
          const data = platformAppointments.map((a) => [
            a.name,
            a.date,
            a.time,
            a.email,
            a.consultationType,
            a.companyName,
          ]);

          autoTable(doc, {
            startY: yPos,
            head: headers,
            body: data,
            styles: { fontSize: 10 },
          });
          yPos = doc.lastAutoTable.finalY + 10;
        }
      });
    }

    if (selectedReport === "Consultation Type Overview") {
      const consultationTypes = [
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
      ];

      consultationTypes.forEach((type) => {
        const typeAppointments = appointments.filter(
          (a) => a.consultationType === type
        );

        if (typeAppointments.length > 0) {
          doc.setFontSize(12);
          doc.text(type, 10, yPos);
          yPos += 10;

          const headers = [
            [
              "Name",
              "Date",
              "Time",
              "Email",
              "Consultation Type",
              "Company Name",
            ],
          ];
          const data = typeAppointments.map((a) => [
            a.name,
            a.date,
            a.time,
            a.email,
            a.consultationType,
            a.companyName,
          ]);

          autoTable(doc, {
            startY: yPos,
            head: headers,
            body: data,
            styles: { fontSize: 10 },
          });
          yPos = doc.lastAutoTable.finalY + 10;
        }
      });
    }

    doc.save(`${selectedReport.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };

  let exportCSVData = [];

  if (selectedReport === "Appointments per Client") {
    exportCSVData = formatAppointmentsPerClientCSV();
  } else if (selectedReport === "Appointments This Month") {
    exportCSVData = formatAppointmentsthisMonthCSV();
  } else if (selectedReport === "Appointments by Platform") {
    exportCSVData = formatAppointmentsByPlatformCSV();
  } else if (selectedReport === "Consultation Type Overview") {
    exportCSVData = formatConsultationTypeCSV();
  } else {
    exportCSVData = appointments; // Default case for Total Appointments & Appointments This Month
  }

  return (
    <div className="app-4">
      <div className="filter-container">
        <select
          className="filter-select"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="All">Year</option>
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
          <option value="All">Month</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        <div className="mt-4 flex justify-start items-center space-x-4">
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
                data={exportCSVData}
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
              <PieChart width={800} height={550}>
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
            <BarChart width={700} height={450} data={appointmentsByPlatform}>
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
            width={1700}
            height={550}
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
