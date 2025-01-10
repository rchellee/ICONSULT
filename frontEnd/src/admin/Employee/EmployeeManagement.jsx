import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetails from "./EmployeeDetails";
import "./employee.css";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";

const EmployeeManagement = () => {
  const { searchTerm } = useContext(SearchContext);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // Fetch employees from the database when the component mounts
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

  useEffect(() => {
    setSearchQuery(searchTerm.toLowerCase());
  }, [searchTerm]);

  const viewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  const goBackToList = () => {
    setSelectedEmployee(null);
    setShowForm(false);
  };

  const updateEmployee = (updatedEmployee) => {
    setEmployees((prevEmployees) =>
      prevEmployees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
    setSelectedEmployee(updatedEmployee);
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

  // Function to generate initials
  const getInitials = (firstName, lastName) => {
    return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
  };

  // Function to generate random background color
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

  // Filter employees based on search term
  const filteredEmployees = employees.filter((employee) =>
    `${employee.firstName} ${employee.lastName} ${employee.middleName} ${employee.address} ${employee.mobile_number} ${employee.email_add} ${employee.status} ${employee.birthday} ${employee.age} ${employee.gender} ${employee.role}`
      .toLowerCase()
      .includes(searchQuery)
  );

  const handleEmployeeAdded = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // Auto-hide after 3 seconds
  };

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      setShowForm(false);
    }, 5000);
  };

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="employee-home-page">
        <div className="employee-content">
          {showForm ? (
            <EmployeeForm
              employees={employees}
              setEmployees={setEmployees}
              toggleForm={() => setShowForm(false)}
              onEmployeeAdded={handleEmployeeAdded}
            />
          ) : selectedEmployee ? (
            <EmployeeDetails
              employee={selectedEmployee}
              updateEmployee={updateEmployee}
              showToast={() => setToastVisible(true)}
              hideToast={() => setToastVisible(false)}
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
              {filteredEmployees.length === 0 ? (
                <p>No matching employees found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Position</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee, index) => (
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
                        <td>{employee.email_add}</td>
                        <td>{employee.role}</td>
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
          {/* Toast Notification */}
          {toastVisible && (
            <div className="toast active">
              <div className="toast-content">
                <i className="fas fa-solid fa-check check"></i>
                <div className="message">
                  <div className="text text-2">
                    Success, employee details has been saved.
                  </div>
                </div>
              </div>
              <div className="progress active"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
