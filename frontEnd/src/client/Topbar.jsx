import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/");
  };

  const handleAccountClick = () => {
    setAnchorEl(null); // Close the menu
    navigate("/account-settings"); // Navigate to the account settings page
  };

  const handleHelpCentreClick = () => {
    setAnchorEl(null); // Close the menu
    navigate("/help-centre"); // Navigate to the help centre page
  };

  useEffect(() => {
    // Retrieve data from localStorage
    const clientId = localStorage.getItem("clientId");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (clientId && firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
    } else {
      console.warn(
        "No clientId, firstName, or lastName found in localStorage."
      );
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#061b38", height: "58px" }}
    >
      <Toolbar sx={{ minHeight: "60px" }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>
        <Typography variant="body1" sx={{ marginRight: 2 }}>
          {userName}
        </Typography>
        <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar alt={userName} src="/path/to/your/profile-pic.jpg" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleAccountClick}>Account</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          <MenuItem onClick={handleMenuClose}>Reviews</MenuItem>
          <MenuItem onClick={handleHelpCentreClick}>Help Centre</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
