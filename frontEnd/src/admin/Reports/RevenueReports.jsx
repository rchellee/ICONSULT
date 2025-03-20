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
    month: "All",
    year: new Date().getFullYear(),
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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

  const paymentsStatus = [
    { name: "Received", value: 120000 },
    { name: "Pending", value: 40000 },
  ];

  // Mock Clients for Payments per Client Bar Graph
  const paymentsPerClient = [
    { name: "John Doe", amount: 50000 },
    { name: "Jane Smith", amount: 42000 },
    { name: "Michael Johnson", amount: 35000 },
    { name: "Emily Davis", amount: 27000 },
    { name: "Chris Brown", amount: 63000 },
  ];

  const totalPerProject = projects.length
    ? projects.map((project) => ({
        name: project.name,
        value: Math.floor(Math.random() * 70000) + 20000,
      }))
    : [{ name: "No Data", value: 0 }];

  const receivedVsRemaining = projects.length
    ? projects.map((project) => ({
        name: project.name,
        received: Math.floor(Math.random() * 50000) + 10000,
        remaining: Math.floor(Math.random() * 30000),
      }))
    : [{ name: "No Data", received: 0, remaining: 0 }];

  const overduePayments = [
    { name: "Paid", value: 90000 },
    { name: "Overdue", value: 30000 },
  ];

  return (
    <div className="revenue-p-4">
      {/* Sorting Buttons */}
      <div className="revenue-filter-buttons">
        <select
          value={filters.year}
          onChange={(e) => setFilters({ ...filters, year: e.target.value })}
        >
          <option value="All">Year</option>
          {[2023, 2024, 2025].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
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
      </div>

      {/* Revenue Summary */}
      <div id="revenue-summary" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Total Revenue: ${totalRevenue.toFixed(2)}</h3>
      </div>

      {/* Export Buttons */}
      <div className="mt-4 flex space-x-4">
        <CSVLink data={revenues} filename="revenue-report.csv" className="bg-green-500 text-white px-4 py-2 rounded">
          Export CSV
        </CSVLink>
        <button onClick={exportPDF} className="bg-red-500 text-white px-4 py-2 rounded">
          Export PDF
        </button>
      </div>

      {/* Reports Grid */}
      <div className="revenue-grid">
        <div className="chart-container">
          <h3>Pending Payments vs. Received Payments</h3>
          <PieChart width={400} height={300}>
            <Pie data={paymentsStatus} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
              {paymentsStatus.map((entry, index) => (
                <Cell key={index} fill={["#4CAF50", "#FF5252"][index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
          {/* Overdue Payments */}
    <div className="chart-container">
    <h3>Overdue Payments</h3>
    <PieChart width={400} height={300}>
      <Pie data={overduePayments} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
        {overduePayments.map((entry, index) => (
          <Cell key={index} fill={["#4CAF50", "#FF5252"][index]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </div>

    {/* Total Revenue per Project */}
    <div className="chart-container">
    <h3>Total Revenue per Project</h3>
    <BarChart width={700} height={400} data={totalPerProject}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill="#82ca9d" />
    </BarChart>
  </div>

    {/* Payment Received vs. Remaining Balances */}
    <div className="chart-container scrollable-chart">
    <h3>Payment Received vs. Remaining Balances</h3>
    <BarChart width={700} height={400} data={receivedVsRemaining}>
    <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="received" fill="#4CAF50" />
      <Bar dataKey="remaining" fill="#FF5252" />
    </BarChart>
  </div>
  </div>

        <div className="chart-container scrollable-chart">
          <h3>Payments per Client</h3>
          <BarChart width={1100} height={400} data={paymentsPerClient}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </div>
      </div>
    
  );
};

export default RevenueReports;
