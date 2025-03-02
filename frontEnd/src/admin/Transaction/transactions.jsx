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
      const {
        transaction_id: transactionId,
        project_id: projectId,
        payee_merchant_id: merchantId,
        payed_to_email: email,
        amount,
        currency,
        created_at: date,
      } = transaction;

      const project = projectMap[projectId]?.toLowerCase() || "";
      const client = clientMap[projectId]?.toLowerCase() || "";

      const searchValue = searchTerm.trim().toLowerCase();

      return (
        String(transactionId || "")
          .toLowerCase()
          .includes(searchValue) ||
        project.includes(searchValue) ||
        client.includes(searchValue) ||
        String(merchantId || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(email || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(amount || "").includes(searchValue) ||
        String(currency || "")
          .toLowerCase()
          .includes(searchValue) ||
        formatDate(date).toLowerCase().includes(searchValue)
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
                  <td title={transaction.transaction_id || "Unknown Email"}>
                    {transaction.transaction_id}
                  </td>
                  <td title={transaction.project_id || "Unknown Email"}>
                    {projectMap[transaction.project_id] || "Unknown Project"}
                  </td>
                  <td
                    title={clientMap[transaction.project_id] || "Unknown Email"}
                  >
                    {clientMap[transaction.project_id] || "Unknown Client"}
                  </td>
                  <td title={getDescription(transaction) || "Unknown Email"}>
                    {getDescription(transaction)}
                  </td>
                  <td title={transaction.payee_merchant_id || "Unknown Email"}>
                    {transaction.payee_merchant_id || "Unknown Merchant"}
                  </td>
                  <td title={transaction.payed_to_email || "Unknown Email"}>
                    {transaction.payed_to_email || "Unknown Email"}
                  </td>
                  <td
                    title={formatAmount(transaction.amount) || "Unknown Email"}
                  >
                    {formatAmount(transaction.amount)}
                  </td>
                  <td title={transaction.currency || "Unknown Email"}>
                    {transaction.currency}
                  </td>
                  <td
                    title={
                      formatDate(transaction.created_at) || "Unknown Email"
                    }
                  >
                    {formatDate(transaction.created_at)}
                  </td>
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
