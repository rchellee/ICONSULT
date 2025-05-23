import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./overview.css";
import { GoProject } from "react-icons/go";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function formatCurrency(amount) {
  return `₱ ${amount?.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

function ProjectOverview({ projectId }) {
  const [project, setProject] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
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
      .get(`http://localhost:8081/admin/tasks?projectId=${projectId}&limit=10`)
      .then((response) => {
        setRecentTasks(response.data.tasks || []);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [projectId]);

  if (isLoading) return <div className="loading">Loading project details...</div>;
  if (error) return <div className="error">{error}</div>;

  const handleReviewClick = () => {
    navigate("/review", { state: { projectId, clientId: project.clientId } });
  };

  return (
    <div className="project-overview-container">
      {project ? (
        <>
          <div className="projectclient-header">
            
            <h2>
            {/*<GoProject className="projectclient-icon" />*/}
              {project.projectName} <span className="statusclient-tag">{project.status}</span>
            </h2>
            <div className="recent-tasks">
              {recentTasks.length} recent task{recentTasks.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div className="projectcliet-details">
            <div className="detailclient-row">
              <span className="detailclient-label">Description:</span>
              <span className="detailclient-value">{project.description}</span>
            </div>
            <div className="detailclient-row">
              <span className="detailclient-label">Duration:</span>
              <span className="detailclient-value">
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
            <div className="detailclient-row">
              <span className="detailclient-prog">Progress: </span>
              <span className="progressclient-container">
                <span className="progressclient-text">{project.progress}%</span>
                <div className="progressclient-bar">
                  <div 
                    className="progressclient-fill" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </span>
            </div>
          </div>

          <div className="financial-summary">
            <div className="financial-item">
              <div className="financial-label">Total Budget</div>
              <div className="financial-value">{formatCurrency(project.total_amount)}</div>
            </div>
            <div className="financial-item">
              <div className="financial-label">Amount Paid</div>
              <div className="financial-value">{formatCurrency(project.paid_amount)}</div>
            </div>
            <div className="financial-item">
              <div className="financial-label">Remaining Balance</div>
              <div className="financial-value">
                {formatCurrency(project.total_amount - (project.paid_amount || 0))}
              </div>
            </div>
          </div>

          {project.status === "Completed" && !project.isReview && (
            <button className="review-button" onClick={handleReviewClick}>
              Leave a Review
            </button>
          )}
        </>
      ) : (
        <div className="no-project">No project details found.</div>
      )}
    </div>
  );
}

export default ProjectOverview;