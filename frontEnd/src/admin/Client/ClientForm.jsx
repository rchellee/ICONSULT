import { useState, useEffect } from "react";
import "./clientForm.css"; // Assuming you have CSS for styling
import Sidebar from "../sidebar";

const ClientForm = ({ clients, setClients, toggleForm, editingClient }) => {
  const [formData, setFormData] = useState({
    lastName: "",
    middleInitial: "", // Added field for Middle Initial
    firstName: "",
    username: "",
    password: "",
    address: "",
    mobile_number: "", // Changed from contactNum to mobile_number
    email_add: "", // Added field for Email Address
    status: "active", // Default status is 'active'
    birthday: "", // Added field for Birthday
  });

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
  const handleSubmit = async (e) => {
    e.preventDefault();

    const autogeneratedUsername = `${formData.lastName.toLowerCase()}.${formData.firstName.toLowerCase()}`;
    const autogeneratedPassword = `${formData.lastName.toUpperCase()}12345`;

    const newClientData = {
      ...formData,
      username: autogeneratedUsername,
      password: autogeneratedPassword,
    };

    try {
      if (editingClient) {
        // Update the existing client in the database
        // Assuming you will add an endpoint for updating clients
      } else {
        // Save new client data to the database
        const response = await fetch("http://localhost:8081/client", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClientData),
        });

        const result = await response.json();
        if (response.ok) {
          setClients([...clients, result]); // Add the new client to the local state
        } else {
          console.error("Error saving client:", result);
        }
      }

      toggleForm(); // Go back to the client list view after submission
      setFormData({
        lastName: "",
        middleName: "",
        firstName: "",
        username: "",
        password: "",
        address: "",
        contactNum: "",
        status: "active",
      });
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="admin-home-page">
      <Sidebar />
      <div className="content">
        <form onSubmit={handleSubmit}>
          <h3>{editingClient ? "Edit Client" : "Add a New Client"}</h3>

          {/* Last Name */}
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />

          {/* Middle Initial */}
          <input
            type="text"
            name="middleInitial"
            placeholder="Middle Initial"
            value={formData.middleInitial}
            onChange={handleChange}
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

          {/* Birthday */}
          <input
            type="date"
            name="birthday"
            placeholder="Birthday"
            value={formData.birthday}
            onChange={handleChange}
          />

          {/* Autogenerated Username (displayed but not editable) */}
          <label>Username:</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={`${formData.lastName.toLowerCase()}.${formData.firstName.toLowerCase()}`}
            disabled
          />

          {/* Autogenerated Password (displayed but not editable) */}
          <label>Password:</label>
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={`${formData.lastName.toUpperCase()}12345`}
            disabled
          />

          {/* Address */}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
          />

          {/* Mobile Number */}
          <input
            type="tel"
            name="mobile_number"
            placeholder="Mobile Number"
            value={formData.mobile_number}
            onChange={handleChange}
          />

          {/* Email Address */}
          <input
            type="email"
            name="email_add"
            placeholder="Email Address"
            value={formData.email_add}
            onChange={handleChange}
          />

          {/* Status (Active or Inactive) */}
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button type="submit">
            {editingClient ? "Update Client" : "Add Client"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;