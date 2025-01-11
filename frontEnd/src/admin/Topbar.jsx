import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Typography,
} from "@mui/material";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../components/SearchProvider"; // Import the context
import logo from "../assets/logo2.png";
import "./topbar.css";

const Topbar = () => {
  const [adminUsername, setAdminUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("");
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const adminId = localStorage.getItem("adminId");
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    const username = localStorage.getItem("username");

    if (adminId && username) {
      setUserName(`${username}`);
    } else {
      console.warn("No adminId, or username found in localStorage.");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    navigate("/");
  };

  const handleAccountClick = () => {
    setAnchorEl(null); // Close the menu
    navigate("/admin-settings"); // Navigate to the account settings page
  };

  const handleReviewClick = () => {
    setAnchorEl(null); // Close the menu
    navigate("/admin-reviews"); // Navigate to the account settings page
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
  position="static"
  sx={{
    backgroundColor: "#f3f3f3",
    height: "58px",
    borderBottom: "1px solid #d1d1d1",
  }}
>
  <Toolbar sx={{ minHeight: "60px" }}>

    {/* Home Icon */}
    <AiFillHome className="home-topbar-icon" />

    {/* Logo */}
    <Typography variant="h7" sx={{ flexGrow: 1 }}>
      <div className="logo-topbar">
        <img src={logo} alt="Logo" className="logo-topbar-img" />
      </div>
    </Typography>

    {/* Search Box */}
    <div className="search-box-container">
      <input
        type="text"
        className="search-box-topbar"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <Typography variant="body1" color="#143d58">
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
      <MenuItem onClick={handleReviewClick}>Reviews</MenuItem>
    </Menu>
  </Toolbar>
</AppBar>

  );
};

export default Topbar;
