import React, { useState, useEffect, useContext } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { SearchContext } from "../components/SearchProvider";
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "@mui/material";
import "./topbar.css";
import help from "../assets/help.png";
import logout from "../assets/logout.png";
import profile from "../assets/profile.png";
import admin from "../assets/admin.jpg";
import logo from "../assets/logo3.png";
import { IoIosSearch } from "react-icons/io";

const Topbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("Guest");
  const [userColor, setUserColor] = useState("#000000");
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    const username = localStorage.getItem("username");

    if (adminId && username) {
      setUserName(`${username}`);
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`;
      setUserColor(randomColor);
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
    setAnchorEl(null); 
    navigate("/admin-settings"); 
  };

  const handleReviewClick = () => {
    setAnchorEl(null); 
    navigate("/admin-reviews"); 
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCancelClick = () => {
    setMenuActive(false);
    setSearchActive(false);
  };

  const handleSearchClick = () => {
    setSearchActive(true);
    setMenuActive(false);
  };
  const getUserInitials = (name) => {
    const parts = name.split(" ");
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name[0].toUpperCase();
  };

  return (
    <nav style={{ 
      backgroundColor: "#fff",
      height: "80px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 1px rgba(0,0,0,0.1)"
    }}>
      <div className="logo">
        <img 
          src={logo} 
          alt="iConsult Logo" 
          style={{
            height: "40px", 
            width: "auto", 
            objectFit: "contain"
          }}
        />
      </div>
      <div className="search-icon" onClick={handleSearchClick}>
        <span className="fas fa-search"></span>
      </div>
      <div
        className={`cancel-icon ${menuActive || searchActive ? "show" : ""}`}
        onClick={handleCancelClick}
      >
        <span className="fas fa-times"></span>
      </div>
      <form className={`search-form ${searchActive ? "active gradient-border" : ""}`}>
        <input
          type="search"
          className="search-data"
          placeholder="Search"
          required
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      {/* <div className="logo">{userName}</div> */}
      <div
        className="user-pic"
        style={{
          backgroundColor: userColor,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#ccc",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          fontSize: "16px",
          cursor: "pointer",
        }}
        onClick={handleMenuOpen}
      >
        {getUserInitials(userName)}
      </div>
      <div className="sub-menu-wrap">
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <div className="user-info">
            <img alt={userName} src={admin} />
            <h2>{userName}</h2>
          </div>
          <hr />
          <MenuItem onClick={handleAccountClick} className="sub-menu-link">
            <img src={profile} alt="Profile icon" />
            <p>Edit Profile</p>
            <span>&gt;</span>
          </MenuItem>
          <MenuItem onClick={handleReviewClick} className="sub-menu-link">
            <img src={profile} alt="Feedback icon" />
            <p>Feedbacks</p>
            <span>&gt;</span>
          </MenuItem>
          <MenuItem onClick={handleReviewClick} className="sub-menu-link">
            <img src={help} alt="Help icon" />
            <p>Help & Support</p>
            <span>&gt;</span>
          </MenuItem>
          <MenuItem onClick={handleLogout} className="sub-menu-link">
            <img src={logout} alt="Logout icon" />
            <p>Logout</p>
            <span>&gt;</span>
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Topbar;
