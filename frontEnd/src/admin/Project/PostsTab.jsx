import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import TaskForm from "./TaskForm";
import { IoCreateOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import "./ListView.css";

const PostsTab = ({
  projectId,
  tasks,
  setShowTaskForm,
  showTaskForm,
  handleCreateTask,
  handleCancelForm,
  setTasks,
}) => {
  const { searchTerm } = useContext(SearchContext);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [selectedTaskName, setSelectedTaskName] = useState(null);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employeeMap, setEmployeeMap] = useState({});
  const [showActions, setShowActions] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [projectName, setProjectName] = useState("");

  const formatCurrency = (amount) => {
    return `₱ ${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const parseMiscellaneous = (miscellaneous) => {
    try {
      return Array.isArray(miscellaneous)
        ? miscellaneous
        : JSON.parse(miscellaneous || "[]");
    } catch (e) {
      console.error("Failed to parse miscellaneous:", e);
      return [];
    }
  };

  useEffect(() => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = tasks.filter((task) => {
      const employeeName = employeeMap[task.employee] || "";
      const dueDate = formatDate(task.due_date) || "";
      const actualFinish = task.actual_finish
        ? formatDate(task.actual_finish)
        : "";

      return (
        task.task_name.toLowerCase().includes(searchLower) ||
        employeeName.toLowerCase().includes(searchLower) ||
        task.status.toLowerCase().includes(searchLower) ||
        dueDate.toLowerCase().includes(searchLower) ||
        actualFinish.toLowerCase().includes(searchLower) ||
        task.amount.toString().includes(searchLower)
      );
    });
    setFilteredTasks(filtered);
  }, [searchTerm, tasks, employeeMap]);

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

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8081/employees/id");
        if (!response.ok) throw new Error("Failed to fetch employee names");
        const data = await response.json();

        const map = data.reduce((acc, curr) => {
          acc[curr.id] = curr.fullName;
          return acc;
        }, {});
        setEmployeeMap(map);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/project/${projectId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }
        const data = await response.json();
        console.log("Project Data:", data);

        setProjectName(data.projectName || "Unknown Project");
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  const handleRowClick = async (task) => {
    setLoading(true);
    setSelectedTaskName(task.task_name);
    try {
      const response = await fetch(`http://localhost:8081/tasks/${task.id}`);
      if (!response.ok) throw new Error("Failed to fetch task details");
      const taskDetails = await response.json();
      // Parse miscellaneous data if it exists
      taskDetails.miscellaneous = taskDetails.miscellaneous
        ? parseMiscellaneous(taskDetails.miscellaneous)
        : [];
      setSelectedTaskDetails(taskDetails);
    } catch (error) {
      console.error("Error fetching task details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (event, taskId) => {
    event.stopPropagation();
    if (showActions === taskId) {
      setShowActions(null);
    } else {
      setShowActions(taskId);
      setSelectedTaskId(taskId);
      setShowActions(taskId === showActions ? null : taskId);
    }
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setSelectedTaskDetails({
        ...taskToEdit,
        miscellaneous: parseMiscellaneous(taskToEdit.miscellaneous),
      });
      setShowTaskForm(true);
    }
    setShowActions(null);
  };

  const handleDelete = async (taskId) => {
    if (!taskId) return;

    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(
          `http://localhost:8081/tasks/${taskId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete task");
        }

        const updatedTasks = tasks.filter((task) => task.id !== taskId);
        setTasks(updatedTasks);
        console.log("Task deleted successfully");
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }

    setShowActions(null);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    try {
      const response = await fetch(
        `http://localhost:8081/task/${taskId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
      if (newStatus === "Completed") {
        const updatedTask = updatedTasks.find((task) => task.id === taskId);
        updatedTask.actual_finish = new Date().toISOString();
        setTasks([...updatedTasks]);
      }
      console.log("Task status and actual finish updated successfully");
    } catch (error) {
      console.error("Error updating task status:", error);

      const revertedTasks = tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: tasks.find((t) => t.id === taskId).status }
          : task
      );
      setTasks(revertedTasks);
    }
  };

  const calculateTotalAmount = () => {
    return tasks.reduce((total, task) => {
      const taskAmount = parseFloat(task.amount) || 0;
      return total + taskAmount;
    }, 0);
  };

  const calculateTotal = (task) => {
    const taskFee = parseFloat(task.task_fee) || 0;
    const miscellaneousFee = task.miscellaneous
      ? task.miscellaneous.reduce(
          (total, item) => total + (parseFloat(item.fee) || 0),
          0
        )
      : 0;
    return taskFee + miscellaneousFee;
  };

  return (
    <div className="posts-tab-content">
      <div className="project-posts">
        <div className="create-button-container">
          <button
            className="create-task-button"
            onClick={() => setShowTaskForm(true)}
          >
            Create
            <IoCreateOutline className="create-task-icon" />
          </button>
        </div>
        <div className="total-amount-container">
          <h2 className="project-name-container">{projectName}</h2>
          <h4>
            <span className="total-amount-number">
              {formatCurrency(calculateTotalAmount())}
            </span>
          </h4>
        </div>

        {selectedTaskDetails ? (
          <div className="task-details">
            <br /><br />
            <div className="task-detail-row">
              <div>
                <strong>Task</strong>
              </div>
              <div className="align-right amount-label">
                <strong>Amount</strong>
              </div>
            </div>
            <br />
            <div className="task-detail-row">
              <div>{selectedTaskDetails.task_name}</div>
              <div className="align-right">
                {formatCurrency(selectedTaskDetails.task_fee)}
              </div>
            </div>
            <br />
            <div className="task-detail-row">
              <div>
                <strong>Miscellaneous</strong>
              </div>
              <div className="align-right amount-label">
                <strong>Fee</strong>
              </div>
            </div>
            {selectedTaskDetails.miscellaneous &&
              selectedTaskDetails.miscellaneous.map((item, index) => (
                <div key={index}>
                  <div className="task-detail-row">
                    <div>{item.name}</div>
                    <div className="align-right">
                      {formatCurrency(parseFloat(item.fee) || 0)}
                    </div>
                  </div>
                  <br />
                </div>
              ))}
            <div className="task-detail-row total-row">
              <div>
                <strong>Total</strong>
              </div>
              <div className="align-right">
                {formatCurrency(calculateTotal(selectedTaskDetails))}
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
                  <th className="numeric-column">Task Fee</th>
                  <th className="numeric-column">Total Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} onClick={() => handleRowClick(task)}>
                    <td>{task.task_name}</td>
                    <td>{employeeMap[task.employee] || "Unknown"}</td>
                    <td>
                      <select
                        className={`status-dropdown ${task.status.toLowerCase()}`}
                        value={task.status || "Pending"}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="Pending" disabled={task.status === "Ongoing" || task.status === "Completed"}>Pending</option>
                        <option value="Ongoing" disabled={task.status === "Completed"}>Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>{formatDate(task.due_date)}</td>
                    <td>{task.actual_finish ? formatDate(task.actual_finish) : "--"}</td>
                    <td className="numeric-column">{formatCurrency(task.task_fee)}</td>
                    <td className="numeric-column">{formatCurrency(task.amount)}</td>
                    <td className="action-icons">
                      <AiOutlineEdit
                        className="edit-task-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(task.id);
                        }}
                        title="Edit Task"
                        style={{ fontSize: "1.5rem", marginRight: "10px" }}
                      />
                      <MdOutlineDeleteOutline
                        className="delete-task-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(task.id);
                        }}
                        title="Delete Task"
                        style={{ fontSize: "1.5rem" }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showTaskForm && (
          <TaskForm
            projectId={projectId}
            tasks={tasks}
            existingTask={selectedTaskDetails}
            onCreate={handleCreateTask}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
};

export default PostsTab;