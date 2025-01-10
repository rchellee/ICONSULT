import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./AccountSettings.css";
import { IoMdArrowDropright } from "react-icons/io";
import image from "../../assets/image.png";


const AccountSettings = () => {
  const [clientDetails, setClientDetails] = useState(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [message, setMessage] = useState("");
  const clientId = localStorage.getItem("clientId");
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/clients/${clientId}`
        );
        if (response.ok) {
          const data = await response.json();
          setClientDetails(data);
        } else {
          setMessage("Failed to fetch client details.");
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
        setMessage("An unexpected error occurred.");
      }
    };
    fetchClientDetails();
  }, []);

  const sendVerificationCode = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8081/sendVerificationCode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: clientDetails.email_add,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setVerificationCode(data.code); // Simulated backend-generated code
        setCodeSent(true);
        setMessage("Verification code sent to your email.");
      } else {
        setMessage("Error sending verification code. Please try again.");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  const verifyCodeAndProceed = async () => {
    console.log("Sending email:", clientDetails.email_add);
    console.log("Sending code:", enteredCode);

    try {
      const response = await fetch("http://localhost:8081/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: clientDetails.email_add,
          code: enteredCode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsVerified(true);
        setOpenDialog(true); // Open the confirmation dialog
        setConfirmationMessage(
          "Verification successful. Are you sure you want to update the password?"
        );
      } else {
        setMessage(
          data.message || "Invalid verification code. Please try again."
        );
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  const handleDialogClose = (confirm) => {
    if (confirm) {
      handlePasswordChange(); // Proceed with password change if confirmed
    }
    setOpenDialog(false); // Close the dialog
  };

  // Handle Password Change with New Endpoint
  const handlePasswordChange = async (event) => {
    if (event) event.preventDefault();

    if (!isVerified) {
      setMessage("Please verify your email before updating the password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/updatePassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          newPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setIsUpdatingPassword(false);
        setNewPassword("");
        setConfirmPassword("");
        setCurrentPassword("");
        setCodeSent(false);
        setIsVerified(false);
        alert("Password successfully updated!");
      } else {
        alert("Error updating password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      alert("An unexpected error occurred.");
    }
  };
  
  

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="account-settings">
        <div className="content">
          <h2>Account Setting</h2>
          

                    <div className="imagee">
                      <img src={image} alt="image" className="account-settings-icon" />
                    </div>
          <div className="info-box">
            <h3>Basic Information</h3>
            <table>
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>
                    {clientDetails?.firstName} {clientDetails?.middleInitial}{" "}
                    {clientDetails?.lastName}
                  </td>
                </tr>
                <tr>
                  <td>Username</td>
                  <td className="no-bg">{clientDetails?.username}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="info-box">
            <h3>Contact Information</h3>
            <table>
              <tbody>
                <tr>
                  <td>Phone number</td>
                  <td>{clientDetails?.mobile_number}</td>
                </tr>
                <tr>
                  <td>Email Address</td>
                  <td>{clientDetails?.email_add}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="info-box">
            <h3>Addresses</h3>
            <table>
              <tbody>
                <tr>
                  <td>Home</td>
                  <td>{clientDetails?.address}</td>
                </tr>
                <tr>
                  <td>Company</td>
                  <td>Not Set</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="info-box">
  <h3>Password</h3>
  <p>Create Strong Password</p>
  <div
    className="password-section"
    onClick={() => setIsUpdatingPassword(true)} // Trigger password update form
  >
    <span className="password-field">*************************</span>
    <IoMdArrowDropright className="password-icon" />
  </div>
</div>



          {isUpdatingPassword ? (
            <form onSubmit={(e) => e.preventDefault()}>
              {!codeSent && (
                <>
                  <div>
                    <label>New Password:</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Confirm New Password:</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </>
              )}
              {!codeSent ? (
                <button type="button" onClick={sendVerificationCode}>
                  Submit
                </button>
              ) : (
                <>
                  <div>
                    <label>Enter Verification Code:</label>
                    <input
                      type="text"
                      value={enteredCode}
                      onChange={(e) => setEnteredCode(e.target.value)}
                    />
                  </div>
                  <button type="button" onClick={verifyCodeAndProceed}>
                    Submit
                  </button>
                </>
              )}
              {isVerified && (
                <button type="button" onClick={handlePasswordChange}>
                  Confirm Changes
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setIsUpdatingPassword(false);
                  setMessage("");
                  setCodeSent(false);
                  setIsVerified(false);
                  setNewPassword(""); // Clear password fields
                  setConfirmPassword(""); // Clear confirm password fields
                }}
              >
                Cancel
              </button>
              {message && <div className="message">{message}</div>}
            </form>
          ) : (
            <></> // Removed the Update Password button
          )}

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Confirm Changes</DialogTitle>
            <DialogContent>
              <Typography>{confirmationMessage}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => handleDialogClose(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={() => handleDialogClose(true)} color="primary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
