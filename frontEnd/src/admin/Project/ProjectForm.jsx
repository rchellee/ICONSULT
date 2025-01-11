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
  contractPrice,
  setContractPrice,
  downpayment,
  setDownpayment,
  clients,
  onCancel,
  onSave,
  editingProjectId,
}) => {
  const [downpaymentWarning, setDownpaymentWarning] = useState(false);
  const [feeWarning, setFeeWarning] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Handle downpayment input change (only numeric input allowed)
  const handleDownpaymentChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) && value !== "") {
      setDownpaymentWarning(true);
    } else {
      setDownpaymentWarning(false);
      setDownpayment(value);
    }
  };

  // Handle professional fee input change (only numeric input allowed)
  const handleFeeChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) && value !== "") {
      setFeeWarning(true);
    } else {
      setFeeWarning(false);
      setContractPrice(value);
    }
  };

  // Handle save action with validation
  const handleSave = () => {
    if (
      !projectName ||
      !clientId ||
      !startDate ||
      !endDate ||
      !description ||
      !contractPrice
    ) {
      setValidationError("All fields except Downpayment are required.");
      return;
    }

    setValidationError(""); // Clear error if all fields are valid
    onSave(); // Call the original onSave function
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

          <div className="form-modal-field">
            <label>Downpayment (Optional):</label>
            <input
              type="text"
              placeholder="₱"
              value={downpayment}
              onChange={handleDownpaymentChange}
            />
            {downpaymentWarning && (
              <span className="warning-message">Invalid</span>
            )}
          </div>

          <div className="form-modal-field">
            <label>Professional Fee:</label>
            <input
              type="text"
              placeholder="₱"
              value={contractPrice}
              onChange={handleFeeChange}
            />
            {feeWarning && <span className="warning-message">Invalid</span>}
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
        </div>

        {validationError && (
          <div className="validation-error">{validationError}</div>
        )}

        <div className="form-create-cancel">
          <button className="form-cancel-project-button" onClick={onCancel}>
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
