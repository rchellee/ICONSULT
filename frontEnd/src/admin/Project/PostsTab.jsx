import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import navigation icons
import TaskForm from "./TaskForm";

const PostsTab = ({ tasks, setShowTaskForm, showTaskForm, handleCreateTask, handleCancelForm }) => {
  const [selectedTaskName, setSelectedTaskName] = useState(null); // State for selected task
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null); // State for selected task details

  const handleRowClick = (task) => {
    setSelectedTaskName(task.taskName); // Set the selected task name when a row is clicked
    setSelectedTaskDetails(task); // Set the selected task details
  };

  // Function to calculate the total amount for the task
  const calculateTotal = (task) => {
    const taskFee = parseFloat(task.taskFee) || 0; // Ensure it's a valid number
    const miscellaneousFee = parseFloat(task.miscellaneousFee) || 0; // Ensure it's a valid number
    return taskFee + miscellaneousFee; // Return the sum of task fee and miscellaneous fee
  };

  return (
    <div className="posts-tab-content">
      <div className="project-posts">
        {/* Task Header with IoIosArrowDown Icon */}
        <div className="task-header">
          <h2>Task</h2>
          <IoIosArrowDown className="toggle-icon down" /> {/* Icon without click functionality */}
        </div>

        {/* Top Navigation Buttons */}
        <div className="top-button">
          <button className="nav-button">
            <FaChevronLeft />
            <span className="tooltip">Go back</span>
          </button>
          <button className="nav-button">
            <FaChevronRight />
          </button>
        </div>

        {/* If a task is selected, show details in the desired format */}
        {selectedTaskName ? (
          <div className="task-details">
            <div className="task-detail-row">
              <div><strong>Task Name</strong></div>
              <div><strong>Amount</strong></div>
            </div>
            <div className="task-detail-row">
              <div>{selectedTaskDetails.taskName}</div>
              <div>{selectedTaskDetails.taskFee}</div> {/* Amount */}
            </div>
            <div className="task-detail-row">
              <div><strong>Miscellaneous</strong></div>
            </div>
            <div className="task-detail-row">
              <div>{selectedTaskDetails.miscellaneousName}</div> {/* Miscellaneous name */}
              <div>{selectedTaskDetails.miscellaneousFee}</div> {/* Miscellaneous fee */}
            </div>

            {/* Total Row */}
            <div className="task-detail-row">
              <div><strong>Total</strong></div>
              <div>{calculateTotal(selectedTaskDetails)}</div> {/* Display the total amount */}
            </div>
          </div>
        ) : (
          // Task Table is displayed when no task is selected
          tasks.length === 0 ? (
            <div className="no-task-container">
              <h2>No Task Created</h2>
            </div>
          ) : (
            <div className="table-container">
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, index) => (
                    <tr key={index} onClick={() => handleRowClick(task)}> {/* Row click handler */}
                      <td>{task.taskName}</td>
                      <td>{task.employee || "Unassigned"}</td>
                      <td>{task.status}</td>
                      <td>{task.dueDate}</td>
                      <td>{task.taskFee}</td> {/* Display the task fee */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* Create Button */}
        <div className="create-button-container">
          <button
            className="create-task-button"
            onClick={() => setShowTaskForm(true)}
          >
            Create
          </button>
        </div>

        {/* Task Form */}
        {showTaskForm && (
          <TaskForm
            onCreate={handleCreateTask}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
};

export default PostsTab;
