import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import { TbArrowsSort } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  
  const statusDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectName = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/project/${projectId}`
        );
        setProjectName(response.data.projectName);
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
          progress: parseFloat(progress),
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
    return sum + (transaction.amount || 0);
  }, 0);

  const totalPaid = transactions.reduce((sum, transaction) => {
    if (transaction.status === "Paid") {
      return sum + (transaction.amount || 0);
    }
    return sum;
  }, 0);

  const paymentProgress = Math.round((totalPaid / totalAmount) * 100);

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

  const totalPaidAmount = transactions.reduce((sum, transaction) => {
    if (transaction.status === "Paid") {
      return sum + (transaction.amount || 0);
    }
    return sum;
  }, 0);

  useEffect(() => {
    if (transactions.length > 0) {
      updatePaidAmount(totalPaidAmount);
    }
  }, [totalPaidAmount]);

  useEffect(() => {
    axios
      .get("http://localhost:8081/employees/id")
      .then((response) => {
        const employeeMap = {};
        response.data.forEach((employee) => {
          employeeMap[employee.id] = employee.fullName;
        });
        setEmployees(employeeMap);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);

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
        const fetchResponse = await fetch(
          `http://localhost:8081/admin/tasks?projectId=${projectId}`
        );
        if (!fetchResponse.ok) {
          throw new Error("Failed to fetch tasks after creation");
        }
        const data = await fetchResponse.json();
        const tasks = data.tasks;

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
        projectId: projectId,
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
          transactionId: taskToEdit.transaction_id,
          modeOfPayment: taskToEdit.mode_of_payment,
          paidDate: taskToEdit.date_paid,
        },
        projectId: projectId,
      },
    });
  };

  const handleUpdateTask = (updatedTask) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[updatedTask.index] = {
      ...updatedTask,
      created_at: updatedTask.created_at || new Date().toISOString(),
    };

    const sortedTransactions = updatedTransactions.sort((a, b) => {
      if (a.status === "Paid" && b.status !== "Paid") return 1;
      if (b.status === "Paid" && a.status !== "Paid") return -1;
      return new Date(b.created_at) - new Date(a.created_at);
    });
    setTransactions(sortedTransactions);
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleDeleteClick = (taskIndex) => {
    setTaskToDelete(taskIndex);
    setShowDeleteConfirm(true);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const confirmDelete = async () => {
    if (taskToDelete === null) {
      setShowDeleteConfirm(false);
      return;
    }

    const taskToDeleteObj = transactions[taskToDelete];

    try {
      const response = await axios.delete(
        `http://localhost:8081/tasks/${taskToDeleteObj.id}`
      );

      if (response.status === 200) {
        const updatedTransactions = transactions.filter(
          (_, index) => index !== taskToDelete
        );
        setTransactions(updatedTransactions);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  const formatAmount = (amount) => {
    if (isNaN(amount)) {
      return "₱0.00";
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
    if (!dueDate || status === "Paid") return 0;
    const today = new Date();
    const due = new Date(dueDate);
    const timeDiff = today - due;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff > 0 ? daysDiff : 0;
  };

  const toggleDropdown = (dropdownName) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
    }
  };

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
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <div className="delete-confirmation-header">
              <MdOutlineDeleteOutline className="delete-project-icon" />
              <h3>Confirm Deletion</h3>
            </div>
            <p>Are you sure you want to delete this task?</p>
           
            <div className="delete-confirmation-buttons">
              <button className="cancel-project-button" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-project-button" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="header-container">
      </div>
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
          <div className="metrics-box">
            <div className="metric-item">
              <span className="metric-label">Current Task:</span>
              <span className="detail-value current-task-value">
                {transactions.length}
              </span>
            </div>
            
            <div className="metric-item">
              <span className="metric-label">Not Paid:</span>
              <span className="detail-value not-paid-value">
                {transactions.filter(t => t.status !== "Paid").length}
              </span>
            </div>
            
            <div className="metric-item">
              <span className="metric-label">Paid:</span>
              <span className="detail-value paid-value">
                {transactions.filter(t => t.status === "Paid").length}
              </span>
            </div>

            <div className="progresstask-container">
              <span className="progress-text">
                Progress: <span className="value">{paymentProgress}%</span>
              </span>
              <div className="progresstask-bar">
              {paymentProgress > 0 && (
                <div
                  className="progress-bar-fill"
                  style={{ width: `${paymentProgress}%` }}
                ></div>
              )}
              </div>
            </div>
          </div>

          <div className="button-row">
            <div className="status-task" ref={statusDropdownRef}>
              <button
                className="status-task-button"
                onClick={() => toggleDropdown("status")}
              >
                <FaTasks size={20} className="button-icon" />
                <span>Status</span>
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
                <TbArrowsSort size={20} className="button-icon" />
                <span>Sort</span>
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

      <div className="table-task">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Task Name</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Assign Employee</th>
              <th>Due Date</th>
              <th>Date Paid</th>
              <th>Status</th>
              <th></th>
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
                    <td className="number-column">{index + 1}</td>
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
                        ? formatAmount(transaction.subItems[0].amount)
                        : formatAmount(subtotal)}
                    </td>
                    <td>{assignedEmployeeName}</td>
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
                          onClick={() => handleDeleteClick(index)}
                        >
                          <MdOutlineDeleteOutline />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedTasks.has(index) &&
                    transaction.subItems.slice(1).map((subItem, subIndex) => (
                      <tr key={`sub-${subIndex}`}>
                        <td></td>
                        <td></td>
                        <td>{subItem.expenses}</td>
                        <td className="amount-cell">
                          {formatAmount(subItem.amount)}
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
                  {expandedTasks.has(index) && (
                    <tr className="subtotal-row">
                      <td colSpan="2"></td>
                      <td></td>
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
              <td></td>
              <td className="amount-cell">{formatAmount(totalAmount)}</td>
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