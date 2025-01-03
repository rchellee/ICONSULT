import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar";

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
        setMessage(
          "Verification successful. You can now update your password."
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

  // Handle Password Change with New Endpoint
  const handlePasswordChange = async (event) => {
    event.preventDefault();

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
      } else {
        setMessage("Error updating password. Please try again.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  return (
    <div className="account-settings">
      <Sidebar />
      <div className="content">
        <h2>Account Settings</h2>

        {isUpdatingPassword ? (
          <form onSubmit={(e) => e.preventDefault()}>
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
            {!codeSent ? (
              <button type="button" onClick={sendVerificationCode}>
                Send Verification Code
              </button>
            ) : (
              <>
                <div>
                  <label>Verification Code:</label>
                  <input
                    type="text"
                    value={enteredCode}
                    onChange={(e) => setEnteredCode(e.target.value)}
                  />
                </div>
                <button type="button" onClick={verifyCodeAndProceed}>
                  Verify Code
                </button>
              </>
            )}
            {isVerified && (
              <button type="submit" onClick={handlePasswordChange}>
                Change Password
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setIsUpdatingPassword(false);
                setMessage("");
                setCodeSent(false);
                setIsVerified(false);
              }}
            >
              Cancel
            </button>
          </form>
        ) : (
          clientDetails && (
            <>
              <div>
                <p>
                  <strong>Name:</strong> {clientDetails.firstName}{" "}
                  {clientDetails.middleInitial} {clientDetails.lastName}
                </p>
                <p>
                  <strong>Username:</strong> {clientDetails.username}
                </p>
                <p>
                  <strong>Phone number:</strong> {clientDetails.mobile_number}
                </p>
                <p>
                  <strong>Email Address:</strong> {clientDetails.email_add}
                </p>
                <p>
                  <strong>Address:</strong> {clientDetails.address}
                </p>
                <p>
                  <strong>Company:</strong> {clientDetails.companyName}
                </p>
              </div>
              <button onClick={() => setIsUpdatingPassword(true)}>
                Update Password
              </button>
            </>
          )
        )}
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default AccountSettings;
