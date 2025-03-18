import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
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
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    clientId: "",
    year: "2025", // Default to 2025 when toggled to month
  });

  const [viewMode, setViewMode] = useState("month");

  useEffect(() => {
    fetchClients();
    fetchProjects(); // Fetch projects without year affecting all data
  }, [filters.startDate, filters.endDate, filters.clientId]); // Removed filters.year

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
          startDate: filters.startDate
            ? new Date(filters.startDate).toISOString().split("T")[0]
            : "",
          endDate: filters.endDate
            ? new Date(filters.endDate).toISOString().split("T")[0]
            : "",
          clientId: filters.clientId,
          year: viewMode === "month" ? filters.year : "",
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Project Report", 20, 10);
    html2canvas(document.getElementById("project-summary"), { scale: 2 }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 30, 180, 0);
        doc.save("project-report.pdf");
      }
    );
  };

  const filteredProjects = projects.filter((p) => {
    const projectStart = new Date(p.startDate);
    const projectEnd = new Date(p.endDate);
    const filterStart = filters.startDate ? new Date(filters.startDate) : null;
    const filterEnd = filters.endDate ? new Date(filters.endDate) : null;

    return (
      (!filterStart || projectStart >= filterStart) &&
      (!filterEnd || projectEnd <= filterEnd)
    );
  });

  const totalProjects = filteredProjects.length;
  const projectsByClient = clients
    .map((client) => ({
      name: `${client.firstName} ${client.lastName}`,
      value: filteredProjects.filter((p) => p.clientId === client.id).length,
    }))
    .filter((entry) => entry.value > 0); // Remove clients with 0 projects

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
  const categorizePaymentStatus = (project) => {
    const endDate = new Date(project.endDate);
    if (project.paymentStatus === "Paid") return null; // Exclude fully paid projects
    if (endDate < today) return "Overdue";
    if ((endDate - today) / (1000 * 60 * 60 * 24) <= 14) return "Due Soon";
    return "Not Paid";
  };

  const paymentDueProjects = projects
    .map((p) => {
      const category = categorizePaymentStatus(p);
      return category
        ? { name: p.projectName, status: category, endDate: formatDate(p.endDate) }
        : null;
    })
    .filter(Boolean);

  return (
    <div className="p-4">
   {/* Export Buttons */}
   <div className="export-buttons">
    <CSVLink
      data={projects}
      filename="project-report.csv"
      className="bg-green-500 text-white px-4 py-2 rounded"
    >
      Export CSV
    </CSVLink>
    <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded">
      Export PDF
    </button>
  </div>

        {/* Filters */}
  <div className="project-filter-container">
    <input
      type="date"
      className="project-filter-input"
      value={filters.startDate}
      onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
    />
    <input
      type="date"
      className="project-filter-input"
      value={filters.endDate}
      onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
    />
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
    <h3 className="project-chart-title">Projects by Status</h3>
    <BarChart width={500} height={300} data={projectStatusCounts}>
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
    <h3 className="project-chart-title">Overdue Projects</h3>
    <BarChart width={500} height={300} data={delayedProjects}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="daysDelayed" fill="#FF0000" name="Days Delayed" />
    </BarChart>
  </div>

  <div className="chart-row">
    {/* Projects per Client (Smaller) */}
    <div className="project-chart-box small-chart">
      <h3 className="project-chart-title">Projects per Client</h3>
      <PieChart width={400} height={300}>
        <Pie data={projectsByClient} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
          {projectsByClient.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d"][index % 2]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>

    {/* Payment Due Status (Bigger) */}
    <div className="project-chart-box large-chart">
      <h3 className="project-chart-title">Payment Due Status</h3>
      <LineChart width={900} height={300} data={paymentDueProjects}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-15} textAnchor="end" />
        <YAxis type="category" dataKey="status" />
        <Tooltip formatter={(value, name, props) => [`${value}`, `Due Date: ${props.payload.endDate}`]} />
        <Legend />
        <Line type="monotone" dataKey="status" stroke="#FF0000" name="Status" dot={{ r: 0 }} />
      </LineChart>
    </div>
  </div>
</div>
</div>

  );
};

export default ProjectReports;
