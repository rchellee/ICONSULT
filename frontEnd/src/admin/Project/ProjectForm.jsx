import React from "react";
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
  contractPrice,
  setContractPrice,
  downpayment,
  setDownpayment,
  clients,
  onCancel,
  onSave,
  editingProjectId,
}) => {
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
              placeholder="Enter project name"
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
            
          <div className="form-modal-field">
            <label>Downpayment (Optional):</label>
            <input
              type="number"
              placeholder="Enter downpayment (if applicable)"
              value={downpayment}
              onChange={(e) => setDownpayment(e.target.value)}
            />
          </div>

          <div className="form-modal-field">
            <label>Contract Price:</label>
            <input
              type="number"
              placeholder="Enter contract price"
              value={contractPrice}
              onChange={(e) => setContractPrice(e.target.value)}
            />
          </div>

          <div className="form-modal-field">
            <label>Description:</label>
            <input
              type="text"
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="form-create-cancel">
          <button className="form-cancel-project-button" onClick={onCancel}>
            Cancel
          </button>
          <button className="form-create-project-button" onClick={onSave}>
            {editingProjectId ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
