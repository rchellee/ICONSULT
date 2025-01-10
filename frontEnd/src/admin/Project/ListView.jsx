import React from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ListView.css";

// Utility function to format numbers
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "0.00";
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const ListView = ({
  filteredProjects,
  formatDate,
  statuses,
  statusColors,
  handleStatusChange,
  startDates,
  finishDates,
  handleStartDateChange,
  handleFinishDateChange,
  handleRightClick,
}) => {
  const navigate = useNavigate();

  // Prevent navigation if the clicked target is the date picker or status dropdown
  const handleRowClick = (e, projectId) => {
    const targetTag = e.target.tagName.toLowerCase();
    if (!["select", "option", "input", "div", "textarea"].includes(targetTag)) {
      navigate(`/project/${projectId}`);
    }
  };

  return (
    <div className="table-scroll-wrapper">
      <table className="project-list-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
            <th>Progress</th>
            <th>
              Planned <br /> Duration
            </th>
            <th>Status</th>
            <th>Downpayment</th>
            <th>Total</th>
            <th>
              Payment <br /> Status
            </th>
            <th>
              Actual <br /> Start
            </th>
            <th>
              Actual <br /> Finish
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredProjects.map((project) => {
            const startDate = startDates[project.id]
              ? new Date(startDates[project.id])
              : null;
            const finishDate = finishDates[project.id]
              ? new Date(finishDates[project.id])
              : null;

            return (
              <tr
                key={project.id}
                onClick={(e) => handleRowClick(e, project.id)} // Navigate conditionally
                onContextMenu={(e) => handleRightClick(e, project.id)}
                className="clickable-row"
              >
                <td>{project.projectName}</td>
                <td>{project.clientName}</td>
                <td>0%</td> {/* Progress column with 0% */}
                <td>
                  <div>{formatDate(project.startDate)}</div> -
                  <div>{formatDate(project.endDate)}</div>
                </td>
                <td>
                  <select
                    value={statuses[project.id]}
                    onChange={(e) =>
                      handleStatusChange(project.id, e.target.value)
                    }
                    className={`status-dropdown ${
                      statuses[project.id] === "Pending"
                        ? "status-pending"
                        : statuses[project.id] === "Completed"
                        ? "status-completed"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        statusColors[statuses[project.id]] || "pink",
                    }}
                  >
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>{formatCurrency(project.downpayment)}</td>
                <td>{formatCurrency(project.totalPayment)}</td>
                <td>{project.paymentStatus}</td>
                <td>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => handleStartDateChange(project.id, date)}
                    className="date-picker-input"
                    placeholderText="--"
                    dateFormat="MMMM d, yyyy"
                    showPopperArrow={false}
                  />
                </td>
                <td>
                  <DatePicker
                    selected={finishDate}
                    onChange={(date) =>
                      handleFinishDateChange(project.id, date)
                    }
                    className="date-picker-input"
                    placeholderText="--"
                    dateFormat="MMMM d, yyyy"
                    showPopperArrow={false}
                    minDate={startDate} // Disable dates before actual start date
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListView;
