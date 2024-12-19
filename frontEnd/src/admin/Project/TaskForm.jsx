import React, { useState } from "react";
import formStyles from "./FormStyle.module.css";

const TaskForm = ({ onCreate, onCancel }) => {
  const [taskName, setTaskName] = useState("");
  const [taskFee, setTaskFee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [employee, setEmployee] = useState("");
  const [additionalFee, setAdditionalFee] = useState("");
  const [additionalFeeName, setAdditionalFeeName] = useState("");

  // Custom change handler for task fee input to validate number only
  const handleTaskFeeChange = (e) => {
    const value = e.target.value;
    // Regular expression to check if the value contains any alphabetic characters
    if (/[^0-9.]/.test(value)) {
      alert("Please enter a valid number for the Task Fee.");
    } else {
      setTaskFee(value); // Set the value only if it's valid
    }
  };

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
    <div className={formStyles.taskFormContainer}>
      <form className={formStyles.taskForm} onSubmit={handleSubmit}>
        <div className={formStyles.taskInputGroup}>
          <div className={formStyles.taskInput}>
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

          <div className={formStyles.taskFee}>
            <label htmlFor="taskFee">Task Fee</label>
            <input
              type="text"
              inputMode="numeric"
              id="taskFee"
              value={taskFee}
              onChange={handleTaskFeeChange} // Use custom change handler
              placeholder="Enter Amount"
              required
            />
          </div>

          <div className={formStyles.dueDate}>
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

        <div className={formStyles.taskInputGroup}>
          <div className={formStyles.employee}>
            <label htmlFor="employee">Assign Employee</label>
            <input
              type="text"
              id="employee"
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              placeholder="Choose Employee"
            />
          </div>
        </div>

        <div className={formStyles.buttonContainer}>
          <button type="submit" className={formStyles.createButton}>
            Create
          </button>
          <button type="button" className={formStyles.cancelButton} onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
