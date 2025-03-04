import React, { useEffect, useState, useContext, useRef } from "react";
import { SearchContext } from "../../components/SearchProvider";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./ListView.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { MdOutlineArrowDropDown } from "react-icons/md";
import { FaSort, FaMoneyBillWave, FaExclamationTriangle } from "react-icons/fa";
import { TbArrowsSort } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";

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
  const [sortOrder, setSortOrder] = useState("default");
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  // Refs for dropdown containers
  const statusDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const statusButtonRef = useRef(null);
  const sortButtonRef = useRef(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close status dropdown if clicked outside
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target) &&
        statusButtonRef.current &&
        !statusButtonRef.current.contains(event.target)
      ) {
        setShowStatusOptions(false);
      }

      // Close sort dropdown if clicked outside
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target) &&
        sortButtonRef.current &&
        !sortButtonRef.current.contains(event.target)
      ) {
        setShowSortOptions(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle status option selection
  const handleStatusOptionClick = (status) => {
    setFilterStatus(status);
    setShowStatusOptions(false);
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

  // Handle dropdown visibility
  const toggleStatusDropdown = () => {
    setShowStatusOptions(!showStatusOptions);
    setShowSortOptions(false); // Close sort dropdown
  };

  const toggleSortDropdown = () => {
    setShowSortOptions(!showSortOptions);
    setShowStatusOptions(false); // Close status dropdown
  };

  useEffect(() => {
    if (!projects) return;

    // Filter projects based on the search term and filter status
    const filtered = projects.filter((project) => {
      const matchesSearchTerm =
        (project.projectName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.clientName || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus ? statuses[project.id] === filterStatus : true;

      return matchesSearchTerm && matchesStatus;
    });

    // Sort projects based on the selected sort order
    let sorted = [...filtered];

    if (sortOrder === "default") {
      // Default sorting
      const statusOrder = { Ongoing: 1, Pending: 2, Completed: 3 };
      sorted.sort((a, b) => {
        const statusA = statuses[a.id] || "Pending";
        const statusB = statuses[b.id] || "Pending";

        if (statusOrder[statusA] !== statusOrder[statusB]) {
          return statusOrder[statusA] - statusOrder[statusB];
        }
        return 0;
      });
    } else if (sortOrder === "name") {
      // Sort alphabetically
      sorted.sort((a, b) => {
        const nameA = a.projectName.toLowerCase();
        const nameB = b.projectName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    } else if (sortOrder === "asc") {
      // Ascending
      sorted.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
      });
    } else if (sortOrder === "desc") {
      // Descending
      sorted.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB - dateA;
      });
    }

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
    <div className="eto-parent">
      {/* Button Container */}
      <div className="sorting-button">
        <div className="sorting-button-container">
          <button
            className="action-button"
            onClick={toggleStatusDropdown}
            ref={statusButtonRef}
          >
            <FaTasks size={20} style={{ marginRight: "13px" }} />
            <span style={{ fontSize: "15px" }}>Status</span> {/* Always show "Status" */}
          </button>
          <div
            className={`sorting-dropdown ${showStatusOptions ? "visible" : ""}`}
            ref={statusDropdownRef}
          >
            <button onClick={() => handleStatusOptionClick(null)}>All</button>
            <button onClick={() => handleStatusOptionClick("Ongoing")}>Ongoing</button>
            <button onClick={() => handleStatusOptionClick("Completed")}>Completed</button>
            <button onClick={() => handleStatusOptionClick("Pending")}>Pending</button>
          </div>
        </div>

        {/* Sorting dropdown for Default, Name, Ascending, Descending */}
        <div className="sorting-button-container">
          <button
            className="action-button"
            onClick={toggleSortDropdown}
            ref={sortButtonRef}
          >
            <TbArrowsSort size={20} style={{ marginRight: "13px" }} />
            <span style={{ fontSize: "15px" }}>Sort</span> {/* Always show "Sort" */}
          </button>
          <div
            className={`sorting-dropdown ${showSortOptions ? "visible" : ""}`}
            ref={sortDropdownRef}
          >
            <button onClick={() => handleSortOptionClick("default")}>
              Default
            </button>
            <button onClick={() => handleSortOptionClick("name")}>
              Name
            </button>
            <button onClick={() => handleSortOptionClick("asc")}>
              Ascending
            </button>
            <button onClick={() => handleSortOptionClick("desc")}>
              Descending
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-scroll-wrapper">
        <div className="title-project">
          <h1>Your Projects</h1>
        </div>
        <table className="project-list-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Progress</th>
              <th>Planned <br /> Duration</th>
              <th>Actual <br /> Start</th>
              <th>Actual <br /> Finish</th>
              <th>Professional <br /> Fee</th>
              <th>Downpayment</th>
              <th>Total</th>
              <th>Payment <br /> Status</th>
              <th>Project <br /> Status</th>
              <th>Action</th>
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

                  {/* Progress */}
                  <td>
                    {(() => {
                      const { total = 0, completed = 0 } =
                        tasksInfo[project.id] || {};
                      const progress =
                        total > 0 ? Math.round((completed / total) * 100) : 0;
                      return `${progress}%`;
                    })()}
                  </td>

                  {/* Planned Duration */}
                  <td>
                    <div title={formatDate(project.startDate)}>
                      {formatDate(project.startDate)}
                    </div>{" "}
                    -
                    <div title={formatDate(project.endDate)}>
                      {formatDate(project.endDate)}
                    </div>
                  </td>

                  {/* Actual Start and Finish */}
                  <td title={startDate ? formatDate(startDate) : "--"}>
                    {startDate ? formatDate(startDate) : "--"}
                  </td>
                  <td title={finishDate ? formatDate(finishDate) : "--"}>
                    {finishDate ? formatDate(finishDate) : "--"}
                  </td>

                  {/* Professional Fee, Downpayment, Total */}
                  <td className="right-align" title={formatCurrency(project.contractPrice)}>
                    {formatCurrency(project.contractPrice)}
                  </td>
                  <td className="right-align"title={formatCurrency(project.downpayment)}>
                    {formatCurrency(project.downpayment)}
                  </td>
                  <td className="right-align" title={formatCurrency(totalTasks[project.id])}>
                    {formatCurrency(totalTasks[project.id])}
                  </td>

                  {/* Payment Status */}
                  <td>Paid</td>

                  {/* Status Dropdown */}
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

                  {/* Action Buttons */}
                  <td>
  <div className="button-group">
    {/* Edit Button */}
    <button
      className="btn-edit"
      onClick={(e) => handleEditClick(e, project.id)}
    >
      <AiOutlineEdit style={{ fontSize: "1.5rem" }} /> {/* Apply style here */}
    </button>

    {/* Delete Button */}
    <button
      className="btn-delete"
      onClick={(e) => handleDeleteClick(e, project.id)}
    >
      <MdOutlineDeleteOutline style={{ fontSize: "1.5rem" }} /> {/* Apply style here */}
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