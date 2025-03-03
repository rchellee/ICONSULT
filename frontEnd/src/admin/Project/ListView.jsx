import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./ListView.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { FaSort, FaMoneyBillWave, FaExclamationTriangle } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";

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
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null); // State for filtering by status

  // Handle status option selection
  const handleStatusOptionClick = (status) => {
    setFilterStatus(status); // Directly set the selected filter
    setShowStatusOptions(false); // Close dropdown
  };

  // Handle payment option selection
  const handlePaymentOptionClick = (paymentStatus) => {
    if (selectedProjectId) {
      handlePaymentStatusChange(selectedProjectId, paymentStatus);
    }
    setShowPaymentOptions(false);
    setSelectedProjectId(null);
  };

  // Handle sorting option selection
  const handleSortOptionClick = (order) => {
    setSortOrder(order);
    setShowSortOptions(false);
  };

  // Handle row click to set selected project ID
  const handleRowClick = (e, projectId) => {
    const targetTag = e.target.tagName.toLowerCase();
    if (!["select", "option", "input", "div", "textarea"].includes(targetTag)) {
      navigate(`/project/${projectId}`);
    }
    setSelectedProjectId(projectId);
  };

  useEffect(() => {
    if (!projects) return; // Ensure projects exist

    // Filter projects based on the search term and filter status
    const filtered = projects.filter((project) => {
      const matchesSearchTerm =
        (project.projectName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.clientName || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus ? statuses[project.id] === filterStatus : true;

      return matchesSearchTerm && matchesStatus;
    });

    // Sort projects based on the selected sort order
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);

      if (sortOrder === "asc") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    setFilteredProjects(sorted);
  }, [searchTerm, projects, filterStatus, statuses, sortOrder]);

  const handleEditClick = (e, projectId) => {
    e.stopPropagation();
    handleEdit(projectId);
  };

  const handleDeleteClick = (e, projectId) => {
    e.stopPropagation();
    handleDelete(projectId);
  };

  return (
    <div>
      {/* Button Container */}
      <div className="sorting-button">
        <div className="sorting-button-container">
          <button
            className="action-button"
            onClick={() => setShowStatusOptions(!showStatusOptions)}
          >
            <FaSort style={{ marginRight: "8px" }} /> {filterStatus || "Status"}
          </button>
          {showStatusOptions && (
            <div className="sorting-dropdown">
              <button onClick={() => handleStatusOptionClick(null)}>All</button>
              <button onClick={() => handleStatusOptionClick("Ongoing")}>Ongoing</button>
              <button onClick={() => handleStatusOptionClick("Completed")}>Completed</button>
              <button onClick={() => handleStatusOptionClick("Pending")}>Pending</button>
            </div>
          )}
        </div>

        <div className="payment-button-container">
          <button
            className="action-button"
            onClick={() => setShowPaymentOptions(!showPaymentOptions)}
          >
            <FaMoneyBillWave style={{ marginRight: "8px" }} />Payment
          </button>
          {showPaymentOptions && (
            <div className="payment-dropdown">
              <button onClick={() => handlePaymentOptionClick("Not Paid")}>Not Paid</button>
              <button onClick={() => handlePaymentOptionClick("Partial Payment")}>
                Partial Payment
              </button>
              <button onClick={() => handlePaymentOptionClick("Paid")}>Paid</button>
            </div>
          )}
        </div>

        <button className="action-button">
          <FaExclamationTriangle style={{ marginRight: "8px" }} /> Past Due
        </button>

        {/* Sorting dropdown for Ascending/Descending */}
        <div className="sorting-button-container">
          <button
            className="action-button"
            onClick={() => setShowSortOptions(!showSortOptions)}
          >
            
            {sortOrder === "asc" ? (
              <span>
                <FaArrowUp style={{ marginRight: "4px" }} />
                Ascending
              </span>
            ) : (
              <span>
                <FaArrowDown style={{ marginRight: "4px" }} />
                Descending
              </span>
            )}
          </button>
          {showSortOptions && (
            <div className="sorting-dropdown">
              <button onClick={() => handleSortOptionClick("asc")}>
                <FaArrowUp style={{ marginRight: "8px" }} /> Ascending
              </button>
              <button onClick={() => handleSortOptionClick("desc")}>
                <FaArrowDown style={{ marginRight: "8px" }} /> Descending
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll-wrapper">
        <table className="project-list-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Progress</th>
              
              <th>Planned <br /> Duration</th>
              <th>Professional <br /> Fee</th>
              <th>Downpayment</th>
              <th>Total</th>
              <th>Actual <br /> Start</th>
              <th>Actual <br /> Finish</th>
              <th>Status</th>
              <th>Payment <br /> Status</th>
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
                  onClick={(e) => handleRowClick(e, project.id)}
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
                  <td className="right-align" title={formatCurrency(project.contractPrice)}>
                    {formatCurrency(project.contractPrice)}
                  </td>
                  <td className="right-align"title={formatCurrency(project.downpayment)}>
                    {formatCurrency(project.downpayment)}
                  </td>
                  <td className="right-align" title={formatCurrency(totalTasks[project.id])}>
                    {formatCurrency(totalTasks[project.id])}
                  </td>
                  <td title={startDate ? formatDate(startDate) : "--"}>
                    {startDate ? formatDate(startDate) : "--"}
                  </td>
                  <td title={finishDate ? formatDate(finishDate) : "--"}>
                    {finishDate ? formatDate(finishDate) : "--"}
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
                          statuses[project.id] === "Completed"
                          ? "#3b4f67"
                          : statuses[project.id] === "Ongoing"
                          ? "#F06292"
                          : statuses[project.id] === "Pending"
                          ? "rgb(252, 118, 118)"
                          : statusColors[statuses[project.id]] || "fffd78",
                        color:
                          statuses[project.id] === "Ongoing" ||
                          statuses[project.id] === "Completed"
                          ? "white"
                          : "white",
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
                  <td>
                    <select
                      value={paymentstatuses[project.id] || "Not Paid"}
                      onChange={(e) => handlePaymentStatusChange(project.id, e.target.value)}
                      className={`status-dropdown ${
                      paymentstatuses[project.id] === "Paid"
                        ? "paid-status"
                        : paymentstatuses[project.id] === "Partial Payment"
                        ? "status-partial-payment"
                        : ""
                    }`}
                      style={{
                      backgroundColor:
                        paymentstatuses[project.id] === "Paid"
                        ? "#3b4f67"
                        : paymentstatuses[project.id] === "Partial Payment"
                        ? "#74C69D"
                        : paymentstatuses[project.id] === "Not Paid"
                        ? "rgb(252, 118, 118)"
                        : paymentstatusColors[paymentstatuses[project.id]] || "blue",
                      color: "white",
                    }}
                    >
                      {paymentstatuses[project.id] === "Not Paid" && (
                        <>
                          <option value="Not Paid">
                            Not Paid
                            <span className="icon-container">
                              <MdOutlineArrowDropDown />
                            </span>
                          </option>
                          <option value="Partial Payment">
                            Partial Payment
                            <span className="icon-container">
                              <MdOutlineArrowDropDown />
                            </span>
                          </option>
                        </>
                      )}
                      {paymentstatuses[project.id] === "Partial Payment" && (
                        <>
                          <option value="Partial Payment">
                            Partial Payment
                            <span className="icon-container">
                              <MdOutlineArrowDropDown />
                            </span>
                          </option>
                          <option value="Paid">
                            Paid
                            <span className="icon-container">
                              <MdOutlineArrowDropDown />
                            </span>
                          </option>
                        </>
                      )}
                      {paymentstatuses[project.id] === "Paid" && (
                        <>
                          <option value="Partial Payment">
                            Partial Payment
                            <span className="icon-container">
                              <MdOutlineArrowDropDown />
                            </span>
                          </option>
                          <option value="Paid">
                            Paid
                            <span className="icon-container">
                              <MdOutlineArrowDropDown />
                            </span>
                          </option>
                        </>
                      )}
                    </select>
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
    </div>
  );
};

export default ListView;