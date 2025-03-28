import React, { useEffect, useState, useContext, useRef } from "react";
import { SearchContext } from "../../components/SearchProvider";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "./ListView.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { TbArrowsSort } from "react-icons/tb";
import { FaTasks } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";

const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "₱ 0.00";
  const formatted = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `₱${String.fromCharCode(160)}${formatted}`;
};

const ListView = ({
  projects,
  filteredProjects,
  setFilteredProjects,
  formatDate,
  statuses,
  statusColors,
  tasksInfo,
  totalTasks,
  handleEdit,
  handleDelete,
}) => {
  const navigate = useNavigate();
  const { searchTerm } = useContext(SearchContext);
  const [sortOrder, setSortOrder] = useState("default");
  const [showStatusOptions, setShowStatusOptions] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Refs for dropdown containers
  const statusDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);
  const statusButtonRef = useRef(null);
  const sortButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target) &&
        statusButtonRef.current &&
        !statusButtonRef.current.contains(event.target)
      ) {
        setShowStatusOptions(false);
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target) &&
        sortButtonRef.current &&
        !sortButtonRef.current.contains(event.target)
      ) {
        setShowSortOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatusOptionClick = (status) => {
    setFilterStatus(status);
    setShowStatusOptions(false);
  };

  const handleSortOptionClick = (order) => {
    setSortOrder(order);
    setShowSortOptions(false);
  };

  const handleRowClick = (e, projectId) => {
    const targetTag = e.target.tagName.toLowerCase();
    if (!["select", "option", "input", "div", "textarea"].includes(targetTag)) {
      navigate(`/project/${projectId}`);
    }
    setSelectedProjectId(projectId);
  };

  const toggleStatusDropdown = () => {
    setShowStatusOptions(!showStatusOptions);
    setShowSortOptions(false);
  };

  const toggleSortDropdown = () => {
    setShowSortOptions(!showSortOptions);
    setShowStatusOptions(false);
  };

  const handleEditClick = (e, projectId) => {
    e.stopPropagation();
    handleEdit(projectId);
  };

  const handleDeleteClick = (e, projectId) => {
    e.stopPropagation();
    setProjectToDelete(projectId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      handleDelete(projectToDelete);
    }
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  useEffect(() => {
    if (!projects) return;
    const filtered = projects.filter((project) => {
      const matchesSearchTerm =
        (project.projectName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (project.clientName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus
        ? statuses[project.id] === filterStatus
        : true;

      return matchesSearchTerm && matchesStatus;
    });

    let sorted = [...filtered];

    if (sortOrder === "default") {
      sorted.sort((a, b) => {
        if (statuses[a.id] === "Completed" && statuses[b.id] !== "Completed") {
          return 1; 
        } else if (
          statuses[a.id] !== "Completed" &&
          statuses[b.id] === "Completed"
        ) {
          return -1; 
        } else {
          return new Date(b.created_at) - new Date(a.created_at);
        }
      });
    } else if (sortOrder === "name") {
      sorted.sort((a, b) => {
        const nameA = a.projectName.toLowerCase();
        const nameB = b.projectName.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    } else if (sortOrder === "asc") {
      sorted.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
      });
    } else if (sortOrder === "desc") {
      sorted.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB - dateA;
      });
    }

    setFilteredProjects(sorted);
  }, [searchTerm, projects, filterStatus, statuses, sortOrder]);

  const statusCounts = projects?.reduce(
    (acc, project) => {
      const status = statuses[project.id] || "Pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { Ongoing: 0, Pending: 0, Completed: 0 }
  );

  const totalProjects = projects?.length || 0;
  const overallProgress = totalProjects
    ? Math.round(
        projects.reduce((sum, project) => sum + (project.progress || 0), 0) /
          totalProjects
      )
    : 0;

  return (
    <div className="eto-parent">
      <div className="sorting-button-container">
        <div className="status-counters">
          <span className="status-counter">
            <span className="counter-label">Total Projects:</span>
            <span className="status-value-list">{totalProjects}</span>
          </span>
          <span className="status-counter">
            <span className="counter-label">Ongoing:</span>
            <span className="status-value-list">
              {statusCounts?.Ongoing || 0}
            </span>
          </span>
          <span className="status-counter">
            <span className="counter-label">Pending:</span>
            <span className="status-value-list">
              {statusCounts?.Pending || 0}
            </span>
          </span>
          <span className="status-counter">
            <span className="counter-label">Completed:</span>
            <span className="status-value-list">
              {statusCounts?.Completed || 0}
            </span>
          </span>
          <span className="progress-counter">
            <span className="progress-label">Progress:</span>
            <span className="progress-value">{overallProgress}%</span>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${overallProgress}%` }}
              ></div>
            </div>
          </span>
        </div>
        <div className="action-list-buttons">
          <div className="dropdown-list-container">
            <button
              className="action-button status-list-button"
              onClick={toggleStatusDropdown}
              ref={statusButtonRef}
            >
              <FaTasks size={20} className="button-icon" />
              <span>Status</span>
            </button>
            <div
              className={`sorting-dropdown ${
                showStatusOptions ? "visible" : ""
              }`}
              ref={statusDropdownRef}
            >
              <button onClick={() => handleStatusOptionClick(null)}>All</button>
              <button onClick={() => handleStatusOptionClick("Ongoing")}>
                Ongoing
              </button>
              <button onClick={() => handleStatusOptionClick("Completed")}>
                Completed
              </button>
              <button onClick={() => handleStatusOptionClick("Pending")}>
                Pending
              </button>
            </div>
          </div>
          <div className="dropdown-list-container">
            <button
              className="action-button sort-button"
              onClick={toggleSortDropdown}
              ref={sortButtonRef}
            >
              <TbArrowsSort size={20} className="button-icon" />
              <span>Sort</span>
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
      </div>

      <div className="table-scroll-wrapper">
        <table className="project-list-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Project</th>
              <th>Client</th>
              <th>Progress</th>
              <th>
                Planned <br /> Duration
              </th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Balance</th>
              <th>
                Project <br /> Status
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project, index) => (
              <tr
                key={project.id}
                onClick={(e) => handleRowClick(e, project.id)}
                className="clickable-row"
              >
                <td className="num-column">{index + 1}</td>
                <td title={project.description}>{project.projectName}</td>
                <td title={project.clientName}>{project.clientName}</td>
                <td>{project.progress}%</td>
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
                  <span className="currency-value">
                    {formatCurrency(project.total_amount)}
                  </span>
                </td>
                <td>
                  <span className="currency-value">
                    {formatCurrency(project.paid_amount || 0.0)}
                  </span>
                </td>
                <td>
                  <span className="currency-value">
                    {formatCurrency(
                      project.total_amount - (project.paid_amount || 0)
                    )}
                  </span>
                </td>
                <td>
                  <div 
                    className="status-indicator"
                    style={{
                      backgroundColor:
                        statuses[project.id] === "Ongoing"
                        ? "rgba(64, 112, 244, 0.1)"
                        : statuses[project.id] === "Completed"
                        ? "rgba(59, 79, 103, 0.1)"
                        : statuses[project.id] === "Pending"
                        ? "rgba(252, 118, 118, 0.1)"
                        : statusColors[statuses[project.id]]
                        ? `${statusColors[statuses[project.id]]}20` 
                        : "rgba(0, 0, 0, 0.05)",
                      color:
                        statuses[project.id] === "Ongoing"
                        ? "#4070f4"
                        : statuses[project.id] === "Completed"
                        ? "#3b4f67"
                        : statuses[project.id] === "Pending"
                        ? "rgb(252, 118, 118)"
                        : statusColors[statuses[project.id]] || "#000",
                    }}
                  >
                    {statuses[project.id] || "Pending"}
                  </div>
                </td>
                <td>
                  <div className="project-action">
                    <button
                      className="project-edit"
                      onClick={(e) => handleEditClick(e, project.id)}
                    >
                      <AiOutlineEdit style={{ fontSize: "1.5rem" }} />
                    </button>
                    <button
                      className="project-delete"
                      onClick={(e) => handleDeleteClick(e, project.id)}
                    >
                      <MdOutlineDeleteOutline style={{ fontSize: "1.5rem" }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-confirmation-modal">
          <div className="delete-confirmation-content">
            <div className="delete-confirmation-header">
              <MdOutlineDeleteOutline className="delete-project-icon" />
              <h3>Confirm Deletion</h3>
            </div>
            <p>Are you sure you want to delete this project?</p>
           
            <div className="delete-confirmation-buttons">
              <button className="cancel-project-button" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="confirm-project-button" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListView;