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
  const [paymentData, setPaymentData] = useState([]);
  const [overduePayments, setOverduePayments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [totalPerProject, setTotalPerProject] = useState([]);
  const [receivedVsRemaining, setReceivedVsRemaining] = useState([]);
  const [paymentsPerClient, setPaymentsPerClient] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueThisMonth, setRevenueThisMonth] = useState(0);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("All");
  const [filters, setFilters] = useState({
    month: "All",
    year: new Date().getFullYear(),
  });
  const [selectedReport, setSelectedReport] = useState("");

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
      const { receivedPayments, pendingPayments, revenueThisMonth } =
        response.data;

      setPaymentData([
        { name: "Received Payments", value: receivedPayments },
        { name: "Pending Payments", value: pendingPayments },
      ]);
      setTotalRevenue(receivedPayments);
      setRevenueThisMonth(revenueThisMonth);
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
  
    // Add headers
    csvData.push(["Category", "Amount"]);
  
    // Populate CSV data
    paymentData.forEach((item) => {
      csvData.push([item.name, item.value]);
    });
  
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
          <option value="TOTAL REVENUE">TOTAL REVENUE</option>
          <option value="REVENUE THIS MONTH">REVENUE THIS MONTH</option>
          <option value="Accounts Receivable Overview">
            Accounts Receivable Overview
          </option>
          <option value="Payments per Client">Payments per Client</option>
          <option value="Revenue per Project">Revenue per Project</option>
          <option value="Overdue Payments">Overdue Payments</option>
        </select>

        {selectedReport && (
          <>
            <CSVLink
              data={exportCSVData}
              filename={`${selectedReport
                .replace(/\s+/g, "_")
                .toLowerCase()}.csv`}
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
          <h2 className="summary-title">TOTAL REVENUE</h2>
          <p className="summary-value">₱ {totalRevenue.toLocaleString()}</p>
        </div>
        <div className="summary-box">
          <h2 className="summary-title">REVENUE THIS MONTH</h2>
          <p className="summary-value">₱ {revenueThisMonth.toLocaleString()}</p>
        </div>
      </div>

      <div className="revenue-grid">
        <div className="chart-container">
          <h3>Accounts Receivable Overview</h3>
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
