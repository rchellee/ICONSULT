import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoCreateOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { IoChevronForward } from "react-icons/io5";
import TaskCreateForm from "./TaskCreateForm";
import axios from "axios";
import "./Transaction.css";

const Transaction = ({ projectId }) => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [employees, setEmployees] = useState({});
  const [projectName, setProjectName] = useState("");
  const statusDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/project/${projectId}`
        );
        setProjectName(response.data.projectName); // Assuming the response contains the project name
      } catch (error) {
        console.error("Error fetching project name:", error);
      }
    };

    fetchProjectName();
  }, [projectId]);
  const updateProjectProgress = async (progress) => {
    try {
      const response = await axios.put(
        `http://localhost:8081/update-progress/${projectId}`,
        {
          progress: parseFloat(progress), // Ensure progress is a number
        }
      );

      if (response.status === 200) {
        console.log("Project progress updated successfully:", response.data);
      }
    } catch (error) {
      console.error("Error updating project progress:", error);
    }
  };
  const updateTotalAmount = async (totalAmount) => {
    try {
      await axios.put("http://localhost:8081/update-total-amount", {
        projectId: projectId,
        totalAmount: totalAmount,
      });
      console.log("Total amount updated successfully.");
    } catch (error) {
      console.error("Error updating total amount:", error);
    }
  };
  const totalAmount = transactions.reduce((sum, transaction) => {
    return sum + (transaction.amount || 0); // Use the amount field directly
  }, 0);
  const totalPaid = transactions.reduce((sum, transaction) => {
    if (transaction.status === "Paid") {
      return sum + (transaction.amount || 0);
    }
    return sum;
  }, 0);
  const paymentProgress = ((totalPaid / totalAmount) * 100).toFixed(2);
  useEffect(() => {
    if (transactions.length > 0) {
      updateProjectProgress(paymentProgress);
    }
  }, [paymentProgress]);
  const checkAndUpdateStatus = async (task) => {
    if (task.transaction_id && task.mode_of_payment && task.date_paid) {
      try {
        const response = await axios.put(
          `http://localhost:8081/tasksStatus/${task.id}`,
          {
            status: "Completed",
            payment_status: "Paid",
          }
        );

        if (response.status === 200) {
          console.log("Task status updated successfully:", response.data);
          return true;
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    }
    return false;
  };
  useEffect(() => {
    if (transactions.length > 0) {
      updateTotalAmount(totalAmount);
    }
  }, [totalAmount]);

  const updatePaidAmount = async (paidAmount) => {
    try {
      await axios.put("http://localhost:8081/update-paid-amount", {
        projectId: projectId,
        paidAmount: paidAmount,
      });
      console.log("Paid amount updated successfully.");
    } catch (error) {
      console.error("Error updating paid amount:", error);
    }
  };

  // Calculate total paid amount
  const totalPaidAmount = transactions.reduce((sum, transaction) => {
    if (transaction.status === "Paid") {
      return sum + (transaction.amount || 0);
    }
    return sum;
  }, 0);

  // Update the paid_amount in the database whenever totalPaidAmount changes
  useEffect(() => {
    if (transactions.length > 0) {
      updatePaidAmount(totalPaidAmount);
    }
  }, [totalPaidAmount]);

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
        const updatedTasks = await Promise.all(
          tasks.map(async (task) => {
            const shouldUpdate = await checkAndUpdateStatus(task);
            if (shouldUpdate) {
              return {
                ...task,
                status: "Completed",
                payment_status: "Paid",
              };
            }
            return task;
          })
        );
        const mappedTransactions = updatedTasks.map((task) => {
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
            assignedEmployee: task.employee,
            subItems: [
              {
                expenses: "Task Fee",
                amount: parseFloat(task.task_fee) || 0,
              },
              ...miscellaneous,
            ],
            status: task.payment_status,
            date_paid: task.date_paid || "",
            amount: parseFloat(task.amount) || 0,
            created_at: task.created_at,
          };
        });

        const sortedTransactions = mappedTransactions.sort((a, b) => {
          if (a.status === "Paid" && b.status !== "Paid") return 1;
          if (b.status === "Paid" && a.status !== "Paid") return -1;
          return new Date(b.created_at) - new Date(a.created_at);
        });

        setTransactions(sortedTransactions);
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
    navigate(`/create-task`, {
      state: {
        projectId: projectId, // Ensure projectId is passed here
      },
    });
  };
  const handleEditTask = (taskIndex) => {
    const taskToEdit = transactions[taskIndex];
    navigate(`/create-task`, {
      state: {
        taskToEdit: {
          ...taskToEdit,
          index: taskIndex,
          transactionId: taskToEdit.transaction_id, // Add transaction_id
          modeOfPayment: taskToEdit.mode_of_payment, // Add mode_of_payment
          paidDate: taskToEdit.date_paid, // Add date_paid
        },
        projectId: projectId, // Pass projectId for context
      },
    });
  };
  const handleUpdateTask = (updatedTask) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[updatedTask.index] = {
      ...updatedTask,
      created_at: updatedTask.created_at || new Date().toISOString(), // Preserve or set created_at
    };

    // Sort transactions by created_at (newest first) and status (Paid last)
    const sortedTransactions = updatedTransactions.sort((a, b) => {
      if (a.status === "Paid" && b.status !== "Paid") return 1;
      if (b.status === "Paid" && a.status !== "Paid") return -1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setTransactions(sortedTransactions);
    setShowTaskForm(false);
    setEditingTask(null);
  };
  const handleDeleteTask = async (taskIndex) => {
    const taskToDelete = transactions[taskIndex];

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!isConfirmed) {
      return; // Exit if the user cancels the deletion
    }

    try {
      // Send a DELETE request to the backend
      const response = await axios.delete(
        `http://localhost:8081/tasks/${taskToDelete.id}`
      );

      if (response.status === 200) {
        // Remove the deleted task from the local state
        const updatedTransactions = transactions.filter(
          (_, index) => index !== taskIndex
        );
        setTransactions(updatedTransactions);
        console.log("Task deleted successfully:", response.data);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
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
  const calculatePastDueDays = (dueDate, status) => {
    if (!dueDate || status === "Paid") return 0; // Return 0 if the task is paid or has no due date
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = today - due;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff > 0 ? daysDiff : 0; // Return the number of days past due (or 0 if not past due)
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
      <h3 className="project-id">
        <span className="project-name">MyProject</span>
          <IoChevronForward className="chevron-icon" />
        <span className="project-name">{projectName}</span>
      </h3>
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
                calculatePastDueDays(
                  transaction.dueDate,
                  transaction.status
                ) > 0
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
      <div className="status-task" ref={statusDropdownRef}>
        <button
          className="status-task-button"
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
          className="sort-task-button"
          onClick={() => toggleDropdown("sort")}
        >
          Sort
        </button>
        {openDropdown === "sort" && (
          <div className="sort-task-dropdown">
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
                        className="misc-dropdown"
                        onClick={() => toggleTaskDetails(index)}
                      >
                        {expandedTasks.has(index) ? "▼" : "▶"} Miscellaneous
                      </button>
                    </td>
                    <td className="amount-cell">
                      {expandedTasks.has(index)
                        ? formatAmount(transaction.subItems[0].amount) // Show only Consultancy Fee when expanded
                        : formatAmount(subtotal)}
                    </td>
                    <td>{assignedEmployeeName}</td>{" "}
                    <td
                      style={{
                        color:
                          calculatePastDueDays(
                            transaction.dueDate,
                            transaction.status
                          ) > 0
                            ? "red"
                            : "inherit",
                      }}
                    >
                      {formatDate(transaction.dueDate)}
                    </td>
                    <td>{formatDate(transaction.date_paid)}</td>
                    <td>
                      <span
                        style={{
                          color: transaction.status === "Paid" ? "blue" : "red",
                          fontWeight: "normal",
                        }}
                      >
                        {transaction.status}
                      </span>
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
              <td>Total</td>
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
