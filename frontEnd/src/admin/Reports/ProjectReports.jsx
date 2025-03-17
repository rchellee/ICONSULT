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

  const fetchPaymentDeadlines = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/paymentDeadlines",
        {
          params: { year: filters.year }, // Fetch payment deadlines only
        }
      );
      setPaymentDeadlines(response.data);
    } catch (error) {
      console.error("Error fetching payment deadlines", error);
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

  const paymentDueProjects = projects
    .filter((p) => p.paymentStatus !== "Paid")
    .map((p) => ({
      name: p.projectName,
      categoryIndex:
        p.dueCategory === "Overdue"
          ? 2
          : p.dueCategory === "Due in 1-2 Weeks"
          ? 1
          : 0, // Assign numeric index
      dueDate: p.paymentDueDate, // Use the correct field from backend
      overdueDays:
        p.dueCategory === "Overdue"
          ? Math.ceil(
              (new Date() - new Date(p.paymentDueDate)) / (1000 * 60 * 60 * 24)
            )
          : 0,
      daysRemaining:
        p.dueCategory === "Due in 1-2 Weeks"
          ? Math.ceil(
              (new Date(p.paymentDueDate) - new Date()) / (1000 * 60 * 60 * 24)
            )
          : 0,
    }));

  const paymentStatusCounts = ["Paid", "Not Paid", "Partial Payment"].map(
    (status) => ({
      name: status,
      count: projects.filter((p) => p.paymentStatus === status).length,
    })
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Project Reports</h2>
      <div className="mt-4 flex space-x-4">
        <CSVLink
          data={projects}
          filename="project-report.csv"
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
      </div>
      <input
        type="date"
        className="border p-2"
        value={filters.startDate}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, startDate: e.target.value }))
        }
      />
      <input
        type="date"
        className="border p-2"
        value={filters.endDate}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, endDate: e.target.value }))
        }
      />

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">Total Projects</h3>
          <p className="text-xl font-bold">{totalProjects}</p>
        </div>
      </div>

      <div id="projects-status" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Projects by Status</h3>
        <BarChart width={1000} height={500} data={projectStatusCounts}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>

      <div
        id="delayed-projects-chart"
        className="bg-white p-4 shadow rounded-lg mt-4"
      >
        <h3 className="text-lg font-semibold">Overdue Projects</h3>
        <BarChart width={600} height={300} data={delayedProjects}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="daysDelayed" fill="#FF0000" name="Days Delayed" />
        </BarChart>
      </div>

      <div id="projects-client" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Projects per Client</h3>
        <PieChart width={1000} height={500}>
          <Pie
            data={projectsByClient}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={250}
          >
            {projectsByClient.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={["#8884d8", "#82ca9d"][index % 2]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div
        id="payment-due-chart"
        className="bg-white p-4 shadow rounded-lg mt-4"
      >
        <h3 className="text-lg font-semibold">Payment Due Status</h3>
        <LineChart width={1500} height={400} data={projects}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="projectName" angle={-15} textAnchor="end" />
          <YAxis type="category" dataKey="paymentStatus" />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="paymentStatus"
            stroke="#FF0000"
            name="Status"
          />
          <Line type="monotone" dataKey="endDate" stroke="#82ca9d" name="Due" />
        </LineChart>
      </div>
    </div>
  );
};

export default ProjectReports;
