import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import navigation icons
import { IoAddCircle } from "react-icons/io5"; // Import IoAddCircle icon
import TaskForm from "./Taskform";
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
  const [showMiscellaneousForm, setShowMiscellaneousForm] = useState(false);
  const miscData = selectedTaskDetails?.miscellaneous || [];

  const [loading, setLoading] = useState(false);

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

  const handleRowClick = async (task) => {
    console.log("Row clicked:", task);
    setLoading(true);
    setSelectedTaskName(task.task_name);
    try {
      const response = await fetch(`http://localhost:8081/tasks/${task.id}`);
      if (!response.ok) throw new Error("Failed to fetch task details");
      const taskDetails = await response.json();

      // Parse miscellaneous if it's a string
      taskDetails.miscellaneous = parseMiscellaneous(taskDetails.miscellaneous);
      setSelectedTaskDetails(taskDetails);
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setLoading(false);
    }
  };

  const parseMiscellaneous = (miscellaneous) => {
    try {
      return JSON.parse(miscellaneous || "[]");
    } catch (e) {
      console.error("Failed to parse miscellaneous:", e);
      return [];
    }
  };

  const calculateTotal = (task) => {
    const task_fee = parseFloat(task.task_fee) || 0;
    const miscellaneousFee =
      task.miscellaneous && Array.isArray(selectedTaskDetails?.miscellaneous)
        ? task.miscellaneous.reduce(
            (total, item) => total + (parseFloat(item.fee) || 0),
            0
          )
        : 0;
    return task_fee + miscellaneousFee;
  };

  const updateTaskWithMiscellaneous = (updatedTask) => {
    setSelectedTaskDetails(updatedTask);
    setShowMiscellaneousForm(false);

    const updatedTasks = tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    console.log("Updated selectedTaskDetails:", updatedTask);
  };

  return (
    <div className="posts-tab-content">
      <div className="project-posts">
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

        {selectedTaskDetails ? (
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
              <div className="align-right">{selectedTaskDetails.task_fee}</div>
            </div>
            <div className="task-detail-row">
              <div>
                <strong>Miscellaneous</strong>
                <button
                  className="task-add-icon"
                  onClick={() => setShowMiscellaneousForm(true)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Loop through miscellaneous entries and display them */}
            {Array.isArray(selectedTaskDetails?.miscellaneous) ? (
              selectedTaskDetails.miscellaneous.map((item, index) => (
                <div key={index}>
                  <p>Name: {item.name}</p>
                  <p>Fee: {item.fee}</p>
                </div>
              ))
            ) : (
              <p>
                Miscellaneous data is not available or not in the expected
                format.
              </p>
            )}

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
                  <th>Task</th>
                  <th>Assigned</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Fee</th>
                  <th>Miscellaneous</th>
                  <th className="align-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const miscellaneousItems = JSON.parse(
                    task.miscellaneous || "[]"
                  );
                  const miscellaneousDetails =
                    Array.isArray(miscellaneousItems) &&
                    miscellaneousItems.length > 0
                      ? miscellaneousItems
                          .map((item) => `${item.name}: ${item.fee}`)
                          .join(", ")
                      : "N/A";

                  return (
                    <tr key={task.id} onClick={() => handleRowClick(task)}>
                      <td>{task.task_name}</td>
                      <td>{task.employee}</td>
                      <td>{task.status}</td>
                      <td>{task.due_date}</td>
                      <td>{task.task_fee}</td>
                      <td>{miscellaneousDetails || "N/A"}</td>
                      <td>{task.amount}</td>
                    </tr>
                  );
                })}
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
            +
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
