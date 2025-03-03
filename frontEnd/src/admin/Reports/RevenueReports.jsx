import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

const RevenueReports = () => {
  const [revenues, setRevenues] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    clientId: "",
    projectId: "",
  });

  useEffect(() => {
    fetchClients();
    fetchProjects();
    fetchRevenues();
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
      const response = await axios.get("http://localhost:8081/projects");
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const fetchRevenues = async () => {
    try {
      const response = await axios.get("http://localhost:8081/revenueReports", {
        params: filters,
      });
      setRevenues(response.data);
    } catch (error) {
      console.error("Error fetching revenue data", error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Revenue Report", 10, 10);
    html2canvas(document.getElementById("revenue-chart")).then((canvas) => {
      doc.addImage(canvas.toDataURL("image/png"), "PNG", 10, 20, 180, 100);
      doc.save("revenue-report.pdf");
    });
  };

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
  const revenueByClient = clients.map((client) => ({
    name: `${client.firstName} ${client.lastName}`,
    value: revenues.filter((r) => r.clientId === client.id).reduce((sum, r) => sum + r.amount, 0),
  }));
  
  const revenueByProject = projects.map((project) => ({
    name: project.name,
    value: revenues.filter((r) => r.projectId === project.id).reduce((sum, r) => sum + r.amount, 0),
  }));

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <input type="date" className="border p-2" onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        <input type="date" className="border p-2" onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
        <select className="border p-2" onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}>
          <option value="">All Clients</option>
          {clients.map((client) => <option key={client.id} value={client.id}>{client.firstName} {client.lastName}</option>)}
        </select>
        <select className="border p-2" onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}>
          <option value="">All Projects</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
      </div>

      <div id="revenue-summary" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Total Revenue: ${totalRevenue.toFixed(2)}</h3>
      </div>

      <div id="revenue-chart" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Revenue by Client</h3>
        <PieChart width={800} height={400}>
          <Pie data={revenueByClient} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150}>
            {revenueByClient.map((entry, index) => <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d"][index % 2]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div id="revenue-project-chart" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Revenue by Project</h3>
        <BarChart width={800} height={400} data={revenueByProject}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#82ca9d" />
        </BarChart>
      </div>

      <div className="mt-4 flex space-x-4">
        <CSVLink data={revenues} filename="revenue-report.csv" className="bg-green-500 text-white px-4 py-2 rounded">Export CSV</CSVLink>
        <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded">Export PDF</button>
      </div>
    </div>
  );
};

export default RevenueReports;
