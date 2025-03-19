import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
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
  Line,
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
  const [clientProjects, setClientProjects] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
  });
  const chartRef = useRef(null);

  useEffect(() => {
    fetchClients();
    fetchClientsWithProjects();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8081/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  };

  const fetchClientsWithProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8081/clientsReports");
      setClientProjects(response.data);
    } catch (error) {
      console.error("Error fetching clients with projects", error);
    }
  };

  const groupClientsByAgeRange = () => {
    return {
      "18-25": clients.filter((c) => c.age >= 18 && c.age <= 25),
      "26-35": clients.filter((c) => c.age >= 26 && c.age <= 35),
      "36-50": clients.filter((c) => c.age >= 36 && c.age <= 50),
      "51+": clients.filter((c) => c.age > 50),
    };
  };

  const activeClients = clients.filter((c) => c.status === "active");
  const inactiveClients = clients.filter((c) => c.status === "inactive");
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
    { name: "Active", value: activeClients.length },
    { name: "Inactive", value: inactiveClients.length },
  ];

  const clientsByMonth = Array.from({ length: 12 }, (_, index) => {
    return {
      month: new Date(0, index).toLocaleString("default", { month: "short" }),
      value: clients.filter(
        (c) =>
          new Date(c.created_at).getFullYear() === selectedYear &&
          new Date(c.created_at).getMonth() === index
      ).length,
    };
  });

  const exportPDF = async (data, title) => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    doc.text(title, 14, 10);

    // Extract headers dynamically
    const headers = Object.keys(data[0]).map((key) => ({
      header: key.replace(/_/g, " "), // Replace underscores with spaces
      dataKey: key,
    }));

    if (title.includes("Clients by Age")) {
      const groupedClients = groupClientsByAgeRange();
      Object.keys(groupedClients).forEach((ageRange, index) => {
        if (index > 0) doc.addPage();
        doc.text(`Age Range: ${ageRange}`, 14, 20);

        const clientData = groupedClients[ageRange];
        if (clientData.length > 0) {
          autoTable(doc, {
            head: [["ID", "Name", "Age", "Comapny Name", "Email"]],
            body: clientData.map((c) => [
              c.id,
              `${c.firstName} ${c.lastName}`,
              c.age,
              c.companyName,
              c.email_add,
            ]),
            startY: 30,
            theme: "grid",
          });
        } else {
          doc.text("No clients in this range.", 14, 30);
        }
      });
    } else if (title.includes("Clients by Gender")) {
      // Male Clients
      const maleClients = clients.filter((c) => c.gender === "Male");
      doc.text("Male Clients", 14, 20);
      if (maleClients.length > 0) {
        autoTable(doc, {
          head: [["ID", "Name", "Age", "Company Name", "Email"]],
          body: maleClients.map((c) => [
            c.id,
            `${c.firstName} ${c.lastName}`,
            c.age,
            c.companyName,
            c.email_add,
          ]),
          startY: 30,
          theme: "grid",
        });
      } else {
        doc.text("No Male Clients.", 14, 30);
      }

      doc.addPage();

      // Female Clients
      const femaleClients = clients.filter((c) => c.gender === "Female");
      doc.text("Female Clients", 14, 20);
      if (femaleClients.length > 0) {
        autoTable(doc, {
          head: [["ID", "Name", "Age", "Company Name", "Email"]],
          body: femaleClients.map((c) => [
            c.id,
            `${c.firstName} ${c.lastName}`,
            c.age,
            c.companyName,
            c.email_add,
          ]),
          startY: 30,
          theme: "grid",
        });
      } else {
        doc.text("No Female Clients.", 14, 30);
      }
    } else if (title.includes("Active vs Inactive Clients")) {
      doc.text("Active Clients", 14, 20);
      if (activeClients.length > 0) {
        autoTable(doc, {
          head: [["ID", "Name", "Age", "Company Name", "Email"]],
          body: activeClients.map((c) => [
            c.id,
            `${c.firstName} ${c.lastName}`,
            c.age,
            c.companyName,
            c.email_add,
          ]),
          startY: 30,
          theme: "grid",
        });
      } else {
        doc.text("No Active Clients.", 14, 30);
      }

      doc.addPage();
      doc.text("Inactive Clients", 14, 20);
      if (inactiveClients.length > 0) {
        autoTable(doc, {
          head: [["ID", "Name", "Age", "Company Name", "Email"]],
          body: inactiveClients.map((c) => [
            c.id,
            `${c.firstName} ${c.lastName}`,
            c.age,
            c.companyName,
            c.email_add,
          ]),
          startY: 30,
          theme: "grid",
        });
      } else {
        doc.text("No Inactive Clients.", 14, 30);
      }
    } else if (title.includes("Client Projects")) {
      doc.text("Client Projects", 14, 20);

      autoTable(doc, {
        head: [["ID", "First Name", "Last Name", "Projects"]],
        body: data.map((client) => [
          client.id,
          client.firstName,
          client.lastName,
          client.projects.map((p) => p.projectName).join(", "), // Extract project names
        ]),
        startY: 20,
        theme: "grid",
      });
    } else {
      // General Table Export
      const headers = Object.keys(data[0]).map((key) => ({
        header: key.replace(/_/g, " "),
        dataKey: key,
      }));
      autoTable(doc, {
        head: [headers.map((h) => h.header)], // Table headers
        body: data.map((row) =>
          headers.map((h) => (row[h.dataKey] !== null ? row[h.dataKey] : "N/A"))
        ), // Replace null values with "N/A"
        startY: 20,
        styles: { fontSize: 6, cellWidth: "wrap" }, // Adjust text size & wrap
        columnStyles: {
          0: { cellWidth: 6 }, // Adjust first column width
          1: { cellWidth: 13 },
          2: { cellWidth: 13 },
          3: { cellWidth: 12 },
          4: { cellWidth: 11 },
          5: { cellWidth: 30 },
          6: { cellWidth: 16 },
          7: { cellWidth: 16 },
          8: { cellWidth: 16 },
          9: { cellWidth: 12 },
          10: { cellWidth: 14 },
          11: { cellWidth: 9 },
          12: { cellWidth: 15 },
          13: { cellWidth: 7 },
          14: { cellWidth: 15 },
          15: { cellWidth: 16 },
          16: { cellWidth: 10 },
          17: { cellWidth: 12 },
          18: { cellWidth: 16 },
          19: { cellWidth: 16 },
        },
        margin: { top: 20 },
        theme: "grid",
      });
    }

    if (chartRef.current) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500)); // Ensure chart is rendered
        const canvas = await html2canvas(chartRef.current, { scale: 3 });
        const imgData = canvas.toDataURL("image/png");

        doc.addPage();
        doc.addImage(imgData, "PNG", 10, 10, 400, 150); // Adjust image size
      } catch (error) {
        console.error("Error capturing chart:", error);
      }
    }

    doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };

  const exportCSVData = () => {
    const groupedClients = groupClientsByAgeRange();
    let csvData = [];

    Object.keys(groupedClients).forEach((ageRange) => {
      csvData.push([`Age Range: ${ageRange}`]);
      csvData.push(["ID", "Name", "Age", "Company Name", "Email"]);
      groupedClients[ageRange].forEach((c) => {
        csvData.push([
          c.id,
          `${c.firstName} ${c.lastName}`,
          c.age,
          c.companyName,
          c.email_add,
        ]);
      });
      csvData.push([]);
    });

    return csvData;
  };

  const exportGenderCSVData = () => {
    let csvData = [];

    // Male Clients
    csvData.push(["Male Clients"]);
    csvData.push([
      "ID",
      "First Name",
      "Last Name",
      "Age",
      "Company Name",
      "Email",
    ]);
    clients
      .filter((c) => c.gender === "Male")
      .forEach((c) => {
        csvData.push([
          c.id,
          c.firstName,
          c.lastName,
          c.age,
          c.companyName,
          c.email_add,
        ]);
      });
    csvData.push([]); // Empty row for spacing

    // Female Clients
    csvData.push(["Female Clients"]);
    csvData.push([
      "ID",
      "First Name",
      "Last Name",
      "Age",
      "Company Name",
      "Email",
    ]);
    clients
      .filter((c) => c.gender === "Female")
      .forEach((c) => {
        csvData.push([
          c.id,
          c.firstName,
          c.lastName,
          c.age,
          c.companyName,
          c.email_add,
        ]);
      });

    return csvData;
  };

  const exportStatusCSVData = () => {
    let csvData = [];
    csvData.push(["Active Clients"]);
    csvData.push(["ID", "Name", "Age", "Comapny Name", "Email"]);
    activeClients.forEach((c) => {
      csvData.push([
        c.id,
        `${c.firstName} ${c.lastName}`,
        c.age,
        c.companyName,
        c.email_add,
      ]);
    });
    csvData.push([]);

    csvData.push(["Inactive Clients"]);
    csvData.push(["ID", "Name", "Age", "Comapny Name", "Email"]);
    inactiveClients.forEach((c) => {
      csvData.push([
        c.id,
        `${c.firstName} ${c.lastName}`,
        c.age,
        c.companyName,
        c.email_add,
      ]);
    });

    return csvData;
  };

  const exportProjectCSVData = () => {
    return clientProjects.map((client) => ({
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      projects: client.projects.map((p) => p.projectName).join(", "), // Extract project names
    }));
  };

  const exportOptions = [
    { label: "CSV Total Clients", type: "csv", data: clients },
    { label: "PDF Total Clients", type: "pdf", data: clients },
    {
      label: "CSV New Clients This Month",
      type: "csv",
      data: clients.filter(
        (c) => new Date(c.created_at).getMonth() === new Date().getMonth()
      ),
    },
    {
      label: "PDF New Clients This Month",
      type: "pdf",
      data: clients.filter(
        (c) => new Date(c.created_at).getMonth() === new Date().getMonth()
      ),
    },
    {
      label: `CSV Clients for ${selectedYear}`,
      type: "csv",
      data: clients.filter(
        (c) => new Date(c.created_at).getFullYear() === selectedYear
      ),
    },
    {
      label: `PDF Clients for ${selectedYear}`,
      type: "pdf",
      data: clients.filter(
        (c) => new Date(c.created_at).getFullYear() === selectedYear
      ),
    },
    { label: "CSV Clients by Age", type: "csv", data: exportCSVData() },
    { label: "PDF Clients by Age", type: "pdf", data: clientsByAge },
    {
      label: "CSV Clients by Gender",
      type: "csv",
      data: exportGenderCSVData(),
    },
    { label: "PDF Clients by Gender", type: "pdf", data: clientsByGender },
    {
      label: "CSV Active vs Inactive Clients",
      type: "csv",
      data: exportStatusCSVData(),
    },
    {
      label: "PDF Active vs Inactive Clients",
      type: "pdf",
      data: clientsByStatus,
    },
    { label: "CSV Client Projects", type: "csv", data: exportProjectCSVData() },
    { label: "PDF Client Projects", type: "pdf", data: clientProjects },
  ];

  return (
    <div className="p-4">
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
      </div>

      <div className="flex justify-between mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center">
              Export Reports <Download className="ml-1" size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {exportOptions.map((option, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() =>
                  option.type === "pdf"
                    ? exportPDF(option.data, option.label)
                    : null
                }
              >
                {option.type === "csv" ? (
                  <CSVLink
                    data={option.data}
                    filename={`${option.label
                      .replace(/\s+/g, "_")
                      .toLowerCase()}.csv`}
                  >
                    {option.label}
                  </CSVLink>
                ) : (
                  option.label
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="clients-reports-container">
  {/* Summary Section */}
  <div className="clients-summary-grid">
    <div className="clients-summary-card">
      <h3>Total Clients</h3>
      <p>{clients.length}</p>
    </div>
    <div className="clients-summary-card">
      <h3>New Clients This Month</h3>
      <p>{newClientsThisMonth}</p>
    </div>
  </div>

  {/* Clients Per Month Chart */}
  <div className="clients-chart-container">
    <h3>Clients Per Month ({selectedYear})</h3>
    <div className="clients-year-selector">
      <label>Select Year:</label>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
      >
        {Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => 2024 + i).map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
    <LineChart width={800} height={300} data={clientsByMonth}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke="#4CAF50" strokeWidth={2} />
    </LineChart>
  </div>

  {/* Clients Data Grid */}
  <div className="clients-clients-grid">
    {/* Clients by Age */}
    <div className="clients-chart-card">
      <h3>Clients by Age</h3>
      <BarChart width={400} height={300} data={clientsByAge}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#4CAF50" />
      </BarChart>
    </div>

    {/* Clients by Gender */}
    <div className="clients-chart-card">
      <h3>Clients by Gender</h3>
      <PieChart width={400} height={300}>
        <Pie data={clientsByGender} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
          {clientsByGender.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={["#0088FE", "#FF69B4"][index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>

    {/* Active vs Inactive Clients */}
    <div className="clients-chart-card">
      <h3>Active vs Inactive Clients</h3>
      <PieChart width={400} height={300}>
        <Pie data={clientsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
          {clientsByStatus.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={["#4CAF50", "#FF5252"][index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  </div>
</div>
</div>


  );
};

export default ClientsReports;