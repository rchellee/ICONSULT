// src/components/Transaction.jsx
import React, { useState } from "react";
import "./Transaction.css"; // Import the CSS file

const Transaction = ({ projectId }) => {
  // Helper function to format amounts as ₱ 1,000.00
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Helper function to format dates as March 12, 2025
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Sample transaction data for a single project
  const transactions = [
    {
      expenses: "Professional Fee",
      amount: 1000,
      datePaid: "",
      status: "",
    },
    {
      expenses: "Task Fee",
      amount: 1000,
      datePaid: "",
      status: "",
    },
    {
      expenses: "Miscellaneous Fees",
      amount: 1000, // Parent category, amount will be calculated from sub-items
      datePaid: "",
      status: "",
      subItems: [
        {
          expenses: "misc1",
          amount: 500,
          datePaid: "2023-10-01",
          status: "Paid",
        },
        {
          expenses: "misc2",
          amount: 500,
          datePaid: "",
          status: "",
        },
      ],
    },
  ];

  // State to manage the visibility of sub-items
  const [showSubItems, setShowSubItems] = useState(false);

  // Toggle sub-items visibility
  const toggleSubItems = () => {
    setShowSubItems(!showSubItems);
  };

  // Calculate total amount for each category
  const calculateTotalAmount = (transactions) => {
    return transactions.reduce((sum, transaction) => {
      if (transaction.subItems) {
        return sum + transaction.subItems.reduce((subSum, subItem) => subSum + subItem.amount, 0);
      }
      return sum + transaction.amount;
    }, 0);
  };

  // Calculate total amount
  const totalAmount = calculateTotalAmount(transactions);

  // Calculate total paid amount
  const totalPaid = transactions.reduce((sum, transaction) => {
    if (transaction.subItems) {
      return (
        sum +
        transaction.subItems
          .filter((subItem) => subItem.status === "Paid")
          .reduce((subSum, subItem) => subSum + subItem.amount, 0)
      );
    }
    return transaction.status === "Paid" ? sum + transaction.amount : sum;
  }, 0);

  // Calculate payment progress percentage
  const paymentProgress = ((totalPaid / totalAmount) * 100).toFixed(2); // 2 decimal places

  // State for selected status
  const [status, setStatus] = useState("Paid"); // Default status

  // State for payment agreement
  const [paymentAgreement, setPaymentAgreement] = useState("Full payment by March 16, 2025");

  // State for partial payment date
  const [partialPaymentDate, setPartialPaymentDate] = useState("");

  // State for paid date
  const [paidDate, setPaidDate] = useState("");

  // State for overdue days
  const [overdueDays, setOverdueDays] = useState(0);

  // Handle status change
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    // Get the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Set the date based on the selected status
    if (newStatus === "Paid") {
      setPaidDate(today); // Set current date as paid date
      setPartialPaymentDate(""); // Clear partial payment date
    } else if (newStatus === "Partial Payment") {
      setPartialPaymentDate(today); // Set current date as partial payment date
      setPaidDate(""); // Clear paid date
    } else {
      setPaidDate(""); // Clear paid date
      setPartialPaymentDate(""); // Clear partial payment date
    }

    // Update overdue days if status is not "Paid"
    if (newStatus !== "Paid") {
      const dueDate = new Date("2025-03-16"); // Example due date
      const timeDiff = new Date() - dueDate;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      setOverdueDays(daysDiff > 0 ? daysDiff : 0);
    } else {
      setOverdueDays(0);
    }
  };

  return (
    <div>
      {/* Header with Project ID, Progress, and Set Status */}
      <div className="header-container">
        <h2 className="project-id">Project: {projectId}</h2>
        <div className="progress-container">
          <span className="progress-text">Progress: {paymentProgress}%</span>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${paymentProgress}%` }}
            ></div>
          </div>
        </div>
        <div className="status-container">
          <span className="status-label">Payment Status:</span>
          <select
            className="status-dropdown"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="Paid">Paid</option>
            <option value="Partial Payment">Partial Payment</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Overdue">Overdue</option>
          </select>
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>

      {/* Details Section */}
      <div className="details-container">
        <h3>Details:</h3>
        <div className="details-content">
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Payment Agreement:</span>
              <span className="detail-value">{paymentAgreement}</span>
            </div>
            <div className="detail-item partial-payment">
              <span className="detail-label">Partial Payment:</span>
              <span className="detail-value">{formatAmount(totalPaid)}</span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Date Paid:</span>
              <span className="detail-value">{formatDate(paidDate)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date Partial Payment:</span>
              <span className="detail-value">{formatDate(partialPaymentDate)}</span>
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">Overdue:</span>
              <span className="detail-value">
                {status !== "Paid" && overdueDays > 0
                  ? `${overdueDays} days past due`
                  : "No overdue"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Expenses</th>
            <th>Amount</th>
            <th>Date Paid</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <React.Fragment key={index}>
              {/* Parent Transaction */}
              <tr>
                <td>
                  {transaction.subItems ? (
                    <button onClick={toggleSubItems} className="toggle-misc-btn">
                      {showSubItems ? "▼" : "▶"} {transaction.expenses}
                    </button>
                  ) : (
                    transaction.expenses
                  )}
                </td>
                <td>
                  {transaction.subItems
                    ? formatAmount(calculateTotalAmount(transaction.subItems))
                    : formatAmount(transaction.amount)}
                </td>
                <td></td>
                <td></td>
              </tr>
              {/* Sub-items */}
              {transaction.subItems &&
                showSubItems &&
                transaction.subItems.map((subItem, subIndex) => (
                  <tr key={`sub-${subIndex}`}>
                    <td style={{ paddingLeft: "20px" }}>- {subItem.expenses}</td>
                    <td>{formatAmount(subItem.amount)}</td>
                    <td>{formatDate(subItem.datePaid)}</td>
                    <td>{subItem.status}</td>
                  </tr>
                ))}
            </React.Fragment>
          ))}
          {/* Total row */}
          <tr className="total-row">
            <td>Total</td>
            <td>{formatAmount(totalAmount)}</td>
            <td colSpan="2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;