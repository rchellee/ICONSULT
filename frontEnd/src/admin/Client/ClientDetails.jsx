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
    setFormData({ ...formData, [name]: value });
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSave = (e) => {
    e.preventDefault();
    updateClient(formData);
    toggleEdit();
  };

  const handleSectionClick = (section) => setSelectedSection(section);
  const goBackToMain = () => setSelectedSection(null);

  const renderSectionDetails = () => {
    const headers = {
      appointments: ["ID", "Date", "Details", "Status", "Type"],
      projects: ["ID", "Project Name", "Start Date", "End Date", "Status"],
      payments: ["ID", "Date", "Amount", "Method", "Status"],
      documents: ["ID", "Document Name", "Uploaded Date", "Type", "Action"],
    };

    const data = client[selectedSection] || [];
    return (
      <div className="section-details">
        <h4>{selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)} Details</h4>
        <table>
          <thead>
            <tr>{headers[selectedSection].map((header) => <th key={header}>{header}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, idx) => (
                  <td key={idx}>
                    {selectedSection === "documents" && idx === Object.values(item).length - 1 ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">View</a>
                    ) : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn-back" onClick={goBackToMain}>Back</button>
      </div>
    );
  };

  return (
    <div className="client-details">
      {showToast && <div className="toast">Client information updated successfully!</div>}
      {!isEditing && (
      <div className="client-history">
        {["appointments", "projects", "payments", "documents"].map((section) => (
          <h4 key={section} onClick={() => handleSectionClick(section)} className="clickable">
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </h4>
        ))}
      </div>
      )}

      {!selectedSection ? (
        <div className="client-info">
           {isEditing ? (
            <form onSubmit={handleSave} className="client-form">
              {Object.keys(formData).map((key) => (
                <label key={key} className="form-label">
                  {key.replace(/_/g, " ")}:
                  <input
                    type={key === "birthday" ? "date" : "text"}
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    className="form-input"
                  />
                </label>
                
              ))}
              <div className="button-row">
                <button type="submit" className="btn-save">
                  Save
                </button>
                <button type="button" className="btn-cancel" onClick={toggleEdit}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="client-view">
              {Object.entries(client).map(([key, value]) => (
                <p key={key}>
                  <strong>{key.replace(/_/g, " ")}:</strong> {value}
                </p>
              ))}
              <div className="button-row">
                <button className="btn-edit" onClick={toggleEdit}>
                  Edit
                </button>
                <button className="btn-back" onClick={goBack}>
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      ) : renderSectionDetails()}
    </div>
  );
};

export default ClientDetails;