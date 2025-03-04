import React, { useState } from "react";
import "./PaymentView.css";

const PaymentView = () => {
  // Example data
  const [payments, setPayments] = useState([
    {
      project: "Project A",
      client: "Client X",
      actualStart: "2023-01-01",
      actualFinish: "2023-06-30",
      professionalFee: 5000,
      taskFee: 1000,
      miscellaneousFee: 500,
      downpayment: 1000,
      total: 6500,
      paymentStatus: "Paid",
    },
    {
      project: "Project B",
      client: "Client Y",
      actualStart: "2023-02-15",
      actualFinish: "2023-08-15",
      professionalFee: 7000,
      taskFee: 1500,
      miscellaneousFee: 300,
      downpayment: 1500,
      total: 8800,
      paymentStatus: "Unpaid",
    },
  ]);

  // State to manage table visibility
  const [isTableVisible, setIsTableVisible] = useState(true);

  // Function to toggle table visibility
  const toggleTableVisibility = () => {
    setIsTableVisible(!isTableVisible);
  };

  const formatCurrency = (amount) => {
    return `₱ ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePaymentStatusChange = (index, newStatus) => {
    const updatedPayments = [...payments];
    updatedPayments[index].paymentStatus = newStatus;
    setPayments(updatedPayments);
  };

  return (
    <div className="parentito">
      <h1 className="payment-text-title">Payment Transaction</h1>

      {/* Button to toggle table visibility */}
      <div className="potaena">
      <button onClick={toggleTableVisibility} className="toggle-table-button">
        {isTableVisible ? "Paid ▼" : "Paid ▲"}
      </button>
      </div>

      {/* Conditionally render the table based on visibility state */}
      {isTableVisible && (
        <table className="payment-table">
          {/* Table Header */}
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Date Paid</th>
              {/*<th>Actual Finish</th>*/}
              <th className="numeric-column">Professional Fee</th>
              <th className="numeric-column">Task Fee</th>
              <th className="numeric-column">Misc. Fee</th>
              <th className="numeric-column">Downpayment</th>
              <th className="numeric-column">Total</th>
              <th>Payment Status</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {payments.map((payment, index) => (
              <tr key={index}>
                <td>{payment.project}</td>
                <td>{payment.client}</td>
                <td>{formatDate(payment.actualStart)}</td>
                {/*<td>{formatDate(payment.actualFinish)}</td>*/}
                <td className="numeric-column">{formatCurrency(payment.professionalFee)}</td>
                <td className="numeric-column">{formatCurrency(payment.taskFee)}</td>
                <td className="numeric-column">{formatCurrency(payment.miscellaneousFee)}</td>
                <td className="numeric-column">{formatCurrency(payment.downpayment)}</td>
                <td className="numeric-column">{formatCurrency(payment.total)}</td>
                <td>
                  <div className="payment-status-dropdown-wrapper">
                    <select
                      className="payment-status-dropdown"
                      value={payment.paymentStatus}
                      onChange={(e) =>
                        handlePaymentStatusChange(index, e.target.value)
                      }
                    >
                      <option value="Paid">Paid</option>
                      <option value="Partial payment">Partial payment</option>
                      <option value="Unpaid">Unpaid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentView;