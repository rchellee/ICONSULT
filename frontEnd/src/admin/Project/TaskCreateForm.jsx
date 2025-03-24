import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./TaskCreate.css";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import { MdAddCircleOutline } from "react-icons/md";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { IoIosCloseCircleOutline } from "react-icons/io";

const TaskCreateForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const taskToEdit = state?.taskToEdit;
  const projectId = state?.projectId;
  const [taskName, setTaskName] = useState("");
  const [taskFee, setTaskFee] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedEmployee, setAssignedEmployee] = useState("");
  const [subItems, setSubItems] = useState([]);
  const [miscName, setMiscName] = useState("");
  const [miscAmount, setMiscAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [projectDetails, setProjectDetails] = useState(null);

  useEffect(() => {
    if (projectId) {
      axios
        .get(`http://localhost:8081/projects/${projectId}`) // Fetch project details
        .then((response) => {
          setProjectDetails(response.data);
        })
        .catch((error) => {
          console.error("Error fetching project details:", error);
        });
    }
  }, [projectId]);
  // Fetch employees
  useEffect(() => {
    axios
      .get("http://localhost:8081/employees/id")
      .then((response) => {
        setEmployees(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      });
  }, []);
  // Pre-fill form if editing a task
  useEffect(() => {
    if (taskToEdit) {
      setTaskName(taskToEdit.expenses);
      setTaskFee(taskToEdit.subItems[0].amount.toString());
      setDueDate(taskToEdit.dueDate);
      setAssignedEmployee(taskToEdit.assignedEmployee);
      setSubItems(taskToEdit.subItems.slice(1));
      setTransactionId(taskToEdit.transactionId || "");
      setModeOfPayment(taskToEdit.modeOfPayment || "");
      setPaidDate(taskToEdit.paidDate || "");
    }
  }, [taskToEdit]);
  const handleAddMiscellaneous = () => {
    if (miscName) {
      setSubItems([
        ...subItems,
        { expenses: miscName, amount: parseFloat(miscAmount) || 0 },
      ]);
      setMiscName("");
      setMiscAmount("");
    }
  };
  const handleRemoveMiscellaneous = (index) => {
    const updatedSubItems = subItems.filter((_, i) => i !== index);
    setSubItems(updatedSubItems);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      (transactionId && (!modeOfPayment || !paidDate)) ||
      (modeOfPayment && (!transactionId || !paidDate)) ||
      (paidDate && (!transactionId || !modeOfPayment))
    ) {
      alert(
        "If any of Transaction ID, Mode of Payment, or Paid Date is set, all three must be provided."
      );
      return;
    }

    const formattedMiscellaneous = subItems.map((item) => ({
      expenses: item.expenses,
      amount: parseFloat(item.amount || 0),
    }));
    const newTask = {
      expenses: taskName,
      dueDate,
      assignedEmployee,
      subItems: [
        { expenses: "Task Fee", amount: parseFloat(taskFee) || 0 },
        ...subItems,
      ],
      transactionId,
      modeOfPayment,
      paidDate: paidDate || null,
    };
    if (taskToEdit) {
      // Update task if editing
      try {
        const response = await axios.put(
          `http://localhost:8081/tasks/${taskToEdit.id}`, // Use the task ID to update
          {
            taskName: newTask.expenses,
            taskFee: newTask.subItems[0].amount,
            dueDate: newTask.dueDate,
            employee: newTask.assignedEmployee,
            miscellaneous: formattedMiscellaneous,
            projectId: projectId,
            transactionId: newTask.transactionId,
            modeOfPayment: newTask.modeOfPayment,
            paidDate: newTask.paidDate,
          }
        );

        if (response.status === 200) {
          console.log("Task updated successfully:", response.data);
          navigate(-1); // Go back to the previous page
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      // Create new task if not editing
      try {
        const response = await axios.post("http://localhost:8081/tasks", {
          taskName: newTask.expenses,
          taskFee: newTask.subItems[0].amount,
          dueDate: newTask.dueDate,
          employee: newTask.assignedEmployee,
          miscellaneous: newTask.subItems.slice(1),
          projectId: projectId,
          transactionId: newTask.transactionId,
          modeOfPayment: newTask.modeOfPayment,
          paidDate: newTask.paidDate,
        });

        if (response.status === 201) {
          console.log("Task created successfully:", response.data);
          navigate(-1); // Go back to the previous page
        }
      } catch (error) {
        console.error("Error creating task:", error);
      }
    }
  };
  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="task-create-form">
        <div className="backkk">
          <button
            type="button"
            className="back-satask"
            onClick={() => navigate(-1)}
          >
            <IoArrowBackCircleOutline className="back-icontask" />
          </button>
          <h2>{taskToEdit ? "" : ""}</h2>
        </div>
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
                <label>Task Fee:</label>
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
                  placeholder="Enter"
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
              <div className="misc-grid">
                {subItems.map((item, index) => (
                  <div key={index} className="misc-item">
                    <div className="misc-details">
                      <span className="misc-name">{item.expenses}</span>
                      <span className="misc-price">₱{item.amount}</span>
                    </div>
                    <button
                      type="button"
                      className="remove-misc-button"
                      onClick={() => handleRemoveMiscellaneous(index)}
                    >
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                ))}
              </div>
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
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullName}
                    </option>
                  ))}
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
          {taskToEdit && (
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
                  />
                </div>
                <div className="form-modal-field">
                  <label>Mode of Payment (MOP): </label>
                  <select
                    value={modeOfPayment}
                    onChange={(e) => setModeOfPayment(e.target.value)}
                  >
                    <option value="">Select (MOP)</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Online Payment">Online Payment</option>
                  </select>
                </div>
                <div className="form-modal-field">
                  <label>Paid Date:</label>
                  <input
                    type="date"
                    value={paidDate}
                    onChange={(e) => setPaidDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit">{taskToEdit ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateForm;
