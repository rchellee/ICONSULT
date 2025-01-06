import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./AdminAccount.css";

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filterRating, setFilterRating] = useState("all");

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

  // Filter reviews by rating
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

  return (
    <div>
      <Topbar />
      <Sidebar />

      <div className="review-section">
        <Typography variant="h4" gutterBottom>
          Client Reviews
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
                <TableCell>
                  <strong>Client</strong>
                </TableCell>
                <TableCell>
                  <strong>Project</strong>
                </TableCell>
                <TableCell>
                  <strong>Rating</strong>
                </TableCell>
                <TableCell>
                  <strong>Comment</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>{getClientName(review.client_id)}</TableCell>
                    <TableCell>{getProjectName(review.project_id)}</TableCell>
                    <TableCell>{review.rating}</TableCell>
                    <TableCell>{review.comment}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No reviews available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default AdminReview;
