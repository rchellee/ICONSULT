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

const ClientsReports = () => {
  const [clients, setClients] = useState([]);
  const [filters, setFilters] = useState({ status: "" });

  useEffect(() => {
    fetchClients();
  }, [filters]);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8081/clients", {
        params: { status: filters.status },
      });
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Clients Report", 20, 10);
    doc.autoTable({ html: "#clients-table" });
    doc.save("clients-report.pdf");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Clients Reports</h2>
      <div className="flex space-x-4 mb-4">
        <select
          className="border p-2"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      <div id="clients-summary" className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Total Clients: {clients.length}</h3>
      </div>

      <div className="mt-4 flex space-x-4">
        <CSVLink
          data={clients}
          filename="clients-report.csv"
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
    </div>
  );
};

export default ClientsReports;
