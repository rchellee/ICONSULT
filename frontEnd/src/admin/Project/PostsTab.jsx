import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; 
import { IoAddCircle } from "react-icons/io5"; 
import { BsThreeDotsVertical } from "react-icons/bs"; 
import { BiSortAlt2 } from "react-icons/bi";
import TaskForm from "./TaskForm";
import MiscellaneousForm from "./MiscellaneousForm ";

const PostsTab = ({
  projectId,
  tasks,
  setShowTaskForm,
  showTaskForm,
  handleCreateTask,
  handleCancelForm,
  setTasks,
}) => {
  const [selectedTaskName, setSelectedTaskName] = useState(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null); 
  const [showMiscellaneousForm, setShowMiscellaneousForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showActions, setShowActions] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null); 

  const miscData = selectedTaskDetails?.miscellaneous || [];

  const formatCurrency = (amount) => {
    return `₱ ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

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

  const handleRowDoubleClick = async (task) => {
    setLoading(true);
    setSelectedTaskName(task.task_name);
    try {
      const response = await fetch(`http://localhost:8081/tasks/${task.id}`);
      if (!response.ok) throw new Error("Failed to fetch task details");
      const taskDetails = await response.json();
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
  };

  const handleActionClick = (event, taskId) => {
    event.stopPropagation();
    if (showActions === taskId) {
      setShowActions(null);
    } else {
      setShowActions(taskId);
      setSelectedTaskId(taskId);
    }
  };

  const handleEdit = () => {
    setShowActions(null); 
  };

  const handleDelete = () => {
    setShowActions(null); 
  };

  const handleStatusChange = (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);
    
  };

  // Calculate the total amount of all tasks
  const calculateTotalAmount = () => {
    return tasks.reduce((total, task) => {
      const taskAmount = parseFloat(task.amount) || 0;
      return total + taskAmount;
    }, 0);
  };

  return (
    <div className="posts-tab-content">
      <div className="project-posts">
   
      <div className="total-amount-container">
          <h3>
            {/*<span className="total-amount-text">Total Task:</span>*/}
            <span className="total-amount-number">
              {formatCurrency(calculateTotalAmount())}</span>
          </h3>
        </div>
      
        
        {selectedTaskDetails ? (
          <div className="task-details">
            <div className="task-detail-row">
              <div>
                <strong>Task</strong>
              </div>
              <div className="align-right amount-label">
                <strong>Amount</strong>
              </div>
            </div>
            <div className="task-detail-row">
              <div>{selectedTaskDetails.task_name}</div>
              <div className="align-right">{formatCurrency(selectedTaskDetails.task_fee)}</div>
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
              <div className="align-right amount-label">
                <strong>Fee</strong>
              </div>
            </div>
            {Array.isArray(selectedTaskDetails?.miscellaneous) ? (
              selectedTaskDetails.miscellaneous.map((item, index) => (
                <div key={index}>
                  <div className="task-detail-row">
                    <div>
                      <p> {item.name}</p>
                    </div>
                    <div className="align-right amount-label">
                      <p>{formatCurrency(parseFloat(item.fee) || 0)}</p>
                    </div>
                  </div>
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
                {calculateTotal(selectedTaskDetails) === 0
                  ? '--'
                  : formatCurrency(calculateTotal(selectedTaskDetails))}
              </div>
            </div>
          </div>
        ) : tasks.length === 0 ? (
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
                  <th>Actual Finish</th>
                  <th>Fee</th>
                  <th>Miscellaneous</th>
                  <th className="align-right">Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => {
                  const miscellaneousItems = JSON.parse(
                    task.miscellaneous || "[]"
                  );
                  const totalMiscellaneousFee = miscellaneousItems.reduce(
                    (total, item) => total + (parseFloat(item.fee) || 0),
                    0
                  );

                  return (
                    <tr
                      key={task.id}
                      onDoubleClick={() => handleRowDoubleClick(task)} // Double-click event
                    >
                      <td>{task.task_name}</td>
                      <td>{task.employee}</td>
                      <td>
  <select
    className={`status-dropdown ${task.status.toLowerCase()}`} // Add a class based on the task's status
    value={task.status || "Pending"} // Default status is "Pending"
    onChange={(e) => handleStatusChange(task.id, e.target.value)}
  >
    <option value="Pending" disabled={task.status === "Ongoing" || task.status === "Completed"}>
      Pending
    </option>
    <option value="Ongoing" disabled={task.status === "Completed"}>
      Ongoing
    </option>
    <option value="Completed">Completed</option>
  </select>
</td>
                      <td>{formatDate(task.due_date)}</td> {/* Updated Due Date formatting */}
                      <td>--</td>
                      <td>{formatCurrency(task.task_fee)}</td>
                      <td>
                        {totalMiscellaneousFee === 0
                          ? '--'
                          : formatCurrency(totalMiscellaneousFee)}
                      </td>
                      <td>{formatCurrency(task.amount)}</td>
                      <td
                        className="click-post-action"
                        onClick={(e) => handleActionClick(e, task.id)}
                      >
                        <BsThreeDotsVertical />
                        {showActions === task.id && (
                          <div className="post-click-popup">
                            <button onClick={handleEdit}>Edit</button>
                            <button onClick={handleDelete}>Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="create-button-container">
          <button
            className="create-task-button"
            onClick={() => setShowTaskForm(true)}
          >
            <IoAddCircle className="create-task-icon" /> +
          </button>
        </div>
        {showTaskForm && (
          <TaskForm
            projectId={projectId}
            handleCreateTask={handleCreateTask}
            handleCancelForm={handleCancelForm}
          />
        )}

        {showMiscellaneousForm && selectedTaskDetails && (
          <MiscellaneousForm
            taskId={selectedTaskDetails.id}
            updateTaskWithMiscellaneous={updateTaskWithMiscellaneous}
          />
        )}
      </div>
    </div>
  );
};

export default PostsTab;
