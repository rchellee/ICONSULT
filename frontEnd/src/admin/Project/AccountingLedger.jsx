import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AccountingLedger.css";

const AccountingLedger = ({
  projects,
  filteredProjects,
  formatDate,
  tasksInfo,
  totalTasks,
}) => {
  const [payments, setPayments] = useState([]);
  const [subtotals, setSubtotals] = useState({});

  // Fetch and save paid tasks when the component mounts
  useEffect(() => {
    const fetchAndSavePaidTasks = async () => {
      try {
        // Fetch paid tasks
        const response = await axios.get("/paid-tasks");
        const paidTasks = response.data;

        if (paidTasks.length > 0) {
          // Save paid tasks to the payments table
          await axios.post("/payments/bulk", paidTasks);
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
        const response = await axios.get("/paymentLedger");
        setPayments(response.data);

        // Calculate subtotals for each project
        const subtotalsMap = response.data.reduce((acc, payment) => {
          const projectName = payment.projectName;
          if (!acc[projectName]) {
            acc[projectName] = 0;
          }
          acc[projectName] += parseFloat(payment.amount);
          return acc;
        }, {});

        setSubtotals(subtotalsMap);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const formatAmount = (amount) => {
    return `₱${parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };



  // Calculate the total amount for all projects
  const calculateGrandTotal = () => {
    let total = 0;
    filteredProjects.forEach((project) => {
      total += parseFloat(project.contractPrice) || 0;
      total += parseFloat(tasksInfo[project.id]?.total) || 0;
    });
    return total;
  };

  return (
    <div className="accounting-ledger">
      <h2>Accounting Ledger</h2>
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
            {payments.map((payment, index) => (
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
                {index === payments.length - 1 ||
                payments[index + 1].projectName !== payment.projectName ? (
                  <tr className="subtotal-row">
                    {/* <td colSpan="4">Subtotal for {payment.projectName}</td>
                    <td>{formatAmount(subtotals[payment.projectName])}</td>
                    <td colSpan="2"></td> */}
                  </tr>
                ) : null}
              </React.Fragment>
            ))}
            {/* Grand Total Row */}
            <tr className="grand-total-row">
              <td colSpan="4">Grand Total</td>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountingLedger;
