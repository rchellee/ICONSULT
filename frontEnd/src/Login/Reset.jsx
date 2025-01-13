import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./otp.css";

axios.defaults.baseURL = "http://localhost:8081";

export default function Reset({ isAdmin = false, clientIdProp = null, onClose }) {  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [alertText, setAlertText] = useState("Enter at least 8 characters");
  const [alertColor, setAlertColor] = useState("#a6a6a6");
  const location = useLocation();
  const { role, clientId: locationClientId } = location.state || {};
  const navigate = useNavigate();
  const clientId = locationClientId || clientIdProp;

  const handlePasswordChange = (value) => {
    setPassword(value);

    if (value.length >= 8) {
      setAlertText("Password is valid");
      setAlertColor("#4070F4");
    } else {
      setAlertText("Enter at least 8 characters");
      setAlertColor("#a6a6a6");
      setConfirmPassword("");
    }
  };

  const handleSubmit = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const endpoint =
      role === "admin" ? "/updateAdminPassword" : "/updateclientPassword";
    const payload =
      role === "admin"
        ? { newPassword: password }
        : { clientId, newPassword: password };

    axios
      .post(endpoint, payload)
      .then((response) => {
        alert(response.data.message);
        if (onClose) {
          onClose();
        } else {
          navigate("/login");
        }
      })
      .catch((error) => {
        setError(error.response?.data?.message || "An error occurred");
      });
  };

  return (
    <div className="reset-content">
      <div className="wrapper-reset">
        <div className="input-box-reset">
          <input
            id="create_pw"
            type="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            required
          />
          <label>Create password</label>
        </div>
        <div className="input-box-reset">
          <input
            id="confirm_pw"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={password.length < 8}
          />
          <label>Confirm password</label>
        </div>
        <div className="alert">
          <i
            className={`fas fa-exclamation-circle ${
              alertText === "Password is valid" ? "hidden" : "error"
            }`}
          ></i>
          <span className="text" style={{ color: alertColor }}>
            {alertText}
          </span>
        </div>
        <div className="input-box-reset button">
          <input
            id="button"
            type="button"
            value="Reset Password"
            onClick={handleSubmit}
            disabled={password.length < 8 || confirmPassword.length < 8}
          />
        </div>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </div>
    </div>
  );
}
