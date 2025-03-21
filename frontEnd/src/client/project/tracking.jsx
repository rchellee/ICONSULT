import React, { useEffect, useState, useContext } from "react";
import { SearchContext } from "../../components/SearchProvider";
import { useParams, useLocation } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaArrowUp,
  FaArrowDown,
  FaFolder,
  FaFile,
  FaHome,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar";
import axios from "axios";
import ProjectOverview from "./ProjectOverview";
import "./tracking.css";
import Files from "./Files";
import Topbar from "../Topbar";

function Tracking() {
  const { projectId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientId = queryParams.get("clientId");
  const [tasks, setTasks] = useState([]);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { searchTerm } = useContext(SearchContext);
  const [folders, setFolders] = useState([]);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("task_name");

  useEffect(() => {
    if (activeTab === "tasks") {
      // Fetch tasks for the specific project
      axios
        .get("http://localhost:8081/tasks", {
          params: { projectIds: [projectId] },
        })
        .then((response) => {
          setTasks(response.data.tasks || []);
          setIsLoading(false);
        })
        .catch((err) => {
          setError("Error fetching tasks. Please try again later.");
          setIsLoading(false);
        });
    }
  }, [projectId, activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "overview") {
      setIsLoading(false);
    }
  };

  const handleSort = (field) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc"; // Toggle order
    setSortField(field);
    setSortOrder(newSortOrder);
    sortTasks(field, newSortOrder);
  };

  const sortTasks = (field, order) => {
    const sortedTasks = [...tasks].sort((a, b) => {
      if (field === "task_fee" || field === "amount") {
        const feeA = parseFloat(a[field]) || 0;
        const feeB = parseFloat(b[field]) || 0;
        return order === "asc" ? feeA - feeB : feeB - feeA;
      } else if (field === "due_date") {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return order === "asc" ? dateA - dateB : dateB - dateA;
      } else if (field === "status") {
        const statusOrder = ["Pending", "Ongoing", "Completed"];
        return order === "asc"
          ? statusOrder.indexOf(a[field]) - statusOrder.indexOf(b[field])
          : statusOrder.indexOf(b[field]) - statusOrder.indexOf(a[field]);
      } else {
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        if (a[field] > b[field]) return order === "asc" ? 1 : -1;
        return 0;
      }
    });
    setTasks(sortedTasks);
  };

  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      // Check if search term matches a task name or file name
      const taskMatch = tasks.some((task) =>
        task.task_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const fileMatch = files.some((file) =>
        file.original_name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (taskMatch) {
        setActiveTab("tasks");
      } else if (fileMatch) {
        setActiveTab("files");
      }
    }
  }, [searchTerm, tasks, files]);

  const formatDueDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handleNewFolderClick = () => {
    setShowNewFolderInput(true);
  };

  const handleFolderNameChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleCancelCreate = () => {
    setFolderName("");
    setShowNewFolderInput(false);
  };

  const handleCreateFolder = () => {
    if (folderName) {
      const newFolder = {
        name: folderName,
        modifiedDate: new Date().toLocaleDateString(),
        modifiedBy: "Client",
        duedate: new Date().toLocaleDateString(), // Added a default due date for each folder
      };
      setFolders([...folders, newFolder]); // Add new folder to the list
      handleCancelCreate();
    }
  };

  return (
    <div>
      <Topbar />
      <div className="client-task-page">
        <Sidebar />
        <div className="content-tracking">
          {/* Tabs */}
          <div className="tabs">
            <button
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => handleTabClick("overview")}
            >
              Overview
            </button>
            <button
              className={activeTab === "tasks" ? "active" : ""}
              onClick={() => handleTabClick("tasks")}
            >
              Tasks
            </button>
            <button
              className={activeTab === "files" ? "active" : ""}
              onClick={() => handleTabClick("files")}
            >
              Files
            </button>
          </div>

          {/* Content Area */}
          <div className="content-area">
            {activeTab === "overview" && (
              <ProjectOverview projectId={projectId} />
            )}
            {activeTab === "tasks" && (
              <>
                {isLoading && <p>Loading tasks...</p>}
                {error && <p className="error">{error}</p>}
                {!isLoading && !error && tasks.length === 0 && (
                  <p>No tasks found.</p>
                )}
                {!isLoading && !error && tasks.length > 0 && (
                  <div className="task-list">
                    <table className="task-table">
                      <thead>
                        <tr>
                          <th onClick={() => handleSort("task_name")}>
                            Task{" "}
                            {sortField === "task_name" && (
                              <span>
                                {sortOrder === "asc" ? (
                                  <FaArrowUp />
                                ) : (
                                  <FaArrowDown />
                                )}
                              </span>
                            )}
                          </th>
                          <th onClick={() => handleSort("task_fee")}>
                            Fee{" "}
                            {sortField === "task_fee" && (
                              <span>
                                {sortOrder === "asc" ? (
                                  <FaArrowUp />
                                ) : (
                                  <FaArrowDown />
                                )}
                              </span>
                            )}
                          </th>
                          <th onClick={() => handleSort("due_date")}>
                            Due Date{" "}
                            {sortField === "due_date" && (
                              <span>
                                {sortOrder === "asc" ? (
                                  <FaArrowUp />
                                ) : (
                                  <FaArrowDown />
                                )}
                              </span>
                            )}
                          </th>
                          <th onClick={() => handleSort("status")}>
                            Status{" "}
                            {sortField === "status" && (
                              <span>
                                {sortOrder === "asc" ? (
                                  <FaArrowUp />
                                ) : (
                                  <FaArrowDown />
                                )}
                              </span>
                            )}
                          </th>
                          <th onClick={() => handleSort("amount")}>
                            Amount{" "}
                            {sortField === "amount" && (
                              <span>
                                {sortOrder === "asc" ? (
                                  <FaArrowUp />
                                ) : (
                                  <FaArrowDown />
                                )}
                              </span>
                            )}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task) => {
                          const miscellaneousItems = JSON.parse(
                            task.miscellaneous || "[]"
                          );
                          const miscellaneousDetails = miscellaneousItems
                            .map((item) => `${item.name}: ${item.fee}`)
                            .join(", ");

                          return (
                            <tr key={task.id}>
                              <td>{task.task_name}</td>
                              <td>{task.task_fee}</td>
                              <td>{formatDueDate(task.due_date)}</td>
                              <td>{task.status}</td>
                              <td>{task.amount}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {activeTab === "files" && (
          <Files projectId={projectId} clientId={clientId} />
        )}
      </div>
    </div>
  );
}

export default Tracking;
