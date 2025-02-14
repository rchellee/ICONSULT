import React, { useState, useEffect } from "react";
import Topbar from "../Topbar";
import Sidebar from "../sidebar";
import "./AccountSettings.css";
import { IoMdArrowDropright } from "react-icons/io";
import image from "../../assets/image.png";
import ChangePassword from "./ChangePassword"; // Import the new component

const AccountSettings = () => {
  const [clientDetails, setClientDetails] = useState(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [message, setMessage] = useState("");
  const clientId = localStorage.getItem("clientId");

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

  return (
    <div>
      <Topbar />
      <Sidebar />
      <div className="account-settings">
        {!isUpdatingPassword ? (
          clientDetails && (
            <>
              <div className="account">
                <h2>Account Setting</h2>
                <div className="imagee">
                  <img
                    src={image}
                    alt="image"
                    className="account-settings-icon"
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
        ) : (
          <ChangePassword
            clientDetails={clientDetails}
            setIsUpdatingPassword={setIsUpdatingPassword}
          />
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
