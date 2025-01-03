import React, { useState, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import navigation icons
import { IoAddCircle } from "react-icons/io5"; // Import IoAddCircle icon
import TaskForm from "./TaskForm";
import MiscellaneousForm from "./MiscellaneousForm ";

const PostsTab = ({
  projectId,
  tasks,
  setShowTaskForm,
  showTaskForm,
  handleCreateTask,
  handleCancelForm,
  setTasks, // Assuming this is passed as a prop to update tasks
}) => {
  const [selectedTaskName, setSelectedTaskName] = useState(null); // State for selected task
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null); // State for selected task details
  const [showMiscellaneousForm, setShowMiscellaneousForm] = useState(false); // State for showing miscellaneous form

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/admin/tasks?projectId=${projectId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (projectId) {
      fetchTasks();
    }
  }, [projectId]);

  const handleRowClick = (task) => {
    console.log("Row clicked:", task);
    setSelectedTaskName(task.task_name);
    setSelectedTaskDetails(task);
  };
  

  const calculateTotal = (task) => {
    const taskFee = parseFloat(task.taskFee) || 0; // Ensure it's a valid number
    const miscellaneousFee =
      task.miscellaneous && Array.isArray(task.miscellaneous)
        ? task.miscellaneous.reduce((total, item) => total + (parseFloat(item.fee) || 0), 0)
        : 0; // Sum of all miscellaneous fees
    return taskFee + miscellaneousFee; // Return the sum of task fee and miscellaneous fee
  };

  const updateTaskWithMiscellaneous = (updatedTask) => {
    setSelectedTaskDetails(updatedTask);
    setShowMiscellaneousForm(false);
    const updatedTasks = tasks.map((task) =>
      task.task_name === updatedTask.task_name ? updatedTask : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="posts-tab-content">
      <div className="project-posts">
        {/* Task Header with IoIosArrowDown Icon */}
        <div className="task-header">
          <h2>Task</h2>
          <IoIosArrowDown className="toggle-icon down" />
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
              <div>
                <strong>Task Name</strong>
              </div>
              <div className="align-right amount-label">
                <strong>Amount</strong>
              </div>
            </div>
            <div className="task-detail-row">
              <div>{selectedTaskDetails.task_name}</div>
              <div className="align-right">{selectedTaskDetails.taskFee}</div>
            </div>
            <div className="task-detail-row">
              <div>
                <strong>Miscellaneous</strong>
                <IoAddCircle
                  size={20}
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onClick={() => setShowMiscellaneousForm(true)}
                />
              </div>
            </div>

            {/* Loop through miscellaneous entries and display them */}
            {selectedTaskDetails.miscellaneous &&
            Array.isArray(selectedTaskDetails.miscellaneous) &&
            selectedTaskDetails.miscellaneous.length > 0 ? (
              selectedTaskDetails.miscellaneous.map((misc, index) => (
                <div className="task-detail-row" key={index}>
                  <div>{misc.name}</div>
                  <div className="align-right">{misc.fee}</div>
                </div>
              ))
            ) : (
              <div className="task-detail-row">No Miscellaneous added yet</div>
            )}

            {/* Total Row */}
            <div className="task-detail-row total-row">
              <div>
                <strong>Total</strong>
              </div>
              <div className="align-right">
                {calculateTotal(selectedTaskDetails)}
              </div>
            </div>
          </div>
        ) : // Task Table is displayed when no task is selected
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
                  <th className="align-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={index} onClick={() => handleRowClick(task)}>
                    <td>{task.task_name}</td>
                    <td>{task.employee || "Unassigned"}</td>
                    <td>{task.status}</td>
                    <td>{task.due_date}</td>
                    <td className="align-right">{task.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            existingTask={selectedTaskDetails}
            projectId={projectId}
          />
        )}

        {/* Miscellaneous Form */}
        {showMiscellaneousForm && (
          <MiscellaneousForm
            task={selectedTaskDetails}
            updateTaskWithMiscellaneous={updateTaskWithMiscellaneous}
            onClose={() => setShowMiscellaneousForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PostsTab;
