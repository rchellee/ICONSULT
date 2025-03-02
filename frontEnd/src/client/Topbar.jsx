import React, { useState, useEffect, useContext } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../components/SearchProvider";
import help from "../assets/help.png";
import logout from "../assets/logout.png";
import profile from "../assets/profile.png";
import admin from "../assets/admin.jpg";
import "./topbar.css";

const Topbar = () => {
  const [menuActive, setMenuActive] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("Guest");
  const [userColor, setUserColor] = useState("#000000");
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
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

  const handleReviewsClick = () => {
    setAnchorEl(null); // Close the menu
    navigate("/client-reviews"); // Navigate to the help centre page
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
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`;
      setUserColor(randomColor);
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
    <nav>
      <div className="logo">iConsult.</div>
      <div className="search-icon" onClick={handleSearchClick}>
        <span className="fas fa-search"></span>
      </div>
      <div
        className={`cancel-icon ${menuActive || searchActive ? "show" : ""}`}
        onClick={handleCancelClick}
      >
        <span className="fas fa-times"></span>
      </div>
      <form className={`${searchActive ? "active" : ""}`} action="#">
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
          color: "#fff",
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
            <img alt={`${userName}'s avatar`} src={admin} />
            <h2>{userName}</h2>
          </div>
          <hr />
          <MenuItem onClick={handleAccountClick} class="sub-menu-link">
            <img alt="Edit Profile Icon" src={profile} />
            <p>Edit Profile</p>
            <span>&gt;</span>
          </MenuItem>
          <MenuItem onClick={handleReviewsClick} class="sub-menu-link">
            <img alt="Feedback Icon" src={profile} />
            <p>My Reviews</p>
            <span>&gt;</span>
          </MenuItem>
          <MenuItem onClick={handleHelpCentreClick} class="sub-menu-link">
            <img alt="Help & Support Icon" src={help} />
            <p>Help & Support</p>
            <span>&gt;</span>
          </MenuItem>
          <MenuItem onClick={handleLogout} class="sub-menu-link">
            <img alt="Logout Icon" src={logout} />
            <p>Logout</p>
            <span>&gt;</span>
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Topbar;
