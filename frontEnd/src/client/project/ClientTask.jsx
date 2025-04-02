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

  // Get current date for comparison
  const currentDate = new Date();
  
  // Separate tasks into categories
  const paidTasks = tasks.filter(
    (task) => task.payment_status?.toLowerCase() === "paid"
  );
  
  const unpaidTasks = tasks.filter(
    (task) => task.payment_status?.toLowerCase() !== "paid"
  );
  
  // Separate unpaid tasks into past due and to pay
  const pastDueTasks = unpaidTasks.filter(
    (task) => new Date(task.due_date) < currentDate
  );
  
  const toPayTasks = unpaidTasks.filter(
    (task) => new Date(task.due_date) >= currentDate
  );

  // Calculate total amounts
  const totalPastDue = pastDueTasks.reduce(
    (sum, task) => sum + parseFloat(task.amount || 0),
    0
  );
  
  const totalToPay = toPayTasks.reduce(
    (sum, task) => sum + parseFloat(task.amount || 0),
    0
  );

  // Check if there are no tasks at all
  const noTasks = tasks.length === 0;

  return (
    <div className="task-container">
      {/* Show "No tasks" message only when there are truly no tasks */}
      {noTasks ? (
        <div className="no-tasksclient-container">
          <p className="no-tasksclient-message">No tasks created yet</p>
        </div>
      ) : (
        <>
          {/* Past Due Tasks Box - Only show if there are past due tasks */}
          {pastDueTasks.length > 0 && (
            <div className="task-box past-due-box">
              <h2>Past Due</h2>
              <div className="task-cards-container">
                {pastDueTasks.map((task, index) => (
                  <div key={`past-due-${task.task_id || index}`} className="task-card past-due-card">
                    <div className="task-card-header">
                      <span className="task-name">{task.task_name}</span>
                      <span className="task-amount">
                        ₱ {parseFloat(task.amount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="task-date overdue-date">
                      Was due: {formatDueDate(task.due_date)}
                    </div>
                    <div className="task-status-row">
                      <span className="task-status overdue-status">Overdue</span>
                      <button
                        onClick={() => handlePay(task.id, task.amount, false)}
                        className="pay-button overdue-button"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="total-amount overdue-total">
                Total Overdue: ₱ {totalPastDue.toFixed(2)}
              </div>
            </div>
          )}

          {/* To Pay Tasks Box - Only show if there are tasks to pay */}
          {toPayTasks.length > 0 && (
            <div className="task-box unpaid-box">
              <h2>To Pay</h2>
              <div className="task-cards-container">
                {toPayTasks.map((task, index) => (
                  <div key={`unpaid-${task.task_id || index}`} className="task-card unpaid-card">
                    <div className="task-card-header">
                      <span className="task-name">{task.task_name}</span>
                      <span className="task-amount">
                        ₱ {parseFloat(task.amount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="task-date">
                      Due date: {formatDueDate(task.due_date)}
                    </div>
                    <div className="task-status-row">
                      <span className="task-status unpaid-status">Not Paid</span>
                      <button
                        onClick={() => handlePay(task.id, task.amount, false)}
                        className="pay-button"
                      >
                        Pay Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="total-amount">
                Total Due: ₱ {totalToPay.toFixed(2)}
              </div>
            </div>
          )}

          {/* Paid Tasks Box - Only show if there are paid tasks */}
          {paidTasks.length > 0 && (
            <div className="task-box paid-box">
              <h2>Paid</h2>
              <div className="task-cards-container">
                {paidTasks.map((task, index) => (
                  <div key={`paid-${task.task_id || index}`} className="task-card paid-card">
                    <div className="task-card-header">
                      <span className="task-name">{task.task_name}</span>
                      <span className="task-amount">
                        ₱ {parseFloat(task.amount || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="task-date">
                      Date Paid: {task.date_paid ? formatDueDate(task.date_paid) : "N/A"}
                    </div>
                    <div className="task-status-row">
                      <span className="task-status paid-status">Paid</span>
                      <span className="payment-badge">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

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