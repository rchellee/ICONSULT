/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const ClientDetails = ({ client, goBack, updateClient }) => {
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes
  const [formData, setFormData] = useState({ ...client }); // Initialize form data with client details

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
    updateClient(formData); // Update client details in the parent component
    toggleEdit(); // Exit edit mode
  };

  return (
    <div className="client-details">
      <h3>{isEditing ? 'Edit Client Details' : 'Client Details'}</h3>

      <div className="client-info">
        {isEditing ? (
          <form onSubmit={handleSave}>
            {/* Editable fields */}
            <label>
              <strong>ID:</strong>
              <input type="text" name="id" value={formData.id} disabled />
            </label>
            <label>
              <strong>Last Name:</strong>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </label>
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
                name="email" // Ensure this matches with the client's email field in the backend
                value={formData.email_add} // Use email_add since that was used in ClientForm
                onChange={handleChange}
              />
            </label>
            <label>
              <strong>Username:</strong>
              <input
                type="text"
                name="username"
                value={formData.username}
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
                name="mobile_number" // Changed to mobile_number
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
            {/* Display client details */}
            <p><strong>ID:</strong> {client.id}</p>
            <p><strong>Last Name:</strong> {client.lastName}</p>
            <p><strong>First Name:</strong> {client.firstName}</p>
            <p><strong>Email:</strong> {client.email_add}</p> {/* Updated to match email field */}
            <p><strong>Username:</strong> {client.username}</p>
            <p><strong>Address:</strong> {client.address}</p>
            <p><strong>Contact Number:</strong> {client.mobile_number}</p> {/* Updated to match mobile_number */}
            <p><strong>Status:</strong> {client.status}</p>
            <p><strong>Birthday:</strong> {client.birthday}</p>
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

export default ClientDetails;
