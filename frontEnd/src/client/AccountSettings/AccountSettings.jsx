import React, { useState, useEffect } from "react";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./AccountSettings.css";
import { IoMdArrowDropright } from "react-icons/io";
import ChangePassword from "./ChangePassword";
import UpdateProfileForm from "./UpdateProfileForm";

const AccountSettings = () => {
  const [clientDetails, setClientDetails] = useState(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [message, setMessage] = useState("");
  const clientId = localStorage.getItem("clientId");

  const fetchClientDetails = async () => {
    console.log("Client ID:", clientId);
    if (!clientId) {
      setMessage("Client ID not found. Please log in again.");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8081/clients-account/${clientId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Client data:", data);
        setClientDetails(data);
      } else {
        setMessage("Failed to fetch client details.");
      }
    } catch (error) {
      console.error("Error fetching client details:", error);
      setMessage("An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchClientDetails();
  }, []);

  const handleProfileUpdateSuccess = (updatedDetails) => {
    setClientDetails(updatedDetails);
    fetchClientDetails();
    setIsUpdatingProfile(false);
  };

  return (
    <div>
      <Sidebar />
      <Topbar />

      <div className="account-settings-client">
        {isUpdatingPassword ? (
          <ChangePassword
            clientDetails={clientDetails}
            setIsUpdatingPassword={setIsUpdatingPassword}
          />
        ) : isUpdatingProfile ? (
          <UpdateProfileForm
            clientDetails={clientDetails}
            handleCloseForm={() => setIsUpdatingProfile(false)}
            onUpdateSuccess={handleProfileUpdateSuccess}
          />
        ) : (
          clientDetails && (
            <>
              <div className="account">
                <h2>Account Setting</h2>
                <div className="info-box">
                  <h3>Basic Information</h3>
                  <div className="edit-profile-btn-container">
                    <button
                      className="edit-profile-btn"
                      onClick={() => setIsUpdatingProfile(true)}
                    >
                      Edit Profile
                    </button>
                  </div>
                  <table>
                    <tbody>
                      <tr>
                        <td>Name</td>
                        <td>
                          {clientDetails.firstName}{" "}
                          {clientDetails.middleInitial} {clientDetails.lastName}
                        </td>
                      </tr>
                      <tr>
                        <td>Username</td>
                        <td className="no-bg">{clientDetails.username}</td>
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
                        <td>{clientDetails.mobile_number}</td>
                      </tr>
                      <tr>
                        <td>Email Address</td>
                        <td>{clientDetails.email_add}</td>
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
                        <td>{clientDetails.address}</td>
                      </tr>
                      <tr>
                        <td>Company</td>
                        <td>{clientDetails.companyName}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="info-box">
                  <h3>Password</h3>
                  <p>Create Strong Password</p>
                  <div
                    className="password-section"
                    onClick={() => setIsUpdatingPassword(true)}
                  >
                    <span className="password-field">
                      *************************
                    </span>
                    <IoMdArrowDropright className="password-icon" />
                  </div>
                </div>

                {message && <div className="message">{message}</div>}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
