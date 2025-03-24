import React, { useState } from "react";
import Payment from "./payment";

const ClientTask = ({ tasks, projectId }) => {
  const [isPaymentOverlayOpen, setIsPaymentOverlayOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({});

  const formatDueDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handlePay = (taskId, amount) => {
    console.log("Task ID being passed:", taskId);
    setPaymentDetails({ taskId, amount, projectId });
    setIsPaymentOverlayOpen(true);
  };

  const closePaymentOverlay = () => {
    setIsPaymentOverlayOpen(false);
  };

  return (
    <div className="task-table">
      <table>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Fee</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Pay</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.task_id || index}>
              <td>{task.task_name}</td>
              <td>₱ {task.amount}.00</td>
              <td>{formatDueDate(task.due_date)}</td>
              <td>{task.payment_status}</td>
              <td>
                <button onClick={() => handlePay(task.id, task.amount)}>
                  Pay
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
