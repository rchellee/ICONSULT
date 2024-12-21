import React, { useState, useEffect } from "react";
import formStyles from "./FormStyle.module.css";

const TaskForm = ({ onCreate, onCancel, existingTask }) => {
  const [taskName, setTaskName] = useState(existingTask ? existingTask.taskName : ""); // Initialize with existing task values
  const [taskFee, setTaskFee] = useState(existingTask ? existingTask.taskFee : ""); // Initialize with existing task fee
  const [dueDate, setDueDate] = useState(existingTask ? existingTask.dueDate : ""); // Initialize with existing due date
  const [employee, setEmployee] = useState(existingTask ? existingTask.employee : ""); // Initialize with existing employee
  const [miscellaneousName, setMiscellaneousName] = useState(""); // State for miscellaneous name
  const [miscellaneousFee, setMiscellaneousFee] = useState(""); // State for miscellaneous fee
  const [miscellaneousList, setMiscellaneousList] = useState(existingTask ? existingTask.miscellaneous : []); // Maintain list of miscellaneous items

  // Handle changes to Task Fee input (numeric validation)
  const handleTaskFeeChange = (e) => {
    const value = e.target.value;
    if (/[^0-9.]/.test(value)) {
      alert("Please enter a valid number for the Task Fee.");
    } else {
      setTaskFee(value);
    }
  };

  // Handle changes to Miscellaneous Fee input (numeric validation)
  const handleMiscellaneousFeeChange = (e) => {
    const value = e.target.value;
    if (/[^0-9.]/.test(value)) {
      alert("Please enter a valid number for the Miscellaneous Fee.");
    } else {
      setMiscellaneousFee(value);
    }
  };

  // Handle adding a new miscellaneous item to the list
  const handleAddMiscellaneous = () => {
    if (miscellaneousName && miscellaneousFee) {
      setMiscellaneousList([
        ...miscellaneousList,
        { name: miscellaneousName, fee: miscellaneousFee },
      ]);
      setMiscellaneousName(""); // Clear name input after adding
      setMiscellaneousFee(""); // Clear fee input after adding
    } else {
      alert("Please provide both a name and a fee for the miscellaneous item.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      taskName,
      taskFee,
      dueDate,
      employee,
      miscellaneous: miscellaneousList, // Send the complete list of miscellaneous items
    };
    onCreate(newTask); // Pass new task data to the parent component
    // Reset form fields after submission
    setTaskName("");
    setTaskFee("");
    setDueDate("");
    setEmployee("");
    setMiscellaneousList([]); // Clear miscellaneous list after submission
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
              onChange={handleTaskFeeChange}
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
              onChange={handleMiscellaneousFeeChange}
              placeholder="Enter Fee"
            />
          </div>

          <button type="button" onClick={handleAddMiscellaneous} className={formStyles.addMiscellaneousButton}>
            Add Miscellaneous
          </button>
        </div>

        {/* Display the list of added miscellaneous items */}
        {miscellaneousList.length > 0 && (
          <div className={formStyles.miscellaneousList}>
            <h4>Added Miscellaneous Items</h4>
            <ul>
              {miscellaneousList.map((item, index) => (
                <li key={index}>{item.name}: {item.fee}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={formStyles.buttonContainer}>
          <button type="submit" className={formStyles.createButton}>
            {existingTask ? "Update Task" : "Create Task"}
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
