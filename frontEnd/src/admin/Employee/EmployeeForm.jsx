import { useState, useEffect } from "react";
import "./employee.css";
import Sidebar from "../sidebar";

const EmployeeForm = ({ employees, setEmployees, toggleForm, editingEmployee }) => {
  const [formData, setFormData] = useState({
    lastName: "",
    middleInitial: "",
    firstName: "",
    address: "",
    mobile_number: "",
    email_add: "",
    status: "active",
    birthday: "",
    role: "role1",
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
    try {
      const method = editingEmployee ? "PUT" : "POST";
      const url = editingEmployee
        ? `http://localhost:8081/employee/${editingEmployee.id}`
        : "http://localhost:8081/employee";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        if (editingEmployee) {
          setEmployees(employees.map(emp => (emp.id === editingEmployee.id ? result : emp)));
        } else {
          setEmployees([...employees, result]);
        }
        toggleForm();
      } else {
        console.error("Error saving employee:", await response.text());
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="employee-home-page">
      <Sidebar />
      <div className="employee-content">
        <form onSubmit={handleSubmit} className="employee-form-grid">
          {/* Name Section */}
          <div className="employee-row">
            <div className="input-group input-group-icon">
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
              <div className="input-icon"><i className="fa fa-user"></i></div>
            </div>
            <div className="input-group input-group-icon">
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
              <div className="input-icon"><i className="fa fa-user"></i></div>
            </div>
            <div className="input-group input-group-icon">
              <input type="text" name="middleInitial" placeholder="Middle Initial" value={formData.middleInitial} onChange={handleChange} />
              <div className="input-icon"><i className="fa fa-user"></i></div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="row">
            <div className="input-group input-group-icon">
              <input type="email" name="email_add" placeholder="Email Address" value={formData.email_add} onChange={handleChange} required />
              <div className="input-icon"><i className="fa fa-envelope"></i></div>
            </div>
            <div className="input-group input-group-icon">
              <input type="tel" name="mobile_number" placeholder="Mobile Number" value={formData.mobile_number} onChange={handleChange} />
              <div className="input-icon"><i className="fa fa-phone"></i></div>
            </div>
            <div className="input-group input-group-icon">
              <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
              <div className="input-icon"><i className="fa fa-map-marker-alt"></i></div>
            </div>
          </div>
          {/* Date of Birth and Role Section */}
          <div className="row">
            <h4>Birthdate</h4>
            <div className="input-group input-group-icon">
              <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} />
              <div className="input-icon"><i className="fa fa-calendar"></i></div>
            </div>
            <button type="submit">{editingEmployee ? "Update Employee" : "Add Employee"}</button>
          </div>

          {/* Status Section */}
          <div className="row">
            <h4>Status</h4>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <h4>Role</h4>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="role1">Role 1</option>
                <option value="role2">Role 2</option>
              </select>
          </div>
                  </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
