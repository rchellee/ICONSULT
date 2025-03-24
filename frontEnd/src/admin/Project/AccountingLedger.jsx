import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AccountingLedger.css";
import { FaTasks } from "react-icons/fa";

const AccountingLedger = ({
  projects,
  filteredProjects,
  formatDate,
  tasksInfo,
  totalTasks,
}) => {
  const [payments, setPayments] = useState([]);
  const [subtotals, setSubtotals] = useState({});
  const [sortCriteria, setSortCriteria] = useState("projectName");

  // Fetch and save paid tasks when the component mounts
  useEffect(() => {
    const fetchAndSavePaidTasks = async () => {
      try {
        // First clean up any existing duplicates
        await axios.post("http://localhost:8081/payments/clean-duplicates");
        // Fetch paid tasks
        const response = await axios.get("http://localhost:8081/paid-tasks");
        const paidTasks = response.data;

        if (paidTasks.length > 0) {
          // Save paid tasks to the payments table
          await axios.post("http://localhost:8081/payments/bulk", paidTasks);
          console.log("Paid tasks saved to payments table");
        }
      } catch (error) {
        console.error("Error fetching or saving paid tasks:", error);
      }
    };

    fetchAndSavePaidTasks();
  }, []);

  // Fetch payments when the component mounts
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:8081/paymentLedger");
        setPayments(response.data);

        // Calculate subtotals for each project
        const subtotalsMap = response.data.reduce((acc, payment) => {
          const key =
            sortCriteria === "mode_of_payment"
              ? payment.mode_of_payment
              : payment.projectName;
          if (!acc[key]) {
            acc[key] = 0;
          }
          acc[key] += parseFloat(payment.amount);
          return acc;
        }, {});

        setSubtotals(subtotalsMap);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  useEffect(() => {
    if (sortCriteria === "date_paid") {
      setSubtotals({}); // No subtotals for date_paid
      return;
    }

    const calculateSubtotals = () => {
      const subtotalsMap = payments.reduce((acc, payment) => {
        let key = payment.projectName;

        if (sortCriteria === "mode_of_payment") {
          key = payment.mode_of_payment;
        } else if (sortCriteria === "payer_name") {
          key = payment.payer_name;
        }

        if (!acc[key]) {
          acc[key] = 0;
        }

        acc[key] += parseFloat(payment.amount) || 0;
        return acc;
      }, {});

      setSubtotals(subtotalsMap);
    };

    calculateSubtotals();
  }, [sortCriteria, payments]);

  const formatAmount = (amount) => {
    return `₱${parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  const sortedPayments = [...payments].sort((a, b) => {
    if (sortCriteria === "date_paid") {
      return new Date(a.date_paid) - new Date(b.date_paid);
    }
    if (a[sortCriteria] < b[sortCriteria]) return -1;
    if (a[sortCriteria] > b[sortCriteria]) return 1;
    return 0;
  });

  return (
    <div className="accounting-ledger">
      <h2>Accounting Ledger</h2>
      <div className="sort-container">
        <label style={{ marginLeft: "1190px" }}>Sort By: </label>
        <select
          value={sortCriteria}
          onChange={(e) => setSortCriteria(e.target.value)}
        >
          <option value="projectName">Project Name</option>
          <option value="mode_of_payment">Mode of Payment</option>
          <option value="payer_name">Client</option>
          <option value="date_paid">Date Paid</option>
        </select>
      </div>
      <div className="">
        <table className="accounting-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Transaction ID</th>
              <th>Paid By</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Mode of Payment</th>
              <th>Date Paid</th>
            </tr>
          </thead>
          <tbody>
            {sortedPayments.map((payment, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{payment.projectName}</td>
                  <td>{payment.transaction_id.toUpperCase()}</td>
                  <td>{payment.payer_name}</td>
                  <td>Payment for {payment.description}</td>
                  <td>{formatAmount(payment.amount)}</td>
                  <td>{payment.mode_of_payment}</td>
                  <td>{formatDate(payment.date_paid)}</td>
                </tr>
                {/* Display subtotal for the project */}
                {sortCriteria !== "date_paid" &&
                (index === sortedPayments.length - 1 ||
                  sortedPayments[index + 1][sortCriteria] !==
                    payment[sortCriteria]) ? (
                  <tr className="subtotal-row">
                    <td colSpan="4">
                      Subtotal for{" "}
                      {sortCriteria === "mode_of_payment"
                        ? `payments in ${payment.mode_of_payment}`
                        : sortCriteria === "payer_name"
                        ? payment.payer_name
                        : payment.projectName}
                    </td>
                    <td>{formatAmount(subtotals[payment[sortCriteria]])}</td>
                    <td colSpan="2"></td>
                  </tr>
                ) : null}
              </React.Fragment>
            ))}
            {sortCriteria !== "date_paid" && (
              <tr className="grand-total-row">
                <td colSpan="4">Total</td>
                <td>
                  {formatAmount(
                    Object.values(subtotals).reduce(
                      (sum, amount) => sum + amount,
                      0
                    )
                  )}
                </td>
                <td colSpan="2"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountingLedger;
