import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./AdminAccount.css";

const AdminAccount = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const adminId = 1; // Replace with the actual admin ID you want to fetch
        const response = await fetch(`http://localhost:8081/admins/${adminId}`);
        if (response.ok) {
          const data = await response.json();
          setAdminDetails(data); // Admin details fetched as an object
          setUpdatedDetails(data); // Set for editing
        } else {
          setMessage("Failed to fetch admin details.");
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
        setMessage("An unexpected error occurred.");
      }
    };    
    fetchAdminDetails();
  }, []);

  const handleUpdate = async () => {
    try {
      const response = await fetch("http://localhost:8081/admins/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDetails),
      });

      if (response.ok) {
        setMessage("Admin details updated successfully.");
        setEditMode(false);
        const updatedData = await response.json();
        setAdminDetails(updatedDetails);
      } else {
        setMessage("Failed to update admin details.");
      }
    } catch (error) {
      console.error("Error updating admin details:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <Topbar />
      <Sidebar />

      <div className="account-settings">
        <div className="content">
          <h2>Admin Account Settings</h2>
          {adminDetails ? (
            <div>
              {!editMode ? (
                <>
                  <p>
                    <strong>Username:</strong> {adminDetails.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {adminDetails.email}
                  </p>
                  <Button variant="contained" onClick={() => setEditMode(true)}>
                    Edit
                  </Button>
                </>
              ) : (
                <div>
                  <TextField
                    label="Username"
                    value={updatedDetails.username || ""}
                    onChange={(e) =>
                      setUpdatedDetails({
                        ...updatedDetails,
                        username: e.target.value,
                      })
                    }
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Email"
                    value={updatedDetails.email || ""}
                    onChange={(e) =>
                      setUpdatedDetails({
                        ...updatedDetails,
                        email: e.target.value,
                      })
                    }
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    value={updatedDetails.password || ""}
                    onChange={(e) =>
                      setUpdatedDetails({
                        ...updatedDetails,
                        password: e.target.value,
                      })
                    }
                    fullWidth
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
                    style={{ marginRight: "10px" }}
                  >
                    Save
                  </Button>
                  <Button variant="outlined" onClick={() => setEditMode(false)}>
                    Cancel
                  </Button>
                </div>
              )}
              {message && <p>{message}</p>}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAccount;
