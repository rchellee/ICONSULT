import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
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
  LineChart,
  Line
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/dropdown-menu";
import Button from "../../components/button";
import { Download } from "lucide-react";
import "./ReportsTab.css";

const ClientsReports = () => {
  const [clients, setClients] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8081/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  };

  const exportPDF = (data, title) => {
    const doc = new jsPDF();
    doc.text(title, 20, 10);
    doc.autoTable({ html: "#clients-table" });
    doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };

  const activeClients = clients.filter((c) => c.status === "active").length;
  const inactiveClients = clients.filter((c) => c.status === "inactive").length;
  const newClientsThisMonth = clients.filter(
    (c) => new Date(c.created_at).getMonth() === new Date().getMonth()
  ).length;

  const clientsByAge = [
    {
      name: "18-25",
      value: clients.filter((c) => c.age >= 18 && c.age <= 25).length,
    },
    {
      name: "26-35",
      value: clients.filter((c) => c.age >= 26 && c.age <= 35).length,
    },
    {
      name: "36-50",
      value: clients.filter((c) => c.age >= 36 && c.age <= 50).length,
    },
    { name: "51+", value: clients.filter((c) => c.age > 50).length },
  ];

  const clientsByGender = [
    { name: "Male", value: clients.filter((c) => c.gender === "Male").length },
    {
      name: "Female",
      value: clients.filter((c) => c.gender === "Female").length,
    },
  ];

  const clientsByStatus = [
    { name: "Active", value: activeClients },
    { name: "Inactive", value: inactiveClients },
  ];

  const clientsByMonth = Array.from({ length: 12 }, (_, index) => {
    return {
      month: new Date(0, index).toLocaleString("default", { month: "short" }),
      value: clients.filter(
        (c) => new Date(c.created_at).getFullYear() === selectedYear &&
              new Date(c.created_at).getMonth() === index
      ).length,
    };
  });

  const exportDropdown = (data, title) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-2 flex items-center">
          {title} <Download className="ml-1" size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <CSVLink
            data={data}
            filename={`${title.replace(/\s+/g, "_").toLowerCase()}.csv`}
          >
            Export CSV
          </CSVLink>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportPDF(data, title)}>
          Export PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Clients Reports</h2>
      <div className="flex space-x-4 mb-4">
        <input
          type="date"
          className="border p-2"
          onChange={(e) =>
            setFilters({ ...filters, startDate: e.target.value })
          }
        />
        <input
          type="date"
          className="border p-2"
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
        />
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
        <div className="bg-white p-4 shadow rounded-lg flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Total Clients: {clients.length} {exportDropdown(clients, "Export")}
          </h3>
          {exportDropdown(clients, "Export")}
        </div>
        <div className="bg-white p-4 shadow rounded-lg flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            New Clients This Month: {newClientsThisMonth}
          </h3>
          {exportDropdown(clients, "Export")}
        </div>
      </div>
      <div className="mb-4">
        <label className="mr-2">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border p-2"
        >
          {[...new Set(clients.map(c => new Date(c.created_at).getFullYear()))]
            .sort((a, b) => b - a)
            .map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
        </select>
      </div>
      
      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">New Clients Per Month ({selectedYear})</h3>
        <LineChart width={1450} height={300} data={clientsByMonth}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </div>

      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Clients by Age</h3>
        <BarChart width={500} height={300} data={clientsByAge}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </div>

      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Clients by Gender</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={clientsByGender}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {clientsByGender.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={["#8884d8", "#82ca9d"][index]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

      <div className="bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Active vs Inactive Clients</h3>
        <PieChart width={400} height={300}>
          <Pie
            data={clientsByStatus}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
          >
            {clientsByStatus.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={["#8884d8", "#FF8042"][index]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>

    </div>
  );
};

export default ClientsReports;
