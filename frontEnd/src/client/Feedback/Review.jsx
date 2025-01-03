import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../sidebar";

function Review() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, clientId } = location.state || {};

  if (!projectId || !clientId) {
    return <p>Project or Client ID is missing. Unable to submit a review.</p>;
  }

  const handleRatingChange = (event) => {
    setRating(Number(event.target.value));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (rating === 0 || comment.trim() === "") {
      setError("Please provide a rating and a comment.");
      return;
    }
    axios
      .post(`http://localhost:8081/reviews`, {
        projectId,
        clientId,
        rating,
        comment,
        status: "reviewed",
      })
      .then((response) => {
        setSuccessMessage("Thank you for your review!");
        setError(null);
        setRating(0);
        setComment("");
        setTimeout(() => navigate("/clientproject"), 3000); // Redirect after 3 seconds
      })
      .catch((err) => {
        setError("Failed to submit the review. Please try again later.");
      });
  };

  return (
    <div className="review-container">
      <Sidebar />
      <h2>Leave a Review</h2>
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="rating">Rating (1 to 5):</label>
          <select
            id="rating"
            value={rating}
            onChange={handleRatingChange}
            required
          >
            <option value={0}>Select Rating</option>
            <option value={1}>1 - Poor</option>
            <option value={2}>2 - Fair</option>
            <option value={3}>3 - Good</option>
            <option value={4}>4 - Very Good</option>
            <option value={5}>5 - Excellent</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            value={comment}
            onChange={handleCommentChange}
            placeholder="Write your review here..."
            required
          ></textarea>
        </div>
        <button type="submit" style={{ marginTop: "20px" }}>
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default Review;
