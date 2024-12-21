import React, { useState } from "react";

const MiscellaneousForm = ({ onClose, task, updateTaskWithMiscellaneous }) => {
    const [miscellaneousName, setMiscellaneousName] = useState("");
    const [miscellaneousFee, setMiscellaneousFee] = useState("");
  
    const handleAddMiscellaneous = () => {
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
        <h3>New</h3>
        <label htmlFor="miscellaneousName">Name:</label>
        <input
          type="text"
          id="miscellaneousName"
          value={miscellaneousName}
          onChange={(e) => setMiscellaneousName(e.target.value)}
          placeholder="Enter miscellaneous name"
        />
        <label htmlFor="miscellaneousFee">Amount:</label>
        <input
          type="text"
          id="miscellaneousFee"
          value={miscellaneousFee}
          onChange={(e) => setMiscellaneousFee(e.target.value)}
          placeholder="Enter amount"
        />
        <button type="button" onClick={handleAddMiscellaneous}>Add</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    );
  };
  
  export default MiscellaneousForm;
  