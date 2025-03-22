import React from "react";

const ClientTask = ({ task }) => {
  return (
    <div style={styles.taskContainer}>
      <h3 style={styles.taskName}>{task.task_name}</h3>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Fee:</strong> ${task.task_fee}</p>
      <p><strong>Due Date:</strong> {new Date(task.due_date).toLocaleDateString()}</p>
      <p><strong>Amount:</strong> ${task.amount}</p>
    </div>
  );
};

const styles = {
  taskContainer: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '16px',
    backgroundColor: '#f9f9f9',
  },
  taskName: {
    marginTop: '0',
    color: '#333',
  },
};

export default ClientTask;