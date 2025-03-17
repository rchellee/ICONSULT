import React, { useState } from "react";
import "./TaskCreate.css";
import { MdAddCircleOutline } from "react-icons/md";

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
        <h2>Create Task</h2>
        <form onSubmit={handleSubmit}>
          {/* Information Section */}
          <div className="form-section">
            <h3>Information</h3>
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

          {/* Sub-items Section */}
          <div className="form-section">
            <h3>Sub-items</h3>
            <div className="form-row">
              <div className="form-modal-field">
                <label>Task Fee:</label>
                <input
                  type="number"
                  placeholder="₱"
                  value={taskFee}
                  onChange={(e) => setTaskFee(e.target.value)}
                  required
                  inputMode="numeric"
                  style={{ width: "260px" }} 
                />
              </div>
            </div>

            {/* Miscellaneous Items */}
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
            <button type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateForm; 