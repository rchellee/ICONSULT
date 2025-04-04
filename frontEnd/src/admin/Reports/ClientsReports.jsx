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
  const [exportYear, setExportYear] = useState("All");
  const [exportMonth, setExportMonth] = useState("All");

  useEffect(() => {
    fetchClients();
    fetchClientsWithProjects();
  }, []);

  useEffect(() => {
    // Reset selected report if it's a "Clients for [Year]" report when year changes
    if (selectedReport && selectedReport.includes("Clients for")) {
      setSelectedReport("");
    }
  }, [selectedYear]);

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

  const getAvailableYears = () => {
    const years = new Set();
    clients.forEach((client) => {
      const year = new Date(client.created_at).getFullYear();
      years.add(year);
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
  };

  const filterClientsByDateRange = (clientsData, reportType = "") => {
    let filtered = [...clientsData];

    // Skip additional filtering for these report types
    if (reportType.includes("Clients This Month")) {
      return filtered.filter(
        (c) => new Date(c.created_at).getMonth() === new Date().getMonth()
      );
    }

    // For "Clients for [Year]" reports, use the selectedYear from state
    if (reportType.includes("Clients for")) {
      return filtered.filter(
        (c) => new Date(c.created_at).getFullYear() === selectedYear
      );
    }

    // Filter by year if not "All"
    if (exportYear !== "All") {
      filtered = filtered.filter(
        (c) => new Date(c.created_at).getFullYear() === parseInt(exportYear)
      );
    }

    // Filter by month if not "All" and year is selected
    if (exportMonth !== "All" && exportYear !== "All") {
      filtered = filtered.filter(
        (c) => new Date(c.created_at).getMonth() === parseInt(exportMonth)
      );
    }

    return filtered;
  };

  const groupClientsByAgeRange = () => {
    const filteredClients = filterClientsByDateRange(clients);
    return {
      "18-25": filteredClients.filter((c) => c.age >= 18 && c.age <= 25),
      "26-35": filteredClients.filter((c) => c.age >= 26 && c.age <= 35),
      "36-50": filteredClients.filter((c) => c.age >= 36 && c.age <= 50),
      "51+": filteredClients.filter((c) => c.age > 50),
    };
  };

  const activeClients = filterClientsByDateRange(clients).filter(
    (c) => c.status === "active"
  );
  const inactiveClients = filterClientsByDateRange(clients).filter(
    (c) => c.status === "inactive"
  );
  const newClientsThisMonth = filterClientsByDateRange(clients).filter(
    (c) => new Date(c.created_at).getMonth() === new Date().getMonth()
  ).length;

  const clientsByAge = [
    {
      name: "18-25",
      value: filterClientsByDateRange(clients).filter(
        (c) => c.age >= 18 && c.age <= 25
      ).length,
    },
    {
      name: "26-35",
      value: filterClientsByDateRange(clients).filter(
        (c) => c.age >= 26 && c.age <= 35
      ).length,
    },
    {
      name: "36-50",
      value: filterClientsByDateRange(clients).filter(
        (c) => c.age >= 36 && c.age <= 50
      ).length,
    },
    {
      name: "51+",
      value: filterClientsByDateRange(clients).filter((c) => c.age > 50).length,
    },
  ];

  const clientsByGender = [
    {
      name: "Male",
      value: filterClientsByDateRange(clients).filter(
        (c) => c.gender === "Male"
      ).length,
    },
    {
      name: "Female",
      value: filterClientsByDateRange(clients).filter(
        (c) => c.gender === "Female"
      ).length,
    },
  ];

  const clientsByStatus = [
    { name: "Active", value: activeClients.length },
    { name: "Inactive", value: inactiveClients.length },
  ];

  const clientsByMonth = Array.from({ length: 12 }, (_, index) => {
    return {
      month: new Date(0, index).toLocaleString("default", { month: "short" }),
      value: filterClientsByDateRange(clients).filter(
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
    if (data.length === 0) return alert("No data available to export.");

    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        return new Date(dateString).toISOString().split("T")[0];
      } catch (e) {
        return dateString;
      }
    };

    const isLandscape =
      title.includes("Total Clients") ||
      title.includes("New Clients This Month");
    const doc = new jsPDF({
      orientation: isLandscape ? "landscape" : "portrait",
      unit: "mm",
    });

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
      pdfDoc.setFont("helvetica", "normal").setFontSize(8);
      return { textX: 14 };
    };

    const addFooter = (pdfDoc) => {
      const currentDate = new Date().toLocaleString();
      const yPos = pdfDoc.internal.pageSize.height - 3;
      pdfDoc.setFontSize(8).setTextColor(100);
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

    const { textX } = setupPage(doc);
    let startY = 40;

    // Add date/month info if needed
    if (title.includes("Clients This Month")) {
      const month = new Date().toLocaleString("default", { month: "long" });
      doc
        .setFontSize(8)
        .setFont("helvetica", "bolditalic")
        .text(`${month} ${new Date().getFullYear()}`, 14, startY);
      startY += 10;
    } else if (exportYear !== "All" || exportMonth !== "All") {
      let rangeText = "Date Range: ";
      if (exportYear !== "All") rangeText += `Year: ${exportYear}`;
      if (exportMonth !== "All") {
        const monthName = new Date(0, parseInt(exportMonth)).toLocaleString(
          "default",
          { month: "long" }
        );
        rangeText += `, Month: ${monthName}`;
      }
      doc.setFontSize(12).text(rangeText, 14, startY);
      startY += 10;
    }

    // Handle different report types
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

      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text("Clients Overview", 145, startY + 3, { align: "center" });

      autoTable(doc, {
        startY: startY + 13,
        head: [headers],
        body: data.map((client) => [
          client.firstName || "",
          client.lastName || "",
          formatDate(client.birthday),
          client.mobile_number || "",
          client.email_add || "",
          client.address || "",
          client.status || "",
          client.companyName || "",
          client.age || "",
          client.nationality || "",
          client.city || "",
          client.postalCode || "",
          client.gender || "",
          client.companyPosition || "",
          client.companyContact || "",
          formatDate(client.created_at),
        ]),
        styles: { fontSize: 6, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        showHead: "everyPage",
      });
    } else if (title.includes("Clients for")) {
      const year = title.match(/\d{4}/)?.[0] || selectedYear;
      // Add Clients Per Month chart
      try {
        const chartContainer = document.querySelector(
          ".clients-for-container"
        )?.parentElement;
        if (chartContainer) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const canvas = await html2canvas(chartContainer, { scale: 3 });
          const chartWidth = doc.internal.pageSize.getWidth() - 10;
          const chartHeight = (chartWidth * canvas.height) / canvas.width;
          doc.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            5,
            (startY += 40),
            chartWidth,
            chartHeight
          );
          startY += chartHeight + 20;
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }
      doc.addPage();
      setupPage(doc);
      startY = 47;
      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text(`Clients for ${year}`, doc.internal.pageSize.width / 2, startY, {
          align: "center",
        });

      doc
        .setFontSize(8)
        .setFont("helvetica", "bolditalic")
        .text(`Total Clients for ${year}: ${data.length}`, 14, startY + 15);

      const headers = [
        "Firstname",
        "Lastname",
        "Mobile Number",
        "Email",
        "Address",
        "Status",
        "Company",
        "Company Contact",
        "Date Created",
      ];

      autoTable(doc, {
        startY: startY + 25,
        head: [headers],
        body: data.map((client) => [
          client.firstName || "",
          client.lastName || "",
          client.mobile_number || "",
          client.email_add || "",
          client.address || "",
          client.status || "",
          client.companyName || "",
          client.companyContact || "",
          formatDate(client.created_at),
        ]),
        styles: { fontSize: 6, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        showHead: "everyPage",
      });
    } else if (title.includes("Clients by Age")) {
      // First add the Clients by Age chart
      try {
        const chartContainer = document.querySelector(".clients-byAge-card");
        if (chartContainer) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const canvas = await html2canvas(chartContainer, {
            scale: 3,
            logging: true,
            useCORS: true,
          });

          const chartWidth = doc.internal.pageSize.getWidth() - 80;
          const chartHeight = (chartWidth * canvas.height) / canvas.width;

          // Add chart to first page
          doc.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            40,
            (startY += 40),
            chartWidth,
            chartHeight
          );
          startY += chartHeight + 20;

          // Add a new page for the data tables
          doc.addPage();
          setupPage(doc);
          startY = 40;
        }
      } catch (error) {
        console.error("Error capturing Clients by Age chart:", error);
      }

      const groupedClients = groupClientsByAgeRange();
      Object.keys(groupedClients).forEach((ageRange, index) => {
        if (index > 0) {
          doc.addPage();
          setupPage(doc);
          startY = 40;
        }

        doc
          .setFontSize(20)
          .setFont("helvetica", "bold")
          .setTextColor(40)
          .text("Client Demographics by Age", 105, startY + 3, {
            align: "center",
          });

        doc
          .setFontSize(12)
          .setFont("helvetica", "bolditalic")
          .text(`Age Range: ${ageRange}`, 14, startY + 18);

        const clientData = groupedClients[ageRange];
        if (clientData.length > 0) {
          autoTable(doc, {
            startY: startY + 26,
            head: [
              ["ID", "Name", "Age", "Company Name", "Email", "Date Created"],
            ],
            body: clientData.map((c) => [
              c.id,
              `${c.firstName} ${c.lastName}`,
              c.age,
              c.companyName,
              c.email_add,
              formatDate(c.created_at),
            ]),
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              fontStyle: "bold",
            },
            alternateRowStyles: { fillColor: [245, 245, 245] },
          });
        } else {
          doc.text("No clients in this range.", 14, startY + 26);
        }
      });
    } else if (title.includes("Clients by Gender")) {
      try {
        const chartContainer = document.querySelector(".clients-gender-card");
        if (chartContainer) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const canvas = await html2canvas(chartContainer, {
            scale: 3,
            logging: true,
            useCORS: true,
          });

          const chartWidth = doc.internal.pageSize.getWidth() - 80;
          const chartHeight = (chartWidth * canvas.height) / canvas.width;

          // Add chart to first page
          doc.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            40,
            (startY += 40),
            chartWidth,
            chartHeight
          );
          startY += chartHeight + 20;

          // Add a new page for the data tables
          doc.addPage();
          setupPage(doc);
          startY = 40;
        }
      } catch (error) {
        console.error("Error capturing Clients by Age chart:", error);
      }
      const renderGenderTable = (gender, clients) => {
        doc
          .setFontSize(20)
          .setFont("helvetica", "bold")
          .setTextColor(40)
          .text("Client Demographics by Gender", 105, startY + 3, {
            align: "center",
          });

        doc
          .setFontSize(12)
          .setFont("helvetica", "bolditalic")
          .text(`${gender} Clients`, 14, startY + 18);

        if (clients.length > 0) {
          autoTable(doc, {
            startY: startY + 26,
            head: [
              [
                "ID",
                "Name",
                "Age",
                "Company Name",
                "Email",
                "Contact Number",
                "Date Created",
              ],
            ],
            body: clients.map((c) => [
              c.id,
              `${c.firstName} ${c.lastName}`,
              c.age,
              c.companyName,
              c.email_add,
              c.mobile_number,
              formatDate(c.created_at),
            ]),
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              fontStyle: "bold",
            },
            alternateRowStyles: { fillColor: [245, 245, 245] },
          });
        } else {
          doc.text(`No ${gender} Clients.`, 14, startY + 26);
        }
      };

      renderGenderTable(
        "Male",
        filterClientsByDateRange(clients).filter((c) => c.gender === "Male")
      );
      doc.addPage();
      setupPage(doc);
      renderGenderTable(
        "Female",
        filterClientsByDateRange(clients).filter((c) => c.gender === "Female")
      );
    } else if (title.includes("Active vs Inactive Clients")) {
      try {
        const chartContainer = document.querySelector(
          ".clients-activeVsinactive-card"
        );
        if (chartContainer) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          const canvas = await html2canvas(chartContainer, {
            scale: 3,
            logging: true,
            useCORS: true,
          });

          const chartWidth = doc.internal.pageSize.getWidth() - 80;
          const chartHeight = (chartWidth * canvas.height) / canvas.width;

          // Add chart to first page
          doc.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            40,
            (startY += 40),
            chartWidth,
            chartHeight
          );
          startY += chartHeight + 20;
          doc.addPage();
          setupPage(doc);
          startY = 40;
        }
      } catch (error) {
        console.error("Error capturing Clients by Age chart:", error);
      }
      const renderStatusTable = (status, clients) => {
        doc
          .setFontSize(12)
          .setFont("helvetica", "bolditalic")
          .text(`${status} Clients`, 14, startY);

        if (clients.length > 0) {
          autoTable(doc, {
            startY: startY + 8,
            head: [
              [
                "ID",
                "Name",
                "Age",
                "Company Name",
                "Email",
                "Contact Number",
                "Date Created",
              ],
            ],
            body: clients.map((c) => [
              c.id,
              `${c.firstName} ${c.lastName}`,
              c.age,
              c.companyName,
              c.email_add,
              c.mobile_number,
              formatDate(c.created_at),
            ]),
            styles: { fontSize: 8, textColor: [0, 0, 0] },
            headStyles: {
              fillColor: [255, 255, 255],
              textColor: [0, 0, 0],
              fontStyle: "bold",
            },
            alternateRowStyles: { fillColor: [245, 245, 245] },
          });
        } else {
          doc.text(`No ${status} Clients.`, 14, startY + 8);
        }
      };

      renderStatusTable("Active", activeClients);
      doc.addPage();
      setupPage(doc);
      renderStatusTable("Inactive", inactiveClients);
    }

    // Add footer to all pages
    for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
      doc.setPage(i);
      addFooter(doc);
    }

    doc.save(`${title.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };

  const exportCSVData = () => {
    const groupedClients = groupClientsByAgeRange();
    let csvData = [];

    // Add date range information if filtered
    if (exportYear !== "All" || exportMonth !== "All") {
      let rangeText = "Date Range: ";
      if (exportYear !== "All") {
        rangeText += `Year: ${exportYear}`;
      }
      if (exportMonth !== "All") {
        const monthName = new Date(0, parseInt(exportMonth)).toLocaleString(
          "default",
          { month: "long" }
        );
        rangeText += `, Month: ${monthName}`;
      }
      csvData.push([rangeText]);
      csvData.push([]);
    }

    Object.keys(groupedClients).forEach((ageRange) => {
      csvData.push([`Age Range: ${ageRange}`]);
      csvData.push([
        "ID",
        "Name",
        "Age",
        "Company Name",
        "Email",
        "Date Created",
      ]);
      groupedClients[ageRange].forEach((c) => {
        csvData.push([
          c.id,
          `${c.firstName} ${c.lastName}`,
          c.age,
          c.companyName,
          c.email_add,
          c.created_at,
        ]);
      });
      csvData.push([]);
    });

    return csvData;
  };
  const exportGenderCSVData = () => {
    let csvData = [];

    // Add date range information if filtered
    if (exportYear !== "All" || exportMonth !== "All") {
      let rangeText = "Date Range: ";
      if (exportYear !== "All") {
        rangeText += `Year: ${exportYear}`;
      }
      if (exportMonth !== "All") {
        const monthName = new Date(0, parseInt(exportMonth)).toLocaleString(
          "default",
          { month: "long" }
        );
        rangeText += `, Month: ${monthName}`;
      }
      csvData.push([rangeText]);
      csvData.push([]);
    }

    // Male Clients
    csvData.push(["Male Clients"]);
    csvData.push([
      "ID",
      "First Name",
      "Last Name",
      "Age",
      "Company Name",
      "Email",
      "Date Created",
    ]);
    filterClientsByDateRange(clients)
      .filter((c) => c.gender === "Male")
      .forEach((c) => {
        csvData.push([
          c.id,
          c.firstName,
          c.lastName,
          c.age,
          c.companyName,
          c.email_add,
          c.created_at,
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
      "Date Created",
    ]);
    filterClientsByDateRange(clients)
      .filter((c) => c.gender === "Female")
      .forEach((c) => {
        csvData.push([
          c.id,
          c.firstName,
          c.lastName,
          c.age,
          c.companyName,
          c.email_add,
          c.created_at,
        ]);
      });

    return csvData;
  };
  const exportStatusCSVData = () => {
    let csvData = [];
    if (exportYear !== "All" || exportMonth !== "All") {
      let rangeText = "Date Range: ";
      if (exportYear !== "All") {
        rangeText += `Year: ${exportYear}`;
      }
      if (exportMonth !== "All") {
        const monthName = new Date(0, parseInt(exportMonth)).toLocaleString(
          "default",
          { month: "long" }
        );
        rangeText += `, Month: ${monthName}`;
      }
      csvData.push([rangeText]);
      csvData.push([]);
    }

    csvData.push(["Active Clients"]);
    csvData.push([
      "ID",
      "Name",
      "Age",
      "Comapny Name",
      "Email",
      "Date Created",
    ]);
    activeClients.forEach((c) => {
      csvData.push([
        c.id,
        `${c.firstName} ${c.lastName}`,
        c.age,
        c.companyName,
        c.email_add,
        c.created_at,
      ]);
    });
    csvData.push([]);

    csvData.push(["Inactive Clients"]);
    csvData.push([
      "ID",
      "Name",
      "Age",
      "Comapny Name",
      "Email",
      "Date Created",
    ]);
    inactiveClients.forEach((c) => {
      csvData.push([
        c.id,
        `${c.firstName} ${c.lastName}`,
        c.age,
        c.companyName,
        c.email_add,
        c.created_at,
      ]);
    });

    return csvData;
  };

  const exportOptions = [
    {
      label: "Total Clients(CSV)",
      type: "csv",
      data: filterClientData(
        filterClientsByDateRange(clients, "Total Clients")
      ),
    },
    {
      label: "Total Clients(PDF)",
      type: "pdf",
      data: filterClientData(
        filterClientsByDateRange(clients, "Total Clients")
      ),
    },
    {
      label: "Clients This Month (CSV)",
      type: "csv",
      data: filterClientData(
        clients.filter(
          (c) => new Date(c.created_at).getMonth() === new Date().getMonth()
        )
      ),
    },
    {
      label: "PDF New Clients This Month",
      type: "pdf",
      data: filterClientData(
        filterClientsByDateRange(clients, "Clients This Month")
      ),
    },
    {
      label: `Clients for ${selectedYear} (CSV)`,
      type: "csv",
      data: filterClientData(
        filterClientsByDateRange(clients, `Clients for ${selectedYear}`)
      ),
    },
    {
      label: `Clients for ${selectedYear} (PDF)`,
      type: "pdf",
      data: filterClientData(
        filterClientsByDateRange(clients, `Clients for ${selectedYear}`)
      ),
    },
    { label: "Clients by Age (CSV)", type: "csv", data: exportCSVData() },
    { label: "Clients by Age (PDF)", type: "pdf", data: clientsByAge },
    {
      label: "Clients by Gender (CSV)",
      type: "csv",
      data: exportGenderCSVData(),
    },
    { label: "Clients by Gender (PDF)", type: "pdf", data: clientsByGender },
    {
      label: "Active vs Inactive Clients (CSV)",
      type: "csv",
      data: exportStatusCSVData(),
    },
    {
      label: "Active vs Inactive Clients (PDF)",
      type: "pdf",
      data: clientsByStatus,
    },
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
        <div className="flex items-center space-x-2">
          {selectedReport &&
            !selectedReport.includes("Clients This Month") &&
            !selectedReport.includes("Clients for") &&
            !selectedReport.includes("Clients by Age") &&
            !selectedReport.includes("Clients by Gender") &&
            !selectedReport.includes("Active vs Inactive Clients") && (
              <div className="flex space-x-2">
                <select
                  className="bg-gray-200 text-black px-2 py-1 rounded"
                  value={exportYear}
                  onChange={(e) => setExportYear(e.target.value)}
                >
                  <option value="All">All Years</option>
                  {getAvailableYears().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <select
                  className="bg-gray-200 text-black px-2 py-1 rounded"
                  value={exportMonth}
                  onChange={(e) => setExportMonth(e.target.value)}
                  disabled={exportYear === "All"}
                >
                  <option value="All">All Months</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
            )}

          {selectedReport.includes("CSV") ? (
            <CSVLink
              data={
                exportOptions.find((opt) => opt.label === selectedReport)?.data
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
            <div className="clients-for-container">
              <LineChart width={1500} height={350} data={clientsByMonth}>
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
        </div>

        {/* Clients Data Grid */}
        <div className="clients-clients-grid">
          {/* Clients by Age */}
          <div className="clients-chart-card scrollable-chart">
            <div className="clients-byAge-card">
              {" "}
              <h3 class>Clients by Age</h3>
              <BarChart width={460} height={320} data={clientsByAge}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4CAF50" />
              </BarChart>
            </div>
          </div>

          {/* Clients by Gender */}
          <div className="clients-chart-card">
            <div className="clients-gender-card">
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
          </div>

          {/* Active vs Inactive Clients */}
          <div className="clients-chart-card">
            <div className="clients-activeVsinactive-card">
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
    </div>
  );
};

export default ClientsReports;
