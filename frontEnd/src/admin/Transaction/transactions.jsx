import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import "./transaction.css";

const Transactions = () => {
  const { searchTerm } = useContext(SearchContext);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [projectMap, setProjectMap] = useState({});
  const [clientMap, setClientMap] = useState({});

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:8081/payments");
        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(
            errorDetails.error || "Failed to fetch transactions."
          );
        }
        const data = await response.json();
        setTransactions(data);
        await fetchProjectAndClientDetails(data);
      } catch (error) {
        console.error("Error fetching transactions:", error.message); // Log error message
      }
    };

    const fetchProjectAndClientDetails = async (transactions) => {
      try {
        const projectIds = [...new Set(transactions.map((t) => t.project_id))];

        const projectData = {};
        const clientData = {};
        for (const projectId of projectIds) {
          if (projectId) {
            const response = await fetch(
              `http://localhost:8081/projects/${projectId}`
            );
            if (response.ok) {
              const result = await response.json();
              // Map both projectName and clientName
              projectData[projectId] = result.project.projectName;
              clientData[projectId] = result.project.clientName;
            }
          }
        }

        setProjectMap(projectData);
        setClientMap(clientData);
      } catch (error) {
        console.error(
          "Error fetching project or client details:",
          error.message
        );
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const filtered = transactions.filter((transaction) => {
      const transactionId = String(transaction.transaction_id || "")
        .trim()
        .toLowerCase();
      const project = (projectMap[transaction.project_id] || "").toLowerCase();
      const client = (clientMap[transaction.project_id] || "").toLowerCase();
      const merchantId = (transaction.payee_merchant_id || "").toLowerCase();
      const email = (transaction.payed_to_email || "").toLowerCase();
      const amount = transaction.amount.toString().toLowerCase();
      const currency = (transaction.currency || "").toLowerCase();
      const date = formatDate(transaction.created_at).toLowerCase();
      const searchValue = searchTerm.trim().toLowerCase();

      return (
        transactionId.includes(searchValue) ||
        (projectMap[transaction.project_id] || "")
          .toLowerCase()
          .includes(searchValue) ||
        (projectMap[transaction.project_id] || "")
          .toLowerCase()
          .includes(searchValue) ||
        (clientMap[transaction.project_id] || "")
          .toLowerCase()
          .includes(searchValue) ||
        (transaction.payee_merchant_id || "")
          .toLowerCase()
          .includes(searchValue) ||
        (transaction.payed_to_email || "")
          .toLowerCase()
          .includes(searchValue) ||
        transaction.amount.toString().includes(searchValue) ||
        (transaction.currency || "").toLowerCase().includes(searchValue) ||
        formatDate(transaction.created_at).toLowerCase().includes(searchValue)
      );
    });

    setFilteredTransactions(filtered);
  }, [searchTerm, transactions, projectMap, clientMap]);

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

  const formatAmount = (amount) => `${parseFloat(amount).toFixed(2)} `;
  const getDescription = () => "Payment from";

  return (
    <div className="transactions-page">
      <Topbar />
      <Sidebar />
      <div className="content-transaction">
        <h3>Transactions</h3>
        {filteredTransactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Project</th>
                <th>Client</th>
                <th>Description</th>
                <th>Merchant ID</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <td>{transaction.transaction_id}</td>
                  <td>
                    {projectMap[transaction.project_id] || "Unknown Project"}
                  </td>
                  <td>
                    {clientMap[transaction.project_id] || "Unknown Client"}
                  </td>
                  <td>{getDescription(transaction)}</td>
                  <td>{transaction.payee_merchant_id || "Unknown Merchant"}</td>
                  <td>{transaction.payed_to_email || "Unknown Email"}</td>
                  <td>{formatAmount(transaction.amount)}</td>
                  <td>{transaction.currency}</td>
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

export default Transactions;
