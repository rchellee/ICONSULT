import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      <h2>Project Overview</h2>
      {project ? (
        <div>
          <p><strong>Project Name:</strong> {project.projectName}</p>
          <p><strong>Description:</strong> {project.description}</p>
          <p><strong>Contract Price:</strong> ₱{project.contractPrice}.00</p>
          <p><strong>Downpayment:</strong> ₱{project.downpayment}.00</p>
          <p><strong>To be Paid:</strong> ₱{remainingPayment}.00</p>
          <p><strong>Payment Status:</strong> {project.paymentStatus}</p>
          <p><strong>Project Due:</strong> {project.endDate ? formatDate(project.endDate) : "N/A"}</p>
          <p><strong>Status:</strong> {project.status}</p>
          {project.paymentStatus !== "Paid" && (
            <button
              onClick={handlePaymentClick}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Pay Now
            </button>
          )}
          {project.paymentStatus === "Paid" && project.status === "completed" && (
            <button
              onClick={handleReviewClick}
              style={{
                marginTop: "20px",
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
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
