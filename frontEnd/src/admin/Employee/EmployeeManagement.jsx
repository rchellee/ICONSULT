import { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetails from "./EmployeeDetails";
import "./employee.css"; // Import the CSS file for the toggle button and initials
import Sidebar from "../sidebar";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const viewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  const goBackToList = () => {
    setSelectedEmployee(null);
  };

  const toggleStatus = async (employeeId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await fetch(`http://localhost:8081/employees/${employeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (response.ok) {
        setEmployees(
          employees.map((employee) =>
            employee.id === employeeId ? { ...employee, status: newStatus } : employee
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
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FFC300", "#A833FF"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="employee-home-page">
      <Sidebar />
      <div className="employee-content">
        {selectedEmployee ? (
          <EmployeeDetails
            employee={selectedEmployee}
            goBack={goBackToList}
          />
        ) : (
          <>
            {/* Button to toggle employee form */}
            <button onClick={toggleForm} className="add-employee-btn">
              {isFormVisible ? "Cancel" : "Add Employee"}
            </button>

            {isFormVisible && (
              <EmployeeForm
                employees={employees}
                setEmployees={setEmployees}
                toggleForm={toggleForm}
              />
            )}

            {!isFormVisible && (
              <>
                {employees.length === 0 ? (
                  <p>No employees added yet.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Role</th> {/* Added Role column */}
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, index) => (
                        <tr key={index}>
                          {/* Initials displayed in Name column */}
                          <td
                            onClick={() => viewEmployeeDetails(employee)}
                          >
                            <div
                              className="initials-circle"
                              style={{ backgroundColor: generateRandomColor() }}
                            >
                              {getInitials(employee.firstName, employee.lastName)}
                            </div>
                            {employee.firstName} {employee.lastName}
                          </td>
                          
                          {/* Status Toggle Column */}
                          <td>
                            <label className="toggle-btn">
                              <input
                                type="checkbox"
                                checked={employee.status === "active"}
                                onChange={() => toggleStatus(employee.id, employee.status)}
                              />
                              <span className="slider"></span>
                            </label>
                          </td>

                          {/* Role Column */}
                          <td>{employee.role || "role 1"}</td> {/* Default to "role 1" */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;
