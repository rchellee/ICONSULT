import { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetails from "./EmployeeDetails";
import "./employee.css";  // Import the CSS file for the toggle button
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
  }, []); // Empty dependency array means this runs once on mount

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const viewEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
  };

  const goBackToList = () => {
    setSelectedEmployee(null);
  };

  const updateEmployee = async (updatedEmployee) => {
    try {
      // Send a PUT request to update employee information in the database
      const response = await fetch(`http://localhost:8081/employee/${updatedEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEmployee),
      });
  
      // Check if the response is successful
      if (response.ok) {
        const result = await response.json();
        // Update the employee in the local state only if the database update was successful
        setEmployees(
          employees.map((employee) =>
            employee.id === updatedEmployee.id ? updatedEmployee : employee
          )
        );
        setSelectedEmployee(updatedEmployee); // Update the selected employee
        console.log("Employee updated successfully:", result.message);
      } else {
        console.error("Failed to update employee:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
 

  const toggleStatus = async (employeeId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const response = await fetch(`http://localhost:8081/employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();
      if (response.ok) {
        // Update the status of the employee in the state
        setEmployees(
          employees.map((employee) =>
            employee.id === employeeId ? { ...employee, status: newStatus } : employee
          )
        );
      } else {
        console.error('Failed to update status:', result.message);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="admin-home-page">
      <Sidebar />
      <div className="content">
        <h2>Employees</h2>
        {selectedEmployee ? (
          <EmployeeDetails
            employee={selectedEmployee}
            goBack={goBackToList}
            updateEmployee={updateEmployee}
          />
        ) : (
          <>
            <button onClick={toggleForm}>
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
                <h3>Employees List</h3>
                {employees.length === 0 ? (
                  <p>No employees added yet.</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, index) => (
                        <tr key={index}>
                          <td
                            onClick={() => viewEmployeeDetails(employee)}
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            {employee.firstName}
                          </td>
                          {/* <td
                            onClick={() => viewEmployeeDetails(employee)}
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            {employee.status}
                          </td> */}
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
