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
  handleProgressChange,
  handleStatusChange,
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

    // Sort projects based on the selected sort order
    let sorted = [...filtered];

    if (sortOrder === "default") {
      // Default sorting: Most recent first, except for completed projects
      sorted.sort((a, b) => {
        if (statuses[a.id] === "Completed" && statuses[b.id] !== "Completed") {
          return 1; // Move completed projects to the bottom
        } else if (
          statuses[a.id] !== "Completed" &&
          statuses[b.id] === "Completed"
        ) {
          return -1; // Move non-completed projects to the top
        } else {
          // Sort by creation date (most recent first)
          return new Date(b.created_at) - new Date(a.created_at);
        }
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
      // Ascending by start date
      sorted.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA - dateB;
      });
    } else if (sortOrder === "desc") {
      // Descending by start date
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
            <span style={{ fontSize: "15px" }}>Status</span>{" "}
            {/* Always show "Status" */}
          </button>
          <div
            className={`sorting-dropdown ${showStatusOptions ? "visible" : ""}`}
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

        {/* Sorting dropdown for Default, Name, Ascending, Descending */}
        <div className="sorting-button-container">
          <button
            className="action-button"
            onClick={toggleSortDropdown}
            ref={sortButtonRef}
          >
            <TbArrowsSort size={20} style={{ marginRight: "13px" }} />
            <span style={{ fontSize: "15px" }}>Sort</span>{" "}
            {/* Always show "Sort" */}
          </button>
          <div
            className={`sorting-dropdown ${showSortOptions ? "visible" : ""}`}
            ref={sortDropdownRef}
          >
            <button onClick={() => handleSortOptionClick("default")}>
              Default
            </button>
            <button onClick={() => handleSortOptionClick("name")}>Name</button>
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
              <th>
                Planned <br /> Duration
              </th>
              <th>Amount</th>
              <th>Balance</th>
              <th>
                Project <br /> Status
              </th>
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
                  <td>{project.progress}%</td>

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

                  <td>{formatCurrency(project.amount || 0.0)}</td>
                  <td>{formatCurrency(project.balance || 0.0)}</td>

                  {/* Status Dropdown */}
                  <td>
                    <div
                      className="status-text"
                      style={{
                        color:
                          statuses[project.id] === "Ongoing"
                            ? "#4070f4" // blue for Ongoing
                            : statuses[project.id] === "Completed"
                            ? "#3b4f67" // Dark blue for Completed
                            : statuses[project.id] === "Pending"
                            ? "rgb(252, 118, 118)" // Red for Pending
                            : statusColors[statuses[project.id]] || "#000", // Default to black
                      }}
                    >
                      {statuses[project.id] || "Pending"}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td>
                    <div className="project-action">
                      {/* Edit Button */}
                      <button
                        className="project-edit"
                        onClick={(e) => handleEditClick(e, project.id)}
                      >
                        <AiOutlineEdit style={{ fontSize: "1.5rem" }} />
                      </button>

                      {/* Delete Button */}
                      <button
                        className="project-delete"
                        onClick={(e) => handleDeleteClick(e, project.id)}
                      >
                        <MdOutlineDeleteOutline
                          style={{ fontSize: "1.5rem" }}
                        />
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