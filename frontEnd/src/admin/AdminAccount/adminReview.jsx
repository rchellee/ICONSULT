import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Avatar,
  Rating,
  Link,
} from "@mui/material";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./adminReview.css";

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filterRating, setFilterRating] = useState("all");
  const [expandedReviewId, setExpandedReviewId] = useState(null); // State to track which review is expanded

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:8081/reviews");
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        } else {
          console.error("Failed to fetch reviews.");
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await fetch("http://localhost:8081/clients");
        if (response.ok) {
          const data = await response.json();
          setClients(data);
        } else {
          console.error("Failed to fetch clients.");
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:8081/project");
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error("Failed to fetch projects.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchReviews();
    fetchClients();
    fetchProjects();
  }, []);

  const filteredReviews =
    filterRating === "all"
      ? reviews
      : reviews.filter((review) => review.rating === parseInt(filterRating));

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client
      ? `${client.firstName.toUpperCase()} ${client.lastName.toUpperCase()}`
      : "UNKNOWN CLIENT";
  };

  const getProjectName = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    return project ? project.projectName.toUpperCase() : "UNKNOWN PROJECT";
  };

  const MAX_COMMENT_LENGTH = 150; // Limit for comment visibility

  // Function to toggle review expansion
  const toggleReadMore = (reviewId) => {
    setExpandedReviewId((prevId) => (prevId === reviewId ? null : reviewId));
  };

  return (
    <div>
      <Topbar />
      <Sidebar />

      <div className="review-admin">
        <FormControl
          style={{
            marginBottom: "20px",
            minWidth: 200,
            backgroundColor: "white",
          }}
        >
          <Select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="5">5 Stars</MenuItem>
            <MenuItem value="4">4 Stars</MenuItem>
            <MenuItem value="3">3 Stars</MenuItem>
            <MenuItem value="2">2 Stars</MenuItem>
            <MenuItem value="1">1 Star</MenuItem>
          </Select>
        </FormControl>

        <div className="reviews-admin-list">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => {
              const isExpanded = expandedReviewId === review.id;
              const displayComment =
                review.comment.length > MAX_COMMENT_LENGTH && !isExpanded
                  ? review.comment.substring(0, MAX_COMMENT_LENGTH) + "..."
                  : review.comment;

              return (
                <Paper
                  key={review.id}
                  elevation={7}
                  style={{
                    padding: "20px",
                    marginBottom: "15px",
                    maxWidth: "450px",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    height: "auto",
                    whiteSpace: "normal",
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                  >
                    {/* Rating and Date Section */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%"
                    >
                      <Box display="flex" alignItems="center">
                        <Rating
                          name="rating"
                          value={review.rating}
                          readOnly
                          precision={0.5}
                        />
                        <Typography
                          variant="body1"
                          style={{
                            marginTop: "10px",
                            marginLeft: "50px",
                            fontStyle: "italic",
                          }}
                        >
                          January 16, 2025
                        </Typography>
                      </Box>
                    </Box>

                    {/* User Information Section */}
                    <Box display="flex" alignItems="center" marginTop="10px">
                      <Avatar style={{ marginRight: "10px" }}>
                        {getClientName(review.client_id)
                          .split(" ")[0]
                          .charAt(0)}
                      </Avatar>
                      <Typography variant="body1">
                        <strong>{getClientName(review.client_id)}</strong>
                      </Typography>
                    </Box>

                    {/* Project Name Section */}
                    <Typography
                      variant="body1"
                      style={{ marginTop: "10px", marginLeft: "50px" }}
                    >
                      {getProjectName(review.project_id)}
                    </Typography>

                    {/* Review Comment Section */}
                    <Typography
                      variant="body1"
                      style={{
                        marginTop: "10px",
                        marginLeft: "50px",
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        maxWidth: "500px",
                      }}
                    >
                      <strong>{displayComment}</strong>
                      {review.comment.length > MAX_COMMENT_LENGTH &&
                        !isExpanded && (
                          <Link
                            component="button"
                            variant="body2"
                            onClick={() => toggleReadMore(review.id)}
                            style={{ marginLeft: "10px", cursor: "pointer" }}
                          >
                            Read More
                          </Link>
                        )}
                      {isExpanded && (
                        <Link
                          component="button"
                          variant="body2"
                          onClick={() => toggleReadMore(review.id)}
                          style={{ marginLeft: "10px", cursor: "pointer" }}
                        >
                          Show Less
                        </Link>
                      )}
                    </Typography>
                  </Box>
                </Paper>
              );
            })
          ) : (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              // Full height of the viewport
              width="90vw" // Full width of the viewport
            >
              <Typography variant="body1">No reviews available.</Typography>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReview;
