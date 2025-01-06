import { useState } from "react";
import axios from "axios"; // Import axios
import "./LoginForm.css";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    try {
      if (!username) {
        return alert("Please enter your username to proceed.");
      }

      const { data } = await axios.post("http://localhost:8081/identifyUser", {
        username,
      });
      console.log(data);

      if (!data.email) {
        return alert("Email associated with this username not found.");
      }

      const OTP = Math.floor(Math.random() * 9000 + 1000); // Generate 4-digit OTP
      await axios.post("http://localhost:8081/sendOTP", {
        email: data.email,
        OTP,
      });

      navigate("/otp-verification", {
        state: { email: data.email, role: data.role, clientId: data.clientId },
      });
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:8081/Login", {
        username,
        password,
      });

      // Check if the client needs to change their password
      if (data.changePassword) {
        navigate("/change-password", { state: { clientId: data.clientId } });
        return;
      }

      // Navigate based on the role
      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "client") {
        // After a successful login as a client, store firstName and lastName in localStorage
        localStorage.setItem("clientId", data.clientId); // Save clientId
        localStorage.setItem("firstName", data.firstName);
        localStorage.setItem("lastName", data.lastName);
        navigate("/clientdashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      if (error.response?.status === 403) {
        setError("Your account is inactive. Please contact the admin.");
      } else {
        setError(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
  };

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        <div>
          <h2>Welcome back!</h2>
          <p>Connect and start your productivity</p>
        </div>
      </div>
      <div className="right-side">
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FaUser className="icon" />
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="icon" />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className="forgot">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleForgotPassword();
                }}
              >
                Forgot password?
              </a>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
      <footer className="footer">
        <p>
          {/* Modified the About link to use navigate and scroll to the About section */}
          <a href="#about" onClick={() => navigate("/", { hash: "about" })}>
            About
          </a>{" "}
          | <a href="#contact">Contact</a>
        </p>
        <p>&copy; Bautista, Cabigting, Rueras, Sandiego 2024</p>
      </footer>
    </div>
  );
};

export default Login;
