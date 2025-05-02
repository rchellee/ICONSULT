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
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ArrowBack, CheckCircle, Email } from "@mui/icons-material";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 500,
  margin: "auto",
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginRight: theme.spacing(1),
  minWidth: 120,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginRight: 0,
    marginBottom: theme.spacing(1)
  }
}));

const PasswordStrengthIndicator = styled(Box)(({ strength, theme }) => {
  const colors = {
    weak: theme.palette.error.main,
    medium: theme.palette.warning.main,
    strong: theme.palette.success.main
  };
  
  return {
    height: 4,
    borderRadius: 2,
    width: `${strength}%`,
    backgroundColor: strength < 40 ? colors.weak : 
                    strength < 70 ? colors.medium : colors.strong,
    marginTop: theme.spacing(0.5),
    transition: 'all 0.3s ease'
  };
});

const steps = ['Enter New Password', 'Verify Email', 'Confirm Change'];

//const ChangePassword = ({ clientDetails, setIsUpdatingPassword, onSuccess }) => {
  const ChangePassword = ({ clientDetails, onSuccess, onCancel }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Form state
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
    currentPassword: "",
    verificationCode: "",
    enteredCode: ""
  });
  
  // UI state
  const [activeStep, setActiveStep] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState({ text: "", severity: "info" });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const clientId = localStorage.getItem("clientId");

  // Handle form field changes
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Calculate password strength when new password changes
    if (field === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length > 0) strength += 10;
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 10;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 10;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    // Common password check (simplified)
    const commonPasswords = ['password', '123456', 'qwerty'];
    if (!commonPasswords.includes(password.toLowerCase())) strength += 10;
    
    setPasswordStrength(Math.min(strength, 100));
  };

  const sendVerificationCode = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match!", severity: "error" });
      return;
    }

    if (passwordStrength < 50) {
      setMessage({ text: "Please choose a stronger password", severity: "warning" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8081/sendVerificationCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clientDetails.email_add })
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, verificationCode: data.code }));
        setCodeSent(true);
        setActiveStep(1);
        setMessage({ 
          text: `Verification code sent to ${clientDetails.email_add}`, 
          severity: "success" 
        });
      } else {
        setMessage({ 
          text: "Error sending verification code. Please try again.", 
          severity: "error" 
        });
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
      setMessage({ 
        text: "An unexpected error occurred.", 
        severity: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCodeAndProceed = async () => {
    if (!formData.enteredCode) {
      setMessage({ text: "Please enter the verification code", severity: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8081/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: clientDetails.email_add,
          code: formData.enteredCode
        })
      });

      const data = await response.json();
      if (response.ok) {
        setIsVerified(true);
        setActiveStep(2);
        setOpenDialog(true);
        setMessage({ 
          text: "Verification successful!", 
          severity: "success" 
        });
      } else {
        setMessage({ 
          text: data.message || "Invalid verification code. Please try again.", 
          severity: "error" 
        });
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setMessage({ 
        text: "An unexpected error occurred.", 
        severity: "error" 
      });
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

  const handlePasswordChange = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8081/updateclientPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          newPassword: formData.newPassword
        })
      });

      if (response.ok) {
        const data = await response.json();
        onSuccess();
        setMessage({ text: data.message, severity: "success" });
        resetForm();
      } else {
        setMessage({ 
          text: "Error updating password. Please try again.", 
          severity: "error" 
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage({ 
        text: "An unexpected error occurred.", 
        severity: "error" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      newPassword: "",
      confirmPassword: "",
      currentPassword: "",
      verificationCode: "",
      enteredCode: ""
    });
    setActiveStep(0);
    setCodeSent(false);
    setIsVerified(false);
    setPasswordStrength(0);
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    } else {
      onCancel(); // Changed from setIsUpdatingPassword(false) to onCancel()
    }
    setMessage({ text: "", severity: "info" });
  };

  const getPasswordStrengthText = () => {
    if (formData.newPassword.length === 0) return "";
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 70) return "Medium";
    return "Strong";
  };

  return (
    <Box sx={{ 
      padding: isMobile ? 2 : 3, 
      maxWidth: 600, 
      margin: 'auto',
      marginTop: isMobile ? 0 : 'auto',
      marginLeft: 'auto',
    }}>
      <StyledPaper elevation={isMobile ? 0 : 3}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={handleBack} sx={{ mr: 1 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h5" component="h1">
            Change Password
          </Typography>
        </Box>

        {message.text && (
          <Alert severity={message.severity} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{isMobile ? '' : label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box component="form" onSubmit={(e) => e.preventDefault()}>
          {activeStep === 0 && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="New Password"
                type="password"
                value={formData.newPassword}
                onChange={handleChange('newPassword')}
                required
                helperText="Minimum 8 characters with uppercase, lowercase, number and symbol"
              />
              <PasswordStrengthIndicator strength={passwordStrength} />
              <Typography variant="caption" color="textSecondary">
                {getPasswordStrengthText()}
              </Typography>
              
              <TextField
                fullWidth
                margin="normal"
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
                error={formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== ""}
                helperText={
                  formData.newPassword !== formData.confirmPassword && formData.confirmPassword !== ""
                    ? "Passwords don't match"
                    : ""
                }
              />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                mt: 3
              }}>
                <StyledButton
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    order: isMobile ? 2 : 1,
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider,
                    '&:hover': {
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  Cancel
                </StyledButton>
                
                <StyledButton
                  variant="contained"
                  onClick={sendVerificationCode}
                  disabled={isLoading || 
                    formData.newPassword !== formData.confirmPassword || 
                    passwordStrength < 50}
                  sx={{ 
                    order: 1,
                    mb: isMobile ? 2 : 0,
                    background: 'linear-gradient(45deg, #716cff 30%, #9d9aff 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a55e0 30%, #7d79ff 90%)'
                    },
                    '&.Mui-disabled': {
                      background: theme.palette.action.disabledBackground
                    }
                  }}
                  startIcon={<Email />}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Send Code"}
                </StyledButton>
              </Box>
            </>
          )}

          {activeStep === 1 && (
            <>
              <Alert severity="info" icon={false} sx={{ mb: 2 }}>
                We've sent a 6-digit code to <strong>{clientDetails.email_add}</strong>. 
                Please check your inbox and enter it below.
              </Alert>
              
              <TextField
                fullWidth
                margin="normal"
                label="Verification Code"
                value={formData.enteredCode}
                onChange={handleChange('enteredCode')}
                required
                inputProps={{ maxLength: 6 }}
              />
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                flexDirection: isMobile ? 'column' : 'row',
                mt: 3
              }}>
                <StyledButton
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    order: isMobile ? 2 : 1,
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.divider
                  }}
                >
                  Back
                </StyledButton>
                
                <StyledButton
                  variant="contained"
                  onClick={verifyCodeAndProceed}
                  disabled={isLoading || formData.enteredCode.length < 6}
                  sx={{ 
                    order: 1,
                    mb: isMobile ? 2 : 0,
                    background: 'linear-gradient(45deg, #716cff 30%, #9d9aff 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a55e0 30%, #7d79ff 90%)'
                    }
                  }}
                  startIcon={<CheckCircle />}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Verify Code"}
                </StyledButton>
              </Box>
            </>
          )}
        </Box>
      </StyledPaper>

      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirm Password Change</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            You are about to change your password. This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Make sure you've saved your new password in a secure place.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => handleDialogClose(false)}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDialogClose(true)}
            color="primary"
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {isLoading ? "Updating..." : "Confirm Change"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChangePassword;