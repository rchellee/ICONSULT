import  { useState } from 'react';

const ClientForm = ({ clients, setClients, toggleForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    status: '',
    projects: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setClients([...clients, formData]); // Add new client to the list
    setFormData({ name: '', contact: '', status: '', projects: '' }); // Clear the form
    toggleForm(); // Go back to the client list view after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add a New Client</h3>
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="contact"
        placeholder="Contact"
        value={formData.contact}
        onChange={handleChange}
        required
      />
      <select name="status" value={formData.status} onChange={handleChange} required>
        <option value="" disabled>Select Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <input
        type="text"
        name="projects"
        placeholder="Projects"
        value={formData.projects}
        onChange={handleChange}
      />
      <button type="submit">Add Client</button>
      <button type="button" onClick={toggleForm}>Cancel</button>
    </form>
  );
};

export default ClientForm;
