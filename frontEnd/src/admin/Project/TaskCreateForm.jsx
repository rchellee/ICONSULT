import React, { useState } from "react";
import "./TaskCreate.css";

const TaskCreateForm = ({ onClose, onCreate }) => {
  const [taskName, setTaskName] = useState("");
  const [taskFee, setTaskFee] = useState(0);
  const [dueDate, setDueDate] = useState("");
  const [assignedEmployee, setAssignedEmployee] = useState("");
  const [subItems, setSubItems] = useState([]);
  const [miscName, setMiscName] = useState("");
  const [miscAmount, setMiscAmount] = useState(0);

  const handleAddMiscellaneous = () => {
    if (miscName && miscAmount > 0) {
      setSubItems([...subItems, { expenses: miscName, amount: parseFloat(miscAmount) }]);
      setMiscName("");
      setMiscAmount(0);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      expenses: taskName,
      dueDate,
      assignedEmployee,
      subItems: [
        { expenses: "Task Fee", amount: parseFloat(taskFee) }, // Task fee as the first sub-item
        ...subItems, // Include additional miscellaneous items
      ],
      datePaid: "",
      status: "",
    };

    onCreate(newTask);
    onClose();
  };

  return (
    <div className="task-create-form-overlay">
      <div className="task-create-form">
        <h2>Create New Task</h2>
        <form onSubmit={handleSubmit}>
          {/* Information Section */}
          <div className="form-section">
            <h3>Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Task Name:</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
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
                  {/* Add more employees as needed */}
                </select>
              </div>
              <div className="form-group">
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

          {/* Sub-items Section */}
          <div className="form-section">
            <h3>Sub-items</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Task Fee:</label>
                <input
                  type="number"
                  value={taskFee}
                  onChange={(e) => setTaskFee(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Miscellaneous Items */}
            <div className="form-row">
              <div className="form-group">
                <label>Miscellaneous Name:</label>
                <input
                  type="text"
                  placeholder="Miscellaneous Name"
                  value={miscName}
                  onChange={(e) => setMiscName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Miscellaneous Fee:</label>
                <input
                  type="number"
                  placeholder="Amount"
                  value={miscAmount}
                  onChange={(e) => setMiscAmount(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="add-misc-button"
                onClick={handleAddMiscellaneous}
              >
                +
              </button>
            </div>

            {/* Display Added Miscellaneous Items */}
            <ul className="misc-list">
              {subItems.map((item, index) => (
                <li key={index}>
                  {item.expenses} - {item.amount}
                </li>
              ))}
            </ul>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Create Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateForm;