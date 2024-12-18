import React, { useState } from "react";
import "./FormStyle.css";

const TaskForm = ({ onCreate, onCancel }) => {
  const [taskName, setTaskName] = useState("");
  const [taskFee, setTaskFee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [employee, setEmployee] = useState("");
  const [additionalFee, setAdditionalFee] = useState("");
  const [additionalFeeName, setAdditionalFeeName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the created task back to the parent
    onCreate({
      taskName,
      taskFee,
      dueDate,
      employee,
      additionalFeeName,
      additionalFee,
    });
    // Reset form fields after submission
    setTaskName("");
    setTaskFee("");
    setDueDate("");
    setEmployee("");
    setAdditionalFee("");
    setAdditionalFeeName("");
  };

  return (
    <div className="task-form-container">
      <form className="task-form" onSubmit={handleSubmit}>
        <div className="task-input-group">
          <div className="task-input">
            <label htmlFor="taskName">Task Name</label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter name"
              required
            />
          </div>

          <div className="taskFee">
            <label htmlFor="taskFee">Task Fee</label>
            <input
              type="text"
              inputMode="numeric"
              id="taskFee"
              value={taskFee}
              onChange={(e) => setTaskFee(e.target.value)}
              placeholder="Enter Amount"
              required
            />
          </div>

          <div className="dueDate">
            <label htmlFor="dueDate">Due Date</label>
            <input
              type="date"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="task-input-group">
          <div className="employee">
            <label htmlFor="employee">Assign Employee</label>
            <input
              type="text"
              id="employee"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              placeholder="Choose Employee"
            />
          </div>

          <div className="additionalFee">
            <label htmlFor="additionalFee">Additional Fee</label>
            <div className="additional-fee-container">
              <input
                type="text"
                value={additionalFeeName}
                onChange={(e) => setAdditionalFeeName(e.target.value)}
                placeholder="Fee Name"
              />
              <input
                type="text"
                inputMode="numeric"
                value={additionalFee}
                onChange={(e) => setAdditionalFee(e.target.value)}
                placeholder="Amount"
              />
            </div>
          </div>
        </div>

        <div className="button-container">
          <button type="submit" className="create-button">
            Create
          </button>
          <button type="button" className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
