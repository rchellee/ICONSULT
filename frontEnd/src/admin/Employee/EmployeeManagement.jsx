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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [filter, setFilter] = useState({ month: "", year: "" });
  const isValidDate = (date) => !isNaN(new Date(date).getTime());

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

  const sortEmployees = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedEmployees = [...employees].sort((a, b) => {
      if (key === "name") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (nameA < nameB) return direction === "asc" ? -1 : 1;
        if (nameA > nameB) return direction === "asc" ? 1 : -1;
        return 0;
      }
      if (key === "status") {
        const statusA = a[key];
        const statusB = b[key];
        if (statusA === statusB) return 0;
        if (statusA === "active" && statusB !== "active")
          return direction === "asc" ? -1 : 1;
        if (statusA !== "active" && statusB === "active")
          return direction === "asc" ? 1 : -1;
        return 0;
      }
      if (key === "modified_date") {
        return direction === "asc"
          ? new Date(a[key]) - new Date(b[key])
          : new Date(b[key]) - new Date(a[key]);
      }
      return 0;
    });

    setEmployees(sortedEmployees);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return "⇅";
  };

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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const filterEmployees = () => {
    return employees.filter((employee) => {
      const employeeDate = new Date(employee.dateAdded);
      const filterMonth = filter.month ? parseInt(filter.month) : null;
      const filterYear = filter.year ? parseInt(filter.year) : null;

      return (
        (!filterMonth || employeeDate.getMonth() + 1 === filterMonth) &&
        (!filterYear || employeeDate.getFullYear() === filterYear)
      );
    });
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
              <div className="employee-filter-section">
                <button
                  onClick={() => setShowForm(true)}
                  className="add-employee-btn"
                >
                  Add Employee
                </button>
              </div>
              {filteredEmployees.length === 0 ? (
                <p>No matching employees found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th onClick={() => sortEmployees("name")}>
                        Name {getSortIcon("name")}
                      </th>
                      <th onClick={() => sortEmployees("email_add")}>
                        Email {getSortIcon("email_add")}
                      </th>
                      <th>Position</th>
                      <th onClick={() => sortEmployees("status")}>
                        Status {getSortIcon("status")}
                      </th>
                      <th onClick={() => sortEmployees("dateAdded")}>
                        Date Added {getSortIcon("dateAdded")}
                      </th>
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
