import React, { useState } from 'react';
import "./client.css";

const ClientDetails = ({ client, goBack }) => {
  const [isEditing, setIsEditing] = useState(false); // Toggle between view and edit modes
  const [formData, setFormData] = useState({ ...client }); // Initialize form data with client details
  const [showToast, setShowToast] = useState(false);

  const updateClient = async (updatedClient) => {
    try {
        const response = await fetch(`http://localhost:8081/client/${updatedClient.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedClient),
        });

        if (response.ok) {
            // Update local client data if needed
            console.log("Client updated successfully");
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } else {
            console.error("Failed to update client");
        }
    } catch (error) {
        console.error("Error updating client:", error);
    }
};

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

      {showToast && (
        <div className="toast">
          Client information updated successfully!
          <div className="toast-progress"></div>
        </div>
      )}

      <div className="client-info">
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

            <button type="submit" className="btn-save">Update</button>
          </form>
        ) : (
          <>
            <p><strong>ID:</strong> {client.id}</p>
            <p><strong>Last Name:</strong> {client.lastName}</p>
            <p><strong>First Name:</strong> {client.firstName}</p>
            <p><strong>Email:</strong> {client.email_add}</p>
            <p><strong>Username:</strong> {client.username}</p>
            <p><strong>Address:</strong> {client.address}</p>
            <p><strong>Contact Number:</strong> {client.mobile_number}</p>
            <p><strong>Status:</strong> {client.status}</p>
            <p><strong>Birthday:</strong> {client.birthday}</p>
          </>
        )}
      </div>

      {/* Combined History Sections with 5 columns */}
      <div className="client-history">
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
            {client.appointments && client.appointments.length > 0 ? (
              client.appointments.map((appointment, index) => (
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
            {client.projects && client.projects.length > 0 ? (
              client.projects.map((project, index) => (
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
            {client.payments && client.payments.length > 0 ? (
              client.payments.map((payment, index) => (
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
            {client.documents && client.documents.length > 0 ? (
              client.documents.map((document, index) => (
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

export default ClientDetails;
