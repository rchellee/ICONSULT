import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./ListView.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

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
  projects,
  filteredProjects,
  setFilteredProjects,
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
  handleEdit,
  handleDelete,
}) => {
  const navigate = useNavigate();
  const { searchTerm } = useContext(SearchContext);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  useEffect(() => {
    const filtered = projects.filter(
      (project) =>
        (project.projectName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (project.clientName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  const handleSort = (field) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);

    const sortedProjects = [...filteredProjects].sort((a, b) => {
      if (field === "progress") {
        const progressA =
          tasksInfo[a.id]?.completed / tasksInfo[a.id]?.total || 0;
        const progressB =
          tasksInfo[b.id]?.completed / tasksInfo[b.id]?.total || 0;
        return newOrder === "asc"
          ? progressA - progressB
          : progressB - progressA;
      } else if (field === "plannedDuration") {
        const startA = new Date(a.startDate);
        const endA = new Date(a.endDate);
        const startB = new Date(b.startDate);
        const endB = new Date(b.endDate);
        const durationA = endA - startA;
        const durationB = endB - startB;
        return newOrder === "asc"
          ? durationA - durationB
          : durationB - durationA;
      } else if (field === "status") {
        const statusOrder = ["Pending", "Ongoing", "Completed"];
        return newOrder === "asc"
          ? statusOrder.indexOf(a[field]) - statusOrder.indexOf(b[field])
          : statusOrder.indexOf(b[field]) - statusOrder.indexOf(a[field]);
      } else if (field === "contractPrice") {
        return newOrder === "asc" ? a[field] - b[field] : b[field] - a[field];
      } else if (field === "downpayment" || field === "total") {
        return newOrder === "asc" ? a[field] - b[field] : b[field] - a[field];
      } else if (field === "total") {
        return newOrder === "asc" ? a[field] - b[field] : b[field] - a[field];
      } else if (field === "paymentStatus") {
        const statusOrder = ["Not Paid", "Partial Payment", "Paid"];
        return newOrder === "asc"
          ? statusOrder.indexOf(a[field]) - statusOrder.indexOf(b[field])
          : statusOrder.indexOf(b[field]) - statusOrder.indexOf(a[field]);
      } else if (field === "actualStart" || field === "actualFinish") {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return newOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return newOrder === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      }
    });

    setFilteredProjects(sortedProjects);
  };

  const handleRowClick = (e, projectId) => {
    const targetTag = e.target.tagName.toLowerCase();
    if (!["select", "option", "input", "div", "textarea"].includes(targetTag)) {
      navigate(`/project/${projectId}`);
    }
  };

  const handleEditClick = (e, projectId) => {
    // Stop the row click event from firing
    e.stopPropagation();
    handleEdit(projectId);
  };
  const handleDeleteClick = (e, projectId) => {
    // Stop the row click event from firing
    e.stopPropagation();
    handleDelete(projectId);
  };

  return (
    <div className="table-scroll-wrapper">
      <table className="project-list-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("projectName")}>
              Project{" "}
              {sortField === "projectName" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th onClick={() => handleSort("clientName")}>
              Client{" "}
              {sortField === "clientName" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th onClick={() => handleSort("progress")}>
              Progress{" "}
              {sortField === "progress" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th onClick={() => handleSort("plannedDuration")}>
              Planned <br /> Duration{" "}
              {sortField === "plannedDuration" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th onClick={() => handleSort("status")}>
              Status{" "}
              {sortField === "status" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th onClick={() => handleSort("contractPrice")}>
              Professional <br /> Fee{" "}
              {sortField === "contractPrice" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th onClick={() => handleSort("downpayment")}>
              Downpayment{" "}
              {sortField === "downpayment" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th onClick={() => handleSort("total")}>
              Total{" "}
              {sortField === "total" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th onClick={() => handleSort("paymentStatus")}>
              Payment <br /> Status{" "}
              {sortField === "paymentStatus" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th onClick={() => handleSort("actualStart")}>
              Actual <br /> Start{" "}
              {sortField === "actualStart" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th onClick={() => handleSort("actualFinish")}>
              Actual <br /> Finish{" "}
              {sortField === "actualFinish" &&
                (sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
            </th>
            <th></th>
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
                className="clickable-row"
              >
                <td title={project.description}>{project.projectName}</td>
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
                    disabled={
                      statuses[project.id] === "Completed" &&
                      (() => {
                        const { total = 0, completed = 0 } =
                          tasksInfo[project.id] || {};
                        return (
                          total > 0 &&
                          Math.round((completed / total) * 100) === 100
                        );
                      })()
                    }
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
                      <>
                        <option value="Completed">Completed</option>
                      </>
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
                    className={`status-dropdown ${
                      paymentstatuses[project.id] === "Paid"
                        ? "paid-status"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        paymentstatusColors[paymentstatuses[project.id]] ||
                        "blue",
                    }}
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
                      <>
                        <option value="Partial Payment">Partial Payment</option>
                        <option value="Paid">Paid</option>
                      </>
                    )}
                  </select>
                </td>

                <td title={startDate ? formatDate(startDate) : "--"}>
                  {startDate ? formatDate(startDate) : "--"}
                </td>

                <td title={finishDate ? formatDate(finishDate) : "--"}>
                  {finishDate ? formatDate(finishDate) : "--"}
                </td>
                <td>
                  <div className="button-group">
                    <button
                      className="btn-edit"
                      onClick={(e) => handleEditClick(e, project.id)}
                    >
                      {" "}
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn-delete"
                      onClick={(e) => handleDeleteClick(e, project.id)}
                    >
                      {" "}
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
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
