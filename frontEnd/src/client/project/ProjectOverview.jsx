import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./overview.css";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
}

function ProjectOverview({ projectId }) {
  const [project, setProject] = useState(null);
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
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Error fetching project details. Please try again later.");
        setIsLoading(false);
      });
  }, [projectId]);

  if (isLoading) return <p>Loading project overview...</p>;
  if (error) return <p className="error">{error}</p>;

  const remainingPayment = project ? project.totalPayment - project.downpayment : 0;

  const handlePaymentClick = () => {
    navigate("/payment", { state: { projectId, amount: remainingPayment } });
  };

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
              <strong>Payment Status:</strong> {project.paymentStatus}
            </span>
          </p>
          <p>
          <p className="description" style={{ marginTop: '-10px' }}>
              <strong>Description:</strong> {project.description}
            </p>

            <span className="project-due" >
              <strong>Project Due:</strong> {project.endDate ? formatDate(project.endDate) : "N/A"}
            
            </span>
          </p>
          {/* Updated Status row */}
          <p className="status-row" style={{ marginTop: '-10px' }}>
            <strong>Status:</strong> {project.status}
          </p>

          <table className="payment-table">
            <thead>
              <tr>
                <th>Contract Price</th>
                <th>Downpayment</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>₱ {project.contractPrice}.00</td>
                <td>₱ {project.downpayment}.00</td>
                <td>₱ {remainingPayment}.00</td>
              </tr>
            </tbody>
          </table>
          <div className="payment-button-container">
          {project.paymentStatus !== "Paid" && (
            <button
              onClick={handlePaymentClick}
              className="pay-now-button"
             
            >
              Pay Now
            </button>
          )}
          </div>

          {project.paymentStatus === "Paid" && project.status === "completed" && (
            <button
              onClick={handleReviewClick}
              style={{
                backgroundColor: "#007bff",
              }}
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
