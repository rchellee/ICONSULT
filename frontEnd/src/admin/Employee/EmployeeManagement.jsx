import React, { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetails from "./EmployeeDetails";
import "./employee.css";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import { FaEye, FaHistory } from "react-icons/fa"; // Import icons

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toastVisible, setToastVisible] = useState(false); // State for toast visibility
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility toggle
  const [employeeHistory, setEmployeeHistory] = useState([]); // History data

  const exampleHistory = [
    { title: 'Project X Assigned', description: 'Assigned to Project X for development.' },
    { title: 'Task Y Completed', description: 'Completed the documentation for Task Y.' },
    { title: 'Team Meeting', description: 'Participated in a team meeting for Q1 planning.' },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8081/employees");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const viewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  const goBackToList = () => {
    setSelectedEmployee(null);
    setShowForm(false);
  };

  const toggleStatus = async (employeeId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await fetch(
        `http://localhost:8081/employees/${employeeId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const result = await response.json();
      if (response.ok) {
        setEmployees(
          employees.map((employee) =>
            employee.id === employeeId
              ? { ...employee, status: newStatus }
              : employee
          )
        );
      } else {
        console.error("Failed to update status:", result.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  };

  const generateRandomColor = () => {
    const colors = [
      "#FF5733",
      "#33FF57",
      "#3357FF",
      "#FF33A8",
      "#FFC300",
      "#A833FF",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleEmployeeAdded = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const openHistoryModal = (employeeId) => {
    setEmployeeHistory(exampleHistory); 
    setIsModalOpen(true); 
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Topbar />
      <div className="employee-home-page">
        <Sidebar />
        <div className="employee-content">
          {showForm ? (
            <EmployeeForm
              employees={employees}
              setEmployees={setEmployees}
              toggleForm={() => setShowForm(false)}
            />
          ) : selectedEmployee ? (
            <EmployeeDetails
              employee={selectedEmployee}
              goBack={goBackToList}
            />
          ) : (
            <>
              <button
                onClick={() => setShowForm(true)}
                className="add-employee-btn"
              >
                Add Employee
              </button>
              {employees.length === 0 ? (
                <p>No employees found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Status</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((employee, index) => (
                      <tr key={index}>
                        <td onClick={() => viewEmployeeDetails(employee)}>
                          <div
                            className="initials-circle"
                            style={{ backgroundColor: generateRandomColor() }}
                          >
                            {getInitials(employee.firstName, employee.lastName)}
                          </div>
                          {employee.firstName} {employee.lastName}
                        </td>
                        <td>
                          <label className="toggle-btn">
                            <input
                              type="checkbox"
                              checked={employee.status === "active"}
                              onChange={() =>
                                toggleStatus(employee.id, employee.status)
                              }
                            />
                            <span className="slider"></span>
                          </label>
                        </td>
                        <td>{employee.role || "role 1"}</td>
                        <td>
                          <div className="action-dropdown">
                            <button className="dropdown-btn">Actions</button>
                            <div className="dropdown-content">
                              <button className="dropdown-item"
                                onClick={() => viewEmployeeDetails(employee)}
                              >
                                <FaEye /> View
                              </button>
                              <button className="dropdown-item"
                                onClick={() => openHistoryModal(employee.id)}
                              >
                                <FaHistory /> History
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
          {toastVisible && (
            <div className="toast active">
              <div className="toast-content">
                <i className="fas fa-solid fa-check check"></i>
                <div className="message">
                  <div className="text text-2">
                    Success, your employee has been added.
                  </div>
                </div>
              </div>
              <i
                className="fa-solid fa-xmark close"
                onClick={() => setToastVisible(false)}
              ></i>
              <div className="progress active"></div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="history-modal">
  <div className="history-modal-content">
    <i className="history-modal-close" onClick={closeModal}>×</i>
    {/* <h2>History</h2> */}
    <ul className="history-list">
      <li className="history-list-item">
        <div className="history-item-title">Title of History Event 1</div>
        <div className="history-item-details">Details of event 1, describing what happened during this event...</div>
        <div className="history-item-date">January 14, 2025</div>
      </li>
      <li className="history-list-item">
        <div className="history-item-title">Title of History Event 2</div>
        <div className="history-item-details">Details of event 2, describing what happened during this event...</div>
        <div className="history-item-date">January 13, 2025</div>
      </li>
     
    </ul>
  </div>
</div>

      )}
    </div>
  );
};

export default EmployeeManagement;
