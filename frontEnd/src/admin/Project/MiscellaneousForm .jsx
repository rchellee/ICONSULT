import React, { useState } from "react";
import "./MiscellaneousForm.css"; 

const MiscellaneousForm = ({ onClose, task, updateTaskWithMiscellaneous }) => {
  const [miscellaneousName, setMiscellaneousName] = useState("");
  const [miscellaneousFee, setMiscellaneousFee] = useState("");

  const handleAddMiscellaneous = () => {
    if (!miscellaneousName || !miscellaneousFee || isNaN(miscellaneousFee)) {
      alert("Please enter a valid name and amount.");
      return;
    }
    const newMiscellaneous = {
      name: miscellaneousName,
      fee: miscellaneousFee,
    };

    const updatedTask = {
      ...task,
      miscellaneous: [...(task.miscellaneous || []), newMiscellaneous],
    };

    updateTaskWithMiscellaneous(updatedTask);
    onClose();
  };

  return (
    <div className="miscellaneous-form">
      <h3>Miscellaneous</h3>
      <label htmlFor="miscellaneousName">Name:</label>
      <input
        type="text"
        id="miscellaneousName"
        value={miscellaneousName}
        onChange={(e) => setMiscellaneousName(e.target.value)}
        placeholder="Untitled"
      />
      <label htmlFor="miscellaneousFee">Amount:</label>
      <input
        type="text"
        id="miscellaneousFee"
        value={miscellaneousFee}
        onChange={(e) => setMiscellaneousFee(e.target.value)}
        placeholder="Enter amount"
      />
      <div className="buttons">
        <button type="button" onClick={handleAddMiscellaneous}>
          Add
        </button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default MiscellaneousForm;
