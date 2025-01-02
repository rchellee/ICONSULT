import React, { useState } from "react";
import "./client.css";

const ClientDetails = ({ client, goBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...client });
  const [selectedSection, setSelectedSection] = useState(null);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateClient(formData);
    toggleEdit();
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const goBackToMain = () => {
    setSelectedSection(null);
  };

  const renderSectionDetails = () => {
    const data = client[selectedSection] || [];

    if (data.length === 0) {
      return <p>No data found for this section.</p>;
    }

    const headers = {
      appointments: ["ID", "Date", "Details", "Status", "Type"],
      projects: ["ID", "Project Name", "Start Date", "End Date", "Status"],
      payments: ["ID", "Date", "Amount", "Method", "Status"],
      documents: ["ID", "Document Name", "Uploaded Date", "Type", "Action"],
    };

    return (
      <>
        <h4>{selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} Details</h4>
        <table>
          <thead>
            <tr>
              {headers[selectedSection].map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, idx) => (
                  <td key={idx}>
                    {selectedSection === "documents" && idx === Object.values(item).length - 1 ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">View</a>
                    ) : (
                      value
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn-back" onClick={goBackToMain}>
          Back
        </button>
      </>
    );
  };

  return (
    <div className="client-details">
      {showToast && (
        <div className="toast">
          Client information updated successfully!
          <div className="toast-progress"></div>
        </div>
      )}

      {!selectedSection ? (
        <>
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
                    name="email_add"
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

                <div className="button-row">
                  <button type="submit" className="btn-save">Update</button>
                  <button type="button" className="btn-edit" onClick={toggleEdit}>Cancel</button>
                </div>
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

                <div className="button-row">
                  <button className="btn-edit" onClick={toggleEdit}>Edit</button>
                  <button className="btn-back" onClick={goBack}>Back</button>
                </div>
              </>
            )}
          </div>

          <div className="client-history">
            <h4 onClick={() => handleSectionClick("appointments")} className="clickable">Appointment History</h4>
            <h4 onClick={() => handleSectionClick("projects")} className="clickable">Project History</h4>
            <h4 onClick={() => handleSectionClick("payments")} className="clickable">Payment History</h4>
            <h4 onClick={() => handleSectionClick("documents")} className="clickable">Documents</h4>
          </div>
        </>
      ) : (
        renderSectionDetails()
      )}
    </div>
  );
};

export default ClientDetails;
