import { useState, useEffect } from "react";
import "./employee.css";
import Sidebar from "../sidebar";

const EmployeeForm = ({
  employees,
  setEmployees,
  toggleForm,
  editingEmployee,
}) => {
  const [formData, setFormData] = useState({
    lastName: "",
    middleName: "",
    firstName: "",
    address: "",
    mobile_number: "",
    email_add: "",
    status: "active",
    birthday: "",
    age: "",
    gender: "",
    role: "",
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData(editingEmployee); // Pre-fill form for editing
    }
  }, [editingEmployee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newAge = formData.age;

    if (name === "birthday" && value) {
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      // Adjust age if the current date is before the birthdate this year
      newAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
    }

    setFormData({
      ...formData,
      [name]: value,
      age: newAge,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        firstName: formData.firstName.toUpperCase(),
        middleName: formData.middleName.toUpperCase(),
        lastName: formData.lastName.toUpperCase(),
        address: formData.address.toUpperCase(),
        role: formData.role.toUpperCase(),
      };

      const method = editingEmployee ? "PUT" : "POST";
      const url = editingEmployee
        ? `http://localhost:8081/employee/${editingEmployee.id}`
        : "http://localhost:8081/employee";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        const result = await response.json();
        if (editingEmployee) {
          setEmployees(
            employees.map((emp) =>
              emp.id === editingEmployee.id ? result : emp
            )
          );
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
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName.toUpperCase()}
                onChange={handleChange}
                required
              />
              <div className="input-icon">
                <i className="fa fa-user"></i>
              </div>
            </div>
            <div className="input-group input-group-icon">
              <input
                type="text"
                name="middleName"
                placeholder="Middle Name"
                value={formData.middleName.toUpperCase()}
                onChange={handleChange}
              />
              <div className="input-icon">
                <i className="fa fa-user"></i>
              </div>
            </div>
            <div className="input-group input-group-icon">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName.toUpperCase()}
                onChange={handleChange}
                required
              />
              <div className="input-icon">
                <i className="fa fa-user"></i>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="row">
            <div className="input-group input-group-icon">
              <input
                type="email"
                name="email_add"
                placeholder="Email Address"
                value={formData.email_add}
                onChange={handleChange}
                required
              />
              <div className="input-icon">
                <i className="fa fa-envelope"></i>
              </div>
            </div>
            <div className="input-group input-group-icon">
              <input
                type="tel"
                name="mobile_number"
                placeholder="Mobile Number"
                value={formData.mobile_number}
                onChange={handleChange}
              />
              <div className="input-icon">
                <i className="fa fa-phone"></i>
              </div>
            </div>
            <div className="input-group input-group-icon">
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address.toUpperCase()}
                onChange={handleChange}
              />
              <div className="input-icon">
                <i className="fa fa-map-marker-alt"></i>
              </div>
            </div>
          </div>
          {/* Date of Birth and Role Section */}
          <div className="row">
            <h4>Birthdate</h4>
            <div className="input-group input-group-icon">
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
              />
              <div className="input-icon">
                <i className="fa fa-calendar"></i>
              </div>
            </div>
            <h4>Age</h4>
            <div className="input-group input-group-icon">
              <input
                type="text"
                name="age"
                placeholder="Age"
                value={formData.age}
                readOnly
              />
              <div className="input-icon">
                <i className="fa fa-calendar"></i>
              </div>
            </div>

            <button type="submit">
              {editingEmployee ? "Update Employee" : "Add Employee"}
            </button>
          </div>

          {/* Status Section */}
          <div className="row">
            <h4>Gender</h4>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <h4>Role</h4>
            <div className="input-group input-group-icon">
              <input
                type="text"
                name="role"
                placeholder="Position"
                value={formData.role.toUpperCase()}
                onChange={handleChange}
              />
              <div className="input-icon">
                <i className="fa fa-user"></i>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
