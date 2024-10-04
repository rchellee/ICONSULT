import React, { useState } from 'react';
import './ClientList.css'; 

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    status: '', 
    projects: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      
      const updatedClients = clients.map((client, index) =>
        index === editIndex ? formData : client
      );
      setClients(updatedClients);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      
      setClients([...clients, formData]);
    }
    setFormData({
      name: '',
      contact: '',
      status: '', 
      projects: '',
    });
  };

  const handleEdit = (index) => {
    setFormData(clients[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  return (
    <div className="client-list">
      <h2>Client List</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="phone number"
          name="contact"
          placeholder="Number"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleChange} required>
          <option value="" disabled>Select Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
        </select>
        <input
          type="text"
          name="projects"
          placeholder="Projects"
          value={formData.projects}
          onChange={handleChange}
        />
        <button type="submit">{isEditing ? 'Update Client' : 'Add Client'}</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Number</th>
            <th>Status</th>
            <th>Projects</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>No clients available</td>
            </tr>
          ) : (
            clients.map((client, index) => (
              <tr key={index}>
                <td>{client.name}</td>
                <td>{client.contact}</td>
                <td>{client.status || 'N/A'}</td>
                <td>{client.projects}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
