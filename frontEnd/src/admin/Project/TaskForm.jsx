import React, { useState } from "react";
import formStyles from "./FormStyle.module.css";

const TaskForm = ({ onCreate, onCancel }) => {
  const [taskName, setTaskName] = useState("");
  const [taskFee, setTaskFee] = useState(""); // State for task fee
  const [dueDate, setDueDate] = useState("");
  const [employee, setEmployee] = useState("");
  const [miscellaneousName, setMiscellaneousName] = useState(""); // State for miscellaneous name
  const [miscellaneousFee, setMiscellaneousFee] = useState(""); // State for miscellaneous fee

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

  const handleMiscellaneousFeeChange = (e) => {
    const value = e.target.value;
    // Validate fee as a number
    if (/[^0-9.]/.test(value)) {
      alert("Please enter a valid number for the Miscellaneous Fee.");
    } else {
      setMiscellaneousFee(value); // Set the value only if it's valid
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the created task back to the parent, including task fee and miscellaneous info
    onCreate({
      taskName,
      taskFee,
      dueDate,
      employee,
      miscellaneousName,
      miscellaneousFee,
    });
    // Reset form fields after submission
    setTaskName("");
    setTaskFee("");
    setDueDate("");
    setEmployee("");
    setMiscellaneousName("");
    setMiscellaneousFee("");
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

        {/* Miscellaneous Name and Fee Inputs */}
        <div className={formStyles.taskInputGroup}>
          <div className={formStyles.miscellaneous}>
            <label htmlFor="miscellaneousName">Miscellaneous Name</label>
            <input
              type="text"
              id="miscellaneousName"
              value={miscellaneousName}
              onChange={(e) => setMiscellaneousName(e.target.value)}
              placeholder="Enter Miscellaneous Name"
            />
          </div>

          <div className={formStyles.miscellaneousFee}>
            <label htmlFor="miscellaneousFee">Miscellaneous Fee</label>
            <input
              type="text"
              inputMode="numeric"
              id="miscellaneousFee"
              value={miscellaneousFee}
              onChange={handleMiscellaneousFeeChange} // Use custom change handler
              placeholder="Enter Fee"
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
