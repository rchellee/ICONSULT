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
    <div className="parent">
      <h1 className="header">Payment Transaction</h1>
      
      <div className="payment-container">
        {/* Header Row */}
        <div className="payment-header">
          <div className="header-item">Project</div>
          <div className="header-item">Client</div>
          <div className="header-item">Actual Start</div>
          <div className="header-item">Actual Finish</div>
          <div className="header-item">Professional Fee</div>
          <div className="header-item">Task Fee</div>
          <div className="header-item">Misc. Fee</div>
          <div className="header-item">Downpayment</div>
          <div className="header-item">Total</div>
          <div className="header-item">Payment Status</div>
        </div>

        {/* Payment Rows */}
        {payments.map((payment, index) => (
          <div className="payment-row" key={index}>
            <div className="row-item">{payment.project}</div>
            <div className="row-item">{payment.client}</div>
            <div className="row-item">{formatDate(payment.actualStart)}</div>
            <div className="row-item">{formatDate(payment.actualFinish)}</div>
            <div className="row-item">{formatCurrency(payment.professionalFee)}</div>
            <div className="row-item">{formatCurrency(payment.taskFee)}</div>
            <div className="row-item">{formatCurrency(payment.miscellaneousFee)}</div>
            <div className="row-item">{formatCurrency(payment.downpayment)}</div>
            <div className="row-item">{formatCurrency(payment.total)}</div>
            <div className="row-item">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentView;
