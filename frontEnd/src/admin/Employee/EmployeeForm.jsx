import { useState, useEffect } from "react";
import "./employeeForm.css"; // Assuming you have CSS for styling
import Sidebar from "../sidebar";

const EmployeeForm = ({ employees, setEmployees, toggleForm, editingEmployee }) => {
  const [formData, setFormData] = useState({
    lastName: "",
    middleName: "",
    firstName: "",
    address: "",
    mobile_number: "",
    email_add: "",
    status: "active",
    birthday: "",
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData(editingEmployee); // Pre-fill form for editing
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newEmployeeData = {
      ...formData,
      email_add: formData.email_add, // Consistent mapping
    };

    try {
      if (editingEmployee) {
        // Update existing employee
        const response = await fetch(`http://localhost:8081/employee/${editingEmployee.id}`, {
          method: "PUT", // Use PUT or PATCH depending on your backend setup
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEmployeeData),
        });

        const result = await response.json();
        if (response.ok) {
          const updatedEmployees = employees.map((emp) =>
            emp.id === editingEmployee.id ? result : emp
          );
          setEmployees(updatedEmployees);
        } else {
          console.error("Error updating employee:", result);
        }
      } else {
        // Add new employee
        const response = await fetch("http://localhost:8081/employee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newEmployeeData),
        });

        const result = await response.json();
        if (response.ok) {
          setEmployees([...employees, result]);
        } else {
          console.error("Error saving employee:", result);
        }
      }

      toggleForm(); // Close the form after submission

      // Reset form state
      setFormData({
        lastName: "",
        middleName: "",
        firstName: "",
        address: "",
        mobile_number: "",
        email_add: "",
        status: "active",
        birthday: "",
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="admin-home-page">
      <Sidebar />
      <div className="content">
        <form onSubmit={handleSubmit}>
          <h3>{editingEmployee ? "Edit Employee" : "Add a New Employee"}</h3>

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="middleName"
            placeholder="Middle Initial"
            value={formData.middleName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="birthday"
            placeholder="Birthday"
            value={formData.birthday}
            onChange={handleChange}
          />

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            type="tel"
            name="mobile_number"
            placeholder="Mobile Number"
            value={formData.mobile_number}
            onChange={handleChange}
          />

          <input
            type="email"
            name="email_add"
            placeholder="Email Address"
            value={formData.email_add}
            onChange={handleChange}
          />

          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit">
            {editingEmployee ? "Update Employee" : "Add Employee"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
