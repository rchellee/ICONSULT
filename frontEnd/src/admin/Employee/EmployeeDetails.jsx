import React, { useState } from 'react';
import "./employee.css";
import '@fortawesome/fontawesome-free/css/all.min.css';


const EmployeeDetails = ({ employee, goBack, updateEmployee }) => {
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes
  const [formData, setFormData] = useState({ ...employee }); // Initialize form data with employee details

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // Handle save action
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8081/employee/${employee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        updateEmployee(updatedEmployee); // Update employee data in parent component
        setIsEditing(false); // Exit edit mode
      } else {
        console.error("Error updating employee:", await response.text());
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="employee-details">
      <div className="employee-info">
        {isEditing ? (
          <form onSubmit={handleSave} className="employee-form-grid">
            {/* Name Section */}
            <div className="row">
              <div className="input-group input-group-icon">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
                <div className="input-icon"><i className="fa fa-user"></i></div>
              </div>
              <div className="input-group input-group-icon">
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
                <div className="input-icon"><i className="fa fa-user"></i></div>
              </div>
              <div className="input-group input-group-icon">
                <input
                  type="text"
                  name="middleInitial"
                  value={formData.middleInitial}
                  onChange={handleChange}
                  placeholder="Middle Initial"
                />
                <div className="input-icon"><i className="fa fa-user"></i></div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="row">
              <div className="input-group input-group-icon">
                <input
                  type="email"
                  name="email_add"
                  value={formData.email_add}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                />
                <div className="input-icon"><i className="fa fa-envelope"></i></div>
              </div>
              <div className="input-group input-group-icon">
                <input
                  type="tel"
                  name="mobile_number"
                  value={formData.mobile_number}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                />
                <div className="input-icon"><i className="fa fa-phone"></i></div>
              </div>
              <div className="input-group input-group-icon">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                />
                <div className="input-icon"><i className="fa fa-map-marker-alt"></i></div>
              </div>
            </div>

            {/* Birthday and Role Section */}
            <div className="row">
              <h4>Birthdate</h4>
              <div className="input-group input-group-icon">
                <input
                  type="date"
                  name="birthday"
                  value={formData.birthday}
                  onChange={handleChange}
                />
                <div className="input-icon"><i className="fa fa-calendar"></i></div>
              </div>
              <div className="button-group">
                <button type="submit" className="btn-save">Save Changes</button>
                <button type="button" className="btn-cancel" onClick={toggleEdit}>Cancel</button>
              </div>
            </div>

            {/* Status Section and Role*/}
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
        ) : (
// Display Section (Read-only mode with icons and centered form)
<div className="employee-readonly">
    <p><i className="fas fa-user"></i> <strong>Last Name:</strong> {employee.lastName}</p>
    <p><i className="fas fa-user"></i> <strong>First Name:</strong> {employee.firstName}</p>
    <p><i className="fas fa-user"></i> <strong>Middle Name:</strong> {employee.middleInitial}</p>
    <p><i className="fas fa-envelope"></i> <strong>Email:</strong> {employee.email_add}</p>
    <p><i className="fas fa-map-marker-alt"></i> <strong>Address:</strong> {employee.address}</p>
    <p><i className="fas fa-phone"></i> <strong>Contact Number:</strong> {employee.mobile_number}</p>
    <p><i className="fas fa-birthday-cake"></i> <strong>Birthday:</strong> {employee.birthday}</p>
    <p><i className="fas fa-user-tag"></i> <strong>Role:</strong> {employee.role}</p>
    <p><i className="fas fa-user-check"></i> <strong>Status:</strong> {employee.status}</p>
     <div className="button-group">
        {!isEditing && <button className="btn-edit" onClick={toggleEdit}>Edit</button>}
        <button className="btn-back" onClick={goBack}>Back</button>
      </div>
</div>

        )}
      </div>


    </div>
  );
};

export default EmployeeDetails;
