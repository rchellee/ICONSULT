import React, { useState } from "react";
import Sidebar from "../sidebar";

const AccountSettings = () => {
  const [profile, setProfile] = useState({
    firstName: localStorage.getItem("firstName") || "",
    lastName: localStorage.getItem("lastName") || "",
    email: localStorage.getItem("email") || "",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [message, setMessage] = useState("");

  // Handle Profile Update
  const handleProfileUpdate = (event) => {
    event.preventDefault();
    localStorage.setItem("firstName", profile.firstName);
    localStorage.setItem("lastName", profile.lastName);
    localStorage.setItem("email", profile.email);
    setMessage("Profile updated successfully!");
  };

  // Handle Password Change with Authentication Email
  const handlePasswordChange = async (event) => {
    event.preventDefault();

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Simulate email authentication (request to provide current password)
    if (!currentPassword) {
      setMessage("Please enter your current password to update your password.");
      return;
    }

    try {
      // Simulating API call to authenticate password and update the new password
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: profile.email,
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        setMessage("Password updated successfully!");
      } else {
        setMessage("Error updating password. Please check your current password.");
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

        {/* Profile Section */}
        <form onSubmit={handleProfileUpdate}>
          <div>
            <label>First Name:</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
          </div>
          <div>
            <label>Last Name:</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <button type="submit">Update Profile</button>
        </form>

        {/* Password Change Section */}
        <form onSubmit={handlePasswordChange}>
          <div>
            <label>Current Password:</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
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
          <button type="submit">Change Password</button>
        </form>

        {/* Display Message */}
        {message && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default AccountSettings;
