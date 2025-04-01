import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import "./ReportsTab.css";
import landscapeTemplate from "../../assets/reports_landscape.jpg";
import AppointmentTemplate from "../../assets/reports_portrait.jpg";

const ProjectReports = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [years, setYears] = useState([]);
  const [filters, setFilters] = useState({
    year: "All Years",
    month: "All Months",
    clientId: "",
  });
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedClient, setSelectedClient] = useState("All");
  const clientChartRef = useRef(null);

  useEffect(() => {
    fetchClients();
    fetchProjects(); // Fetch projects without year affecting all data
  }, [filters.year, filters.month, filters.clientId]);

  useEffect(() => {
    console.log("Clients:", clients);
    console.log("Projects:", projects);
  }, [clients, projects]);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8081/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8081/projectReports", {
        params: {
          year: filters.year !== "All Years" ? filters.year : "",
          month: filters.month !== "All Months" ? filters.month : "",
          clientId: filters.clientId,
        },
      });
      const projectsData = response.data;
      setProjects(projectsData);

      const extractedYears = [
        ...new Set(
          projectsData.map((p) => new Date(p.startDate).getFullYear())
        ),
      ].sort((a, b) => b - a);
      setYears(extractedYears);
    } catch (error) {
      console.error("Error fetching projects", error);
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

  const filteredProjects = projects.filter((p) => {
    const projectYear = new Date(p.startDate).getFullYear();
    const projectMonth = new Date(p.startDate).getMonth(); // 0-11

    const filterYear =
      filters.year !== "All Years" ? parseInt(filters.year) : null;
    const filterMonth =
      filters.month !== "All Months" ? months.indexOf(filters.month) : null;

    return (
      (!filterYear || projectYear === filterYear) &&
      (filterMonth === null || projectMonth === filterMonth)
    );
  });
  const totalProjects = filteredProjects.length;
  const projectsThisMonth = projects.filter((p) => {
    const projectDate = new Date(p.startDate);
    return (
      projectDate.getMonth() === new Date().getMonth() &&
      projectDate.getFullYear() === new Date().getFullYear()
    );
  }).length;
  const projectsByClient = clients
    .map((client) => ({
      name: `${client.firstName} ${client.lastName}`,
      value: filteredProjects.filter((p) => p.clientId === client.id).length,
    }))
    .filter((entry) => entry.value > 0);

  const projectStatusCounts = ["Completed", "Ongoing", "Pending"].map(
    (status) => ({
      name: status,
      value: filteredProjects.filter((p) => p.status === status).length,
    })
  );

  const delayedProjects = filteredProjects
    .filter((project) => project.isDelayed === 1)
    .map((project) => ({
      name: project.projectName,
      daysDelayed: project.delayedDays, // Use delayedDays from backend
    }));

  const formatProjectsThisMonthCSV = () => {
    let csvData = [];

    // Add headers
    csvData.push([
      "Project Name",
      "Client Name",
      "Description",
      "Status",
      "Start Date",
      "End Date",
      "Created At",
    ]);

    // Filter projects for current month
    const currentMonthProjects = projects.filter((p) => {
      const projectDate = new Date(p.startDate);
      return (
        projectDate.getMonth() === new Date().getMonth() &&
        projectDate.getFullYear() === new Date().getFullYear()
      );
    });

    // Populate CSV data
    currentMonthProjects.forEach((p) => {
      csvData.push([
        p.projectName || "N/A",
        p.clientName || "N/A",
        p.description || "N/A",
        p.status || "N/A",
        p.startDate ? new Date(p.startDate).toLocaleDateString() : "N/A",
        p.endDate ? new Date(p.endDate).toLocaleDateString() : "N/A",
        p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A",
      ]);
    });

    return csvData;
  };
  const formatProjectsbyStatusCSV = () => {
    let csvData = [];

    const status = ["Pending", "Ongoing", "Completed"];

    status.forEach((status) => {
      const statusProjects = projects.filter((p) => p.status === status);

      if (statusProjects.length > 0) {
        csvData.push([status]);
        csvData.push([
          "Project Name",
          "Client Name",
          "Description",
          "Start Date",
          "End Date",
          "Date Created",
        ]);

        statusProjects.forEach((p) => {
          csvData.push([
            p.projectName,
            p.clientName,
            p.description,
            p.startDate,
            p.endDate,
            p.created_at,
          ]);
        });

        csvData.push([]); // Blank row for spacing
      }
    });

    return csvData;
  };
  const formatOverdueProjectsCSV = () => {
    let csvData = [["Overdue Projects"]]; // Title row
    csvData.push([
      "Project Name",
      "Client Name",
      "Description",
      "Start Date",
      "End Date",
    ]); // Header row

    const overdueProjects = projects.filter((p) => p.isDelayed === 1);

    overdueProjects.forEach((p) => {
      csvData.push([
        p.projectName,
        p.clientName,
        p.description,
        p.startDate,
        p.endDate,
      ]);
    });

    return csvData;
  };
  const formatProjectsperClientCSV = () => {
    let csvData = [];
    let grandTotal = 0;
    const clientsToExport =
      selectedClient === "All"
        ? clients
        : clients.filter((c) => c.id.toString() === selectedClient);

    clientsToExport.forEach((client) => {
      const clientProjects = projects.filter((p) => p.clientId === client.id);

      if (clientProjects.length > 0) {
        csvData.push([`${client.firstName} ${client.lastName}`]);
        csvData.push([
          "Project Name",
          "Description",
          "Status",
          "Start Date",
          "End Date",
          "Created At",
        ]);

        let clientTotal = 0;

        clientProjects.forEach((p) => {
          csvData.push([
            p.projectName || "N/A",
            p.description || "N/A",
            p.status || "N/A",
            p.startDate ? new Date(p.startDate).toLocaleDateString() : "N/A",
            p.endDate ? new Date(p.endDate).toLocaleDateString() : "N/A",
            p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A",
          ]);
          clientTotal++;
        });
        csvData.push(["Project Total", clientTotal, "", "", "", ""]);
        csvData.push([]);
        grandTotal += clientTotal;
      }
    });
    if (grandTotal > 0) {
      csvData.push(["GRAND TOTAL", grandTotal, "", "", "", ""]);
    }

    return csvData;
  };

  let exportCSVData = [];

  if (selectedReport === "Projects by Status") {
    exportCSVData = formatProjectsbyStatusCSV();
  } else if (selectedReport === "Overdue Projects") {
    exportCSVData = formatOverdueProjectsCSV();
  } else if (selectedReport === "Projects per Client") {
    exportCSVData = formatProjectsperClientCSV();
  } else if (selectedReport === "Projects This Month") {
    exportCSVData = formatProjectsThisMonthCSV();
  } else {
    exportCSVData = projects;
  }

  const exportPDF = async (data, title) => {
    if (data.length === 0) return alert("No data available to export.");

    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        return new Date(dateString).toISOString().split("T")[0];
      } catch (e) {
        return dateString;
      }
    };
    const isLandscape = ["Total Projects", "Projects This Month"].includes(
      selectedReport
    );
    const doc = new jsPDF(isLandscape ? "landscape" : "portrait", "mm", "a4");
    const setupPage = (pdfDoc) => {
      const template = isLandscape ? landscapeTemplate : AppointmentTemplate;
      pdfDoc.addImage(
        template,
        "JPEG",
        0,
        0,
        pdfDoc.internal.pageSize.getWidth(),
        pdfDoc.internal.pageSize.getHeight()
      );
      pdfDoc.setFont("helvetica", "normal").setFontSize(8);
      return { textX: 14 };
    };

    const addFooter = (pdfDoc) => {
      const currentDate = new Date().toLocaleString();
      const yPos = pdfDoc.internal.pageSize.height - 3;
      pdfDoc.setFontSize(8).setTextColor(100);
      pdfDoc.text(
        `Generated by: ${localStorage.getItem("username") || "System"}`,
        14,
        yPos
      );
      pdfDoc.text(
        `Date Generated: ${currentDate}`,
        pdfDoc.internal.pageSize.width - 60,
        yPos,
        { align: "right" }
      );
    };

    setupPage(doc);
    let startY = 40;

    if (selectedReport === "Total Projects") {
      const headers = [
        [
          "Project Name",
          "Client Name",
          "Description",
          "Status",
          "Project Start",
          "Project End",
          "Date Created",
        ],
      ];
      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text("Projects Overview", 145, startY + 3, { align: "center" });

      autoTable(doc, {
        startY: startY + 13,
        head: headers,
        body: projects.map((p) => [
          p.projectName,
          p.clientName,
          p.description,
          p.status,
          formatDate(p.startDate),
          formatDate(p.endDate),
          formatDate(p.created_at),
        ]),
        styles: { fontSize: 6, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        showHead: "everyPage",
      });
    }
    if (selectedReport === "Projects This Month") {
      const headers = [
        [
          "Project Name",
          "Client Name",
          "Description",
          "Status",
          "Start Date",
          "End Date",
          "Created At",
        ],
      ];

      const currentMonthProjects = projects.filter((p) => {
        const projectDate = new Date(p.startDate);
        return (
          projectDate.getMonth() === new Date().getMonth() &&
          projectDate.getFullYear() === new Date().getFullYear()
        );
      });

      const data = currentMonthProjects.map((p) => [
        p.projectName || "N/A",
        p.clientName || "N/A",
        p.description || "N/A",
        p.status || "N/A",
        p.startDate ? new Date(p.startDate).toLocaleDateString() : "N/A",
        p.endDate ? new Date(p.endDate).toLocaleDateString() : "N/A",
        p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A",
      ]);
      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text("Projects this Month", 145, startY + 3, { align: "center" });

      autoTable(doc, {
        startY: startY + 13,
        head: headers,
        body: data,
        styles: { fontSize: 6, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        showHead: "everyPage",
      });
    }
    if (selectedReport === "Projects by Status") {
      // First page - Chart
      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#project-status .recharts-wrapper"
        );
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 160;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart to first page
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Projects by Status Overview", 105, 45, { align: "center" });

          doc.addImage(
            imgData,
            "PNG",
            (doc.internal.pageSize.getWidth() - imgWidth) / 2,
            50,
            imgWidth,
            imgHeight
          );

          // Add description below chart
          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(
              "This chart shows the distribution of projects by their current status.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Add new page for status details
      doc.addPage();
      setupPage(doc);

      const statuses = ["Pending", "Ongoing", "Completed"];

      statuses.forEach((status, index) => {
        const projectStatus = projects.filter((p) => p.status === status);

        if (projectStatus.length > 0) {
          // Add new page for each status (except first one after chart)
          if (index > 0) {
            doc.addPage();
            setupPage(doc);
          }

          // Reset Y position for new page
          let startY = 40;

          // Add status title
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text(`${status} Projects`, 105, startY, { align: "center" });

          startY += 15;

          // Add table
          const headers = [
            [
              "Project Name",
              "Client Name",
              "Description",
              "Start Date",
              "End Date",
              "Created At",
            ],
          ];

          const data = projectStatus.map((p) => [
            p.projectName,
            p.clientName,
            p.description,
            p.startDate ? new Date(p.startDate).toLocaleDateString() : "N/A",
            p.endDate ? new Date(p.endDate).toLocaleDateString() : "N/A",
            p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A",
          ]);

          autoTable(doc, {
            startY: startY,
            head: headers,
            body: data,
            styles: {
              fontSize: 8,
              cellPadding: 3,
              overflow: "linebreak",
            },
            headStyles: {
              fillColor: [220, 220, 220],
              textColor: [0, 0, 0],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
          });

          // Add status summary
          startY = doc.lastAutoTable.finalY + 10;
          doc
            .setFontSize(10)
            .setTextColor(40)
            .text(
              `Total ${status} Projects: ${projectStatus.length}`,
              14,
              startY
            );

          // Add footer to this page
          addFooter(doc);
        }
      });
    }
    if (selectedReport === "Overdue Projects") {
      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#overdue-projects .recharts-wrapper"
        );
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 160;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart to first page
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Overdue Projects", 105, 45, { align: "center" });

          doc.addImage(
            imgData,
            "PNG",
            (doc.internal.pageSize.getWidth() - imgWidth) / 2,
            50,
            imgWidth,
            imgHeight
          );

          // Add description below chart
          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(
              "This chart shows projects that are delayed, along with the number of days overdue.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Add new page for status details
      doc.addPage();
      setupPage(doc);

      const headers = [
        [
          "Project Name",
          "Client Name",
          "Description",
          "Status",
          "End Date",
          "Days Overdue",
        ],
      ];
      const overdueProjects = projects
        .filter((p) => p.isDelayed === 1)
        .map((p) => [
          p.projectName,
          p.clientName,
          p.description,
          p.status,
          formatDate(p.endDate),
          p.delayedDays, // Ensure this field exists in your backend response
        ]);

      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text("Overdue Projects", 105, startY + 3, {
          align: "center",
        });

      startY += 15;

      autoTable(doc, {
        startY: startY,
        head: headers,
        body: overdueProjects,
        styles: {
          fontSize: 8,
          textColor: [0, 0, 0],
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 15 },
      });
    }
    if (selectedReport === "Projects per Client") {
      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#projects-per-client .recharts-wrapper"
        );
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 200;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart to first page
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Client Project List", 105, 45, { align: "center" });

          doc.addImage(
            imgData,
            "PNG",
            (doc.internal.pageSize.getWidth() - imgWidth) / 2,
            50,
            imgWidth,
            imgHeight
          );

          // Add description below chart
          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(
              " This line chart represents the number of projects associated with each client.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Add new page for status details
      doc.addPage();
      setupPage(doc);

      let grandTotal = 0;
      const clientsToExport =
        selectedClient === "All"
          ? clients
          : clients.filter((c) => c.id.toString() === selectedClient);

      clientsToExport.forEach((client, index) => {
        const clientProjects = projects.filter((p) => p.clientId === client.id);

        if (clientProjects.length > 0) {
          // Add new page for each client (except first one)
          if (index > 0) {
            doc.addPage();
            setupPage(doc); // Re-setup page template
          }

          // Reset Y position for new page
          let startY = 45;

          // Client header
          doc
            .setFontSize(12)
            .setFont("helvetica", "bolditalic")
            .setTextColor(40)
            .text(
              `${client.firstName} ${client.lastName}'s Projects`,
              105,
              startY,
              { align: "center" }
            );

          startY += 20;

          // Projects table
          const headers = [
            [
              "Project Name",
              "Description",
              "Status",
              "Start Date",
              "End Date",
              "Created At",
            ],
          ];

          let clientTotal = 0;
          const data = clientProjects.map((p) => {
            clientTotal++;
            return [
              p.projectName || "N/A",
              p.description || "N/A",
              p.status || "N/A",
              p.startDate ? new Date(p.startDate).toLocaleDateString() : "N/A",
              p.endDate ? new Date(p.endDate).toLocaleDateString() : "N/A",
              p.created_at
                ? new Date(p.created_at).toLocaleDateString()
                : "N/A",
            ];
          });

          autoTable(doc, {
            startY: startY,
            head: headers,
            body: data,
            styles: {
              fontSize: 8,
              cellPadding: 3,
              overflow: "linebreak",
            },
            headStyles: {
              fillColor: [220, 220, 220],
              textColor: [0, 0, 0],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
          });

          // Client summary
          startY = doc.lastAutoTable.finalY + 10;
          doc
            .setFontSize(10)
            .setFont("helvetica", "italic")
            .text(
              `Total Projects for ${client.firstName} ${client.lastName}: ${clientTotal}`,
              14,
              startY
            );

          grandTotal += clientTotal;
        }
      });

      // Add summary page if multiple clients
      if (clientsToExport.length > 1 && grandTotal > 0) {
        doc.addPage();
        setupPage(doc);

        doc
          .setFontSize(16)
          .setFont("helvetica", "bold")
          .setTextColor(40)
          .text("Projects Summary by Client", 105, 40, { align: "center" });

        const summaryHeaders = [["Client Name", "Number of Projects"]];
        const summaryData = clientsToExport.map((client) => {
          const count = projects.filter((p) => p.clientId === client.id).length;
          return [`${client.firstName} ${client.lastName}`, count];
        });
        autoTable(doc, {
          startY: 45,
          head: summaryHeaders,
          body: summaryData,
          styles: { fontSize: 6 },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
        });
        doc
          .setFontSize(10)
          .setFont("helvetica", "bolditalic")
          .text(
            `Overall Total: ${grandTotal} projects`,
            14,
            doc.lastAutoTable.finalY + 15
          );
      }
    }
    for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
      doc.setPage(i);
      addFooter(doc);
    }

    doc.save(`${selectedReport.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };

  return (
    <div className="project-p-4">
      {/* Filters */}
      <div className="filter-container">
        <select
          className="filter-select"
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option>Years</option>
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
          <option>Months</option>
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
            <option value="Total Projects">Total Projects</option>
            <option value="Projects This Month">Projects This Month</option>
            <option value="Projects by Status">Projects by Status</option>
            <option value="Overdue Projects">Overdue Projects</option>
            <option value="Projects per Client">Projects per Client</option>
          </select>
          {selectedReport === "Projects per Client" && (
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
                className="export-button"
              >
                Export CSV
              </CSVLink>
              <button onClick={exportPDF} className="export-button">
                Export PDF
              </button>
            </>
          )}
        </div>
      </div>
      {/* Summary Section */}
      <div className="summary-container">
        <div className="summary-box">
          <h3 className="summary-title">Total Projects</h3>
          <p className="summary-value">{totalProjects}</p>
        </div>
        <div className="summary-box">
          <h3 className="summary-title">Projects This Month</h3>
          <p className="summary-value">{projectsThisMonth}</p>
        </div>
      </div>
      <div className="project-charts-container">
        {/* Projects by Status */}
        <div className="project-chart-box" id="project-status">
          <h3>Projects by Status</h3>
          <p>
            This chart displays the total number of projects categorized by
            their current status.
          </p>
          <BarChart width={750} height={400} data={projectStatusCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </div>

        {/* Overdue Projects */}
        <div className="project-chart-box" id="overdue-projects">
          <h3>Overdue Projects</h3>
          <p>
            This chart shows projects that are delayed, along with the number of
            days overdue.
          </p>
          <BarChart width={750} height={400} data={delayedProjects}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="daysDelayed" fill="#FF0000" name="Days Delayed" />
          </BarChart>
        </div>
      </div>
      <div
        className="project-charts-container"
        id="projects-per-client"
        ref={clientChartRef}
      >
        <div className="chart-card">
          <h3>Projects per Client</h3>
          <p className="chart-description">
            This line chart represents the number of projects associated with
            each client.
          </p>

          <LineChart
            width={1600}
            height={400}
            data={projectsByClient}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-37}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              name="Number of projects"
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default ProjectReports;
