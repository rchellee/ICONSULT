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
      setRevenueThisMonth(receivedPayments); // Assuming you want to update this too
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
    } catch (error) {
      console.error("Error fetching revenues", error);
    }
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
  const exportPDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4");
    doc.setFontSize(8);
    doc.text(selectedReport, 10, 10);
    let yPos = 20;
    const chartElement = document.getElementById("chart-container");
    if (chartElement) {
      try {
        // Capture chart as an image
        const canvas = await html2canvas(chartElement);
        const imgData = canvas.toDataURL("image/png");

        // Add image to the PDF
        doc.addImage(imgData, "PNG", 10, yPos, 120, 80);
        yPos += 90; // Adjust position for the table
      } catch (error) {
        console.error("Error capturing chart:", error);
      }
    }
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
      const data = revenues.map((r) => [
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

      autoTable(doc, {
        startY: yPos,
        head: headers,
        body: data,
        styles: { fontSize: 8 },
      });
    }
    if (selectedReport === "REVENUE THIS MONTH") {
      // Filter revenues for the current month
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

      autoTable(doc, {
        startY: yPos,
        head: headers,
        body: data,
        styles: { fontSize: 8 },
      });
    }
    if (selectedReport === "Accounts Receivable Overview") {
      doc.setFontSize(8);

      // Add report title
      doc.text("Accounts Receivable Overview", 14, yPos);
      yPos += 10;

      // Add Received Payments section header
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.text("Received Payments", 14, yPos);
      yPos += 7;

      // Add Received Payments table headers
      doc.setFont("helvetica", "normal");
      const receivedHeaders = [
        "Task ID",
        "Task Name",
        "Amount",
        "Transaction ID",
        "MOP",
        "Date Paid",
      ];

      // Prepare Received Payments data
      const receivedRows = detailedPaymentData.receivedPayments.map(
        (payment) => [
          payment.task_id,
          payment.task_name,
          `₱${payment.amount.toFixed(2)}`,
          payment.transaction_id || "N/A",
          payment.mode_of_payment || "N/A",
          payment.date_paid
            ? new Date(payment.date_paid).toLocaleDateString()
            : "N/A",
        ]
      );

      // Calculate received total
      const receivedTotal = detailedPaymentData.receivedPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      // Add Received Payments table
      autoTable(doc, {
        startY: yPos,
        head: [receivedHeaders],
        body: receivedRows,
        margin: { left: 14 },
        styles: { fontSize: 8, cellPadding: 2 },
      });
      yPos = doc.lastAutoTable.finalY + 5;
      doc.text(`Total Amount: ₱${receivedTotal.toFixed(2)}`, 14, yPos);
      yPos += 10;

      doc.setFont("helvetica", "bold");
      doc.text("Pending Payments", 14, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");
      const pendingHeaders = ["Task ID", "Task Name", "Amount", "Due Date"];

      // Prepare Pending Payments data
      const pendingRows = detailedPaymentData.pendingPayments.map((payment) => [
        payment.task_id,
        payment.task_name,
        `₱${payment.amount.toFixed(2)}`,
        payment.due_date
          ? new Date(payment.due_date).toLocaleDateString()
          : "N/A",
      ]);

      // Calculate pending total
      const pendingTotal = detailedPaymentData.pendingPayments.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      // Add Pending Payments table
      autoTable(doc, {
        startY: yPos,
        head: [pendingHeaders],
        body: pendingRows,
        margin: { left: 14 },
        styles: { fontSize: 8, cellPadding: 2 },
      });

      // Add Pending Payments total
      yPos = doc.lastAutoTable.finalY + 5;
      doc.text(`Total Amount: ₱${pendingTotal.toFixed(2)}`, 14, yPos);
    }
    if (selectedReport === "Payments per Client") {
      let grandTotal = 0;

      // Filter clients based on selection
      const clientsToExport =
        selectedClient === "All"
          ? clients
          : clients.filter((c) => c.id.toString() === selectedClient);

      clientsToExport.forEach((client) => {
        const clientRevenues = revenues.filter(
          (r) => r.client_id === client.id
        );

        if (clientRevenues.length > 0) {
          doc.setFontSize(8);
          doc.text(`${client.firstName} ${client.lastName}`, 10, yPos);
          yPos += 10;

          const headers = [["Transaction ID", "Amount", "MOP", "Date Paid"]];
          let clientTotal = 0;
          const data = clientRevenues.map((r) => {
            clientTotal += r.amount;
            return [
              r.transaction_id || "N/A",
              `₱${r.amount.toFixed(2)}`,
              r.mode_of_payment || "N/A",
              r.date_paid ? new Date(r.date_paid).toLocaleDateString() : "N/A",
            ];
          });

          autoTable(doc, {
            startY: yPos,
            head: headers,
            body: data,
            styles: { fontSize: 8 },
          });

          // Add client total
          yPos = doc.lastAutoTable.finalY + 5;
          doc.text(`Client Total: ₱${clientTotal.toFixed(2)}`, 10, yPos);
          yPos += 15; // Extra space before next client

          grandTotal += clientTotal;
        }
      });
      if (grandTotal > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`GRAND TOTAL: ₱${grandTotal.toFixed(2)}`, 10, yPos);
        doc.setFont("helvetica", "normal");
      }
    }
    if (selectedReport === "Revenue per Project") {
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
          doc.setFontSize(8);
          doc.text(`${project.projectName}`, 10, yPos);
          yPos += 10;

          const headers = [["Transaction ID", "Amount", "MOP", "Date Paid"]];
          let projectTotal = 0;
          const data = projectRevenues.map((r) => {
            projectTotal += r.amount;
            return [
              r.transaction_id || "N/A",
              `₱${r.amount.toFixed(2)}`,
              r.mode_of_payment || "N/A",
              r.date_paid ? new Date(r.date_paid).toLocaleDateString() : "N/A",
            ];
          });

          autoTable(doc, {
            startY: yPos,
            head: headers,
            body: data,
          });

          // Add project total
          yPos = doc.lastAutoTable.finalY + 5;
          doc.text(`Project Total: ₱${projectTotal.toFixed(2)}`, 10, yPos);
          yPos += 15; // Extra space before next project

          grandTotal += projectTotal;
        }
      });
      if (grandTotal > 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`GRAND TOTAL: ₱${grandTotal.toFixed(2)}`, 10, yPos);
        doc.setFont("helvetica", "normal");
      }
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
        csvData.push(["Transaction ID", "Amount", "MOP", "Date Paid"]); // Headers

        let clientTotal = 0;

        clientRevenues.forEach((r) => {
          csvData.push([
            r.transaction_id || "N/A",
            `₱${r.amount.toFixed(2)}`,
            r.mode_of_payment || "N/A",
            r.date_paid ? new Date(r.date_paid).toLocaleDateString() : "N/A",
          ]);
          clientTotal += r.amount;
        });

        csvData.push(["Client Total", `₱${clientTotal.toFixed(2)}`, "", ""]);
        csvData.push([]); // Blank row for spacing

        grandTotal += clientTotal;
      }
    });

    // Add grand total if there were any clients with revenues
    if (grandTotal > 0) {
      csvData.push(["GRAND TOTAL", `₱${grandTotal.toFixed(2)}`, "", ""]);
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
        csvData.push(["Transaction ID", "Amount", "MOP", "Date Paid"]);

        let projectTotal = 0;

        projectRevenues.forEach((r) => {
          csvData.push([
            r.transaction_id || "N/A",
            `₱${r.amount.toFixed(2)}`,
            r.mode_of_payment || "N/A",
            r.date_paid ? new Date(r.date_paid).toLocaleDateString() : "N/A",
          ]);
          projectTotal += r.amount;
        });

        csvData.push(["Project Total", `₱${projectTotal.toFixed(2)}`, "", ""]);
        csvData.push([]); // Blank row for spacing

        grandTotal += projectTotal;
      }
    });

    // Add grand total if there were any projects with revenues
    if (grandTotal > 0) {
      csvData.push(["GRAND TOTAL", `₱${grandTotal.toFixed(2)}`, "", ""]);
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
              onClick={exportPDF}
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
          <h2 className="summary-title">Revenue this Month </h2>
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
          <Bar dataKey="total_amount" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default RevenueReports;
