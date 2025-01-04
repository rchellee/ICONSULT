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
import client from "../assets/admin.jpg";
import logo from "../assets/logo2.png";

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
      sx={{ backgroundColor: "#f3f3f3", height: "58px", borderBottom: "1px solid #d1d1d1" }}
    >
      <Toolbar sx={{ minHeight: "60px" }}>
        <Typography variant="h7" sx={{ flexGrow: 1 }} >
          {" "}
          <div className="logo-topbar">
            <img src={logo} alt="Logo" className="logo-topbar-img" />
          </div>
        </Typography>
        <Typography variant="body1" sx={{ marginRight: 2 }} color="#143d58">
          {userName}
        </Typography>
        <IconButton onClick={handleMenuOpen} color="#0056b3">
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
