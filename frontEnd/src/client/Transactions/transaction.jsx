import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import "./transactions.css";
import Topbar from "../Topbar";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const clientId = localStorage.getItem("clientId"); // Retrieve clientId from localStorage

      if (!clientId) {
        console.error("No client ID found.");
        return;
      }

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
      } catch (error) {
        console.error("Error fetching transactions:", error.message);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div className="transactions-page">
      <Topbar />
      <Sidebar />
      <div className="content">
        <h4>Transactions</h4>
        {transactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Payer Name</th>
                <th>Payer Email</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Payed To Email</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.transaction_id}>
                  <td>{transaction.transaction_id}</td>
                  <td>{transaction.payer_name}</td>
                  <td>{transaction.payer_email}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.currency}</td>
                  <td>{transaction.payed_to_email}</td>
                  <td>
                    {new Date(transaction.created_at).toLocaleDateString()}
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

export default Transaction;
