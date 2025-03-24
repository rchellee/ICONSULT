import React, { useState } from "react";
import Payment from "./payment";
import "./ClientTask.css";

const ClientTask = ({ tasks, projectId }) => {
  const [isPaymentOverlayOpen, setIsPaymentOverlayOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});

  const formatDueDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handlePay = (taskId, amount, isPaid) => {
    if (isPaid) return;
    console.log("Payment attempt for task:", taskId);
    setPaymentDetails({ taskId, amount, projectId });
    setIsPaymentOverlayOpen(true);
  };

  // Separate tasks into paid and unpaid
  const paidTasks = tasks.filter(task => task.payment_status?.toLowerCase() === "paid");
  const unpaidTasks = tasks.filter(task => task.payment_status?.toLowerCase() !== "paid");

  // Calculate total unpaid amount
  const totalUnpaid = unpaidTasks.reduce((sum, task) => sum + parseFloat(task.amount || 0), 0);

  return (
    <div className="task-container">
      {/* Unpaid Tasks Box */}
      <div className="task-box unpaid-box">
        <h2>Unpaid Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th className="right-align">Fee</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {unpaidTasks.map((task, index) => (
              <tr key={`unpaid-${task.task_id || index}`}>
                <td>{task.task_name}</td>
                <td className="right-align">₱ {parseFloat(task.amount || 0).toFixed(2)}</td>
                <td>{formatDueDate(task.due_date)}</td>
                <td>{task.payment_status}</td>
                <td>
                  <button 
                    onClick={() => handlePay(task.id, task.amount, false)}
                    className="pay-button"
                  >
                    Pay
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          {unpaidTasks.length > 0 && (
            <tfoot>
              <tr className="total-row">
                <td>Total</td>
                <td className="right-align total-amount">₱ {totalUnpaid.toFixed(2)}</td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          )}
        </table>
        {unpaidTasks.length === 0 && <p className="no-tasks">No unpaid tasks</p>}
      </div>

      {/* Paid Tasks Box */}
      <div className="task-box paid-box">
        <h2>Paid Tasks</h2>
        <table>
          <thead>
            <tr>
              <th>Task Name</th>
              <th className="right-align">Fee</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Date Paid</th>
            </tr>
          </thead>
          <tbody>
            {paidTasks.map((task, index) => (
              <tr key={`paid-${task.task_id || index}`}>
                <td>{task.task_name}</td>
                <td className="right-align">₱ {parseFloat(task.amount || 0).toFixed(2)}</td>
                <td>{formatDueDate(task.due_date)}</td>
                <td>{task.payment_status}</td>
                <td>{task.payment_date ? formatDueDate(task.payment_date) : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {paidTasks.length === 0 && <p className="no-tasks">No paid tasks</p>}
      </div>

      {/* Payment Overlay */}
      {isPaymentOverlayOpen && (
        <div className="overlay">
          <div className="overlay-content">
            <Payment
              taskId={paymentDetails.taskId}
              amount={paymentDetails.amount}
              projectId={paymentDetails.projectId}
              onClose={() => setIsPaymentOverlayOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTask;