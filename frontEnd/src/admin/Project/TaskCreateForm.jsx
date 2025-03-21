import React, { useState, useEffect } from "react";
import "./TaskCreate.css";
import { MdAddCircleOutline } from "react-icons/md";

const TaskCreateForm = ({ onClose, onCreate, onUpdate, taskToEdit }) => {
  const [taskName, setTaskName] = useState("");
  const [taskFee, setTaskFee] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [assignedEmployee, setAssignedEmployee] = useState("");
  const [subItems, setSubItems] = useState([]);
  const [miscName, setMiscName] = useState("");
  const [miscAmount, setMiscAmount] = useState(0);
  const [transactionId, setTransactionId] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("");

  // Pre-fill form if editing a task
  useEffect(() => {
    if (taskToEdit) {
      setTaskName(taskToEdit.expenses);
      setDueDate(taskToEdit.dueDate);
      setAssignedEmployee(taskToEdit.assignedEmployee);
      setTransactionId(taskToEdit.transactionId);
      setModeOfPayment(taskToEdit.modeOfPayment);
      setSubItems(taskToEdit.subItems);
      setTaskFee(taskToEdit.subItems[0].amount); // Task fee is the first sub-item
    }
  }, [taskToEdit]);

  // Add a miscellaneous item
  const handleAddMiscellaneous = () => {
    if (miscName && miscAmount > 0) {
      setSubItems([...subItems, { expenses: miscName, amount: parseFloat(miscAmount) }]);
      setMiscName("");
      setMiscAmount(0);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      expenses: taskName,
      dueDate,
      assignedEmployee,
      subItems: [
        { expenses: "Task Fee", amount: parseFloat(taskFee) },
        ...subItems,
      ],
      transactionId,
      modeOfPayment,
      datePaid: taskToEdit ? taskToEdit.datePaid : "",
      status: taskToEdit ? taskToEdit.status : "",
      index: taskToEdit ? taskToEdit.index : null,
    };

    if (taskToEdit) {
      onUpdate(newTask); // Update task if editing
    } else {
      onCreate(newTask); // Create new task if not editing
    }
    onClose(); // Close the form
  };

  return (
    <div className="task-create-form-overlay">
      <div className="task-create-form">
        <h2>{taskToEdit ? "Update Task" : "Create Task"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Task Details Section */}
          <div className="form-section">
            <h3>Task Details</h3>
            <div className="form-row">
              <div className="form-modal-field">
                <label>Task Name:</label>
                <input
                  type="text"
                  placeholder="Enter"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />
              </div>
              <div className="form-modal-field">
                <label>Consultancy Fee:</label>
                <input
                  type="number"
                  placeholder="₱"
                  value={taskFee}
                  onChange={(e) => setTaskFee(e.target.value)}
                  required
                  inputMode="numeric"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-modal-field">
                <label>Miscellaneous Name:</label>
                <input
                  type="text"
                  value={miscName}
                  onChange={(e) => setMiscName(e.target.value)}
                />
              </div>
              <div className="form-modal-field">
                <label>Miscellaneous Fee:</label>
                <input
                  type="number"
                  placeholder="₱"
                  value={miscAmount}
                  onChange={(e) => setMiscAmount(e.target.value)}
                  inputMode="numeric"
                />
              </div>
              <button
                type="button"
                className="add-misc-button"
                onClick={handleAddMiscellaneous}
              >
                <MdAddCircleOutline />
              </button>
            </div>

            {/* Display Added Miscellaneous Items */}
            <div className="misc-list-container">
              <ul className="misc-list">
                {subItems.map((item, index) => (
                  <li key={index}>
                    <span>{item.expenses}</span>
                    <span>₱{item.amount}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="form-row">
              <div className="form-modal-field">
                <label>Assign Employee:</label>
                <select
                  value={assignedEmployee}
                  onChange={(e) => setAssignedEmployee(e.target.value)}
                  required
                >
                  <option value="">Select Employee</option>
                  <option value="Employee 1">Employee 1</option>
                  <option value="Employee 2">Employee 2</option>
                  <option value="Employee 3">Employee 3</option>
                </select>
              </div>
              <div className="form-modal-field">
                <label>Due Date:</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="form-section">
            <h3>Payment Details</h3>
            <div className="form-row">
              <div className="form-modal-field">
                <label>Transaction ID:</label>
                <input
                  type="text"
                  placeholder="Enter"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
              </div>
              <div className="form-modal-field">
                <label>Mode of Payment (MOP): </label>
                <select
                  value={modeOfPayment}
                  onChange={(e) => setModeOfPayment(e.target.value)}
                  required
                >
                  <option value="">Select (MOP)</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{taskToEdit ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateForm;