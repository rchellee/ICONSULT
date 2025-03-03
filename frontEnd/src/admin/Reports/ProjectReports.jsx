import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import "./ReportsTab.css";

const ProjectReports = () => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    clientId: "",
  });

  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, [filters]);

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
          startDate: filters.startDate,
          endDate: filters.endDate,
          clientId: filters.clientId,
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
    html2canvas(document.getElementById("project-summary"), { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 10, 30, 180, 0);
      doc.save("project-report.pdf");
    });
  };

  const filteredProjects = filters.clientId
    ? projects.filter((p) => p.client_id == filters.clientId)
    : projects;

  const totalProjects = filteredProjects.length;
  const projectsByClient = clients.map((client) => ({
    name: `${client.firstName} ${client.lastName}`,
    value: filteredProjects.filter((p) => p.client_id === client.id).length,
  }));

  const projectStatusCounts = ["Completed", "Ongoing", "Pending"].map((status) => ({
    name: status,
    value: filteredProjects.filter((p) => p.status === status).length,
  }));

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <input type="date" className="border p-2" onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        <input type="date" className="border p-2" onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
        <select className="border p-2" value={filters.clientId} onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}>
          <option value="">All Clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.firstName} {client.lastName}
            </option>
          ))}
        </select>
      </div>

      <div id="project-summary" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Total Projects: {totalProjects}</h3>
      </div>

      <div id="projects-client" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Projects per Client</h3>
        <PieChart width={1000} height={500}>
          <Pie data={projectsByClient} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={250}>
            {projectsByClient.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d"][index % 2]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
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

      <div className="mt-4 flex space-x-4">
        <CSVLink data={projects} filename="project-report.csv" className="bg-green-500 text-white px-4 py-2 rounded">
          Export CSV
        </CSVLink>
        <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded">
          Export PDF
        </button>
      </div>
    </div>
  );
};

export default ProjectReports;
