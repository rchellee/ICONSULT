import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import EmployeeForm from "./EmployeeForm";
import EmployeeDetails from "./EmployeeDetails";
import "./employee.css";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import { format } from "date-fns";

const EmployeeManagement = () => {
  const { searchTerm } = useContext(SearchContext);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const isValidDate = (date) => !isNaN(new Date(date).getTime());

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

  const months = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from(new Set(employees.map(emp => new Date(emp.modified_date).getFullYear())));

  const filteredEmployees = employees.filter((employee) => {
    const employeeDate = new Date(employee.modified_date);
    const matchesMonth = selectedMonth ? months[employeeDate.getMonth()] === selectedMonth : true;
    const matchesYear = selectedYear ? employeeDate.getFullYear().toString() === selectedYear : true;
    const matchesStatus = selectedStatus ? employee.status === selectedStatus : true;
    return matchesMonth && matchesYear && matchesStatus && `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchQuery);
  });

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

  const handleEmployeeAdded = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000); // Auto-hide after 3 seconds
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
              goBack={goBackToList}
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
              <div className="employee-filters-section">
            <select onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
              <option value="">All Months</option>
              {months.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
            <select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
              <option value="">All Years</option>
              {years.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
            <select onChange={(e) => setSelectedStatus(e.target.value)} value={selectedStatus}>
              <option value="">Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
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
                      <th>Date Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((employee, index) => (
                      <tr key={index}>
                        <td onClick={() => viewEmployeeDetails(employee)}>
                          <div className="initials-circle">
                            {getInitials(employee.firstName, employee.lastName)}
                          </div>
                          {employee.firstName} {employee.lastName}
                        </td>
                        <td>{employee.email_add}</td>
                        <td>{employee.role}</td>
                        <td>{employee.status}</td>
                                                <td>
                          {isValidDate(employee.modified_date)
                            ? format(
                                new Date(employee.modified_date),
                                "MMMM dd, yyyy" 
                              )
                            : "N/A"}
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
                    Success, employee details have been saved.
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
