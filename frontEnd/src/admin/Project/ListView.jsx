import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./ListView.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { FaSort, FaMoneyBillWave, FaExclamationTriangle } from "react-icons/fa"; 

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
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  // Handle status option selection
  const handleStatusOptionClick = (status) => {
    if (selectedProjectId) {
      handleStatusChange(selectedProjectId, status);
    }
    setShowStatusOptions(false);
    setSelectedProjectId(null);
  };

  // Handle payment option selection
  const handlePaymentOptionClick = (paymentStatus) => {
    if (selectedProjectId) {
      handlePaymentStatusChange(selectedProjectId, paymentStatus);
    }
    setShowPaymentOptions(false);
    setSelectedProjectId(null);
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
  
    // Filter projects based on the search term
    const filtered = projects.filter(
      (project) =>
        (project.projectName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.clientName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  
    // Sort by createdAt in descending order (newest first)
    const sorted = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
    setFilteredProjects(sorted);
  }, [searchTerm, projects]);
  

  const handleSort = (field) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);

    const sortedProjects = [...filteredProjects].sort((a, b) => {
      if (field === "createdAt") {
        return newOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (field === "progress") {
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
    <div>
      {/* Button Container */}
      <div className="sorting-button">
        <div className="sorting-button-container">
          <button
            className="action-button"
            onClick={() => setShowStatusOptions(!showStatusOptions)}
          >
             <FaSort style={{ marginRight: "8px" }} /> Status
          </button>
          {showStatusOptions && (
            <div className="sorting-dropdown">
              <button onClick={() => handleStatusOptionClick("Ongoing")}>Ongoing</button>
              <button onClick={() => handleStatusOptionClick("Completed")}>Completed</button>
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
              <button onClick={() => handlePaymentOptionClick("Partial Payment")}>Partial Payment</button>
              <button onClick={() => handlePaymentOptionClick("Paid")}>Paid</button>
            </div>
          )}
        </div>
  
        <button className="action-button">
        <FaExclamationTriangle style={{ marginRight: "8px" }} /> Past Due
        </button>
      
      </div>

      <div className="table-scroll-wrapper">
        <table className="project-list-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Progress</th>
              <th>Date Created</th>
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
                  <td>{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</td>


                  <td>
                    <div title={formatDate(project.startDate)}>
                      {formatDate(project.startDate)}
                    </div>{" "}
                    -
                    <div title={formatDate(project.endDate)}>
                      {formatDate(project.endDate)}
                    </div>
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
                        ? "#3b4f67" // Color for "Paid"
                        : paymentstatuses[project.id] === "Partial Payment"
                        ? "#74C69D" // Color for "Partial Payment"
                        : paymentstatuses[project.id] === "Not Paid"
                        ? "rgb(252, 118, 118)" // Color for "Not Paid"
                        : paymentstatusColors[paymentstatuses[project.id]] || "blue",
                      color: "white", // Set font color to white
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