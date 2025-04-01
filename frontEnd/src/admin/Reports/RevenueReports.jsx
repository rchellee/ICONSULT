import React, { useState, useEffect } from "react";
import axios from "axios";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart,
  Line,
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
import landscapeTemplate from "../../assets/reports_landscape.jpg";
import AppointmentTemplate from "../../assets/reports_portrait.jpg";

const RevenueReports = () => {
  const [revenues, setRevenues] = useState([]);
  const [clients, setClients] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [overduePayments, setOverduePayments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [totalPerProject, setTotalPerProject] = useState([]);
  const [receivedVsRemaining, setReceivedVsRemaining] = useState([]);
  const [paymentsPerClient, setPaymentsPerClient] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueThisMonth, setRevenueThisMonth] = useState(0);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedClient, setSelectedClient] = useState("All");
  const [tasks, setTasks] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [exportFilters, setExportFilters] = useState({
    year: "All",
    month: "All",
  });

  const getAvailableYears = (revenues) => {
    const years = new Set();
    revenues.forEach((revenue) => {
      if (revenue.date_paid) {
        const year = new Date(revenue.date_paid).getFullYear();
        years.add(year.toString());
      }
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending (newest first)
  };

  const [detailedPaymentData, setDetailedPaymentData] = useState({
    receivedPayments: [],
    pendingPayments: [],
  });

  const [filters, setFilters] = useState({
    month: "All",
    year: new Date().getFullYear(),
  });

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

  useEffect(() => {
    fetchProjects();
    fetchRevenues();
    fetchPaymentsPerClient();
    fetchClients();
    fetchTasks();
  }, [filters]);

  useEffect(() => {
    fetchPaymentStatus();
    fetchOverduePayments();
  }, []);

  useEffect(() => {
    fetchTotalRevenuePerProject();
  }, [paymentStatusFilter]);

  const fetchTotalRevenuePerProject = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/total-revenue-per-project",
        {
          params: {
            paymentStatus:
              paymentStatusFilter === "All" ? undefined : paymentStatusFilter,
          },
        }
      );
      setTotalPerProject(response.data);
    } catch (error) {
      console.error("Error fetching total revenue per project:", error);
    }
  };

  const fetchPaymentStatus = async () => {
    try {
      const response = await axios.get("http://localhost:8081/payment-status");
      const { paidTasks, pendingTasks, receivedPayments, pendingPayments } =
        response.data;

      // Format for the pie chart
      setPaymentData([
        { name: "Received Payments", value: receivedPayments },
        { name: "Pending Payments", value: pendingPayments },
      ]);

      // Store detailed data for CSV export
      setDetailedPaymentData({
        receivedPayments: paidTasks,
        pendingPayments: pendingTasks,
      });

      setTotalRevenue(receivedPayments);
      // Remove the line that sets revenueThisMonth here
    } catch (error) {
      console.error("Error fetching payment status data:", error);
    }
  };

  const fetchOverduePayments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/overdue-payments"
      );
      setOverduePayments(response.data);
    } catch (error) {
      console.error("Error fetching overdue payments:", error);
    }
  };
  const fetchClients = async () => {
    try {
      const response = await axios.get("http://localhost:8081/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients", error);
    }
  };

  const fetchPaymentsPerClient = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/payments-per-client",
        {
          params: {
            year: filters.year,
            month: filters.month,
          },
        }
      );
      setPaymentsPerClient(response.data);
    } catch (error) {
      console.error("Error fetching payments per client:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:8081/projects");
      setProjects(response.data);

      // Format the data for the "Payment Received vs. Remaining Balances" chart
      const formattedData = response.data.map((project) => ({
        name: project.projectName,
        received: project.paid_amount,
        remaining: project.remaining,
      }));
      setReceivedVsRemaining(formattedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchRevenues = async () => {
    try {
      const response = await axios.get("http://localhost:8081/payments", {
        params: filters,
      });
      setRevenues(response.data);
      setAvailableYears(getAvailableYears(response.data));
      // Calculate and set current month revenue
      setRevenueThisMonth(calculateCurrentMonthRevenue(response.data));
    } catch (error) {
      console.error("Error fetching revenues", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8081/tasksPayments");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const calculateCurrentMonthRevenue = (revenues) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return revenues.reduce((total, revenue) => {
      if (!revenue.date_paid) return total;

      try {
        const paymentDate = new Date(revenue.date_paid);
        if (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        ) {
          return total + (revenue.amount || 0);
        }
      } catch (e) {
        console.error("Error parsing payment date:", e);
      }
      return total;
    }, 0);
  };

  const COLORS = ["#4CAF50", "#FF5252"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const task = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="intro">{`Due Date: ${task.due_date}`}</p>
          <p className="intro">{`Amount: ₱ ${task.amount}`}</p>
        </div>
      );
    }
    return null;
  };
  const exportPDF = async (filters) => {
    let dataToExport = revenues;
    if (dataToExport.length === 0) return alert("No data available to export.");

    const formatDate = (dateString) => {
      if (!dateString) return "";
      try {
        return new Date(dateString).toISOString().split("T")[0];
      } catch (e) {
        return dateString;
      }
    };
    const clientNames = {};
    clients.forEach((client) => {
      clientNames[client.id] = `${client.firstName} ${client.lastName}`;
    });

    const projectNames = {};
    projects.forEach((project) => {
      projectNames[project.id] = project.projectName;
    });

    const taskNames = {};
    tasks.forEach((task) => {
      taskNames[task.id] = task.task_name;
    });
    if (selectedReport === "TOTAL REVENUE") {
      dataToExport = revenues.filter((revenue) => {
        if (!revenue.date_paid) return false;
        const paymentDate = new Date(revenue.date_paid);
        const paymentYear = paymentDate.getFullYear().toString();
        const paymentMonth = paymentDate.toLocaleString("default", {
          month: "long",
        });

        return (
          (filters.year === "All" || paymentYear === filters.year) &&
          (filters.month === "All" || paymentMonth === filters.month)
        );
      });

      if (dataToExport.length === 0) {
        return alert("No data available to export with the current filters.");
      }
    }
    const isLandscape = ["TOTAL REVENUE", "REVENUE THIS MONTH"].includes(
      selectedReport
    );
    const doc = new jsPDF(isLandscape ? "landscape" : "portrait", "mm", "a4");
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

    setupPage(doc);
    let startY = 40;

    if (selectedReport === "TOTAL REVENUE") {
      const headers = [
        [
          "id",
          "Client",
          "Project",
          "Task",
          "Transaction ID",
          "Paid by",
          "Email",
          "Amount",
          "Currency",
          "MOP",
          "Date Paid",
          "Date Created",
        ],
      ];
      doc
        .setFontSize(10)
        .setTextColor(80)
        .text(
          `Filters: Year - ${filters.year} | Month - ${filters.month}`,
          145,
          startY + 8,
          { align: "center" }
        );
      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text("Payments Overview", 145, startY + 3, { align: "center" });

      autoTable(doc, {
        startY: startY + 20,
        head: headers,
        body: dataToExport.map((r) => [
          r.id,
          clientNames[r.client_id] || `Client ID: ${r.client_id}`,
          projectNames[r.project_id] || `Project ID: ${r.project_id}`,
          taskNames[r.task_id] || `Task ID: ${r.task_id}`,
          r.transaction_id,
          r.payer_name,
          r.payer_email,
          r.amount,
          r.currency,
          r.mode_of_payment,
          formatDate(r.date_paid),
          formatDate(r.created_at),
        ]),
        styles: { fontSize: 8, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        showHead: "everyPage",
      });
    }
    if (selectedReport === "REVENUE THIS MONTH") {
      const currentMonthRevenues = revenues.filter((r) => {
        const revenuesDate = new Date(r.date_paid);
        return (
          revenuesDate.getMonth() === new Date().getMonth() &&
          revenuesDate.getFullYear() === new Date().getFullYear()
        );
      });
      const headers = [
        [
          "id",
          "Client",
          "Project",
          "Task",
          "Transaction ID",
          "Paid by",
          "Email",
          "Amount",
          "Currency",
          "MOP",
          "Date Paid",
          "Date Created",
        ],
      ];

      const data = currentMonthRevenues.map((r) => [
        r.id,
        clientNames[r.client_id] || `Client ID: ${r.client_id}`,
        projectNames[r.project_id] || `Project ID: ${r.project_id}`,
        taskNames[r.task_id] || `Task ID: ${r.task_id}`,
        r.transaction_id,
        r.payer_name,
        r.payer_email,
        r.amount,
        r.currency,
        r.mode_of_payment,
        formatDate(r.date_paid),
        formatDate(r.created_at),
      ]);
      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text("Revenue this Month", 145, startY + 3, { align: "center" });

      autoTable(doc, {
        startY: startY + 13,
        head: headers,
        body: data,
        styles: { fontSize: 6, textColor: [0, 0, 0] },
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
        showHead: "everyPage",
      });
    }
    if (selectedReport === "Accounts Receivable Overview") {
      // First page - Chart
      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#project-status .recharts-wrapper"
        );
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 160;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart to first page
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Projects by Status Overview", 105, 45, { align: "center" });

          doc.addImage(
            imgData,
            "PNG",
            (doc.internal.pageSize.getWidth() - imgWidth) / 2,
            50,
            imgWidth,
            imgHeight
          );

          // Add description below chart
          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(
              "This chart shows the distribution of projects by their current status.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Add new page for status details
      doc.addPage();
      setupPage(doc);

      const statuses = ["Pending", "Ongoing", "Completed"];

      statuses.forEach((status, index) => {
        const projectStatus = projects.filter((p) => p.status === status);

        if (projectStatus.length > 0) {
          // Add new page for each status (except first one after chart)
          if (index > 0) {
            doc.addPage();
            setupPage(doc);
          }

          // Reset Y position for new page
          let startY = 40;

          // Add status title
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text(`${status} Projects`, 105, startY, { align: "center" });

          startY += 15;

          // Add table
          const headers = [
            [
              "Project Name",
              "Client Name",
              "Description",
              "Start Date",
              "End Date",
              "Created At",
            ],
          ];

          const data = projectStatus.map((p) => [
            p.projectName,
            p.clientName,
            p.description,
            p.startDate ? new Date(p.startDate).toLocaleDateString() : "N/A",
            p.endDate ? new Date(p.endDate).toLocaleDateString() : "N/A",
            p.created_at ? new Date(p.created_at).toLocaleDateString() : "N/A",
          ]);

          autoTable(doc, {
            startY: startY,
            head: headers,
            body: data,
            styles: {
              fontSize: 8,
              cellPadding: 3,
              overflow: "linebreak",
            },
            headStyles: {
              fillColor: [220, 220, 220],
              textColor: [0, 0, 0],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
          });

          // Add status summary
          startY = doc.lastAutoTable.finalY + 10;
          doc
            .setFontSize(10)
            .setTextColor(40)
            .text(
              `Total ${status} Projects: ${projectStatus.length}`,
              14,
              startY
            );

          // Add footer to this page
          addFooter(doc);
        }
      });
    }
    if (selectedReport === "Payments per Client") {
      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#overdue-projects .recharts-wrapper"
        );
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 160;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart to first page
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Overdue Projects", 105, 45, { align: "center" });

          doc.addImage(
            imgData,
            "PNG",
            (doc.internal.pageSize.getWidth() - imgWidth) / 2,
            50,
            imgWidth,
            imgHeight
          );

          // Add description below chart
          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(
              "This chart shows projects that are delayed, along with the number of days overdue.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Add new page for status details
      doc.addPage();
      setupPage(doc);

      const headers = [
        [
          "Project Name",
          "Client Name",
          "Description",
          "Status",
          "End Date",
          "Days Overdue",
        ],
      ];
      const overdueProjects = projects
        .filter((p) => p.isDelayed === 1)
        .map((p) => [
          p.projectName,
          p.clientName,
          p.description,
          p.status,
          formatDate(p.endDate),
          p.delayedDays, // Ensure this field exists in your backend response
        ]);

      doc
        .setFontSize(20)
        .setFont("helvetica", "bold")
        .setTextColor(40)
        .text("Overdue Projects", 105, startY + 3, {
          align: "center",
        });

      startY += 15;

      autoTable(doc, {
        startY: startY,
        head: headers,
        body: overdueProjects,
        styles: {
          fontSize: 8,
          textColor: [0, 0, 0],
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [220, 220, 220],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        margin: { top: 15 },
      });
    }
    if (selectedReport === "Revenue per Project") {
      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#projects-per-client .recharts-wrapper"
        );
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 200;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Add chart to first page
          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Client Project List", 105, 45, { align: "center" });

          doc.addImage(
            imgData,
            "PNG",
            (doc.internal.pageSize.getWidth() - imgWidth) / 2,
            50,
            imgWidth,
            imgHeight
          );

          // Add description below chart
          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(
              " This line chart represents the number of projects associated with each client.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Add new page for status details
      doc.addPage();
      setupPage(doc);

      let grandTotal = 0;
      const clientsToExport =
        selectedClient === "All"
          ? clients
          : clients.filter((c) => c.id.toString() === selectedClient);

      clientsToExport.forEach((client, index) => {
        const clientProjects = projects.filter((p) => p.clientId === client.id);

        if (clientProjects.length > 0) {
          // Add new page for each client (except first one)
          if (index > 0) {
            doc.addPage();
            setupPage(doc); // Re-setup page template
          }

          // Reset Y position for new page
          let startY = 45;

          // Client header
          doc
            .setFontSize(12)
            .setFont("helvetica", "bolditalic")
            .setTextColor(40)
            .text(
              `${client.firstName} ${client.lastName}'s Projects`,
              105,
              startY,
              { align: "center" }
            );

          startY += 20;

          // Projects table
          const headers = [
            [
              "Project Name",
              "Description",
              "Status",
              "Start Date",
              "End Date",
              "Created At",
            ],
          ];

          let clientTotal = 0;
          const data = clientProjects.map((p) => {
            clientTotal++;
            return [
              p.projectName || "N/A",
              p.description || "N/A",
              p.status || "N/A",
              p.startDate ? new Date(p.startDate).toLocaleDateString() : "N/A",
              p.endDate ? new Date(p.endDate).toLocaleDateString() : "N/A",
              p.created_at
                ? new Date(p.created_at).toLocaleDateString()
                : "N/A",
            ];
          });

          autoTable(doc, {
            startY: startY,
            head: headers,
            body: data,
            styles: {
              fontSize: 8,
              cellPadding: 3,
              overflow: "linebreak",
            },
            headStyles: {
              fillColor: [220, 220, 220],
              textColor: [0, 0, 0],
              fontStyle: "bold",
            },
            alternateRowStyles: {
              fillColor: [245, 245, 245],
            },
          });

          // Client summary
          startY = doc.lastAutoTable.finalY + 10;
          doc
            .setFontSize(10)
            .setFont("helvetica", "italic")
            .text(
              `Total Projects for ${client.firstName} ${client.lastName}: ${clientTotal}`,
              14,
              startY
            );

          grandTotal += clientTotal;
        }
      });

      // Add summary page if multiple clients
      if (clientsToExport.length > 1 && grandTotal > 0) {
        doc.addPage();
        setupPage(doc);

        doc
          .setFontSize(16)
          .setFont("helvetica", "bold")
          .setTextColor(40)
          .text("Projects Summary by Client", 105, 40, { align: "center" });

        const summaryHeaders = [["Client Name", "Number of Projects"]];
        const summaryData = clientsToExport.map((client) => {
          const count = projects.filter((p) => p.clientId === client.id).length;
          return [`${client.firstName} ${client.lastName}`, count];
        });
        autoTable(doc, {
          startY: 45,
          head: summaryHeaders,
          body: summaryData,
          styles: { fontSize: 6 },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
        });
        doc
          .setFontSize(10)
          .setFont("helvetica", "bolditalic")
          .text(
            `Overall Total: ${grandTotal} projects`,
            14,
            doc.lastAutoTable.finalY + 15
          );
      }
    }
    for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
      doc.setPage(i);
      addFooter(doc);
    }

    doc.save(`${selectedReport.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };
  const formatREVENUETHISMonthCSV = () => {
    let csvData = [];

    // Add headers
    csvData.push([
      "id",
      "Client",
      "Project",
      "Task",
      "Transaction ID",
      "Paid by",
      "Email",
      "Amount",
      "Currency",
      "MOP",
      "Date Paid",
      "Date Created",
    ]);

    // Filter appointments for the current month
    const currentMonthRevenues = revenues.filter((r) => {
      const revenuesDate = new Date(r.date_paid);
      return (
        revenuesDate.getMonth() === new Date().getMonth() &&
        revenuesDate.getFullYear() === new Date().getFullYear()
      );
    });

    // Populate CSV data
    currentMonthRevenues.forEach((r) => {
      csvData.push([
        r.id,
        r.client_id,
        r.project_id,
        r.task_id,
        r.transaction_id,
        r.payer_name,
        r.payer_email,
        r.amount,
        r.currency,
        r.mode_of_payment,
        r.date_paid,
        r.created_at,
      ]);
    });

    return csvData;
  };
  const formatAccountsReceivableOverviewCSV = () => {
    let csvData = [];
    csvData.push(["Received Payments"]);
    csvData.push([
      "Task ID",
      "Task Name",
      "Amount",
      "Transaction ID",
      "MOP",
      "Date Paid",
    ]);

    let receivedTotal = 0;
    detailedPaymentData.receivedPayments.forEach((payment) => {
      csvData.push([
        payment.task_id,
        payment.task_name,
        `₱${payment.amount.toFixed(2)}`,
        payment.transaction_id,
        payment.mode_of_payment,
        payment.date_paid
          ? new Date(payment.date_paid).toLocaleDateString()
          : "N/A",
      ]);
      receivedTotal += payment.amount;
    });

    csvData.push([
      "Total Amount",
      "",
      `₱${receivedTotal.toFixed(2)}`,
      "",
      "",
      "",
    ]);
    csvData.push([]);
    csvData.push(["Pending Payments"]);
    csvData.push(["Task ID", "Task Name", "Amount", "Due Date"]);

    let pendingTotal = 0;
    detailedPaymentData.pendingPayments.forEach((payment) => {
      csvData.push([
        payment.task_id,
        payment.task_name,
        `₱${payment.amount.toFixed(2)}`,
        payment.due_date
          ? new Date(payment.due_date).toLocaleDateString()
          : "N/A",
      ]);
      pendingTotal += payment.amount;
    });

    csvData.push(["Total Amount", "", `₱${pendingTotal.toFixed(2)}`, ""]);

    return csvData;
  };
  const formatPaymentsperClientCSV = () => {
    let csvData = [];
    let grandTotal = 0;

    // Filter clients based on selection
    const clientsToExport =
      selectedClient === "All"
        ? clients
        : clients.filter((c) => c.id.toString() === selectedClient);

    clientsToExport.forEach((client) => {
      const clientRevenues = revenues.filter((r) => r.client_id === client.id);

      if (clientRevenues.length > 0) {
        csvData.push([`${client.firstName} ${client.lastName}`]); // Add client name as a row
        csvData.push([
          "Transaction ID",
          "Project",
          "Task",
          "Paid by",
          "Amount",
          "MOP",
          "Date Paid",
        ]); // Headers

        let clientTotal = 0;

        clientRevenues.forEach((r) => {
          const project = projects.find((p) => p.id === r.project_id);
          // Safely get task name - use empty array if tasks not loaded yet
          const task = (tasks || []).find((t) => t.id === r.task_id);

          csvData.push([
            r.transaction_id || "N/A",
            project ? project.projectName : "N/A",
            task ? task.task_name : "N/A",
            r.payer_name || "N/A",
            `₱${r.amount.toFixed(2)}`,
            r.mode_of_payment || "N/A",
            r.date_paid ? new Date(r.date_paid).toLocaleDateString() : "N/A",
          ]);
          clientTotal += r.amount;
        });

        csvData.push([
          "Client Total",
          "",
          "",
          "",
          `₱${clientTotal.toFixed(2)}`,
          "",
          "",
        ]);
        csvData.push([]); // Blank row for spacing

        grandTotal += clientTotal;
      }
    });

    // Add grand total if there were any clients with revenues
    if (grandTotal > 0) {
      csvData.push([
        "GRAND TOTAL",
        "",
        "",
        "",
        `₱${grandTotal.toFixed(2)}`,
        "",
        "",
      ]);
    }

    return csvData;
  };
  const formatRevenueperProjectCSV = () => {
    let csvData = [];
    let grandTotal = 0;

    // Filter projects based on selection
    const projectsToExport =
      selectedProject === "All"
        ? projects
        : projects.filter((p) => p.id.toString() === selectedProject);

    projectsToExport.forEach((project) => {
      const projectRevenues = revenues.filter(
        (r) => r.project_id === project.id
      );

      if (projectRevenues.length > 0) {
        csvData.push([`${project.projectName}`]); // Add project name as a row
        csvData.push([
          "Transaction ID",
          "Task",
          "Paid by",
          "Amount",
          "MOP",
          "Date Paid",
        ]); // Headers

        let projectTotal = 0;

        projectRevenues.forEach((r) => {
          const task = (tasks || []).find((t) => t.id === r.task_id);

          csvData.push([
            r.transaction_id || "N/A",
            task ? task.task_name : "N/A",
            r.payer_name || "N/A",
            `₱${r.amount.toFixed(2)}`,
            r.mode_of_payment || "N/A",
            r.date_paid ? new Date(r.date_paid).toLocaleDateString() : "N/A",
          ]);
          projectTotal += r.amount;
        });

        csvData.push([
          "Project Total",
          "",
          "",
          `₱${projectTotal.toFixed(2)}`,
          "",
          "",
        ]);
        csvData.push([]); // Blank row for spacing

        grandTotal += projectTotal;
      }
    });

    // Add grand total if there were any projects with revenues
    if (grandTotal > 0) {
      csvData.push([
        "GRAND TOTAL",
        "",
        "",
        `₱${grandTotal.toFixed(2)}`,
        "",
        "",
      ]);
    }

    return csvData;
  };

  let exportCSVData = [];

  if (selectedReport === "REVENUE THIS MONTH") {
    exportCSVData = formatREVENUETHISMonthCSV();
  } else if (selectedReport === "Accounts Receivable Overview") {
    exportCSVData = formatAccountsReceivableOverviewCSV();
  } else if (selectedReport === "Payments per Client") {
    exportCSVData = formatPaymentsperClientCSV();
  } else if (selectedReport === "Revenue per Project") {
    exportCSVData = formatRevenueperProjectCSV();
  } else {
    exportCSVData = revenues; // Default case for Total Appointments & Appointments This Month
  }
  return (
    <div className="revenue-p-4">
      {/* Report Type Selection */}
      <div className="filter-buttons">
        <select
          className="revenue-report-type"
          value={selectedReport}
          onChange={(e) => setSelectedReport(e.target.value)}
        >
          <option value="">Select Report Type</option>
          <option value="TOTAL REVENUE">Total revenue</option>
          <option value="REVENUE THIS MONTH">Revenue this Month</option>
          <option value="Accounts Receivable Overview">
            Accounts Receivable Overview
          </option>
          <option value="Payments per Client">Payments per Client</option>
          <option value="Revenue per Project">Revenue per Project</option>
        </select>

        {/* Add project selection dropdown when Revenue per Project is selected */}
        {selectedReport === "Revenue per Project" && (
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="ml-4"
          >
            <option value="All">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName}
              </option>
            ))}
          </select>
        )}

        {/* Add client selection dropdown when Payments per Client is selected */}
        {selectedReport === "Payments per Client" && (
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="ml-4"
          >
            <option value="All">All Clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
        )}

        {selectedReport && (
          <>
            {/* Add year/month filters for TOTAL REVENUE */}
            {selectedReport === "TOTAL REVENUE" && (
              <div className="flex gap-2 ml-4">
                <select
                  className="border p-2"
                  value={exportFilters.year}
                  onChange={(e) =>
                    setExportFilters({ ...exportFilters, year: e.target.value })
                  }
                >
                  <option value="All">All Years</option>
                  {availableYears.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  className="border p-2"
                  value={exportFilters.month}
                  onChange={(e) =>
                    setExportFilters({
                      ...exportFilters,
                      month: e.target.value,
                    })
                  }
                >
                  <option value="All">All Months</option>
                  {[
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
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <CSVLink
              data={exportCSVData}
              filename={`${selectedReport.replace(/\s+/g, "_").toLowerCase()}_${
                selectedReport === "Revenue per Project"
                  ? selectedProject === "All"
                    ? "all_projects"
                    : "project_" + selectedProject
                  : selectedReport === "Payments per Client"
                  ? selectedClient === "All"
                    ? "all_clients"
                    : "client_" + selectedClient
                  : "report"
              }.csv`}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Export CSV
            </CSVLink>

            <button
              onClick={() => exportPDF(exportFilters)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Export PDF
            </button>
          </>
        )}
      </div>

      {/* Reports Grid */}
      <div id="summary-section">
        <div className="summary-box">
          <h2 className="summary-title">Total Revenue</h2>
          <p className="summary-value">₱ {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="summary-box">
          <h2 className="summary-title">Revenue this Month</h2>
          <p className="summary-value">₱ {revenueThisMonth.toLocaleString()}</p>
        </div>
      </div>

      <div className="revenue-grid">
        <div className="chart-container">
          <h3>Accounts Receivable Overview</h3>
          <p>
            Compares received payments and pending payments for a clearer view
            of outstanding balances.
          </p>
          <PieChart width={400} height={300}>
            <Pie
              data={paymentData}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {paymentData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        {/* Overdue Payments */}
        <div className="chart-container scrollable-chart">
          <h3>Overdue Payments</h3>
          <p>
            Displays overdue payments, showing their due dates and amounts.
          </p>{" "}
          <LineChart
            width={1500}
            height={400}
            data={overduePayments}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-15} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#FF5252"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>

        {/* Total Revenue per Project */}
        <div className="chart-container scrollable-chart">
          <h3>Total Revenue per Project</h3>
          <p>Displays the total revenue generated by each project.</p>{" "}
          <div className="filter-buttons">
            <label>
              Filter by Payment Status:
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Not Paid">Unpaid</option>
              </select>
            </label>
          </div>
          <BarChart width={1500} height={400} data={totalPerProject}>
            <XAxis dataKey="project_name" angle={-15} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_revenue" fill="#82ca9d" />
          </BarChart>
        </div>

        {/* Payment Received vs. Remaining Balances */}
        <div className="chart-container scrollable-chart">
          <h3>Payment Received vs. Remaining Balances</h3>
          <p>
            Compares payments already received with remaining balances for
            various projects.
          </p>{" "}
          <LineChart
            width={1500}
            height={400}
            data={receivedVsRemaining}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-15} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="received"
              stroke="#4CAF50"
              activeDot={{ r: 8 }}
              name="Received"
            />
            <Line
              type="monotone"
              dataKey="remaining"
              stroke="#FF5252"
              activeDot={{ r: 8 }}
              name="Remaining"
            />
          </LineChart>
        </div>
      </div>

      <div className="chart-container scrollable-chart">
        <h3>Payments per Client</h3>
        <p>Shows the total payments received from each client.</p>{" "}
        <BarChart width={1700} height={400} data={paymentsPerClient}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total_amount" fill="#8884d8" name="Total" />
        </BarChart>
      </div>
    </div>
  );
};

export default RevenueReports;
