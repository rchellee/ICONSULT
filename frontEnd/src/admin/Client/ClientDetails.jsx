/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

const ClientDetails = ({ client, goBack, updateClient }) => {
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({ ...client }); // Store client details in state

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

  // Handle form submission (save changes)
  const handleSave = (e) => {
    e.preventDefault();
    updateClient(formData); // Update the client details in the parent component
    toggleEdit(); // Exit edit mode
  };

  return (
    <div className="client-details">
      <h3>{isEditing ? 'Update Client Details' : 'Client Details'}</h3>

      {/* Display in read-only mode or edit mode based on isEditing state */}
      <div className="client-info">
        {isEditing ? (
          <form onSubmit={handleSave}>
            {/* Input fields for editing client details */}
            <label>
              <strong>ID:</strong>
              <input type="text" name="id" value={formData.id} disabled />
            </label>
            <label>
              <strong>Last Name:</strong>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </label>
            <label>
              <strong>First Name:</strong>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </label>
            <label>
              <strong>Email:</strong>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </label>
            <label>
              <strong>Username:</strong>
              <input type="text" name="username" value={formData.username} onChange={handleChange} />
            </label>
            <label>
              <strong>Address:</strong>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </label>
            <label>
              <strong>Contact Number:</strong>
              <input type="tel" name="contactNum" value={formData.contactNum} onChange={handleChange} />
            </label>
            <label>
              <strong>Status:</strong>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>

            <button type="submit" className="btn-save">Udpate</button>
            {/* <button type="button" className="btn-cancel" onClick={toggleEdit}>Cancel</button> */}
          </form>
        ) : (
          <>
            {/* Display client details */}
            <p><strong>ID:</strong> {client.id}</p>
            <p><strong>Last Name:</strong> {client.lastName}</p>
            <p><strong>First Name:</strong> {client.firstName}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Username:</strong> {client.username}</p>
            <p><strong>Address:</strong> {client.address}</p>
            <p><strong>Contact Number:</strong> {client.contactNum}</p>
            <p><strong>Status:</strong> {client.status}</p>
          </>
        )}
      </div>

      {/* Buttons to edit and go back */}
      {isEditing ? null : (
        <button className="btn-edit" onClick={toggleEdit}>Edit</button>
      )}
      <button className="btn-back" onClick={goBack}>
        Back
      </button>
    </div>
  );
};

export default ClientDetails;
