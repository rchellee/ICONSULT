import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  TextField,
} from "@mui/material";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ClientReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filterRating, setFilterRating] = useState("all");
  const clientId = localStorage.getItem("clientId");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editReview, setEditReview] = useState(null);

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

  const handleEditClick = (review) => {
    setEditReview(review);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    const rating = parseInt(editReview?.rating, 10);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      alert("Rating must be a number between 1 and 5.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8081/reviews/${editReview.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editReview),
        }
      );
      if (response.ok) {
        setEditModalOpen(false);
        const updatedReviews = reviews.map((r) =>
          r.id === editReview.id ? editReview : r
        );
        setReviews(updatedReviews);
      } else {
        console.error("Failed to update review.");
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  // Filter reviews by client ID and rating
  const filteredReviews = reviews.filter(
    (review) =>
      review.client_id === parseInt(clientId) &&
      (filterRating === "all" || review.rating === parseInt(filterRating))
  );

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

  return (
    <div>
      <Topbar />
      <Sidebar />

      <div className="review-section">
        <Typography variant="h4" gutterBottom>
          My Reviews
        </Typography>

        <FormControl style={{ marginBottom: "20px", minWidth: 200 }}>
          <InputLabel>Rating</InputLabel>
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

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "white" }}>
                  <strong>Project</strong>
                </TableCell>
                <TableCell sx={{ color: "white" }}>
                  <strong>Rating</strong>
                </TableCell>
                <TableCell sx={{ color: "white" }}>
                  <strong>Comment</strong>
                </TableCell>
                <TableCell sx={{ color: "white" }}>
                  <strong>Date</strong>
                </TableCell>
                <TableCell
                  sx={{ color: "white" }}
                ></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{getProjectName(review.project_id)}</TableCell>
                    <TableCell>{review.rating}</TableCell>
                    <TableCell>{review.comment}</TableCell>
                    <TableCell>
                      {format(new Date(review.created_at), "MMMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleEditClick(review)}
                      >
                        <i className="fas fa-edit"></i>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No reviews available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            boxShadow: 24,
            borderRadius: 2,
            width: 400,
          }}
        >
          <Typography variant="h6">Edit Review</Typography>
          <TextField
            fullWidth
            label="Rating"
            type="number"
            value={editReview?.rating || ""}
            onChange={(e) =>
              setEditReview({ ...editReview, rating: e.target.value })
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Comment"
            value={editReview?.comment || ""}
            onChange={(e) =>
              setEditReview({ ...editReview, comment: e.target.value })
            }
            margin="normal"
          />
          <Button variant="contained" onClick={handleEditSubmit} sx={{ mt: 2 }}>
            Save
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ClientReviews;
