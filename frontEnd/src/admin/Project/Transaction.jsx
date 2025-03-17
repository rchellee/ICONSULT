import React, { useState, useEffect, useRef } from "react";
import { IoCreateOutline } from "react-icons/io5";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import TaskCreateForm from "./TaskCreateForm";
import "./Transaction.css";

const Transaction = ({ projectId }) => {
  const [transactions, setTransactions] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [sortCriteria, setSortCriteria] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [openDropdown, setOpenDropdown] = useState(null); // Track which dropdown is open

  // Refs for dropdown containers
  const statusDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if clicked outside status dropdown
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }

      // Close dropdown if clicked outside sort dropdown
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateTask = (newTask) => {
    setTransactions([...transactions, newTask]);
  };

  const handleDeleteTask = (taskIndex) => {
    const updatedTransactions = transactions.filter((_, index) => index !== taskIndex);
    setTransactions(updatedTransactions);
  };

  const handleEditTask = (taskIndex) => {
    console.log("Edit task:", transactions[taskIndex]);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
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
    const subtotal = transaction.subItems.reduce((subSum, subItem) => subSum + subItem.amount, 0);
    return sum + subtotal;
  }, 0);

  const totalPaid = transactions.reduce((sum, transaction) => {
    if (transaction.status === "Paid") {
      const subtotal = transaction.subItems.reduce((subSum, subItem) => subSum + subItem.amount, 0);
      return sum + subtotal;
    }
    return sum;
  }, 0);

  const paymentProgress = ((totalPaid / totalAmount) * 100).toFixed(2);

  const handleTaskStatusChange = (taskIndex, status) => {
    const updatedTransactions = [...transactions];
    updatedTransactions[taskIndex].status = status;

    if (status === "Paid") {
      updatedTransactions[taskIndex].datePaid = new Date().toISOString().split("T")[0];
    } else {
      updatedTransactions[taskIndex].datePaid = "";
    }

    setTransactions(updatedTransactions);
  };

  const handleMOPChange = (taskIndex, subItemIndex, mop) => {
    const updatedTransactions = [...transactions];
    if (subItemIndex === -1) {
      // Update MOP for the main task fee
      updatedTransactions[taskIndex].mop = mop;
    } else {
      // Update MOP for the sub-item (miscellaneous)
      updatedTransactions[taskIndex].subItems[subItemIndex].mop = mop;
    }
    setTransactions(updatedTransactions);
  };

  const sortTransactions = (criteria) => {
    const sortedTransactions = [...transactions];

    switch (criteria) {
      case "name-asc":
        sortedTransactions.sort((a, b) => a.expenses.localeCompare(b.expenses));
        break;
      case "date-asc":
        sortedTransactions.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        break;
      case "date-desc":
        sortedTransactions.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
        break;
      default:
        break;
    }

    setTransactions(sortedTransactions);
    setSortCriteria(criteria);
    setOpenDropdown(null); // Close dropdown after sorting
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (filterStatus === "all") return true;
    return transaction.status.toLowerCase() === filterStatus.toLowerCase();
  });

  // Handle dropdown toggle
  const toggleDropdown = (dropdownName) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null); // Close the dropdown if it's already open
    } else {
      setOpenDropdown(dropdownName); // Open the clicked dropdown
    }
  };

  return (
    <div>
      {/* Header with Project ID */}
      <div className="header-container">
        <h2 className="project-id">Project: {projectId}</h2>
        <button
          className="create-task-button"
          onClick={() => setShowTaskForm(true)}
        >
          Create
          <IoCreateOutline className="create-task-icon" />
        </button>
      </div>

      {/* Task Creation Form */}
      {showTaskForm && (
        <TaskCreateForm
          onClose={() => setShowTaskForm(false)}
          onCreate={handleCreateTask}
        />
      )}

      {/* Details Section */}
      <div className="details-container">
        <div className="details-content">
          {/* Left-aligned details */}
          <div className="detail-row">
            <div className="detail-item partial-payment">
              <span className="detail-label">Partial Payment:</span>
              <span className="detail-value">--</span>
            </div>
            <div className="detail-item current-task">
              <span className="detail-label">Current Task:</span>
              <span className="detail-value">{transactions.length}</span>
            </div>
            <div className="detail-item past-dues">
              <span className="detail-label">Past Dues:</span>
              <span className="detail-value">
                {transactions.filter((transaction) => calculatePastDueDays(transaction.dueDate) > 0).length}
              </span>
            </div>
            <div className="progress-container">
              <span className="progress-text">Progress: {paymentProgress}%</span>
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
                  <button onClick={() => setFilterStatus("all")}>All</button>
                  <button onClick={() => setFilterStatus("paid")}>Paid</button>
                  <button onClick={() => setFilterStatus("unpaid")}>Unpaid</button>
                  <button onClick={() => setFilterStatus("partial payment")}>Partial Payment</button>
                  <button onClick={() => setFilterStatus("overdue")}>Overdue</button>
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
                  <button onClick={() => sortTransactions("name-asc")}>Name</button>
                  <button onClick={() => sortTransactions("date-asc")}>Ascending</button>
                  <button onClick={() => sortTransactions("date-desc")}>Descending</button>
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
              <th>Assign Employee</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Date Paid</th>
              <th>Past Due</th>
              <th>Status</th>
              <th>Mode of Payment (MOP)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction, index) => {
              const subtotal = transaction.subItems.reduce((sum, subItem) => sum + subItem.amount, 0);
              const pastDueDays = calculatePastDueDays(transaction.dueDate);

              return (
                <React.Fragment key={index}>
                  {/* Task Name Row */}
                  <tr>
                    <td>{transaction.expenses}</td>
                    <td></td>
                    <td>{transaction.assignedEmployee}</td>
                    <td></td>
                    <td>{formatDate(transaction.dueDate)}</td>
                    <td>{formatDate(transaction.datePaid)}</td>
                    <td>{pastDueDays > 0 ? `${pastDueDays} days` : "No"}</td>
                    <td>
                      <select
                        value={transaction.status || ""}
                        onChange={(e) => handleTaskStatusChange(index, e.target.value)}
                        className="transaction-button"
                      >
                        <option value="">Select Status</option>
                        <option value="Paid" disabled={transaction.status === "Partial Payment" || transaction.status === "Unpaid"}>
                          Paid
                        </option>
                        <option value="Partial Payment" disabled={transaction.status === "Paid"}>
                          Partial Payment
                        </option>
                        <option value="Unpaid" disabled={transaction.status === "Paid" || transaction.status === "Partial Payment"}>
                          Unpaid
                        </option>
                      </select>
                    </td>
                    <td></td>
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

                  {/* Task Fee Row */}
                  <tr>
                    <td></td>
                    <td>Task Fee</td>
                    <td></td>
                    <td className="amount-cell">{formatAmount(transaction.subItems[0].amount)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <select
                        value={transaction.mop || ""}
                        onChange={(e) => handleMOPChange(index, -1, e.target.value)}
                        className="mop-dropdown"
                      >
                        <option value="">Select MOP</option>
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </td>
                  </tr>

                  {/* Sub-items (Miscellaneous) */}
                  {transaction.subItems.slice(1).map((subItem, subIndex) => (
                    <tr key={`sub-${subIndex}`}>
                      <td></td>
                      <td>{subItem.expenses}</td>
                      <td></td>
                      <td className="amount-cell">{formatAmount(subItem.amount)}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td>
                        <select
                          value={subItem.mop || ""}
                          onChange={(e) => handleMOPChange(index, subIndex + 1, e.target.value)}
                          className="mop-dropdown"
                        >
                          <option value="">Select MOP</option>
                          <option value="Cash">Cash</option>
                          <option value="Online">Online</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </td>
                    </tr>
                  ))}

                  {/* Subtotal Row for the Task */}
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
                </React.Fragment>
              );
            })}
            {/* Total row */}
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