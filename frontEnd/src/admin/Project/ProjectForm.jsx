// ProjectForm.jsx
import React from "react";
import "./project.css";

const ProjectForm = ({
  projectName,
  setProjectName,
  clientId, // Ensure this is included
  setClientId,
  clientName,
  setClientName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  description,
  setDescription,
  clients,
  onCancel,
  onSave,
  editingProjectId,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {editingProjectId ? "Edit Project" : "Create Project"}
        </h2>
        <div className="modal-field">
          <label>Project Name:</label>
          <input
            type="text"
            placeholder="Enter project name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Client Name:</label>
          <select
            value={clientId} // Use clientId instead of clientName
            onChange={(e) => {
              const selectedClientId = e.target.value;
              setClientId(selectedClientId); // Set clientId state
              const selectedClient = clients.find(
                (client) => client.id === parseInt(selectedClientId)
              );
              if (selectedClient) {
                setClientName(
                  `${selectedClient.firstName} ${selectedClient.lastName}`
                ); // Set clientName for display
              }
            }}
          >
            <option value="">Select a client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-field">
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="modal-field">
          <label>Description:</label>
          <input
            type="text"
            placeholder="Enter project description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="create-button" onClick={onSave}>
            {editingProjectId ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
