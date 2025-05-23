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
  useMediaQuery,
  useTheme,
  IconButton,
  Grid,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "@fortawesome/fontawesome-free/css/all.min.css";
import EditIcon from "@mui/icons-material/Edit";

const ClientReviews = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  
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

  const renderStars = (rating) => {
    return (
      <Box display="flex" alignItems="center">
        {[...Array(5)].map((_, i) => (
          <Typography
            key={i}
            color={i < rating ? "gold" : "text.secondary"}
            fontSize={isMobile ? "1rem" : "1.25rem"}
          >
            ★
          </Typography>
        ))}
        {!isMobile && <Typography ml={1}>({rating})</Typography>}
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Topbar />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${theme.spacing(8)})` },
            marginLeft: { sm: `${theme.spacing(8)}` },
          }}
        >
          {/*<Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
            My Reviews
          </Typography>*/}

          <FormControl style={{ marginBottom: "20px", minWidth: isMobile ? "100%" : 200 }}>
            {/*<InputLabel>Rating</InputLabel>*/}
            <Select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              size={isMobile ? "small" : "medium"}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="5">5 Stars</MenuItem>
              <MenuItem value="4">4 Stars</MenuItem>
              <MenuItem value="3">3 Stars</MenuItem>
              <MenuItem value="2">2 Stars</MenuItem>
              <MenuItem value="1">1 Star</MenuItem>
            </Select>
          </FormControl>

          {isMobile || isTablet ? (
            <Grid container spacing={2}>
              {filteredReviews.length > 0 ? (
                filteredReviews.map((review) => (
                  <Grid item xs={12} key={review.id}>
                    <Card>
                      <CardContent>
                        <Stack spacing={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {getProjectName(review.project_id)}
                          </Typography>
                          {renderStars(review.rating)}
                          <Typography variant="body2">
                            {review.comment}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {format(new Date(review.created_at), "MMMM dd, yyyy")}
                          </Typography>
                          <Box>
                            <IconButton
                              color="primary"
                              onClick={() => handleEditClick(review)}
                              size="small"
                            >
                              <EditIcon fontSize={isMobile ? "small" : "medium"} />
                            </IconButton>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Typography align="center">No reviews available.</Typography>
                </Grid>
              )}
            </Grid>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                    <TableCell sx={{ color: "black" }}>
                      <strong>Project</strong>
                    </TableCell>
                    <TableCell sx={{ color: "black" }}>
                      <strong>Rating</strong>
                    </TableCell>
                    <TableCell sx={{ color: "black" }}>
                      <strong>Comment</strong>
                    </TableCell>
                    <TableCell sx={{ color: "black" }}>
                      <strong>Date</strong>
                    </TableCell>
                    <TableCell sx={{ color: "black" }}></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>{getProjectName(review.project_id)}</TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell>{review.comment}</TableCell>
                        <TableCell>
                          {format(new Date(review.created_at), "MMMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(review)}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
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
          )}
        </Box>
      </Box>

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
            width: isMobile ? "90%" : 400,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Review
          </Typography>
          <TextField
            fullWidth
            label="Rating"
            type="number"
            value={editReview?.rating || ""}
            onChange={(e) =>
              setEditReview({ ...editReview, rating: e.target.value })
            }
            margin="normal"
            inputProps={{ min: 1, max: 5 }}
          />
          <TextField
            fullWidth
            label="Comment"
            value={editReview?.comment || ""}
            onChange={(e) =>
              setEditReview({ ...editReview, comment: e.target.value })
            }
            margin="normal"
            multiline
            rows={4}
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setEditModalOpen(false)}
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleEditSubmit}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ClientReviews;