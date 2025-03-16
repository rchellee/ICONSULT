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

  // Helper function to calculate past due days
  const calculatePastDueDays = (dueDate) => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = today - due;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  // Sample transaction data with task fees and miscellaneous items
  const [transactions, setTransactions] = useState([
    {
      expenses: "Task 1",
      taskFee: 500, // Task fee
      dueDate: "2025-03-10", // Due date for the task
      subItems: [
        {
          expenses: "Misc1",
          amount: 300, // Miscellaneous amount
        },
        {
          expenses: "Misc2",
          amount: 300, // Miscellaneous amount
        },
      ],
      datePaid: "", // Date paid for the entire task (subtotal row)
      status: "", // Status for the entire task
    },
    {
      expenses: "Task 2",
      taskFee: 100, // Task fee
      dueDate: "2025-03-15", // Due date for the task
      subItems: [
        {
          expenses: "Misc1",
          amount: 100, // Miscellaneous amount
        },
        {
          expenses: "Misc2",
          amount: 100, // Miscellaneous amount
        },
      ],
      datePaid: "", // Date paid for the entire task (subtotal row)
      status: "", // Status for the entire task
    },
  ]);

  // Calculate total amount (Task Fee + Miscellaneous)
  const totalAmount = transactions.reduce((sum, transaction) => {
    const taskFee = transaction.taskFee || 0;
    const miscellaneousAmount = transaction.subItems
      ? transaction.subItems.reduce((subSum, subItem) => subSum + subItem.amount, 0)
      : 0;
    return sum + taskFee + miscellaneousAmount;
  }, 0);

  // Calculate total paid amount
  const totalPaid = transactions.reduce((sum, transaction) => {
    if (transaction.status === "Paid") {
      const taskFee = transaction.taskFee || 0;
      const miscellaneousAmount = transaction.subItems
        ? transaction.subItems.reduce((subSum, subItem) => subSum + subItem.amount, 0)
        : 0;
      return sum + taskFee + miscellaneousAmount;
    }
    return sum;
  }, 0);

  const paymentProgress = ((totalPaid / totalAmount) * 100).toFixed(2); // 2 decimal places
  const [status, setStatus] = useState("Paid"); // Default status
  const [partialPaymentDate, setPartialPaymentDate] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [overdueDays, setOverdueDays] = useState(0);

  // Handle status change for the overall payment status
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
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

  // Handle status change for a task
  const handleTaskStatusChange = (taskIndex, status) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[taskIndex].status = status;

    // If the status is "Paid," set the current date as the datePaid
    if (status === "Paid") {
      updatedTransactions[taskIndex].datePaid = new Date().toISOString().split("T")[0];
    } else {
      updatedTransactions[taskIndex].datePaid = ""; // Clear datePaid if status is not "Paid"
    }

    setTransactions(updatedTransactions);
  };

  return (
    <div>
      {/* Header with Project ID, Progress, and Set Status */}
      <div className="header-container">
        <h2 className="project-id">Project: {projectId}</h2>
        
      </div>

      {/* Details Section */}
      <div className="details-container">
  
  <div className="details-content">
    <div className="detail-row">
      <div className="detail-item partial-payment">
        <span className="detail-label">Partial Payment:</span>
        <span className="detail-value">--</span>
      </div>
      <div className="detail-item current-task">
        <span className="detail-label">Current Task:</span>
        <span className="detail-value">5</span>
      </div>
      <div className="detail-item past-dues">
        <span className="detail-label">Past Dues:</span>
        <span className="detail-value">10</span>
      </div>
      <div className="progress-container">
          <span className="progress-text">Progress: {paymentProgress}%</span>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${paymentProgress}%` }}
            ></div>
          </div>
        </div>
    </div>
  </div>
</div>

      {/* Transaction Table */}
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Date Paid</th>
            <th>Past Due</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => {
            // Calculate subtotal for the current task (Task Fee + Miscellaneous)
            const subtotal = transaction.taskFee + transaction.subItems.reduce((sum, subItem) => sum + subItem.amount, 0);

            // Calculate past due days
            const pastDueDays = calculatePastDueDays(transaction.dueDate);

            return (
              <React.Fragment key={index}>
                {/* Parent Task */}
                <tr>
                  <td>{transaction.expenses}</td>
                  <td>Task Fee</td>
                  <td className="amount-cell">{formatAmount(transaction.taskFee)}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {/* Sub-items (Miscellaneous) */}
                {transaction.subItems &&
                  transaction.subItems.map((subItem, subIndex) => (
                    <tr key={`sub-${subIndex}`}>
                      <td></td>
                      <td>{subItem.expenses}</td>
                      <td className="amount-cell">{formatAmount(subItem.amount)}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  ))}
                {/* Subtotal Row for the Task */}
                <tr className="subtotal-row">
                  <td colSpan="2"></td>
                  <td className="amount-cell">{formatAmount(subtotal)}</td>
                  <td>{formatDate(transaction.dueDate)}</td>
                  <td>{formatDate(transaction.datePaid)}</td>
                  <td>{pastDueDays > 0 ? `${pastDueDays} days` : "No"}</td>
                  <td>
                    <select
                      value={transaction.status || ""}
                      onChange={(e) => handleTaskStatusChange(index, e.target.value)}
                      className="transaction-button"
                    >
                      <option value="">Select Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Partial Payment</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Unpaid">Overdue</option>
                    </select>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
          {/* Total row */}
          <tr className="total-row">
            <td>Total</td>
            <td></td>
            <td className="amount-cell">{formatAmount(totalAmount)}</td>
            <td colSpan="4"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;