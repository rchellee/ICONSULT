import React from "react";

const ClientTask = ({ tasks }) => {
  const formatDueDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handlePay = (taskId) => {
    console.log(`Paying for task with ID: ${taskId}`);
    alert(`Payment of ₱100.00 for Task ID ${taskId} is being processed.`);
    
  };

  return (
    <div className="task-table">
      <table>
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Consultancy Fee</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Pay</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.task_id}>
              <td>{task.task_name}</td>
              <td>{task.task_fee}</td>
              <td>{formatDueDate(task.due_date)}</td>
              <td>{task.status}</td>
              <td>
                <button onClick={() => handlePay(task.task_id)}>Pay</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTask;