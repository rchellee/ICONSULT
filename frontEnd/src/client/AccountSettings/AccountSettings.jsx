// AccountSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./AccountSettings.css";
import { IoMdArrowDropright } from "react-icons/io";
import image from "../../assets/image.png";
import ChangePassword from "./ChangePassword"; 
import { CiEdit } from "react-icons/ci";
import UpdateProfileForm from "./UpdateProfileForm"; // Import the new UpdateProfileForm component

const AccountSettings = () => {
  const [clientDetails, setClientDetails] = useState(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isFormVisible, setIsFormVisible] = useState(false); // State to control visibility of the update form
  const clientId = localStorage.getItem("clientId");
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchClientDetails();
  }, []);

  const handleUpdateProfile = () => {
    setIsFormVisible(true); // Show the floating form when the "UPDATE PROFILE" button is clicked
  };

  const handleCloseForm = () => {
    setIsFormVisible(false); // Close the floating form
  };

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="account-setting">
        {!isUpdatingPassword ? (
          clientDetails && (
            <>
              <div className="account">
                <h2>Account Setting</h2>
                <p>
                  Personal info and options to manage it.<br />
                  See the summary of your profiles.
                </p>
                <button className="update-profile-button" onClick={handleUpdateProfile}>
                  <CiEdit /> UPDATE PROFILE
                </button>

                <div className="imagee">
                  <img
                    src={image}
                    alt="image"
                    className="account-setting-icon"
                  />
                </div>

                <div className="info-box">
                  <h3>Basic Information</h3>
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
                      <tr>
                        <td>Age</td>
                        <td className="no-bg">20</td>
                      </tr>
                      <tr>
                        <td>Gender</td>
                        <td className="no-bg">Female</td>
                      </tr>
                      <tr>
                        <td>Nationality</td>
                        <td className="no-bg">Filipino</td>
                      </tr>
                      <tr>
                        <td>Home</td>
                        <td>{clientDetails?.address}</td>
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
                        <td>Company Name</td>
                        <td>Not Set</td>
                      </tr>
                      <tr>
                        <td>Position</td>
                        <td>Not Set</td>
                      </tr>
                      <tr>
                        <td>Company Contact Number</td>
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
        ) : (
          <ChangePassword
            clientDetails={clientDetails}
            setIsUpdatingPassword={setIsUpdatingPassword}
          />
        )}
      </div>

      {/* Floating Update Profile Form */}
      {isFormVisible && (
        <UpdateProfileForm clientDetails={clientDetails} handleCloseForm={handleCloseForm} />
      )}
    </div>
  );
};

export default AccountSettings;
