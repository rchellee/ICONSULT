import React from 'react';
import './LoginForm.css'; // Import the CSS file for styling
import { FaUser, FaLock } from "react-icons/fa";
import logo from '../assets/logo1.png'; // Correct path

const Login = () => {
  return (
    <div className='container'>
      <div className='left-side'>
        <div className='logo-container'>
          <img src={logo} alt='Logo' className='logo' />
        </div>
        <div>
          <h2>Welcome back!</h2>
          <p>Connect and start your productivity</p>
        </div>
      </div>
      <div className='right-side'>
        <div className='wrapper'>
          <form action="">
            <div className="input-box">
              <input type="text" placeholder='Username' required />
              <FaUser className='icon' />
            </div>

            <div className='input-box'>
              <input type="password" placeholder='Password' required />
              <FaLock className='icon'/>
            </div>

            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Login</button>

            <div className="register-link">
              <p>Don't have an account? <a href="#">Register</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
