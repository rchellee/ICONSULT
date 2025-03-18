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
  clients,
  onCancel,
  onSave,
  editingProjectId,
  existingCreatedAt,
}) => {
  const [feeWarning, setFeeWarning] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState(""); // Initialized as an empty string
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility

  const handleFeeChange = (e) => {
    const value = e.target.value;
    if (isNaN(value) && value !== "") {
      setFeeWarning(true);
    } else {
      setFeeWarning(false);
      setContractPrice(value);
    }
  };

  const handleSave = () => {
    if (!projectName || !clientId || !startDate || !endDate || !description || !contractPrice) {
      setValidationError("All fields except Transaction ID are required.");
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
      contractPrice,
      transactionId,
      modeOfPayment,
      createdAt: existingCreatedAt || new Date().toISOString(), // Use existingCreatedAt or current timestamp
    };

    onSave(newProject);
  };

  const handleOptionClick = (value) => {
    setModeOfPayment(value); // Update the selected value
    setIsOpen(false); // Close the dropdown
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
                  setClientName(`${selectedClient.firstName} ${selectedClient.lastName}`);
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
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>

          <div className="form-modal-field">
            <label>End Date:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>

        <div className="form-modal-field-container">
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
            <label>Transaction ID:</label>
            <input
              type="text"
              placeholder="Enter Transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>

          <div className="form-modal-field">
            <label>Mode of Payment: (MOP)</label>
            <div className="custom-dropdown">
              <div
                className="dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)} // Toggle dropdown visibility
              >
                <span>{modeOfPayment ? modeOfPayment : "Select MOP"}</span>
                <span className="dropdown-icon">▼</span> {/* Dropdown icon */}
              </div>
              {isOpen && (
                <ul className="dropdown-menu">
                  <li onClick={() => handleOptionClick("Select MOP")}>Select MOP</li>
                  <li onClick={() => handleOptionClick("Cheque")}>Cheque</li>
                  <li onClick={() => handleOptionClick("Online")}>Online</li>
                  <li onClick={() => handleOptionClick("Cash")}>Cash</li>
                </ul>
              )}
            </div>
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

        {validationError && <div className="validation-error">{validationError}</div>}

        <div className="form-create-cancel">
          <button className="form-cancel-project-button" onClick={() => onCancel()}>
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