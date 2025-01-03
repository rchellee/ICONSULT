import { TbXboxXFilled } from "react-icons/tb"; // Import the remove icon
import { IoMdArrowDropdown } from "react-icons/io";
import React, { useState, useEffect } from "react";
import { MdAddCircle } from "react-icons/md";
import formStyles from "./FormStyle.module.css";

const TaskForm = ({ onCreate, onCancel, existingTask, projectId }) => {
  const [taskName, setTaskName] = useState(
    existingTask ? existingTask.taskName : ""
  );
  const [taskFee, setTaskFee] = useState(
    existingTask ? existingTask.taskFee : ""
  );
  const [dueDate, setDueDate] = useState(
    existingTask ? existingTask.dueDate : ""
  );
  const [employee, setEmployee] = useState(
    existingTask ? existingTask.employee : ""
  );
  const [employeeList, setEmployeeList] = useState([]);
  const [miscellaneousName, setMiscellaneousName] = useState("");
  const [miscellaneousFee, setMiscellaneousFee] = useState("");
  const [miscellaneousList, setMiscellaneousList] = useState(
    Array.isArray(existingTask?.miscellaneous) ? existingTask.miscellaneous : []
  );
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    console.log("Received projectId in TaskForm:", projectId);
  }, [projectId]);

  useEffect(() => {
    const taskFeeValue = parseFloat(taskFee) || 0;
    const miscellaneousTotal = miscellaneousList.reduce((sum, item) => {
      return sum + (parseFloat(item.fee) || 0);
    }, 0);
    setTotalAmount(taskFeeValue + miscellaneousTotal);
  }, [taskFee, miscellaneousList]);

  useEffect(() => {
    // Fetch employees when the component mounts
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8081/employees");
        const data = await response.json();
        setEmployeeList(data);
      } catch (error) {
        console.error("Error fetching employee list:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleTaskFeeChange = (e) => {
    const value = e.target.value;
    if (/[^0-9.]/.test(value)) {
      alert("Please enter a valid number for the Task Fee.");
    } else {
      setTaskFee(value);
    }
  };

  const handleMiscellaneousFeeChange = (e) => {
    const value = e.target.value;
    if (/[^0-9.]/.test(value)) {
      alert("Please enter a valid number for the Miscellaneous Fee.");
    } else {
      setMiscellaneousFee(value);
    }
  };

  const handleAddMiscellaneous = () => {
    if (miscellaneousName && miscellaneousFee) {
      setMiscellaneousList([
        ...miscellaneousList,
        { name: miscellaneousName, fee: miscellaneousFee },
      ]);
      setMiscellaneousName("");
      setMiscellaneousFee("");
    } else {
      alert("Please provide both a name and a fee for the miscellaneous item.");
    }
  };

  const handleRemoveMiscellaneous = (index) => {
    const updatedList = miscellaneousList.filter((_, i) => i !== index);
    setMiscellaneousList(updatedList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending projectId:", projectId);

    // Create a task object from the form values
    const newTask = {
      taskName,
      taskFee,
      dueDate,
      employee,
      miscellaneous: miscellaneousList,
      projectId,
    };

    try {
      // Send a POST request to create the task
      const response = await fetch("http://localhost:8081/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Task created successfully", data);
        // Optionally, call onCreate to update the UI or perform other actions
        onCreate(newTask);

        // Reset the form fields
        setTaskName("");
        setTaskFee("");
        setDueDate("");
        setEmployee("");
        setMiscellaneousList([]);
      } else {
        console.error("Failed to create task");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <div className="project-form">
      <div className={formStyles.taskFormContainer}>
        <form className={formStyles.taskForm} onSubmit={handleSubmit}>
          {/* Task Form Inputs */}
          <div className={formStyles.taskInputGroup}>
            <div className={formStyles.taskInput}>
              <label htmlFor="taskName">Task Name</label>
              <input
                type="text"
                id="taskName"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Untitled"
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
                placeholder="₱"
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

          {/* Employee Dropdown */}
          <div className={formStyles.taskInputGroup}>
            <div className={formStyles.employee}>
              <label htmlFor="employee">Assign Employee</label>
              <div className={formStyles.employeeInputWrapper}>
                <select
                  id="employee"
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Choose an Employee
                  </option>
                  {employeeList.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
                <IoMdArrowDropdown className={formStyles.dropdownIcon} />
              </div>
            </div>
          </div>

          {/* Miscellaneous Items */}
          <div className={formStyles.taskInputGroup}>
            <div className={formStyles.miscellaneous}>
              <label htmlFor="miscellaneousName">Miscellaneous Name</label>
              <input
                type="text"
                id="miscellaneousName"
                value={miscellaneousName}
                onChange={(e) => setMiscellaneousName(e.target.value)}
                placeholder="Untitled"
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
                placeholder="₱"
              />
            </div>
            <button
              type="button"
              onClick={handleAddMiscellaneous}
              className={formStyles.addMiscellaneousButton}
            >
              <MdAddCircle size={24} />
            </button>
          </div>

          {/* Display Miscellaneous Items List with Remove Icon */}
          {miscellaneousList.length > 0 && (
            <div className={formStyles.scrollableMiscellaneousList}>
              <h4>Miscellaneous Items</h4>
              <ul>
                {miscellaneousList.map((item, index) => (
                  <li key={index} className={formStyles.miscellaneousItem}>
                    {item.name}: ₱{item.fee}
                    <TbXboxXFilled
                      size={20}
                      className={formStyles.removeIcon}
                      onClick={() => handleRemoveMiscellaneous(index)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={formStyles.totalAmount}>
            <label>Total Amount:</label>
            <span>₱{totalAmount.toFixed(2)}</span>
          </div>

          {/* Submit & Cancel Buttons */}
          <div className={formStyles.buttonContainer}>
            <button type="submit" className={formStyles.createButton}>
              {existingTask ? "Update Task" : "Create Task"}
            </button>
            <button
              type="button"
              className={formStyles.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
