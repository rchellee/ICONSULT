import React from "react";
import { useNavigate } from "react-router-dom";
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
  tasksInfo,
  totalTasks,
  handleRightClick,
}) => {
  const navigate = useNavigate();

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
                <td title={project.projectName}>{project.projectName}</td>
                <td title={project.clientName}>{project.clientName}</td>
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
                  <div title={formatDate(project.startDate)}>
                    {formatDate(project.startDate)}
                  </div>{" "}
                  -
                  <div title={formatDate(project.endDate)}>
                    {formatDate(project.endDate)}
                  </div>
                </td>
                <td>
                  <select
                    value={statuses[project.id] || "Pending"}
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
                <td title={formatCurrency(project.contractPrice)}>
                  {formatCurrency(project.contractPrice)}
                </td>
                <td title={formatCurrency(project.downpayment)}>
                  {formatCurrency(project.downpayment)}
                </td>
                <td title={formatCurrency(totalTasks[project.id])}>
                  {formatCurrency(totalTasks[project.id])}
                </td>

                <td>
                  <select
                    value={paymentstatuses[project.id] || "Not Paid"}
                    onChange={(e) =>
                      handlePaymentStatusChange(project.id, e.target.value)
                    }
                    className={`payment-status-dropdown ${
                      paymentstatuses[project.id] === "Paid"
                        ? "paid-status"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        paymentstatusColors[paymentstatuses[project.id]] ||
                        "blue",
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
                        <option value="Paid">Settled</option>
                      </>
                    )}
                    {paymentstatuses[project.id] === "Paid" && (
                      <option value="Paid">Settled</option>
                    )}
                  </select>
                </td>

                <td title={startDate ? formatDate(startDate) : "--"}>
                  {startDate ? formatDate(startDate) : "--"}
                </td>

                <td title={finishDate ? formatDate(finishDate) : "--"}>
                  {finishDate ? formatDate(finishDate) : "--"}
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
