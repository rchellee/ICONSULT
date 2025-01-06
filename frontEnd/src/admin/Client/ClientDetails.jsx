import React, { useState } from "react";
import "./client.css";

const ClientDetails = ({ client, goBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...client });
  const [activeTab, setActiveTab] = useState("overview");
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
    setIsEditing(false); 
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (isEditing) setIsEditing(false); 
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "appointments":
        return renderSectionDetails("appointments");
      case "projects":
        return renderSectionDetails("projects");
      case "files":
        return renderSectionDetails("documents");
      default:
        return null;
    }
  };

  const renderOverview = () => {
    const details = [
      { label: "Prefix", value: client.prefix },
      { label: "Last Name", value: client.lastName },
      { label: "Middle Initial", value: client.middleInitial },
      { label: "First Name", value: client.firstName },
      { label: "Address", value: client.address },
      { label: "Mobile Number", value: client.mobile_number },
      { label: "Email", value: client.email_add },
      { label: "Status", value: client.status === "active" ? "Active" : "Inactive" },
      { label: "Birthday", value: client.birthday },
      { label: "Company Name", value: client.companyName },
      { label: "City", value: client.city },
      { label: "Postal Code", value: client.postalCode },
    ];
    return (
      <div className="tab-content">
        {details.map((detail, index) => (
          <p key={index}>
            <strong>{detail.label}:</strong> {detail.value}
          </p>
        ))}
      </div>
    );
  };

  const renderSectionDetails = (section) => {
    const headers = {
      appointments: ["ID", "Date", "Details", "Status", "Type"],
      projects: ["ID", "Project Name", "Start Date", "End Date", "Status"],
      documents: ["ID", "Document Name", "Uploaded Date", "Type", "Action"],
    };

    const data = client[section] || [];
    return (
      <div className="section-details">
        <h4>{section.charAt(0).toUpperCase() + section.slice(1)} Details</h4>
        <table>
          <thead>
            <tr>{headers[section].map((header) => <th key={header}>{header}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, idx) => (
                  <td key={idx}>
                    {section === "documents" && idx === Object.values(item).length - 1 ? (
                      <a href={item.url} target="_blank" rel="noopener noreferrer">View</a>
                    ) : value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="client-details">
      {showToast && <div className="toast">Client information updated successfully!</div>}

      <div className="tabs">
        <button
          className={activeTab === "overview" ? "active" : ""}
          onClick={() => handleTabClick("overview")}
        >
          Overview
        </button>
        <button
          className={activeTab === "appointments" ? "active" : ""}
          onClick={() => handleTabClick("appointments")}
        >
          Appointments
        </button>
        <button
          className={activeTab === "projects" ? "active" : ""}
          onClick={() => handleTabClick("projects")}
        >
          Projects
        </button>
        <button
          className={activeTab === "files" ? "active" : ""}
          onClick={() => handleTabClick("files")}
        >
          Files
        </button>
      </div>

      <div className="client-tab-container">
        {isEditing ? (
          <form onSubmit={handleSave} className="client-details-form">
            {Object.keys(formData).map((key) => (
              <label key={key} className="client-form-label">
                {key.replace(/_/g, " ")}:
                <input
                  type={key === "birthday" ? "date" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="client-details-form-input"
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
          renderTabContent()
        )}
      </div>

      <div className="button-row">
        {!isEditing && (
          <>
            <button className="btn-edit" onClick={toggleEdit}>
              Edit
            </button>
            <button className="btn-back" onClick={goBack}>
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
