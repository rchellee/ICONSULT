import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoCreateOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import TaskCreateForm from "./TaskCreateForm";
import axios from "axios"; // Import axios for making HTTP requests
import "./Transaction.css";

const Transaction = ({ projectId }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [employees, setEmployees] = useState({}); // Store employee data as a mapping of ID to fullName

  // Refs for dropdown containers
  const statusDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  // Fetch employee data
  useEffect(() => {
    axios
      .get("http://localhost:8081/employees/id") // Fetch employee data
      .then((response) => {
        const employeeMap = {};
        response.data.forEach((employee) => {
          employeeMap[employee.id] = employee.fullName; // Map employee ID to fullName
        });
        setEmployees(employeeMap); // Set the employee mapping
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

  // Fetch tasks
  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/admin/tasks?projectId=${projectId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        const tasks = data.tasks;

        // Map tasks to the expected transactions structure
        const mappedTransactions = tasks.map((task) => {
          // Parse the miscellaneous JSON string and ensure `fee` is a number
          const miscellaneous = JSON.parse(task.miscellaneous || "[]").map(
            (item) => ({
              ...item,
              fee: parseFloat(item.fee) || 0, // Ensure fee is a number
            })
          );

          return {
            id: task.id,
            expenses: task.task_name,
            dueDate: task.due_date,
            assignedEmployee: task.employee, // This is the employee ID
            subItems: [
              {
                expenses: "Task Fee",
                amount: parseFloat(task.task_fee) || 0, // Ensure amount is a number
              },
              ...miscellaneous, // Use the parsed and corrected miscellaneous array
            ],
            status: task.status,
            datePaid: task.actual_finish || "",
            amount: parseFloat(task.amount) || 0, // Include the amount field from the tasks table
          };
        });

        // Log the mapped transactions for debugging
        console.log("Mapped Transactions:", mappedTransactions);

        setTransactions(mappedTransactions);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [projectId]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }

      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle creating a new task
  const handleCreateTask = async (newTask) => {
    try {
      const response = await axios.post("http://localhost:8081/tasks", {
        taskName: newTask.expenses,
        taskFee: newTask.subItems[0].amount,
        dueDate: newTask.dueDate,
        employee: newTask.assignedEmployee,
        miscellaneous: newTask.subItems.slice(1),
        projectId: projectId,
      });

      if (response.status === 201) {
        // Fetch tasks again to update the list
        const fetchResponse = await fetch(
          `http://localhost:8081/admin/tasks?projectId=${projectId}`
        );
        if (!fetchResponse.ok) {
          throw new Error("Failed to fetch tasks after creation");
        }
        const data = await fetchResponse.json();
        const tasks = data.tasks;

        // Map tasks to the expected transactions structure
        const mappedTransactions = tasks.map((task) => {
          const miscellaneous = JSON.parse(task.miscellaneous || "[]").map(
            (item) => ({
              ...item,
              fee: parseFloat(item.fee) || 0,
            })
          );

          return {
            id: task.id,
            expenses: task.task_name,
            dueDate: task.due_date,
            assignedEmployee: task.employee,
            subItems: [
              {
                expenses: "Task Fee",
                amount: parseFloat(task.task_fee) || 0,
              },
              ...miscellaneous,
            ],
            status: task.status,
            datePaid: task.actual_finish || "",
            amount: parseFloat(task.amount) || 0,
          };
        });

        setTransactions(mappedTransactions);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const navigateToCreateTask = () => {
    navigate(`/create-task?projectId=${projectId}`); // Pass only projectId
  };

  const handleEditTask = (taskIndex) => {
    setEditingTask({ ...transactions[taskIndex], index: taskIndex });
    setShowTaskForm(true);
  };

  const handleUpdateTask = (updatedTask) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[updatedTask.index] = updatedTask;
    setTransactions(updatedTransactions);
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskIndex) => {
    const updatedTransactions = transactions.filter(
      (_, index) => index !== taskIndex
    );
    setTransactions(updatedTransactions);
  };

  const formatAmount = (amount) => {
    if (isNaN(amount)) {
      return "₱0.00"; // Return a default value if amount is NaN
    }
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculatePastDueDays = (dueDate) => {
    if (!dueDate) return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = today - due;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  const totalAmount = transactions.reduce((sum, transaction) => {
    return sum + (transaction.amount || 0); // Use the amount field directly
  }, 0);

  const totalPaid = transactions.reduce((sum, transaction) => {
    if (transaction.status === "Paid") {
      return sum + (transaction.amount || 0); // Use the amount field directly
    }
    return sum;
  }, 0);

  const paymentProgress = ((totalPaid / totalAmount) * 100).toFixed(2);

  const handleTaskStatusChange = (taskIndex, status) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[taskIndex].status = status;

    if (status === "Paid") {
      updatedTransactions[taskIndex].datePaid = new Date()
        .toISOString()
        .split("T")[0];
    } else {
      updatedTransactions[taskIndex].datePaid = "";
    }

    setTransactions(updatedTransactions);
  };

  // Handle dropdown toggle
  const toggleDropdown = (dropdownName) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
    }
  };

  // Toggle task details visibility
  const toggleTaskDetails = (taskIndex) => {
    const newExpandedTasks = new Set(expandedTasks);
    if (newExpandedTasks.has(taskIndex)) {
      newExpandedTasks.delete(taskIndex);
    } else {
      newExpandedTasks.add(taskIndex);
    }
    setExpandedTasks(newExpandedTasks);
  };

  return (
    <div>
      {/* Header with Project ID */}
      <div className="header-container">
        <h2 className="project-id">Project: {projectId}</h2>
        <button
          className="create-task-button"
          onClick={navigateToCreateTask} // Use the navigate function
        >
          Create <IoCreateOutline className="create-task-icon" />
        </button>
      </div>
      {/* Task Creation/Edit Form */}
      {showTaskForm && (
        <TaskCreateForm
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          onCreate={handleCreateTask}
          onUpdate={handleUpdateTask}
          taskToEdit={editingTask}
        />
      )}

      {/* Details Section */}
      <div className="details-container">
        <div className="details-content">
          {/* Left-aligned details */}
          <div className="detail-row">
            <div className="detail-item current-task">
              <span className="detail-label">Current Task:</span>
              <span className="detail-value">{transactions.length}</span>
            </div>
            <div className="detail-item past-dues">
              <span className="detail-label">Past Dues:</span>
              <span className="detail-value">
                {
                  transactions.filter(
                    (transaction) =>
                      calculatePastDueDays(transaction.dueDate) > 0
                  ).length
                }
              </span>
            </div>
            <div className="progress-container">
              <span className="progress-text">
                Progress: {paymentProgress}%
              </span>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${paymentProgress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right-aligned buttons */}
          <div className="button-row">
            <button className="export-button">Export</button>
            <div className="status-task" ref={statusDropdownRef}>
              <button
                className="status-button"
                onClick={() => toggleDropdown("status")}
              >
                Status
              </button>
              {openDropdown === "status" && (
                <div className="dropdown-task">
                  <button>All</button>
                  <button>Paid</button>
                  <button>Unpaid</button>
                </div>
              )}
            </div>
            <div className="sort-container" ref={sortDropdownRef}>
              <button
                className="sort-button"
                onClick={() => toggleDropdown("sort")}
              >
                Sort
              </button>
              {openDropdown === "sort" && (
                <div className="sort-dropdown">
                  <button>Name</button>
                  <button>Ascending</button>
                  <button>Descending</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="table-task">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Task Name</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Assign Employee</th>
              <th>Due Date</th>
              <th>Date Paid</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => {
              const subtotal = transaction.amount;
              const pastDueDays = calculatePastDueDays(transaction.dueDate);
              const assignedEmployeeName =
                employees[transaction.assignedEmployee] || "Unknown"; 
              return (
                <React.Fragment key={index}>
                  <tr>
                    <td>{transaction.expenses}</td>
                    <td>
                      <button
                        className="dropdown-toggle"
                        onClick={() => toggleTaskDetails(index)}
                      >
                        {expandedTasks.has(index) ? "▼" : "▶"} Miscellaneous
                      </button>
                    </td>
                    <td className="amount-cell">
                      {
                        expandedTasks.has(index)
                          ? formatAmount(transaction.subItems[0].amount) // Show only Consultancy Fee when expanded
                          : formatAmount(subtotal) // Show total when collapsed
                      }
                    </td>
                    <td>{assignedEmployeeName}</td>{" "}
                    <td>{formatDate(transaction.dueDate)}</td>
                    <td>{formatDate(transaction.datePaid)}</td>
                    <td>
                      <select
                        value={transaction.status || ""}
                        onChange={(e) =>
                          handleTaskStatusChange(index, e.target.value)
                        }
                        className="transaction-button"
                      >
                        <option value="">Select Status</option>
                        <option
                          value="Paid"
                          disabled={transaction.status === "Paid"}
                        >
                          Paid
                        </option>
                        <option
                          value="Unpaid"
                          disabled={transaction.status === "Paid"}
                        >
                          Unpaid
                        </option>
                      </select>
                    </td>
                    <td>
                      <div className="task-actions">
                        <button
                          className="edit-task"
                          onClick={() => handleEditTask(index)}
                        >
                          <AiOutlineEdit />
                        </button>
                        <button
                          className="delete-task"
                          onClick={() => handleDeleteTask(index)}
                        >
                          <MdOutlineDeleteOutline />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Sub-items (Miscellaneous) */}
                  {expandedTasks.has(index) &&
                    transaction.subItems.slice(1).map((subItem, subIndex) => (
                      <tr key={`sub-${subIndex}`}>
                        <td></td>
                        <td>{subItem.expenses}</td>
                        <td className="amount-cell">
                          {formatAmount(subItem.amount)}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
                  {/* Subtotal Row for the Task */}
                  {expandedTasks.has(index) && (
                    <tr className="subtotal-row">
                      <td colSpan="2"></td>
                      <td className="amount-cell">{formatAmount(subtotal)}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            <tr className="total-row">
              <td>Total</td>{/* Total row */}
              <td></td>
              <td className="amount-cell">{formatAmount(totalAmount)}</td>
              <td></td>
              <td colSpan="4"></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaction;
