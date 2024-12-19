import React, { useState } from "react";
import ProjectForm from "./ProjectForm";
import TaskForm from "./TaskForm";

const PickerForm = () => {
  const [selection, setSelection] = useState(null);

  const handleCancel = () => {
    setSelection(null); // Reset selection to go back to picker
  };

  const handleSave = () => {
    console.log("Form submitted successfully!");
    setSelection(null); // Optionally reset after saving
  };

  return (
    <div className="picker-container">
      {!selection && (
        <div className="picker-floating-box">
          <h2>Select an Option</h2>
          <button
            className="picker-button"
            onClick={() => setSelection("project")}
          >
            Create Project
          </button>
          <button
            className="picker-button"
            onClick={() => setSelection("task")}
          >
            Create Task
          </button>
        </div>
      )}
      {selection === "project" && (
        <ProjectForm
          projectName=""
          setProjectName={() => {}}
          clientId=""
          setClientId={() => {}}
          clientName=""
          setClientName={() => {}}
          startDate=""
          setStartDate={() => {}}
          endDate=""
          setEndDate={() => {}}
          description=""
          setDescription={() => {}}
          clients={[]}
          onCancel={handleCancel}
          onSave={handleSave}
          editingProjectId={null}
        />
      )}
      {selection === "task" && (
        <TaskForm
          onCreate={(taskData) => {
            console.log("Task Created:", taskData);
            setSelection(null); // Optionally reset after creation
          }}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default PickerForm;
