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
import landscapeTemplate from "../../assets/reports_landscape.jpg";
import AppointmentTemplate from "../../assets/reports_portrait.jpg";

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
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedClient, setSelectedClient] = useState("All");
  const [adminUsername, setAdminUsername] = useState("");

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

  const filterClientData = (clients) => {
    return clients.map((client) => ({
      firstName: client.firstName,
      lastName: client.lastName,
      birthday: client.birthday,
      mobile_number: client.mobile_number,
      email_add: client.email_add,
      address: client.address,
      status: client.status,
      companyName: client.companyName,
      created_at: client.created_at,
      age: client.age,
      nationality: client.nationality,
      city: client.city,
      postalCode: client.postalCode,
      gender: client.gender,
      companyPosition: client.companyPosition,
      companyContact: client.companyContact,
    }));
  };

  const exportPDF = async (data, title) => {
    if (data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      } catch (e) {
        return dateString; // Return original if parsing fails
      }
    };

    // Determine orientation and template based on report type
    const isLandscape =
      title.includes("Total Clients") ||
      title.includes("New Clients This Month");
    const doc = new jsPDF({
      orientation: isLandscape ? "landscape" : "portrait",
      unit: "mm",
    });

    // Common setup functions
    const setupPage = (pdfDoc) => {
      const template = isLandscape ? landscapeTemplate : AppointmentTemplate;
      pdfDoc.addImage(
        template,
        "JPEG",
        0,
        0,
        pdfDoc.internal.pageSize.getWidth(),
        pdfDoc.internal.pageSize.getHeight()
      );

      pdfDoc.setFont("helvetica", "normal");
      pdfDoc.setFontSize(8);

      return { textX: 14 }; // Return a default left margin position
    };

    const addFooter = (pdfDoc) => {
      const currentDate = new Date().toLocaleString();
      const yPos = pdfDoc.internal.pageSize.height - 3;
      pdfDoc.setFontSize(8);
      pdfDoc.setTextColor(100);
      pdfDoc.text(
        `Generated by: ${localStorage.getItem("username") || "System"}`,
        14,
        yPos
      );
      pdfDoc.text(
        `Date Generated: ${currentDate}`,
        pdfDoc.internal.pageSize.width - 60,
        yPos,
        { align: "right" }
      );
    };

    // Setup first page
    const { textX } = setupPage(doc);
    let startY = 40;

    if (
      title.includes("Total Clients") ||
      title.includes("New Clients This Month")
    ) {
      const headers = [
        "Firstname",
        "Lastname",
        "Birthday",
        "Mobile Number",
        "Email",
        "Address",
        "Status",
        "Company",
        "Age",
        "Nationality",
        "City",
        "Postal Code",
        "Gender",
        "Client Position",
        "Company Contact",
        "Date Created",
      ];

      autoTable(doc, {
        startY,
        head: [headers],
        body: data.map((client) => [
          client.firstName,
          client.lastName,
          formatDate(client.birthday),
          client.mobile_number,
          client.email_add,
          client.address,
          client.status,
          client.companyName,
          client.age,
          client.nationality,
          client.city,
          client.postalCode,
          client.gender,
          client.companyPosition,
          client.companyContact,
          formatDate(client.created_at),
        ]),
        styles: { fontSize: 6, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        showHead: "everyPage",
      });
    } else if (title.includes("Clients by Age")) {
      const groupedClients = groupClientsByAgeRange();
      Object.keys(groupedClients).forEach((ageRange, index) => {
        if (index > 0) {
          doc.addPage();
          setupPage(doc);
          startY = 40;
        }

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(40);
        doc.text("Client Demographics by Age", 105, (startY += 3), {
          align: "center",
        });
        startY += 15;

        doc
          .setFontSize(12)
          .setFont("helvetica", "bolditalic")
          .text(`Age Range: ${ageRange}`, 14, startY);
        startY += 8;

        const clientData = groupedClients[ageRange];
        if (clientData.length > 0) {
          autoTable(doc, {
            startY,
            head: [["ID", "Name", "Age", "Company Name", "Email"]],
            body: clientData.map((c) => [
              c.id,
              `${c.firstName} ${c.lastName}`,
              c.age,
              c.companyName,
              c.email_add,
            ]),
            styles: {
              fontSize: 8,
              textColor: [0, 0, 0],
            },
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
            margin: { top: startY },
          });
        } else {
          doc.text("No clients in this range.", 14, startY);
        }
      });
    } else if (title.includes("Clients by Gender")) {
      // Male Clients
      const maleClients = clients.filter((c) => c.gender === "Male");
      doc
        .setFontSize(12)
        .setFont("helvetica", "bolditalic")
        .text("Male Clients", 14, startY);
      startY += 8;

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
          styles: {
            fontSize: 8,
            textColor: [0, 0, 0],
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { top: startY },
        });
      } else {
        doc.text("No Male Clients.", 10, 30);
      }

      doc.addPage();
      setupPage(doc);
      doc
        .setFontSize(12)
        .setFont("helvetica", "bolditalic")
        .text("Female Clients", 14, startY);
      startY += 8;
      const femaleClients = clients.filter((c) => c.gender === "Female");
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
          styles: {
            fontSize: 8,
            textColor: [0, 0, 0],
          },
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
          alternateRowStyles: {
            fillColor: [245, 245, 245],
          },
          margin: { top: startY },
        });
      } else {
        doc.text("No Female Clients.", 10, 30);
      }
    } else if (title.includes("Active vs Inactive Clients")) {
      doc.text("Active Clients", 10, 20);
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
          margin: { top: 30 },
        });
      } else {
        doc.text("No Active Clients.", 10, 30);
      }

      doc.addPage();
      doc.text("Inactive Clients", 10, 20);
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
          margin: { top: 30 },
        });
      } else {
        doc.text("No Inactive Clients.", 10, 30);
      }
    } else if (title.includes("Client Projects")) {
      doc.text("Client Projects", 10, 20);
      autoTable(doc, {
        head: [["ID", "First Name", "Last Name", "Projects"]],
        body: data.map((client) => [
          client.id,
          client.firstName,
          client.lastName,
          client.projects.map((p) => p.projectName).join(", "),
        ]),
        startY: 30,
        theme: "grid",
        margin: { top: 30 },
      });
    }

    // Add chart if available
    if (chartRef.current) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const canvas = await html2canvas(chartRef.current, { scale: 3 });
        const imgData = canvas.toDataURL("image/png");

        doc.addPage(isLandscape ? "landscape" : "portrait");
        setupPage(doc);

        const chartWidth = doc.internal.pageSize.getWidth() - 40;
        const chartHeight = (chartWidth * canvas.height) / canvas.width;
        doc.addImage(imgData, "PNG", 20, 60, chartWidth, chartHeight);
      } catch (error) {
        console.error("Error capturing chart:", error);
      }
    }

    // Add footer to all pages
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      addFooter(doc);
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
    {
      label: "Total Clients(CSV)",
      type: "csv",
      data: filterClientData(clients),
    },
    {
      label: "Total Clients(PDF)",
      type: "pdf",
      data: filterClientData(clients),
    },
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
      <div className="mt-4 flex justify-start items-center space-x-4">
        <select
          className="bg-gray-200 text-black px-4 py-2 rounded"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="">Select Report Type</option>
          {exportOptions.map((option, index) => (
            <option key={index} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>

        {selectedReport && (
          <div className="flex space-x-2">
            {selectedReport.includes("CSV") ? (
              <CSVLink
                data={
                  exportOptions.find((opt) => opt.label === selectedReport)
                    ?.data
                }
                filename={`${selectedReport
                  .replace(/\s+/g, "_")
                  .toLowerCase()}.csv`}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors"
                title="Download CSV"
              >
                <Download size={18} />
              </CSVLink>
            ) : (
              <button
                onClick={() => {
                  const option = exportOptions.find(
                    (opt) => opt.label === selectedReport
                  );
                  if (option) exportPDF(option.data, option.label);
                }}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                title="Download PDF"
              >
                <Download size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="clients-reports-container">
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
        <div className="clients-clients-grid">
          <div className="clients-chart-container scrollable-chart">
            <h3>Clients Per Month ({selectedYear})</h3>
            <div className="clients-year-selector">
              <label>Select Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                {Array.from(
                  { length: new Date().getFullYear() - 2023 },
                  (_, i) => 2024 + i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <LineChart width={1700} height={350} data={clientsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4CAF50"
                strokeWidth={2}
              />
            </LineChart>
          </div>
        </div>

        {/* Clients Data Grid */}
        <div className="clients-clients-grid">
          {/* Clients by Age */}
          <div className="clients-chart-card scrollable-chart">
            <h3>Clients by Age</h3>
            <BarChart width={1000} height={300} data={clientsByAge}>
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
              <Pie
                data={clientsByGender}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {clientsByGender.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#0088FE", "#FF69B4"][index]}
                  />
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
              <Pie
                data={clientsByStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {clientsByStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#4CAF50", "#FF5252"][index]}
                  />
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
