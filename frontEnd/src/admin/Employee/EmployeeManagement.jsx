import { useState, useEffect } from "react";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetails from "./EmployeeDetails";
import Sidebar from "../sidebar";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees from the database when the component mounts
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8081/employee");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employee:", error);
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

  const updateEmployee = (updatedEmployee) => {
    setEmployees(
      employees.map((employee) =>
        employee.id === updatedEmployee.id ? updatedEmployee : employee
      )
    );
    setSelectedEmployee(updatedEmployee);
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
                          <td
                            onClick={() => viewEmployeeDetails(employee)}
                            style={{ cursor: "pointer", color: "blue" }}
                          >
                            {employee.status}
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
