/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
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
      <h3>{isEditing ? 'Edit Employee Details' : 'Employee Details'}</h3>

      <div className="employee-info">
        {isEditing ? (
          <form onSubmit={handleSave}>
            {/* Editable fields */}
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
              <strong>Status:</strong>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
          </>
        )}
      </div>

      {/* Combined History Sections with 5 columns */}
      <div className="employee-history">
        <h4>Appointment History</h4>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Details</th>
              <th>Status</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {employee.appointments && employee.appointments.length > 0 ? (
              employee.appointments.map((appointment, index) => (
                <tr key={index}>
                  <td>{appointment.id}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.details}</td>
                  <td>{appointment.status}</td>
                  <td>{appointment.type}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No appointments found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <h4>Project History</h4>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Project Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employee.projects && employee.projects.length > 0 ? (
              employee.projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.id}</td>
                  <td>{project.name}</td>
                  <td>{project.startDate}</td>
                  <td>{project.endDate}</td>
                  <td>{project.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No projects found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <h4>Payment History</h4>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employee.payments && employee.payments.length > 0 ? (
              employee.payments.map((payment, index) => (
                <tr key={index}>
                  <td>{payment.id}</td>
                  <td>{payment.date}</td>
                  <td>${payment.amount}</td>
                  <td>{payment.method}</td>
                  <td>{payment.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No payments found.</td>
              </tr>
            )}
          </tbody>
        </table>

        <h4>Documents</h4>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Document Name</th>
              <th>Uploaded Date</th>
              <th>Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employee.documents && employee.documents.length > 0 ? (
              employee.documents.map((document, index) => (
                <tr key={index}>
                  <td>{document.id}</td>
                  <td>{document.name}</td>
                  <td>{document.date}</td>
                  <td>{document.type}</td>
                  <td><a href={document.url} target="_blank" rel="noopener noreferrer">View</a></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No documents found.</td>
              </tr>
            )}
          </tbody>
        </table>
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
