import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
  CircularProgress,
  Container,
  Stack,
  Paper,
  Fade,
} from "@mui/material";
import Sidebar from "../sidebar";
import Topbar from "../Topbar";
import { Star, StarBorder } from "@mui/icons-material";

function Review() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isMobile = useMediaQuery("(max-width:600px)");
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId, clientId } = location.state || {};

  const ratingLabels = {
    1: "Poor",
    2: "Fair",
    3: "Good",
    4: "Very Good",
    5: "Excellent",
  };

  const handleRatingChange = (newValue) => {
    setRating(newValue);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }
    if (comment.trim() === "") {
      setError("Please provide a comment.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:8081/reviews`, {
        projectId,
        clientId,
        rating,
        comment,
        status: "reviewed",
      });
      setSuccessMessage("Thank you for your review!");
      setError(null);
      setTimeout(() => navigate("/clientproject"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit the review. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
    }}>
      <Topbar />
      <Box sx={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Container maxWidth="sm" sx={{ 
          py: 4, 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "flex-start",
          mt: { xs: 3, sm: 0 },
        }}>
          <Fade in timeout={500}>
            <Paper elevation={3} sx={{ 
              p: isMobile ? 3 : 4,
              borderRadius: 4,
              background: "white",
              boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
              position: "relative",
              overflow: "hidden",
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 6,
                background: "linear-gradient(90deg, #716cff 0%, #D283FF 100%)",
              }
            }}>
              <Stack spacing={3} alignItems="center">
                {/* Header Section */}
                <Box textAlign="center">
                  <Star sx={{ 
                    fontSize: 48, 
                    color: "#FFD700",
                    mb: 1,
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                  }} />
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600,
                    color: "text.primary",
                    mb: 0.5,
                  }}>
                    Share Your Feedback
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    We value your honest opinion
                  </Typography>
                </Box>

                {/* Floating Stars Rating */}
                <Box sx={{ 
                  py: 2,
                  px: 3,
                  bgcolor: "rgba(113, 108, 255, 0.05)",
                  borderRadius: 3,
                  position: "relative",
                }}>
                  <Box sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1,
                  }}>
                    {[1, 2, 3, 4, 5].map((value) => {
                      const isFilled = value <= (hover !== -1 ? hover : rating);
                      return (
                        <Box
                          key={value}
                          component="span"
                          sx={{
                            cursor: "pointer",
                            fontSize: "2.8rem",
                            color: isFilled ? "#FFD700" : "#e0e0e0",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              transform: "scale(1.1)",
                              color: "#FFD700",
                            },
                            "& svg": {
                              filter: isFilled ? "drop-shadow(0 2px 4px rgba(255, 215, 0, 0.4))" : "none",
                            }
                          }}
                          onMouseEnter={() => setHover(value)}
                          onMouseLeave={() => setHover(-1)}
                          onClick={() => handleRatingChange(value)}
                        >
                          {isFilled ? (
                            <Star fontSize="inherit" />
                          ) : (
                            <StarBorder fontSize="inherit" />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                  <Typography variant="body1" sx={{ 
                    mt: 1,
                    textAlign: "center",
                    fontWeight: 500,
                    color: hover !== -1 ? "#716cff" : "text.secondary",
                  }}>
                    {ratingLabels[hover !== -1 ? hover : rating] || "Tap to rate"}
                  </Typography>
                </Box>

                {/* Feedback Form */}
                <Box component="form" onSubmit={handleSubmit} width="100%">
                  <Stack spacing={3}>
                    <TextField
                      label="Write your feedback"
                      multiline
                      rows={4}
                      fullWidth
                      value={comment}
                      onChange={handleCommentChange}
                      variant="outlined"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": {
                            borderColor: "#e0e0e0",
                          },
                          "&:hover fieldset": {
                            borderColor: "#716cff",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#716cff",
                            boxShadow: "0 0 0 2px rgba(113, 108, 255, 0.2)",
                          },
                        },
                      }}
                      placeholder="What did you like or what could we improve?"
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      fullWidth
                      sx={{
                        py: 1.8,
                        borderRadius: 2,
                        fontSize: "1rem",
                        fontWeight: 600,
                        textTransform: "none",
                        letterSpacing: 0.5,
                        background: "linear-gradient(90deg, #716cff 0%, #D283FF 100%)",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)",
                          background: "#716cff",
                        },
                        "&:active": {
                          transform: "translateY(0)",
                          background: "#5a55d1",
                        },
                        "&.Mui-disabled": {
                          background: "#e0e0e0",
                          color: "#9e9e9e",
                        }
                      }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Submit Your Review"
                      )}
                    </Button>
                  </Stack>
                </Box>
              </Stack>

              {/* Notifications */}
              {error && (
                <Snackbar
                  open={!!error}
                  autoHideDuration={6000}
                  onClose={() => setError(null)}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                  </Alert>
                </Snackbar>
              )}
              
              {successMessage && (
                <Snackbar
                  open={!!successMessage}
                  autoHideDuration={4000}
                  onClose={() => setSuccessMessage(null)}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <Alert severity="success" onClose={() => setSuccessMessage(null)}>
                    {successMessage}
                  </Alert>
                </Snackbar>
              )}
            </Paper>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
}

export default Review;