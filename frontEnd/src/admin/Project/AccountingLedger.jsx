import React, { useEffect, useState, useContext, useRef } from "react";
import { SearchContext } from "../../components/SearchProvider";
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
  const { searchTerm } = useContext(SearchContext);

  const filterPayments = (payments, searchTerm) => {
    if (!searchTerm) return payments;

    const term = searchTerm.toLowerCase();

    return payments.filter((payment) => {
      return (
        payment.projectName?.toLowerCase().includes(term) ||
        payment.transaction_id?.toLowerCase().includes(term) ||
        payment.payer_name?.toLowerCase().includes(term) ||
        payment.description?.toLowerCase().includes(term) ||
        payment.amount?.toString().includes(term) ||
        payment.mode_of_payment?.toLowerCase().includes(term) ||
        formatDate(payment.date_paid)?.toLowerCase().includes(term)
      );
    });
  };

  useEffect(() => {
    const fetchAndSavePaidTasks = async () => {
      try {
        await axios.post("http://localhost:8081/payments/clean-duplicates");
        const response = await axios.get("http://localhost:8081/paid-tasks");
        const paidTasks = response.data;
        if (paidTasks.length > 0) {
          await axios.post("http://localhost:8081/payments/bulk", paidTasks);
          console.log("Paid tasks saved to payments table");
        }
      } catch (error) {
        console.error("Error fetching or saving paid tasks:", error);
      }
    };
    fetchAndSavePaidTasks();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:8081/paymentLedger");
        setPayments(response.data);
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
      setSubtotals({});
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

  const filteredAndSortedPayments = [
    ...filterPayments(payments, searchTerm),
  ].sort((a, b) => {
    if (sortCriteria === "date_paid") {
      return new Date(a.date_paid) - new Date(b.date_paid);
    }
    if (a[sortCriteria] < b[sortCriteria]) return -1;
    if (a[sortCriteria] > b[sortCriteria]) return 1;
    return 0;
  });
  useEffect(() => {
    if (sortCriteria === "date_paid") {
      setSubtotals({});
      return;
    }

    const calculateFilteredSubtotals = () => {
      const subtotalsMap = filteredAndSortedPayments.reduce((acc, payment) => {
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

    calculateFilteredSubtotals();
  }, [sortCriteria, filteredAndSortedPayments]);

  return (
    <div className="accounting-ledger">
      <div className="sortledger-container">
        <label style={{ marginLeft: "1300px" }}>Sort By: </label>
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
      <div className="ok">
        <table className="accounting-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Transaction ID</th>
              <th>Paid By</th>
              <th>Description</th>
              <th style={{ textAlign: "right", paddingRight: "20px" }}>
                Amount
              </th>
              <th>Mode of Payment</th>
              <th>Date Paid</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPayments.map((payment, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>{payment.projectName}</td>
                  <td>{payment.transaction_id.toUpperCase()}</td>
                  <td>{payment.payer_name}</td>
                  <td>Payment for {payment.description}</td>
                  <td
                    style={{
                      textAlign: "right",
                      paddingRight: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatAmount(payment.amount)}
                  </td>
                  <td>{payment.mode_of_payment}</td>
                  <td>{formatDate(payment.date_paid)}</td>
                </tr>
                {sortCriteria !== "date_paid" &&
                (index === filteredAndSortedPayments.length - 1 ||
                  filteredAndSortedPayments[index + 1][sortCriteria] !==
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
                    <td
                      style={{
                        textAlign: "right",
                        paddingRight: "20px",
                        fontWeight: "bold",

                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatAmount(subtotals[payment[sortCriteria]])}
                    </td>
                    <td colSpan="2"></td>
                  </tr>
                ) : null}
              </React.Fragment>
            ))}
            {sortCriteria !== "date_paid" && (
              <tr className="grand-total-row">
                <td colSpan="4">Total</td>
                <td
                  style={{
                    textAlign: "right",
                    paddingRight: "20px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
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
