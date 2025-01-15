import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
} from "@mui/material";
import { CiEdit } from "react-icons/ci";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./AdminAccount.css";
import password from "../../assets/password.png";

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
          setAdminDetails(data);
          setUpdatedDetails(data);
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
        <div className="content-admin">
          <div className="passwordd-admin">
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
                      Your Username is <span className="value-admin">{adminDetails.username}</span>
                    </p>
                  </div>
                  <div className="admin-detail-row">
                    <span className="label-admin">Email Address</span>
                    <p>
                      Your Email is <span className="value-admin">{adminDetails.email}</span>
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
                    style={{ marginTop: "10px" }} // Adjust the margin to move button up
                  >
                    <CiEdit /> UPDATE PROFILE
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
                    className="text-field"
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
                    className="text-field"
                  />
                  <div className="button-group">
                    <Button
                      variant="contained"
                      onClick={handleUpdate}
                      style={{ marginRight: "10px", marginTop: "20px" }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditMode(false)}
                      style={{ marginTop: "20px" }}
                    >
                      Cancel
                    </Button>
                  </div>
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
