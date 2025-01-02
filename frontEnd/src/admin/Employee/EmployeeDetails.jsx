import React, { useState } from 'react';

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
  const handleSave = (e) => {
    e.preventDefault();
    updateEmployee(formData); // Update employee details in the parent component
    toggleEdit(); // Exit edit mode
  };

  return (
    <div className="employee-details">
      <div className="employee-info">
        {isEditing ? (
          <form onSubmit={handleSave}>
            <label>
              <strong>First Name:</strong>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={formData.email_add}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Address:</strong>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Contact Number:</strong>
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Birthday:</strong>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Role:</strong>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
              />
            </label>

            <button type="submit" className="btn-save">Update</button>
          </form>
        ) : (
          <>
            {/* Display employee details */}
            <p><strong>ID:</strong> {employee.id}</p>
            <p><strong>Last Name:</strong> {employee.lastName}</p>
            <p><strong>First Name:</strong> {employee.firstName}</p>
            <p><strong>Email:</strong> {employee.email_add}</p>
            <p><strong>Address:</strong> {employee.address}</p>
            <p><strong>Contact Number:</strong> {employee.mobile_number}</p>
            <p><strong>Status:</strong> {employee.status}</p>
            <p><strong>Birthday:</strong> {employee.birthday}</p>
            <p><strong>Role:</strong> {employee.role}</p> {/* Added role */}
          </>
        )}
      </div>

      {/* Display Edit button if not editing */}
      {!isEditing && (
        <button className="btn-edit" onClick={toggleEdit}>Edit</button>
      )}

      {/* Back button to return to the list */}
      <button className="btn-back" onClick={goBack}>
        Back
      </button>
    </div>
  );
};

export default EmployeeDetails;
