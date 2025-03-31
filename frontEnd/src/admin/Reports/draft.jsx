import React, { useState, useEffect } from "react";
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

 const exportPDF = async () => {
     const isLandscape = ["Total Projects", "Projects This Month"].includes(
       selectedReport
     );
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
 
     const chartHandlers = {
       "Projects by Status": {
         selector: "#project-status .recharts-wrapper",
         processor: async (dataDoc, textX) => {
           let contentY = 50;
           const statuses = ["Pending", "Ongoing", "Completed"];
           statuses.forEach((status) => {
             const projectStatus = projects.filter((p) => p.status === status);
 
             if (projectStatus.length > 0) {
               doc.setFontSize(12);
               doc.text(status, 10, contentY);
               contentY += 10;
 
               autoTable(dataDoc, {
                 startY: contentY,
                 head: [
                   [
                     "Project Name",
                     "Client Name",
                     "Description",
                     "Status",
                     "Project Start",
                     "Project End",
                     "Actual Finish",
                     "Date Created",
                   ],
                 ],
                 body: projectStatus.map((p) => [
                   p.projectName,
                   p.clientName,
                   p.description,
                   p.status,
                   p.startDate,
                   p.endDate,
                   p.actualFinish,
                   p.created_at,
                 ]),
                 styles: { fontSize: 8, textColor: [0, 0, 0] },
                 headStyles: {
                   fillColor: [255, 255, 255],
                   textColor: [0, 0, 0],
                 },
               });
               contentY = dataDoc.lastAutoTable.finalY + 15;
             }
           });
         },
       },
       "Projects per Client": {
         selector: "#projects-per-client .recharts-surface",
         processor: async (dataDoc, textX) => {
           let contentY = 50;
           let grandTotal = 0;
           const clientsToExport =
             selectedClient === "All"
               ? clients
               : clients.filter((c) => c.id.toString() === selectedClient);
           clientsToExport.forEach((client) => {
             const clientProjects = projects.filter(
               (p) => p.clientId === client.id
             );
             if (clientProjects.length > 0) {
               doc.setFontSize(12);
               doc.setFont("helvetica", "bolditalic");
               doc.text(`${client.firstName} ${client.lastName}`, 8, contentY);
               contentY += 8;
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
                   p.startDate
                     ? new Date(p.startDate).toLocaleDateString()
                     : "N/A",
                   p.endDate ? new Date(p.endDate).toLocaleDateString() : "N/A",
                   p.created_at
                     ? new Date(p.created_at).toLocaleDateString()
                     : "N/A",
                 ];
               });
 
               autoTable(dataDoc, {
                 startY: contentY,
                 head: headers,
                 body: data,
                 styles: { fontSize: 8, textColor: [0, 0, 0] },
                 headStyles: {
                   fillColor: [255, 255, 255],
                   textColor: [0, 0, 0],
                 },
               });
               contentY = dataDoc.lastAutoTable.finalY + 8;
               doc.text(`Project Total: ${clientTotal}`, 10, contentY);
               contentY += 15;
               grandTotal += clientTotal;
             }
           });
           if (grandTotal > 0) {
             doc.setFontSize(12);
             doc.setFont("helvetica", "bold");
             doc.text(`GRAND TOTAL: ${grandTotal}`, 10, contentY);
             doc.setFont("helvetica", "normal");
           }
         },
       },
       "Consultation Type Overview": {
         selector: "#overdue-projects .recharts-surface",
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
       "Total Projects": () => {
         const data = projects.map((p) => [
           p.projectName,
           p.clientName,
           p.description,
           p.status,
           p.startDate,
           p.endDate,
           p.actualFinish,
           p.created_at,
         ]);
         autoTable(doc, {
           startY: yPos,
           head: [
             [
               "Project Name",
               "Client Name",
               "Description",
               "Status",
               "Project Start",
               "Project End",
               "Actual Finish",
               "Date Created",
             ],
           ],
           body: data,
           styles: { fontSize: 8, textColor: [0, 0, 0] },
           headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
           showHead: "everyPage",
         });
       },
       "Projects This Month": () => {
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
         autoTable(doc, {
           startY: yPos,
           head: [
             [
               "Project Name",
               "Client Name",
               "Description",
               "Status",
               "Start Date",
               "End Date",
               "Created At",
             ],
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
        <div className="project-chart-box">
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
        <div className="project-chart-box">
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
      <div className="project-charts-container">
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
              angle={-15}
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
