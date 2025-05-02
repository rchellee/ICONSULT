import React, { useState, useEffect } from "react";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./AccountSettings.css";
import { IoMdArrowDropright } from "react-icons/io";
import ChangePassword from "./ChangePassword";

const AccountSettings = () => {
  const [clientDetails, setClientDetails] = useState(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);
  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    const fetchClientDetails = async () => {
      if (!clientId) {
        setMessage({ text: "Client ID not found. Please log in again.", type: "error" });
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(
          `http://localhost:8081/clients-account/${clientId}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setClientDetails(data);
          setMessage({ text: "", type: "" });
        } else {
          setMessage({ text: "Failed to fetch client details.", type: "error" });
        }
      } catch (error) {
        console.error("Error fetching client details:", error);
        setMessage({ text: "An unexpected error occurred.", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientDetails();
  }, [clientId]);

  const handlePasswordUpdateSuccess = () => {
    setMessage({ text: "Password updated successfully!", type: "success" });
    setIsUpdatingPassword(false);
  };

  if (isLoading) {
    return (
      <div className="account-settings-container">
        <Topbar />
        <Sidebar />
        <div className="account-settings-content">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-settings-container">
      <Topbar />
      <Sidebar />
      <div className="account-settings-content">
        {!isUpdatingPassword ? (
          <div className="account-settings-wrapper">
            <header className="account-settings-header">
              <h1 className="account-settings-title">Account Settings</h1>
              {/*<p className="account-settings-subtitle">Manage your account information and security</p>*/}
            </header>

            {message.text && (
              <div className={`status-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="settings-sections">
              <section className="info-box">
                <h2 className="info-box-title">
                  <span className="info-box-icon">👤</span>
                  Basic Information
                </h2>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Name</span>
                    <span className="info-value">
                      {clientDetails?.firstName || 'N/A'} 
                      {clientDetails?.middleInitial ? ` ${clientDetails.middleInitial}` : ''} 
                      {clientDetails?.lastName ? ` ${clientDetails.lastName}` : ''}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Username</span>
                    <span className="info-value">{clientDetails?.username || 'N/A'}</span>
                  </div>
                </div>
              </section>

              <section className="info-box">
                <h2 className="info-box-title">
                  <span className="info-box-icon">📱</span>
                  Contact Information
                </h2>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Phone number</span>
                    <span className="info-value">{clientDetails?.mobile_number || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email Address</span>
                    <span className="info-value">{clientDetails?.email_add || 'N/A'}</span>
                  </div>
                </div>
              </section>

              <section className="info-box">
                <h2 className="info-box-title">
                  <span className="info-box-icon">🏠</span>
                  Addresses
                </h2>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Home</span>
                    <span className="info-value">{clientDetails?.address || 'N/A'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Company</span>
                    <span className="info-value">{clientDetails?.companyName || 'N/A'}</span>
                  </div>
                </div>
              </section>

              <section className="info-box">
                <h2 className="info-box-title">
                  <span className="info-box-icon">🔒</span>
                  Security
                </h2>
                <p className="password-info-text">
                  For your security, please use a strong, unique password.
                </p>
                <button 
                  className="password-change-button"
                  onClick={() => setIsUpdatingPassword(true)}
                >
                  <span>Change Password</span>
                  <IoMdArrowDropright className="password-change-icon" />
                </button>
              </section>
            </div>
          </div>
        ) : (
          <ChangePassword
            clientDetails={clientDetails}
            onSuccess={handlePasswordUpdateSuccess}
            onCancel={() => setIsUpdatingPassword(false)}
          />
        )}
      </div>
    </div>
  );
};

export default AccountSettings;