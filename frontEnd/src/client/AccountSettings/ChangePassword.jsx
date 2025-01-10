import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ChangePassword = ({ clientDetails, setIsUpdatingPassword }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [message, setMessage] = useState("");
  const clientId = localStorage.getItem("clientId");

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
        setOpenDialog(true);
        setConfirmationMessage(
          "Verification successful. Are you sure you want to update your password?"
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

  const handlePasswordChange = async (event) => {
    if (event) event.preventDefault();

    if (!isVerified) {
      setMessage("Please verify your email before updating the password.");
      return;
    }

    console.log(clientId);

    try {
      const response = await fetch("http://localhost:8081/updateclientPassword", {
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
            setNewPassword("");
            setConfirmPassword("");
          }}
        >
          Cancel
        </button>
        {message && <div className="message">{message}</div>}
      </form>
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
  );
};

export default ChangePassword;
