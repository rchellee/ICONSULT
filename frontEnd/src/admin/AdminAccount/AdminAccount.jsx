import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
} from "@mui/material";
import { CiEdit } from "react-icons/ci";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./AdminAccount.css";
import password from "../../assets/passimg.png";

const AdminAccount = () => {
  const [adminDetails, setAdminDetails] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({});
  const [message, setMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const adminId = 1; // Replace with the actual admin ID you want to fetch
        const response = await fetch(`http://localhost:8081/admins/${adminId}`);
        if (response.ok) {
          const data = await response.json();
          setAdminDetails(data);
          setUpdatedDetails(data);
        } else {
          setMessage("Failed to fetch admin details.");
          setOpenDialog(true);
        }
      } catch (error) {
        console.error("Error fetching admin details:", error);
        setMessage("An unexpected error occurred.");
        setOpenDialog(true);
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
        setAdminDetails(updatedDetails);
      } else {
        setMessage("Failed to update admin details.");
      }
      setOpenDialog(true);
    } catch (error) {
      console.error("Error updating admin details:", error);
      setMessage("An unexpected error occurred.");
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="account-settings">
        <div className="content-admin">
          <div className="password-admin">
            <img
              src={password}
              alt="password"
              className="password-image-admin"
            />
          </div>
          <h2>Account Settings</h2>
          {adminDetails ? (
            <div>
              {!editMode ? (
                <>
                  <div className="admin-detail-row">
                    <span className="label-admin">Username</span>
                    <p>
                      <span className="value-admin">
                        {adminDetails.username}
                      </span>
                    </p>
                  </div>
                  <div className="admin-detail-row">
                    <span className="label-admin">Email Address</span>
                    <p>
                      <span className="value-admin">{adminDetails.email}</span>
                    </p>
                  </div>
                  <div className="admin-detail-row">
                    <span className="label-admin">Password</span>
                    <p>
                      <span className="value-admin">**********</span>
                    </p>
                  </div>
                  <Button
                    variant="contained"
                    onClick={() => setEditMode(true)}
                    style={{ marginTop: "10px" }}
                  >
                    <CiEdit /> UPDATE PROFILE
                  </Button>
                </>
              ) : (
                <div className="update-form">
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
                    variant="outlined"
                    className="text-field"
                  />
                  <TextField
                    label="Email Address"
                    
                    value={updatedDetails.email || ""}
                    onChange={(e) =>
                      setUpdatedDetails({
                        ...updatedDetails,
                        email: e.target.value,
                      })
                    }
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    className="text-field"
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
                    variant="outlined"
                    className="text-field"
                  />
                  <div className="button-group">
                    <Button
                      variant="contained"
                      onClick={handleUpdate}
                      className="save-button"
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                      className="cancel-button"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {message.startsWith("Failed") || message.startsWith("An unexpected")
            ? "Error"
            : "Success"}
        </DialogTitle>
        <DialogContent>
          <p>{message}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminAccount;