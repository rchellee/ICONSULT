import { useNavigate } from "react-router-dom";
import { TbXboxXFilled } from "react-icons/tb"; // Import the remove icon
import { IoMdArrowDropdown } from "react-icons/io";
import React, { useState, useEffect } from "react";
import { MdAddCircle } from "react-icons/md";
import formStyles from "./FormStyle.module.css";

const TaskForm = ({ onCreate, onCancel, existingTask, projectId }) => {
  const navigate = useNavigate();

  const [taskName, setTaskName] = useState(
    existingTask ? existingTask.task_name : ""
  );
  const [taskFee, setTaskFee] = useState(
    existingTask ? existingTask.task_fee : ""
  );
  const [dueDate, setDueDate] = useState(
    existingTask ? existingTask.due_date : ""
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
    if (existingTask) {
      setTaskName(existingTask.task_name || "");
      setTaskFee(existingTask.task_fee || "");
      setDueDate(existingTask.due_date || "");
      setEmployee(existingTask.employee || "");
      setMiscellaneousList(
        Array.isArray(existingTask.miscellaneous) ? existingTask.miscellaneous : []
      );
    }
  }, [existingTask]);
  

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

    const taskData = {
      taskName,
      taskFee,
      dueDate,
      employee,
      miscellaneous: miscellaneousList,
      projectId,
    };

    try {
      const url = existingTask
        ? `http://localhost:8081/tasks/${existingTask.id}`
        : "http://localhost:8081/tasks";
      const method = existingTask ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(
          `${existingTask ? "Task updated" : "Task created"} successfully`,
          data
        );
        onCreate(taskData);
        resetForm();
        navigate("/admin");
      } else {
        console.error(`Failed to ${existingTask ? "update" : "create"} task`);
      }
    } catch (error) {
      console.error(
        `Error ${existingTask ? "updating" : "creating"} task:`,
        error
      );
    }
  };

  const resetForm = () => {
    setTaskName("");
    setTaskFee("");
    setDueDate("");
    setEmployee("");
    setMiscellaneousList([]);
  };

  return (
    <div className="project-form">
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
          </div>

          {/* Employee and Due Date Input */}
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
                  <option value="" disabled style={{ color: "#ccc" }}>
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
              {existingTask ? "Update Task" : "Create"}
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
