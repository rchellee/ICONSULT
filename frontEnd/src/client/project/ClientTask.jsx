import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./tracking.css"; // Assuming you have a CSS file for styling

function ClientTask({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("task_name");

  useEffect(() => {
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
  }, [projectId]);

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

  const formatDueDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  return (
    <div className="task-list">
      {isLoading && <p>Loading tasks...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && !error && tasks.length === 0 && <p>No tasks found.</p>}
      {!isLoading && !error && tasks.length > 0 && (
        <table className="task-table">
          <thead>
            <tr>
              <th onClick={() => handleSort("task_name")}>
                Task{" "}
                {sortField === "task_name" && (
                  <span>
                    {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort("task_fee")}>
                Fee{" "}
                {sortField === "task_fee" && (
                  <span>
                    {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort("due_date")}>
                Due Date{" "}
                {sortField === "due_date" && (
                  <span>
                    {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort("status")}>
                Status{" "}
                {sortField === "status" && (
                  <span>
                    {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort("amount")}>
                Amount{" "}
                {sortField === "amount" && (
                  <span>
                    {sortOrder === "asc" ? <FaArrowUp /> : <FaArrowDown />}
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
      )}
    </div>
  );
}

export default ClientTask;