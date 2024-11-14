import React from "react";
import "./project.css";

const Task = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="task-details-overlay">
      <div className="task-details">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h3>Task Details</h3>
        <p><strong>Name:</strong> {task.taskName}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Status:</strong> {task.status}</p>
        <p><strong>Due Date:</strong> {task.dueDate}</p>
        {/* Add any additional task details here */}
      </div>
    </div>
  );
};

export default Task;
