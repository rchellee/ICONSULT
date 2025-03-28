import React, { useState } from "react";
import "./ProjectFormStyle.css";

const ProjectForm = ({
  projectName,
  setProjectName,
  clientId,
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
  existingCreatedAt,
}) => {
  const [validationError, setValidationError] = useState("");

  const handleSave = () => {
    if (!projectName || !clientId || !startDate || !endDate || !description) {
      setValidationError("All fields are required.");
      return;
    }

    setValidationError("");

    const newProject = {
      projectName,
      clientId,
      clientName,
      startDate,
      endDate,
      description,
      createdAt: existingCreatedAt || new Date().toISOString(), // Use existingCreatedAt or current timestamp
    };

    onSave(newProject);
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-modal-content">
        <h2 className="form-modal-title">
          {editingProjectId ? "Edit Project" : "Create Project"}
        </h2>
        <div className="form-project-details">
          <div className="form-modal-field">
            <label>Project Name:</label>
            <input
              type="text"
              placeholder="Untitled"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="form-modal-field">
            <label>Client Name:</label>
            <select
              value={clientId}
              onChange={(e) => {
                const selectedClientId = e.target.value;
                setClientId(selectedClientId);
                const selectedClient = clients.find(
                  (client) => client.id === parseInt(selectedClientId)
                );
                if (selectedClient) {
                  setClientName(
                    `${selectedClient.firstName} ${selectedClient.lastName}`
                  );
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

          <div className="form-modal-field">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="form-modal-field">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-modal-field">
          <label>Description:</label>
          <textarea
            placeholder="Describe your project"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="description-input"
          />
        </div>

        {validationError && (
          <div className="validation-error">{validationError}</div>
        )}

        <div className="form-create-cancel">
          <button
            className="form-cancel-project-button"
            onClick={() => onCancel()}
          >
            Cancel
          </button>
          <button className="form-create-project-button" onClick={handleSave}>
            {editingProjectId ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
