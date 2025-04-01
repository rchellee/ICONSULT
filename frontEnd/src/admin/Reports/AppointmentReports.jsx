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
import landscapeTemplate from "../../assets/reports_landscape.jpg";
import AppointmentTemplate from "../../assets/reports_portrait.jpg";

const AppointmentReports = () => {
  const [appointments, setAppointments] = useState([]);
  const [adminUsername, setAdminUsername] = useState("");
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
  const [selectedClient, setSelectedClient] = useState("All");

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setAdminUsername(username);
    }
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

  const formatTotalAppointmentsCSV = () => {
    let csvData = [];
    csvData.push([
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
    ]);
    const appointmentsToExport =
      filters.year === "All" && filters.month === "All"
        ? appointments
        : filteredAppointments;
    appointmentsToExport.forEach((a) => {
      csvData.push([
        a.name || "N/A",
        a.date ? new Date(a.date).toLocaleDateString() : "N/A",
        a.time || "N/A",
        a.email || "N/A",
        a.contact || "N/A",
        a.consultationType || "N/A",
        a.additionalInfo || "N/A",
        a.companyName || "N/A",
        a.platform || "N/A",
        a.created_at ? new Date(a.created_at).toLocaleDateString() : "N/A",
      ]);
    });

    return csvData;
  };
  const formatAppointmentsthisMonthCSV = () => {
    let csvData = [];
    csvData.push([
      "Client Name",
      "Date",
      "Time",
      "Email",
      "Consultation Type",
      "Company Name",
      "Platform",
    ]);
    const currentMonthAppointments = appointments.filter((a) => {
      const appointmentDate = new Date(a.date);
      return (
        appointmentDate.getMonth() === new Date().getMonth() &&
        appointmentDate.getFullYear() === new Date().getFullYear()
      );
    });
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
  const formatClientAppointmentSummaryCSV = () => {
    let csvData = [];
    let grandTotal = 0;
    const isAllClients = selectedClient === "All";

    // Filter clients based on selection
    const clientsToExport = isAllClients
      ? clients
      : clients.filter((c) => c.id.toString() === selectedClient);

    clientsToExport.forEach((client) => {
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
          "Platform",
        ]); // Headers

        let clientTotal = 0;

        clientAppointments.forEach((a) => {
          csvData.push([
            a.date ? new Date(a.date).toLocaleDateString() : "N/A",
            a.time || "N/A",
            a.email || "N/A",
            a.consultationType || "N/A",
            a.companyName || "N/A",
            a.platform || "N/A",
          ]);
          clientTotal++;
        });

        csvData.push(["Appointment Total", clientTotal, "", "", "", ""]);
        csvData.push([]); // Blank row for spacing

        grandTotal += clientTotal;
      }
    });

    // Only add GRAND TOTAL if "All Clients" is selected
    if (isAllClients && grandTotal > 0) {
      csvData.push(["OVERALL TOTAL", grandTotal, "", "", "", ""]);
    }

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
    const isLandscape = [
      "Total Appointments",
      "Appointments This Month",
    ].includes(selectedReport);
    const doc = new jsPDF(isLandscape ? "landscape" : "portrait", "mm", "a4");

    // Common setup functions
    const setupPage = (pdfDoc) => {
      pdfDoc.addImage(
        isLandscape ? landscapeTemplate : AppointmentTemplate,
        "JPEG",
        0,
        0,
        pdfDoc.internal.pageSize.getWidth(),
        pdfDoc.internal.pageSize.getHeight()
      );
      pdfDoc.setFontSize(18);
      pdfDoc.setFont("helvetica", "bold");
      pdfDoc.setTextColor(0);
      const textX =
        (pdfDoc.internal.pageSize.getWidth() -
          (pdfDoc.getStringUnitWidth(selectedReport) *
            pdfDoc.internal.getFontSize()) /
            pdfDoc.internal.scaleFactor) /
        2;
      pdfDoc.text(selectedReport, textX, 45);
      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.setFontSize(8);
      return { textX };
    };

    const addFooter = (pdfDoc) => {
      const currentDate = new Date().toLocaleString();
      const yPos = pdfDoc.internal.pageSize.height - 20;
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(100);
      pdfDoc.text(`Generated by: ${adminUsername || "System"}`, 14, yPos);
      pdfDoc.text(
        `Date Generated: ${currentDate}`,
        pdfDoc.internal.pageSize.width - 60,
        yPos,
        { align: "right" }
      );
    };

    // Handle special reports with charts
    const handleChartReports = async (chartSelector, dataProcessor) => {
      try {
        const chartElement = document.querySelector(chartSelector);
        if (!chartElement) throw new Error("Chart element not found");

        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = chartSelector.includes("client") ? 150 : 180;
        const imgHeight = imgWidth / (canvas.width / canvas.height);

        // Chart page
        const chartDoc = new jsPDF("portrait", "mm", "a4");
        const { textX } = setupPage(chartDoc);
        const centerX = (chartDoc.internal.pageSize.getWidth() - imgWidth) / 2;
        chartDoc.addImage(imgData, "PNG", centerX, 60, imgWidth, imgHeight);
        addFooter(chartDoc);

        // Data pages
        const dataDoc = new jsPDF("portrait", "mm", "a4");
        const setup = setupPage(dataDoc);
        await dataProcessor(dataDoc, setup.textX);
        addFooter(dataDoc);

        // Merge PDFs
        const { PDFDocument } = await import("pdf-lib");
        const mergedPdf = await PDFDocument.create();
        const [chartPage] = await mergedPdf.copyPages(
          await PDFDocument.load(chartDoc.output("arraybuffer")),
          [0]
        );
        mergedPdf.addPage(chartPage);
        const dataPages = await mergedPdf.copyPages(
          await PDFDocument.load(dataDoc.output("arraybuffer")),
          (
            await PDFDocument.load(dataDoc.output("arraybuffer"))
          ).getPageIndices()
        );
        dataPages.forEach((page) => mergedPdf.addPage(page));

        const blob = new Blob([await mergedPdf.save()], {
          type: "application/pdf",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedReport
          .replace(/\s+/g, "_")
          .toLowerCase()}.pdf`;
        link.click();
        return true;
      } catch (error) {
        console.error("Error generating PDF:", error);
        return false;
      }
    };

    // Try to handle as chart report first
    const chartHandlers = {
      "Client Appointment Summary": {
        selector: "#client-appointment-chart .app-chart",
        processor: async (dataDoc, textX) => {
          let contentY = 50;
          const clientsToExport =
            selectedClient === "All"
              ? clients
              : clients.filter((c) => c.id.toString() === selectedClient);

          for (const [i, client] of clientsToExport.entries()) {
            const clientAppointments = appointments.filter(
              (a) => a.client_id === client.id
            );
            if (!clientAppointments.length) continue;

            if (i > 0) {
              dataDoc.addPage();
              contentY = 50;
              setupPage(dataDoc);
            }

            dataDoc
              .setFontSize(12)
              .setFont("helvetica", "bolditalic")
              .text(`${client.firstName} ${client.lastName}`, 8, contentY);
            contentY += 8;

            autoTable(dataDoc, {
              startY: contentY,
              head: [
                [
                  "Date",
                  "Time",
                  "Consultation Type",
                  "Company Name",
                  "Platform",
                ],
              ],
              body: clientAppointments.map((a) => [
                a.date ? new Date(a.date).toLocaleDateString() : "N/A",
                a.time || "N/A",
                a.consultationType || "N/A",
                a.companyName || "N/A",
                a.platform || "N/A",
              ]),
              styles: { fontSize: 8, textColor: [0, 0, 0] },
              headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            });
            contentY = dataDoc.lastAutoTable.finalY + 15;
          }
        },
      },
      "Consultation Platforms Summary": {
        selector: "#platforms-summary-chart .app-chart-scroll",
        processor: async (dataDoc, textX) => {
          let contentY = 50;
          const platforms = [
            "In-Person",
            "Zoom",
            "Google Meet",
            "Phone Call",
            "Microsoft Teams",
          ];

          for (const [i, platform] of platforms.entries()) {
            const platformAppointments = appointments.filter(
              (a) => a.platform === platform
            );
            if (!platformAppointments.length) continue;

            if (i > 0) {
              dataDoc.addPage();
              contentY = 50;
              setupPage(dataDoc);
            }

            dataDoc
              .setFontSize(12)
              .setFont("helvetica", "bolditalic")
              .text(platform, 8, contentY);
            contentY += 8;

            autoTable(dataDoc, {
              startY: contentY,
              head: [
                [
                  "Name",
                  "Date",
                  "Time",
                  "Email",
                  "Consultation Type",
                  "Company Name",
                ],
              ],
              body: platformAppointments.map((a) => [
                a.name,
                a.date,
                a.time,
                a.email,
                a.consultationType,
                a.companyName,
              ]),
              styles: { fontSize: 8, textColor: [0, 0, 0] },
              headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            });
            contentY = dataDoc.lastAutoTable.finalY + 8;
          }
        },
      },
      "Consultation Type Overview": {
        selector: "#app-appointments-consultation .app-chart-scroll",
        processor: async (dataDoc, textX) => {
          let contentY = 50;
          const types = [
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
            "SEC/DTI/Mayor's Permit Assistance",
            "Compliance Consultation",
            "Follow up",
            "Others",
          ];

          for (const [i, type] of types.entries()) {
            const typeAppointments = appointments.filter(
              (a) => a.consultationType === type
            );
            if (!typeAppointments.length) continue;

            if (i > 0) {
              dataDoc.addPage();
              contentY = 50;
              setupPage(dataDoc);
            }

            dataDoc
              .setFont("helvetica", "bolditalic")
              .setFontSize(10)
              .text(type, 8, contentY);
            dataDoc.setFont("helvetica", "normal");
            contentY += 8;

            autoTable(dataDoc, {
              startY: contentY,
              head: [
                [
                  "Name",
                  "Date",
                  "Time",
                  "Email",
                  "Consultation Type",
                  "Company Name",
                ],
              ],
              body: typeAppointments.map((a) => [
                a.name,
                a.date,
                a.time,
                a.email,
                a.consultationType,
                a.companyName,
              ]),
              styles: { fontSize: 8, textColor: [0, 0, 0] },
              headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
            });
            contentY = dataDoc.lastAutoTable.finalY + 8;
          }
        },
      },
    };

    if (chartHandlers[selectedReport]) {
      const success = await handleChartReports(
        chartHandlers[selectedReport].selector,
        chartHandlers[selectedReport].processor
      );
      if (success) return;
    }

    // Handle regular reports
    setupPage(doc);
    let yPos = 50;

    const reportHandlers = {
      "Total Appointments": () => {
        const data = (
          filters.year === "All" && filters.month === "All"
            ? appointments
            : filteredAppointments
        ).map((a) => [
          a.name || "N/A",
          a.date ? new Date(a.date).toLocaleDateString() : "N/A",
          a.time || "N/A",
          a.email || "N/A",
          a.contact || "N/A",
          a.consultationType || "N/A",
          a.additionalInfo || "N/A",
          a.companyName || "N/A",
          a.platform || "N/A",
          a.created_at ? new Date(a.created_at).toLocaleDateString() : "N/A",
        ]);
        autoTable(doc, {
          startY: yPos,
          head: [
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
          ],
          body: data,
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
          showHead: "everyPage",
        });
      },
      "Appointments This Month": () => {
        const data = appointments
          .filter((a) => new Date(a.date).getMonth() === new Date().getMonth())
          .map((a) => [
            a.date,
            a.time,
            a.email,
            a.consultationType,
            a.companyName,
          ]);
        autoTable(doc, {
          startY: yPos,
          head: [
            ["Date", "Time", "Email", "Consultation Type", "Company Name"],
          ],
          body: data,
          styles: { fontSize: 8, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
          showHead: "everyPage",
        });
      },
    };

    if (reportHandlers[selectedReport]) {
      reportHandlers[selectedReport]();
    }

    addFooter(doc);
    doc.save(`${selectedReport.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };

  let exportCSVData = [];

  if (selectedReport === "Total Appointments") {
    exportCSVData = formatTotalAppointmentsCSV();
  } else if (selectedReport === "Client Appointment Summary") {
    exportCSVData = formatClientAppointmentSummaryCSV();
  } else if (selectedReport === "Appointments This Month") {
    exportCSVData = formatAppointmentsthisMonthCSV();
  } else if (selectedReport === "Consultation Platforms Summary") {
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
            <option value="Client Appointment Summary">
              Client Appointment Summary
            </option>
            <option value="Consultation Platforms Summary">
              Consultation Platforms Summary
            </option>
            <option value="Consultation Type Overview">
              Consultation Type Overview
            </option>
          </select>

          {/* Add client selection dropdown when Client Appointment Summary is selected */}
          {selectedReport === "Client Appointment Summary" && (
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="ml-4 bg-gray-200 text-black px-4 py-2 rounded"
            >
              <option value="All">All Clients</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.firstName} {client.lastName}
                </option>
              ))}
            </select>
          )}

          {selectedReport && (
            <>
              <CSVLink
                data={exportCSVData}
                filename={`${selectedReport
                  .replace(/\s+/g, "_")
                  .toLowerCase()}_${
                  selectedClient === "All"
                    ? "all_clients"
                    : "client_" + selectedClient
                }.csv`}
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
        {!filters.clientId && (
          <div className="app-chart-box" id="client-appointment-chart">
            <h3 className="app-chart-title">Client Appointment Summary</h3>
            <p className="app-chart-description">
              Overview of client appointments in percentage format.
            </p>
            <div className="app-chart">
              <PieChart width={550} height={550}>
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

        {/* Consultation Platforms Summary */}
        <div className="app-chart-box" id="platforms-summary-chart">
          <h3 className="app-chart-title">Consultation Platforms Summary</h3>
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
