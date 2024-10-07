/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './clientForm.css'; // Assuming you have CSS for styling

const ClientForm = ({ clients, setClients, toggleForm, editingClient }) => {
  const [formData, setFormData] = useState({
    id: '',
    lastName: '',
    username: '',
    firstName: '',
    address: '',
    contactNum: '',
    status: 'active', // Default status is 'active'
  });

  // Populate form data if a client is being edited
  useEffect(() => {
    if (editingClient) {
      setFormData(editingClient); // Pre-fill the form with the selected client's data
    }
  }, [editingClient]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClient) {
      // Update the existing client
      const updatedClients = clients.map((client) =>
        client.id === editingClient.id ? formData : client
      );
      setClients(updatedClients);
    } else {
      // Add new client
      setClients([...clients, { ...formData, id: clients.length + 1 }]);
    }
    toggleForm(); // Go back to the client list view after submission
    setFormData({ 
      id: '', 
      lastName: '', 
      email: '', 
      username: '', 
      // password: '', 
      firstName: '', 
      address: '', 
      contactNum: '', 
      status: 'active' 
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{editingClient ? 'Edit Client' : 'Add a New Client'}</h3>

      {/* Id */}
      <input
        type="text"
        name="id"
        placeholder="ID"
        value={formData.id}
        onChange={handleChange}
        required
      />

      {/* Last Name */}
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={handleChange}
        required
      />

      {/* First Name */}
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        value={formData.firstName}
        onChange={handleChange}
        required
      />

      {/* Username */}
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <input
      type = "text"
      name = "email"
      placeholder = "Email"
      value= {formData.email}
      onChange={handleChange}
      required
      />

      {/* Password
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        required
      /> */}

      {/* Address */}
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />

      {/* Contact Number */}
      <input
        type="tel"
        name="contactNum"
        placeholder="Contact Number"
        value={formData.contactNum}
        onChange={handleChange}
      />

      {/* Status (Active or Inactive) */}
      <label>Status:</label>
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button type="submit">{editingClient ? 'Update Client' : 'Add Client'}</button>
    </form>
  );
};

export default ClientForm;
