import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./overview.css";

function formatDate(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function formatCurrency(amount) {
  return `₱ ${amount?.toLocaleString("en-PH")}.00`;
}

function ProjectOverview({ projectId }) {
  const [project, setProject] = useState(null);
  const [tasksTotal, setTasksTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`http://localhost:8081/projects/${projectId}`)
      .then((response) => {
        if (response.data.project) {
          setProject(response.data.project);
        } else {
          setProject(null);
        }
      })
      .catch((err) => {
        setError("Error fetching project details. Please try again later.");
      });

    axios
      .get(`http://localhost:8081/admin/tasks?projectId=${projectId}`)
      .then((response) => {
        const tasks = response.data.tasks || [];
        const totalAmount = tasks.reduce((sum, task) => sum + task.amount, 0);
        setTasksTotal(totalAmount);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [projectId]);

  if (isLoading) return <p>Loading project overview...</p>;
  if (error) return <p className="error">{error}</p>;

  const handleReviewClick = () => {
    navigate("/review", { state: { projectId, clientId: project.clientId } });
  };

  return (
    <div className="project-overview">
      {project ? (
        <div className="project-details">
          <p>
            <p className="pro-name">
              <strong>Project Name:</strong> {project.projectName}
            </p>
            <span className="payment-status">
              <div className="progress-display" style={{ margin: "10px 0" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <strong style={{ marginRight: "10px" }}>Progress:</strong>
                  <span>{project.progress}%</span>
                </div>
                <div
                  className="progress-bar-container"
                  style={{
                    width: "100%",
                    height: "10px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="progress-bar"
                    style={{
                      width: `${project.progress}%`,
                      height: "100%",
                      backgroundColor: "#4070f4",
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>
              </div>
            </span>
          </p>
          <p>
            <p className="description" style={{ marginTop: "-10px" }}>
              <strong>Description:</strong> {project.description}
            </p>
          </p>
          <p>
            <p className="project-due" style={{ marginTop: "-10px" }}>
              <strong>Project Duration:</strong>{" "}
              {project.startDate ? formatDate(project.startDate) : "N/A"} -{" "}
              {project.endDate ? formatDate(project.endDate) : "N/A"}
            </p>
          </p>
          <p className="status-row" style={{ marginTop: "-10px" }}>
            <strong>Status:</strong> {project.status}
          </p>

          <table className="payment-table">
            <thead>
              <tr>
                <th>Total</th>
                <th>Paid Amount</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatCurrency(project.total_amount)}</td>
                <td>{formatCurrency(project.paid_amount)}</td>
                <td>
                  {formatCurrency(
                    project.total_amount - (project.paid_amount || 0)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          {project.status === "Completed" && !project.isReview && (
            <button
              onClick={handleReviewClick}
              style={{ backgroundColor: "#007bff" }}
            >
              Leave a Review
            </button>
          )}
        </div>
      ) : (
        <p>No project details found.</p>
      )}
    </div>
  );
}

export default ProjectOverview;
