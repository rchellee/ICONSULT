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

  const today = new Date();
  const formatDate = (dateString, format) => {
    const date = new Date(dateString);
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

    if (format === "year") return date.getFullYear().toString();
    if (format === "month") return months[date.getMonth()]; // Convert to month name
    return date.toLocaleDateString("en-US");
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
    let csvData = [["Projects per Client"]]; // Title row

    clients.forEach((client) => {
      const clientProjects = projects.filter((p) => p.clientId === client.id);

      if (clientProjects.length > 0) {
        csvData.push([client.firstName + " " + client.lastName]); // Client name
        csvData.push([
          "Project Name",
          "Description",
          "Start Date",
          "End Date",
          "Created At",
        ]); // Column headers

        clientProjects.forEach((p) => {
          csvData.push([
            p.projectName,
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

  let exportCSVData = [];

  if (selectedReport === "Projects by Status") {
    exportCSVData = formatProjectsbyStatusCSV();
  } else if (selectedReport === "Overdue Projects") {
    exportCSVData = formatOverdueProjectsCSV();
  } else if (selectedReport === "Projects per Client") {
    exportCSVData = formatProjectsperClientCSV();
  } else {
    exportCSVData = projects;
  }

  const exportPDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4");
    doc.setFontSize(10);
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

    if (selectedReport === "Total Projects") {
      const headers = [
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
      ];
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
        head: headers,
        body: data,
        styles: { fontSize: 8 },
      });
    }

    if (selectedReport === "Projects by Status") {
      const statuses = ["Pending", "Ongoing", "Completed"];

      statuses.forEach((status) => {
        const projectStatus = projects.filter((p) => p.status === status);

        if (projectStatus.length > 0) {
          doc.setFontSize(12);
          doc.text(status, 10, yPos);
          yPos += 10;

          const headers = [
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
          ];
          const data = projectStatus.map((p) => [
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
            head: headers,
            body: data,
            styles: { fontSize: 8 },
          });
          yPos = doc.lastAutoTable.finalY + 10;
        }
      });
    }

    if (selectedReport === "Overdue Projects") {
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
          p.endDate,
          p.delayedDays, // Ensure this field exists in your backend response
        ]);

      autoTable(doc, {
        startY: yPos,
        head: headers,
        body: overdueProjects,
        styles: { fontSize: 8 },
      });
    }

    if (selectedReport === "Projects per Client") {
      clients.forEach((client) => {
        const clientProjects = projects.filter((p) => p.clientId === client.id);

        if (clientProjects.length > 0) {
          doc.setFontSize(12);
          doc.text(`${client.firstName} ${client.lastName}`, 10, yPos);
          yPos += 10;

          const headers = [
            [
              "Project Name",
              "Description",
              "Start Date",
              "End Date",
              "Created At",
            ],
          ];
          const data = clientProjects.map((p) => [
            p.projectName,
            p.description,
            p.startDate,
            p.endDate,
            p.created_at,
          ]);

          autoTable(doc, {
            startY: yPos,
            head: headers,
            body: data,
            styles: { fontSize: 8 },
          });
          yPos = doc.lastAutoTable.finalY + 10;
        }
      });
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
            <option value="Projects by Status">Projects by Status</option>
            <option value="Overdue Projects">Overdue Projects</option>
            <option value="Projects per Client">Projects per Client</option>
          </select>
          {selectedReport && (
            <>
              <CSVLink
                data={exportCSVData}
                filename={`${selectedReport
                  .replace(/\s+/g, "_")
                  .toLowerCase()}.csv`}
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
      </div>
      <div className="project-charts-container">
        {/* Projects by Status */}
        <div className="project-chart-box">
          <h3>Projects by Status</h3>
          <p>
            This chart displays the total number of projects categorized by
            their current status.
          </p>
          <BarChart width={800} height={400} data={projectStatusCounts}>
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
          <BarChart width={800} height={400} data={delayedProjects}>
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
            width={1700}
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
