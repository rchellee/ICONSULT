import React from "react";
import "./ListView.css";

const GridView = ({ filteredProjects, formatDate, statuses, statusColors, handleStatusChange, startDates, finishDates, handleStartDateChange, handleFinishDateChange }) => {
  return (
    <div className="grid-view">
      {filteredProjects.map((project) => (
        <div key={project.id} className="grid-item">
          <div>{project.projectName}</div>
          <div>{project.clientName}</div>
          <div>{formatDate(project.startDate)} - {formatDate(project.endDate)}</div>
          <div>{project.status}</div>
          {/* Add other project details as required */}
        </div>
      ))}
    </div>
  );
};

export default GridView;
