import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./ListView.css";

// Utility function to format numbers with ₱ symbol
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₱ 0.00";
  return (
    "₱ " +
    new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  );
};

const ListView = ({
  filteredProjects,
  formatDate,
  statuses,
  statusColors,
  handleStatusChange,
  paymentstatuses,
  paymentstatusColors,
  handlePaymentStatusChange,
  startDates,
  finishDates,
  handleStartDateChange,
  handleFinishDateChange,
  tasksInfo,
  totalTasks,
  handleDelete,
  handleEdit,
  handleRightClick,
  toggleDropdown,
  activeDropdown,
}) => {
  const navigate = useNavigate();
  const rowsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const handleRowClick = (e, projectId) => {
    const targetTag = e.target.tagName.toLowerCase();
    if (!["select", "option", "input", "div", "textarea"].includes(targetTag)) {
      navigate(`/project/${projectId}`);
    }
  };

  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);

  const currentProjects = filteredProjects.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
            <th>
              Professional <br /> Fee
            </th>
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
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map((project) => {
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
                <td>
                  {(() => {
                    const { total = 0, completed = 0 } =
                      tasksInfo[project.id] || {};
                    const progress =
                      total > 0 ? Math.round((completed / total) * 100) : 0;
                    return `${progress}%`;
                  })()}
                </td>

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
                    disabled={statuses[project.id] === "Completed"}
                  >
                    {statuses[project.id] === "Pending" && (
                      <>
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                      </>
                    )}
                    {statuses[project.id] === "Ongoing" && (
                      <>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </>
                    )}
                    {statuses[project.id] === "Completed" && (
                      <option value="Completed">Completed</option>
                    )}
                  </select>
                </td>
                <td>{formatCurrency(project.contractPrice)}</td>
                <td>{formatCurrency(project.downpayment)}</td>
                <td>{formatCurrency(totalTasks[project.id])}</td>
                <td>
                  <select
                    value={paymentstatuses[project.id]}
                    onChange={(e) =>
                      handlePaymentStatusChange(project.id, e.target.value)
                    }
                    className={`payment-status-dropdown`}
                    style={{
                      backgroundColor:
                        paymentstatusColors[paymentstatuses[project.id]] ||
                        "gray",
                    }}
                    disabled={paymentstatuses[project.id] === "Paid"}
                  >
                    {/* Render options dynamically based on current paymentStatus */}
                    {paymentstatuses[project.id] === "Not Paid" && (
                      <>
                        <option value="Not Paid">Not Paid</option>
                        <option value="Partial Payment">Partial Payment</option>
                      </>
                    )}
                    {paymentstatuses[project.id] === "Partial Payment" && (
                      <>
                        <option value="Partial Payment">Partial Payment</option>
                        <option value="Paid">Paid</option>
                      </>
                    )}
                    {paymentstatuses[project.id] === "Paid" && (
                      <option value="Paid">Paid</option>
                    )}
                  </select>
                </td>

                <td>{startDate ? formatDate(startDate) : "--"}</td>
                <td>{finishDate ? formatDate(finishDate) : "--"}</td>
                <div className="action-project">
                  <button
                    className="action-menu-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(project.id);
                    }}
                  >
                    &#x22EE;
                  </button>
                  {activeDropdown === project.id && (
                    <div className="dropdown-menu">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(project.id);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id);
                        }}
                      >
                        Trash
                      </button>
                    </div>
                  )}
                </div>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="pagination-controls">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ListView;
