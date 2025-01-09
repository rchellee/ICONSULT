import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import "./transactions.css";
import Topbar from "../Topbar";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [projectMap, setProjectMap] = useState({});

  useEffect(() => {
    const clientId = localStorage.getItem("clientId"); 

    if (!clientId) {
      console.error("No client ID found.");
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/payments/${clientId}`
        );
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(
            errorDetails.error || "Failed to fetch transactions."
          );
        }
        const data = await response.json();
        setTransactions(data);
        await fetchProjects(data);
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };

    const fetchProjects = async (transactions) => {
      try {
        const projectIds = [...new Set(transactions.map((t) => t.project_id))]; 
        const projectData = {};
        for (const projectId of projectIds) {
          if (projectId) {
            const response = await fetch(
              `http://localhost:8081/projects/${projectId}` 
            );
            if (response.ok) {
              const result = await response.json();
              projectData[projectId] = result.project.projectName;
            }
          }
        }
        setProjectMap(projectData);
      } catch (error) {
        console.error("Error fetching project details:", error.message);
      }
    };

    fetchTransactions();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  const formatAmount = (amount) => `₱${parseFloat(amount).toFixed(2)} PHP`;

  const getDescription = (transaction) =>
    transaction.type === "payment" ? "Payment from" : "Transfer to";

  return (
    <div className="transactions-page">
      <Topbar />
      <Sidebar />
      <div className="content-transactions">
        <h4>Transactions</h4>
        {transactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Description</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Project Name</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <td>{transaction.transaction_id}</td>
                  <td>{getDescription(transaction)}</td>
                  <td>{transaction.payed_to_email}</td>
                  <td>{formatAmount(transaction.amount)}</td>
                  <td>{transaction.currency}</td>
                  <td>
                    {projectMap[transaction.project_id] || "Unknown Project"}
                  </td>
                  <td>{formatDate(transaction.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transaction;
