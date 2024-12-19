import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import TaskForm from "./TaskForm";

const PostsTab = ({ tasks, setShowTaskForm, showTaskForm, handleCreateTask, handleCancelForm }) => {
  const [isTableVisible, setIsTableVisible] = useState(true); // State for table visibility

  const toggleTableVisibility = () => {
    setIsTableVisible((prevVisibility) => !prevVisibility);
  };

  return (
    <div className="posts-tab-content">
      <div className="project-posts">
        {/* Task Header with IoIosArrowDown Icon */}
        <div className="task-header">
          <h2>Task</h2>
          <IoIosArrowDown
            className={`toggle-icon ${isTableVisible ? "down" : "up"}`}
            onClick={toggleTableVisibility}  // Click event only on the icon
          />
        </div>

        {isTableVisible && tasks.length === 0 ? (
          // When the table is visible but no tasks are available
          <div className="no-task-container">
            <h2>No Task Created</h2>
          </div>
        ) : (
          // Task Table
          isTableVisible && (
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
                    <tr key={index}>
                      <td>{task.taskName}</td>
                      <td>{task.employee || "Unassigned"}</td>
                      <td>{task.status}</td>
                      <td>{task.dueDate}</td>
                      <td>{task.taskFee}</td>
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
