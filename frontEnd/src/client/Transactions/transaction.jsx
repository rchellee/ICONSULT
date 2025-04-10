import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import Sidebar from "../sidebar";
import "./transactions.css";
import Topbar from "../Topbar";

const Transaction = () => {
  const { searchTerm } = useContext(SearchContext);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
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

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const searchValue = searchTerm.trim().toLowerCase();
      const transactionId = String(
        transaction.transaction_id || ""
      ).toLowerCase();
      const projectName = (
        projectMap[transaction.project_id] || ""
      ).toLowerCase();
      const merchantId = (transaction.payee_merchant_id || "").toLowerCase();
      const email = (transaction.payed_to_email || "").toLowerCase();
      const amount = transaction.amount.toString().toLowerCase();
      const currency = (transaction.currency || "").toLowerCase();
      const date = formatDate(transaction.created_at).toLowerCase();

      return (
        transactionId.includes(searchValue) ||
        projectName.includes(searchValue) ||
        merchantId.includes(searchValue) ||
        email.includes(searchValue) ||
        amount.includes(searchValue) ||
        currency.includes(searchValue) ||
        date.includes(searchValue)
      );
    });

    setFilteredTransactions(filtered);
  }, [searchTerm, transactions, projectMap]);

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
      <Sidebar />
      <Topbar />

      <div className="content-transactions">
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
              {filteredTransactions.map((transaction) => (
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
