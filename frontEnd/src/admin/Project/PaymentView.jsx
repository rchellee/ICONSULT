import React, { useState } from "react";
import "./PaymentView.css";

const PaymentView = () => {
  // Example data
  const [payments] = useState([
    {
      project: "Project A",
      client: "Client X",
      actualStart: "2025-03-02", 
      actualFinish: "2023-06-30",
      professionalFee: 800,
      taskFee: 800,
      miscellaneousFee: 800,
      downpayment: 1000,
      total: 2400,
      paymentStatus: "Paid",
    },
  ]);

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

  return (
    <div className="parentito">
      <h1 className="payment-text-title">Payment Transaction</h1>
      <div className="payment-container">
        {/* Sidebar Table */}
        <div className="payment-sidebar">
          <table className="sidebar-table">
            <thead>
              <tr>
                <th>Projects</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Project A</td>
              </tr>
              <tr>
                <td>Project B</td>
              </tr>
              <tr>
                <td>Project C</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* New Payment Breakdown Table */}
        <div className="main-content">
          <table className="payment-breakdown-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Date Paid</th>
                <th>Name</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td>{payment.project}</td>
                    <td>{formatDate(payment.actualStart)}</td>
                    <td>Miscellaneous</td>
                    <td>{formatCurrency(payment.miscellaneousFee)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Professional Fee</td>
                    <td>{formatCurrency(payment.professionalFee)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Task Fee</td>
                    <td>{formatCurrency(payment.taskFee)}</td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td>Total</td>
                    <td>{formatCurrency(payment.total)}</td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentView;
