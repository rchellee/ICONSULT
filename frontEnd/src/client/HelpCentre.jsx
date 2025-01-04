import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";

const HelpCentre = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null); // Tracks the expanded FAQ
  const [showMoreFAQs, setShowMoreFAQs] = useState(false); // To show/hide more FAQs
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/clientdashboard"); // Navigate back to /clientdashboard
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    console.log("Search query:", query);
    // Add functionality to handle search (e.g., filter FAQs, tutorials, etc.)
  };

  const handleFAQClick = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index); // Toggle the expanded FAQ
  };

  const handleViewMoreFAQs = () => {
    setShowMoreFAQs(!showMoreFAQs); // Toggle visibility of additional FAQs
  };

  return (
    <Container>
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginTop: 3 }}
        onClick={handleGoBack}
      >
        back
      </Button>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Help Centre
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 1 }}>
          Welcome to the Help Centre! Explore the sections below for assistance,
          or contact our support team for help.
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for help..."
          sx={{ marginBottom: 1 }}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* FAQ Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Frequently Asked Questions (FAQ)
              </Typography>
              <Typography variant="body2" gutterBottom>
                Find answers to the most commonly asked questions about our
                services, accounts, and more.
              </Typography>

              {/* Show the first two FAQs */}
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() => handleFAQClick(1)}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    1. How can I schedule a consultation with a consultant?
                  </Typography>
                  <IconButton>
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                {expandedFAQ === 1 && (
                  <Typography variant="body2" sx={{ marginLeft: 2 }}>
                    You can schedule a consultation by using the real-time
                    online scheduler within the app. Simply choose a date and
                    time that works best for you, and the consultant will be
                    notified.
                  </Typography>
                )}
              </Box>
              <Box sx={{ marginTop: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  onClick={() => handleFAQClick(2)}
                >
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    2. How do I track the progress of my project?
                  </Typography>
                  <IconButton>
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
                {expandedFAQ === 2 && (
                  <Typography variant="body2" sx={{ marginLeft: 2 }}>
                    You can track your project progress directly within the
                    app's project management module. You'll be able to see the
                    status of tasks, deadlines, and any updates from your
                    consultant.
                  </Typography>
                )}
              </Box>

              {/* Show more FAQs if the state is true */}
              {showMoreFAQs && (
                <>
                  <Box sx={{ marginTop: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      onClick={() => handleFAQClick(3)}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        3. How can I provide feedback on a project or service?
                      </Typography>
                      <IconButton>
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                    {expandedFAQ === 3 && (
                      <Typography variant="body2" sx={{ marginLeft: 2 }}>
                        After each consultation or project milestone, you’ll
                        receive a prompt to provide feedback. This helps ensure
                        that your expectations are met, and our services are
                        continuously improved.
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ marginTop: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      onClick={() => handleFAQClick(4)}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        4. How do I make a payment for services?
                      </Typography>
                      <IconButton>
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                    {expandedFAQ === 4 && (
                      <Typography variant="body2" sx={{ marginLeft: 2 }}>
                        Payments are securely processed via PayPal Sandbox.
                        You'll receive an invoice, and you can make a payment
                        directly within the app.
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ marginTop: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        cursor: "pointer",
                      }}
                      onClick={() => handleFAQClick(5)}
                    >
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        5. Can I share documents with my consultant through the
                        app?
                      </Typography>
                      <IconButton>
                        <ExpandMoreIcon />
                      </IconButton>
                    </Box>
                    {expandedFAQ === 5 && (
                      <Typography variant="body2" sx={{ marginLeft: 2 }}>
                        Yes, the app includes a document sharing feature, where
                        you can upload and access files relevant to your
                        projects or consultations.
                      </Typography>
                    )}
                  </Box>
                </>
              )}

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleViewMoreFAQs}
              >
                {showMoreFAQs ? "Hide FAQs" : "View More FAQs"}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Tutorials Section */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tutorials
              </Typography>
              <Typography variant="body2" gutterBottom>
                Learn how to use our features and make the most out of your
                experience.
              </Typography>
              <Button variant="contained" color="primary" fullWidth>
                Explore Tutorials
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Support */}
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Support
              </Typography>
              <Typography variant="body2" gutterBottom>
                Reach out to our support team for personalized assistance with
                your concerns.
              </Typography>
              <Button variant="contained" color="primary" fullWidth>
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: 6, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Need More Help?
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          We're here to assist you! Feel free to browse our resources or get in
          touch with us for any additional help.
        </Typography>
        <Button variant="contained" color="secondary">
          Chat with Support
        </Button>
      </Box>
    </Container>
  );
};

export default HelpCentre;
