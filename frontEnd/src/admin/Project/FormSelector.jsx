import React from "react";

const FormSelector = ({ setSelectedForm }) => {
  return (
    <div className="form-selector">
      <button onClick={() => setSelectedForm("projectForm")}>Project Form</button>
      <button onClick={() => setSelectedForm("taskForm")}>Task Form</button>
    </div>
  );
};

export default FormSelector;
