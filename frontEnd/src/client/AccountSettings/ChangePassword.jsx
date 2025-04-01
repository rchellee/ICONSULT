import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 500,
  margin: "auto",
  marginTop: theme.spacing(2),
  border: 'none',       
  boxShadow: 'none',
  
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginRight: theme.spacing(1),
}));

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
  const [isLoading, setIsLoading] = useState(false);
  const clientId = localStorage.getItem("clientId");

  const sendVerificationCode = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setIsLoading(true);
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
        setVerificationCode(data.code);
        setCodeSent(true);
        setMessage("Verification code sent to your email.");
      } else {
        setMessage("Error sending verification code. Please try again.");
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCodeAndProceed = async () => {
    if (!enteredCode) {
      setMessage("Please enter the verification code");
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleDialogClose = (confirm) => {
    if (confirm) {
      handlePasswordChange();
    }
    setOpenDialog(false);
  };

  const handlePasswordChange = async (event) => {
    if (event) event.preventDefault();

    if (!isVerified) {
      setMessage("Please verify your email before updating the password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8081/updateclientPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientId,
            newPassword,
          }),
        }
      );

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3, marginTop: '-200px' }}>
      <StyledPaper elevation={0}>
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>

        {message && (
          <Alert severity={isVerified ? "success" : "error"} sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}

        <Box component="form" onSubmit={(e) => e.preventDefault()}>
          {!codeSent ? (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                error={newPassword !== confirmPassword && confirmPassword !== ""}
                helperText={
                  newPassword !== confirmPassword && confirmPassword !== ""
                    ? "Passwords don't match"
                    : ""
                }
              />
              <Box sx={{ mt: 2 }}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={sendVerificationCode}
                  disabled={isLoading || newPassword !== confirmPassword}
                  sx={{ 
                    width: '150px', 
                    backgroundColor: '#716cff;', 
                  '&:hover': {
                      backgroundColor: '#5a55e0;', 
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Send Code"}
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  onClick={() => {
                    setIsUpdatingPassword(false);
                    setMessage("");
                    setCodeSent(false);
                    setIsVerified(false);
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  sx={{
                    '&:hover': {
                      color: 'white',       
                      borderColor: '#716cff;', 
                      backgroundColor: '#716cff;'
                    },
                  }}
                >
                  Cancel
                </StyledButton>
              </Box>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Verification Code"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                required
              />
              <Box sx={{ mt: 2 }}>
                <StyledButton
                  variant="contained"
                  color="primary"
                  onClick={verifyCodeAndProceed}
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Verify Code"}
                </StyledButton>
                <StyledButton
                  variant="outlined"
                  onClick={() => {
                    setCodeSent(false);
                    setMessage("");
                  }}
                >
                  Back
                </StyledButton>
              </Box>
            </>
          )}
        </Box>
      </StyledPaper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Password Change</DialogTitle>
        <DialogContent>
          <Typography>{confirmationMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogClose(false)}>Cancel</Button>
          <Button
            onClick={() => handleDialogClose(true)}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChangePassword;