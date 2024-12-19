// PostsTab.jsx
import React from "react";

const PostsTab = ({ tasks, setShowTaskForm, showTaskForm, handleCreateTask, handleCancelForm }) => {
  return (
    <div className="posts-tab-content">
      <div className="project-posts">
        {tasks.length === 0 ? (
          <div className="no-task-container">
            <h2>No Task Created</h2>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task, index) => (
              <li key={index} className="task-item">
                <h3>{task.taskName}</h3>
                <p>Fee: {task.taskFee}</p>
                <p>Due: {task.dueDate}</p>
                <p>Employee: {task.employee || "Unassigned"}</p>
                {task.additionalFeeName && (
                  <p>
                    Additional Fee ({task.additionalFeeName}): {task.additionalFee}
                  </p>
                )}
              </li>
            ))}
          </ul>
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
