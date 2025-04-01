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
  const [exportType, setExportType] = useState("All");
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
    const fetchData = async () => {
      await fetchClients();
      await fetchTasks(); // Load tasks first
      await fetchProjects();
      await fetchRevenues();
      await fetchPaymentsPerClient(); // Now this will have tasks data available
    };
    fetchData();
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

      // Transform data to include task names by joining with tasks data
      const dataWithTasks = response.data.map((item) => ({
        ...item,
        task_name: item.task_name || "No Task Assigned", // Directly use API response
        client_name:
          clients.find((c) => c.id === item.client_id)?.name || item.name,
      }));

      setPaymentsPerClient(dataWithTasks);
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
  const CustomClientTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <p>
            <strong>Client:</strong> {data.client_name || data.name}
          </p>
          <p>
            <strong>Amount:</strong> ₱{data.total_amount?.toFixed(2) || "0.00"}
          </p>
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
      try {
        // Always include the chart page
        const chartElement = document.querySelector(
          "#receivable-graph .recharts-wrapper"
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

          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Accounts Receivable Overview", 105, 45, { align: "center" });

          doc.addImage(
            imgData,
            "PNG",
            (doc.internal.pageSize.getWidth() - imgWidth) / 2,
            50,
            imgWidth,
            imgHeight
          );

          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(
              "Compares received payments and pending payments for a clearer view of outstanding balances.",
              105,
              50 + imgHeight + 10,
              { align: "center" }
            );
        }

        // Add pages based on selected export type
        if (exportType === "All" || exportType === "Received") {
          doc.addPage();
          setupPage(doc);
          let yPos = 40;

          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Received Payments", 105, yPos, { align: "center" });

          yPos += 15;

          const receivedHeaders = [
            "Task ID",
            "Task Name",
            "Amount",
            "Transaction ID",
            "MOP",
            "Date Paid",
          ];

          const receivedRows = detailedPaymentData.receivedPayments.map(
            (payment) => [
              payment.task_id,
              payment.task_name,
              `${payment.amount.toFixed(2)}`,
              payment.transaction_id || "N/A",
              payment.mode_of_payment || "N/A",
              payment.date_paid
                ? new Date(payment.date_paid).toLocaleDateString()
                : "N/A",
            ]
          );

          const receivedTotal = detailedPaymentData.receivedPayments.reduce(
            (sum, payment) => sum + payment.amount,
            0
          );

          autoTable(doc, {
            startY: yPos,
            head: [receivedHeaders],
            body: receivedRows,
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

          yPos = doc.lastAutoTable.finalY + 5;
          doc
            .setFontSize(10)
            .setFont("helvetica", "bolditalic")
            .setTextColor(40)
            .text(`Total Amount: ${receivedTotal.toFixed(2)}`, 14, yPos);
        }

        if (exportType === "All" || exportType === "Pending") {
          doc.addPage();
          setupPage(doc);
          let yPos = 40;

          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Pending Payments", 105, yPos, { align: "center" });

          yPos += 15;

          const pendingHeaders = ["Task ID", "Task Name", "Amount", "Due Date"];

          const pendingRows = detailedPaymentData.pendingPayments.map(
            (payment) => [
              payment.task_id,
              payment.task_name,
              `${payment.amount.toFixed(2)}`,
              payment.due_date
                ? new Date(payment.due_date).toLocaleDateString()
                : "N/A",
            ]
          );

          const pendingTotal = detailedPaymentData.pendingPayments.reduce(
            (sum, payment) => sum + payment.amount,
            0
          );

          autoTable(doc, {
            startY: yPos,
            head: [pendingHeaders],
            body: pendingRows,
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

          yPos = doc.lastAutoTable.finalY + 5;
          doc
            .setFontSize(10)
            .setFont("helvetica", "bolditalic")
            .setTextColor(40)
            .text(`Total Amount: ${pendingTotal.toFixed(2)}`, 14, yPos);
        }
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
    if (selectedReport === "Payments per Client") {
      let grandTotal = 0;
      let hasData = false; // Flag to track if any client has data

      // Filter clients based on selection
      const clientsToExport =
        selectedClient === "All"
          ? clients
          : clients.filter((c) => c.id.toString() === selectedClient);

      // First Page - Chart
      try {
        const chartElement = document.querySelector(
          "#payments-chart .recharts-wrapper"
        );
        if (chartElement) {
          const canvas = await html2canvas(chartElement, {
            scale: 3,
            logging: true,
            useCORS: true,
            height: chartElement.offsetHeight * 1.5,
            windowHeight: chartElement.offsetHeight * 1.5,
          });
          const imgData = canvas.toDataURL("image/png");
          const imgWidth = 190;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          doc
            .setFontSize(16)
            .setFont("helvetica", "bold")
            .setTextColor(40)
            .text("Payments per Client", 105, 50, { align: "center" });

          doc.addImage(
            imgData,
            "PNG",
            (doc.internal.pageSize.getWidth() - imgWidth) / 2,
            70,
            imgWidth,
            imgHeight
          );

          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(
              "This chart shows the total payments received from each client.",
              105,
              70 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Second Page - Start client data
      doc.addPage();
      setupPage(doc);
      let startY = 40;

      // Process each client's data
      for (const client of clientsToExport) {
        const clientRevenues = revenues.filter(
          (r) => r.client_id === client.id
        );

        if (clientRevenues.length > 0) {
          hasData = true; // We found data for at least one client

          // Client header
          doc
            .setFontSize(12)
            .setFont("helvetica", "bold")
            .text(`${client.firstName} ${client.lastName}`, 14, startY);
          startY += 10;

          // Client payments table
          const headers = [
            [
              "Transaction ID",
              "Project",
              "Task",
              "Paid by",
              "Amount",
              "MOP",
              "Date Paid",
            ],
          ];

          let clientTotal = 0;
          const data = clientRevenues.map((r) => {
            const project = projects.find((p) => p.id === r.project_id);
            const task = tasks?.find((t) => t.id === r.task_id);
            clientTotal += r.amount;

            return [
              r.transaction_id || "N/A",
              project?.projectName || "N/A",
              task?.task_name || "N/A",
              r.payer_name || "N/A",
              `${r.amount.toFixed(2)}`,
              r.mode_of_payment || "N/A",
              r.date_paid ? new Date(r.date_paid).toLocaleDateString() : "N/A",
            ];
          });

          autoTable(doc, {
            startY: startY,
            head: headers,
            body: data,
            styles: {
              fontSize: 8,
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

          // Client total
          startY = doc.lastAutoTable.finalY + 10;
          doc
            .setFontSize(10)
            .setFont("helvetica", "bolditalic")
            .text(`Client Total: ${clientTotal.toFixed(2)}`, 14, startY);
          startY += 15;

          grandTotal += clientTotal;

          // Add page break if we're running out of space
          if (startY > doc.internal.pageSize.height - 100) {
            doc.addPage();
            setupPage(doc);
            startY = 40;
          }
        }
      }

      // If no data was found for any client
      if (!hasData) {
        doc
          .setFontSize(12)
          .setTextColor(100)
          .text("No payment data found for the selected client(s)", 14, startY);
        return; // Skip the summary since there's no data
      }

      // Add summary page if multiple clients
      if (clientsToExport.length > 1 && grandTotal > 0) {
        doc.addPage();
        setupPage(doc);
        startY = 40;

        // Summary title
        doc
          .setFontSize(16)
          .setFont("helvetica", "bold")
          .setTextColor(40)
          .text("Payments Summary", 105, startY, { align: "center" });
        startY += 20;

        // Summary table
        const summaryHeaders = [["Client Name", "Total Payments"]];
        const summaryData = clientsToExport.map((client) => {
          const clientTotal = revenues
            .filter((r) => r.client_id === client.id)
            .reduce((sum, r) => sum + r.amount, 0);
          return [
            `${client.firstName} ${client.lastName}`,
            `${clientTotal.toFixed(2)}`,
          ];
        });

        autoTable(doc, {
          startY: startY,
          head: summaryHeaders,
          body: summaryData,
          styles: { fontSize: 8 },
          headStyles: {
            fillColor: [220, 220, 220],
            textColor: [0, 0, 0],
            fontStyle: "bold",
          },
        });

        // Grand total
        startY = doc.lastAutoTable.finalY + 10;
        doc
          .setFontSize(12)
          .setFont("helvetica", "bold")
          .text(`TOTAL: ${grandTotal.toFixed(2)}`, 14, startY);
      }
    }
    if (selectedReport === "Revenue per Project") {
      try {
        // Capture the chart element
        const chartElement = document.querySelector(
          "#revenue-chart .recharts-wrapper"
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
            .text("Revenue per Project", 105, 45, { align: "center" });

          doc.addImage(
            imgData,
            "PNG",
            (doc.internal.pageSize.getWidth() - imgWidth) / 2,
            60,
            imgWidth,
            imgHeight
          );

          // Add description below chart
          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(
              "This chart shows the revenue generated by each project.",
              105,
              60 + imgHeight + 10,
              { align: "center" }
            );
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
      }

      // Add new page for project details
      doc.addPage();
      setupPage(doc);

      let grandTotalRevenue = 0;
      let totalProjects = 0;
      const projectsToExport =
        selectedProject === "All"
          ? projects
          : projects.filter((p) => p.id.toString() === selectedProject);

      projectsToExport.forEach((project, index) => {
        const projectRevenues = revenues.filter(
          (r) => r.project_id === project.id
        );
        const projectClient = clients.find((c) => c.id === project.clientId);

        if (projectRevenues.length > 0) {
          // Add new page if not first project and we're running out of space
          if (index > 0) {
            doc.addPage();
            setupPage(doc);
          }

          let startY = 47;

          // Project header with client name
          doc
            .setFontSize(12)
            .setFont("helvetica", "bolditalic")
            .setTextColor(40)
            .text(`Project: ${project.projectName}`, 14, startY);

          startY += 7;

          // Display client name or fallback to payer_name from revenues
          const clientDisplayName = projectClient
            ? `${projectClient.firstName} ${projectClient.lastName}`
            : projectRevenues[0]?.payer_name || "Client Not Specified";

          doc
            .setFontSize(10)
            .setTextColor(80)
            .text(`Client: ${clientDisplayName}`, 14, startY);

          startY += 10;

          // Project revenues table
          const headers = [
            ["Transaction ID", "Task", "Paid by", "Amount", "MOP", "Date Paid"],
          ];

          let projectTotal = 0;
          const data = projectRevenues.map((r) => {
            const task = tasks.find((t) => t.id === r.task_id);
            projectTotal += r.amount;

            return [
              r.transaction_id || "N/A",
              task?.task_name || "N/A",
              r.payer_name || "N/A",
              `₱${r.amount.toFixed(2)}`,
              r.mode_of_payment || "N/A",
              r.date_paid ? new Date(r.date_paid).toLocaleDateString() : "N/A",
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

          // Project summary
          startY = doc.lastAutoTable.finalY + 10;
          doc
            .setFontSize(10)
            .setFont("helvetica", "bolditalic")
            .text(
              `Project Revenue Total: ₱${projectTotal.toFixed(2)}`,
              14,
              startY
            );

          grandTotalRevenue += projectTotal;
          totalProjects++;
        }
      });

      // Add summary page if multiple projects
      if (projectsToExport.length > 1 && grandTotalRevenue > 0) {
        doc.addPage();
        setupPage(doc);
        let startY = 40;

        // Summary title
        doc
          .setFontSize(14)
          .setFont("helvetica", "bold")
          .setTextColor(40)
          .text("Revenue Summary by Project", 105, startY, { align: "center" });

        startY += 10;

        // Summary table
        const summaryHeaders = [["Project Name", "Revenue"]];
        const summaryData = projectsToExport.map((project) => {
          const projectRevenues = revenues.filter(
            (r) => r.project_id === project.id
          );
          const projectTotal = projectRevenues.reduce(
            (sum, r) => sum + r.amount,
            0
          );

          return [project.projectName, `₱${projectTotal.toFixed(2)}`];
        });

        autoTable(doc, {
          startY: startY,
          head: summaryHeaders,
          body: summaryData,
          styles: {
            fontSize: 8,
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
        });

        // Grand total
        startY = doc.lastAutoTable.finalY + 15;
        doc
          .setFontSize(10)
          .setFont("helvetica", "bold")
          .text(
            `Total Revenue for ${totalProjects} Projects: ₱${grandTotalRevenue.toFixed(
              2
            )}`,
            14,
            startY
          );
      } else if (projectsToExport.length === 0) {
        // Handle case where no projects were found
        doc
          .setFontSize(12)
          .setTextColor(100)
          .text("No project data found with the current filters", 14, 50);
      }
    }
    for (let i = 1; i <= doc.internal.getNumberOfPages(); i++) {
      doc.setPage(i);
      addFooter(doc);
    }

    doc.save(`${selectedReport.replace(/\s+/g, "_").toLowerCase()}.pdf`);
  };
  const formatREVENUETHISMonthCSV = () => {
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

        {selectedReport === "Accounts Receivable Overview" && (
          <select
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            className="ml-4"
          >
            <option value="All">All Payments</option>
            <option value="Received">Received Payments Only</option>
            <option value="Pending">Pending Payments Only</option>
          </select>
        )}

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

            {(selectedReport !== "Payments per Client" ||
              selectedClient === "All") &&
              (selectedReport !== "Accounts Receivable Overview" ||
                exportType === "All") && (
                <CSVLink
                  data={exportCSVData}
                  filename={`${selectedReport
                    .replace(/\s+/g, "_")
                    .toLowerCase()}_${
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
              )}

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
        <div className="chart-container" id="receivable-graph">
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
        <div className="chart-container scrollable-chart" id="revenue-chart">
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

      <div className="chart-container scrollable-chart" id="payments-chart">
        <h3>Payments per Client</h3>
        <p>Shows the total payments received from each client.</p>
        <BarChart width={1550} height={580} data={paymentsPerClient}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="task_name"
            angle={-20}
            tickFormatter={(value) =>
              value?.length > 15 ? `${value.substring(0, 15)}...` : value
            }
            height={70} // Give more space for angled labels
          />
          <YAxis />
          <Tooltip content={<CustomClientTooltip />} />
          <Legend />
          <Bar dataKey="total_amount" fill="#8884d8" name="Total Payments" />
        </BarChart>
      </div>
    </div>
  );
};

export default RevenueReports;
