import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const OtpVerification = () => {
  const [inputOTP, setInputOTP] = useState(["", "", "", ""]);
  const [timerCount, setTimer] = useState(60);
  const [disable, setDisable] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { email, role, clientId } = location.state;

  const handleVerifyOTP = async () => {
    const enteredOTP = inputOTP.join("");
    try {
      const { data } = await axios.post("http://localhost:8081/verifyOTP", {
        email,
        inputOTP: enteredOTP,
      });

      alert(data.message);

      // Ensure navigate does not fail
      try {
        navigate("/reset-password", {
          state: { email, role, clientId },
        });
      } catch (navError) {
        console.error("Navigation error:", navError);
      }
    } catch (error) {
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  const resendOTP = async () => {
    if (disable) return;
    try {
      await axios.post("http://localhost:8081/resendOTP", { email });
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
    if (!/^[0-9]?$/.test(value)) return;
    const newOTP = [...inputOTP];
    newOTP[index] = value;
    setInputOTP(newOTP);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
      <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
          <form>
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="font-semibold text-3xl">
                <p>Email Verification</p>
              </div>
              <div className="flex flex-row text-sm font-medium text-gray-400">
                <p>We have sent a code to your email {email}</p>
              </div>
            </div>

            <div>
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="w-16 h-16">
                      <input
                        maxLength="1"
                        className="w-full h-full flex flex-col items-center justify-center text-center px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                        type="text"
                        id={`otp-${index}`}
                        value={inputOTP[index]}
                        onChange={(e) => handleChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <a
                      onClick={() => handleVerifyOTP()}
                      className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                    >
                      Verify Account
                    </a>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>Didn't recieve code?</p>{" "}
                    <a
                      className="flex flex-row items-center"
                      style={{
                        color: disable ? "gray" : "blue",
                        cursor: disable ? "none" : "pointer",
                        textDecorationLine: disable ? "none" : "underline",
                      }}
                      onClick={() => resendOTP()}
                    >
                      {disable ? `Resend OTP in ${timerCount}s` : "Resend OTP"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
