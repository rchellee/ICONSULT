import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import  "./review.css";



function Review() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  // const { projectId, clientId } = location.state || {};
  const { projectId = 1, clientId = 1 } = location.state || {};

  if (!projectId || !clientId) {
    return (
      <Typography variant="h6">
        Project or Client ID is missing. Unable to submit a review.
      </Typography>
    );
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
    <div>
      <Topbar />
      <Box display="flex">
        <Sidebar />
        <Box
          flex="1"
          p={4}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bgcolor="#f9f9f9"
          minHeight="100vh"
        >
          <Typography 
          variant="h4" 
          gutterBottom
          sx={{ mt: -20, fontWeight: "bold" }} 
       
          className="leave-review-title"
          >
            Leave a Review
          </Typography>
          {error && (
            <Snackbar
              open
              autoHideDuration={4000}
              onClose={() => setError(null)}
            >
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </Snackbar>
          )}
          {successMessage && (
            <Snackbar
              open
              autoHideDuration={4000}
              onClose={() => setSuccessMessage(null)}
            >
              <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                {successMessage}
              </Alert>
            </Snackbar>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            className="review-form-box" 
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              width: "100%",
              maxWidth: 800,
              mt: 5,
              p: 3,
              backgroundColor: "#ffff",
              borderRadius: 2,
              boxShadow: "#fff",
            }}
          >
            <Typography variant="h6" align="center">
              How was the service?
            </Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              className="custom-rating"
              size="large"
              sx={{ alignSelf: "center" }}
            />
            <TextField
              label="Write your comment"
              multiline
              rows={8}
              variant="outlined"
              fullWidth
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write here..."
              required
              className="comment-review-box"
            />
            <button
              type="submit"
              variant="contained"
              color="primary"
              className="submit-review-button"
              sx={{ alignSelf: "center", py: 1.5, px: 4 }}
            >
              Submit Review
            </button>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Review;
