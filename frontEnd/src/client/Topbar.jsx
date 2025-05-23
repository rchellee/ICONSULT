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
import logo from "../assets/logo3.png";
import { useMediaQuery } from "@mui/material";
import { IoIosSearch } from "react-icons/io";

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("Guest");
  const [userColor, setUserColor] = useState("#000000");
  const { searchTerm, setSearchTerm } = useContext(SearchContext);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 768px)");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    navigate("/");
  };

  const handleAccountClick = () => {
    setAnchorEl(null);
    navigate("/account-settings");
  };

  const handleReviewsClick = () => {
    setAnchorEl(null);
    navigate("/client-reviews");
  };

  const handleHelpCentreClick = () => {
    setAnchorEl(null);
    navigate("/help-centre");
  };

  useEffect(() => {
    const clientId = localStorage.getItem("clientId");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");

    if (clientId && firstName && lastName) {
      setUserName(`${firstName} ${lastName}`);
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      setUserColor(randomColor);
    } else {
      console.warn("No clientId, firstName, or lastName found in localStorage.");
    }
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      zIndex: 1100, 
      boxShadow: "0 1px 1px rgba(0,0,0,0.1)"
    }}>
      {!isSmallScreen && (
        <div style={{ minWidth: "150px" }}>
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
      )}

      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        margin: "0 20px",
        maxWidth: "800px"
      }}>
        <div style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          height: "50px",
          backgroundColor: "#f5f5f5",
          borderRadius: "40px",
          overflow: "hidden",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          alignItems: "center",
          padding: "0 15px"
        }}>
          <input
            type="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "16px",
              padding: "0 10px",
              color: "black"
            }}
          />
          <IoIosSearch style={{
            color: "#555",
            fontSize: "20px",
            minWidth: "24px"
          }} />
        </div>
      </div>

      <div
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
          fontWeight: "bold",
          minWidth: "40px"
        }}
        onClick={handleMenuOpen}
      >
        {getUserInitials(userName)}
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div style={{
          padding: "15px",
          display: "flex",
          alignItems: "center"
        }}>
          <img
            src={admin}
            alt={userName}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              marginRight: "10px",
              objectFit: "cover"
            }}
          />
          <h2 style={{
            fontSize: "16px",
            margin: 0,
            fontWeight: "500"
          }}>{userName}</h2>
        </div>
        <hr style={{ margin: 0 }} />
        <MenuItem onClick={handleAccountClick} style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 15px",
          minWidth: "200px"
        }}>
          <img
            src={profile}
            alt="Profile icon"
            style={{
              width: "20px",
              height: "20px",
              marginRight: "10px",
              objectFit: "contain"
            }}
          />
          <p style={{ margin: 0, flex: 1 }}>Edit Profile</p>
          <span style={{ color: "#999" }}>&gt;</span>
        </MenuItem>
        <MenuItem onClick={handleReviewsClick} style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 15px"
        }}>
          <img
            src={profile}
            alt="Feedback icon"
            style={{
              width: "20px",
              height: "20px",
              marginRight: "10px",
              objectFit: "contain"
            }}
          />
          <p style={{ margin: 0, flex: 1 }}>My Reviews</p>
          <span style={{ color: "#999" }}>&gt;</span>
        </MenuItem>
        <MenuItem onClick={handleHelpCentreClick} style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 15px"
        }}>
          <img
            src={help}
            alt="Help icon"
            style={{
              width: "20px",
              height: "20px",
              marginRight: "10px",
              objectFit: "contain"
            }}
          />
          <p style={{ margin: 0, flex: 1 }}>Help & Support</p>
          <span style={{ color: "#999" }}>&gt;</span>
        </MenuItem>
        <MenuItem onClick={handleLogout} style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 15px"
        }}>
          <img
            src={logout}
            alt="Logout icon"
            style={{
              width: "20px",
              height: "20px",
              marginRight: "10px",
              objectFit: "contain"
            }}
          />
          <p style={{ margin: 0, flex: 1 }}>Logout</p>
          <span style={{ color: "#999" }}>&gt;</span>
        </MenuItem>
      </Menu>
    </nav>
  );
};

export default Topbar;