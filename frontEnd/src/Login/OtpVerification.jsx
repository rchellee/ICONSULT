import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./otp.css";

const OtpVerification = ({ email, role, clientId, onOtpSuccess }) => {
  const [inputOTP, setInputOTP] = useState(["", "", "", ""]);
  const [timerCount, setTimer] = useState(60);
  const [disable, setDisable] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically focus the first input when the component loads
    document.getElementById("otp-0").focus();
  }, []);

  useEffect(() => {
    // Timer logic
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDisable(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [disable]);

  const handleVerifyOTP = async () => {
    const enteredOTP = inputOTP.join("");
    try {
      const { data } = await axios.post("http://localhost:8081/verifyOTP", {
        email,
        inputOTP: enteredOTP,
      });

      alert(data.message);
      onOtpSuccess();
    } catch (error) {
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const resendOTP = async () => {
    if (disable) return;
    try {
      await axios.post("http://localhost:8081/sendOTP", { email });
      alert("A new OTP has been sent to your email.");
      setDisable(true);
      setTimer(60);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setDisable(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [disable]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow single digits
    const newOTP = [...inputOTP];
    newOTP[index] = value;
    setInputOTP(newOTP);

    // Automatically focus the next input if available
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.removeAttribute("disabled");
        nextInput.focus();
      }
    }

    // Handle backspace key logic
    if (!value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  return (
    <div className="otpBody">
      <div className="container">
        <header>
          <i className="bx bxs-check-shield"></i>
        </header>
        <h4>Enter OTP Code</h4>
        <form>
          <div className="input-field">
            {inputOTP.map((digit, index) => (
              <input
                key={index}
                type="text"
                id={`otp-${index}`}
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                disabled={index !== 0 && inputOTP[index - 1] === ""}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleVerifyOTP}
            className={inputOTP.every((digit) => digit) ? "active" : ""}
          >
            Verify
          </button>
        </form>
        <div className="resend-section">
          <p>Didn't receive code?</p>
          <button className="resend-btn" disabled={disable} onClick={resendOTP}>
            {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
