
import React, { useState } from 'react';
import Sidebar from "../sidebar";

const AccountSettings = () => {
  const [profile, setProfile] = useState({
    firstName: localStorage.getItem('firstName'),
    lastName: localStorage.getItem('lastName'),
    email: '', 
  });

  const handleProfileUpdate = (event) => {
    event.preventDefault();
    
  };

  return (
    <div className="account-settings">
        <Sidebar /> 
        <div className="content">
      <h2>Account Settings</h2>
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
      <div className="password-change">
        <h3>Change Password</h3>
        <form>
          <div>
            <label>New Password:</label>
            <input type="password" placeholder="Enter new password" />
          </div>
          <button>Change Password</button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
