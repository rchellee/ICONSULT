import React from "react";


const Task = ({ tasks, isLoading, error }) => {
  const formatCurrency = (value) => {
    return Number(value).toLocaleString("en-US", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatDate = (date) => {
    if (!date) return "N/A"; // Handle undefined or null dates
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && tasks.length === 0 && <p>No tasks found.</p>}
      {!isLoading && !error && tasks.length > 0 && (
        <div className="task-list">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Fee</th>
                <th>Miscellaneous</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const miscellaneousItems = JSON.parse(task.miscellaneous || "[]");

                // Ensure the fee is treated as a number
                const miscellaneousTotal = miscellaneousItems.reduce(
                  (total, item) => total + (Number(item.fee) || 0), // Convert fee to number
                  0
                );

                return (
                  <tr key={task.id}>
                    <td>{task.task_name}</td>
                    <td>{task.status}</td>
                    <td>{formatDate(task.due_date)}</td>
                    <td>{formatCurrency(task.task_fee) || formatCurrency(0)}</td>
                    <td>{miscellaneousTotal > 0 ? formatCurrency(miscellaneousTotal) : "N/A"}</td>
                    <td>{formatCurrency(task.amount) || formatCurrency(0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default Task;
