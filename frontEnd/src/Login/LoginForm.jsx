import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './LoginForm.css'; 
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo1.png'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      const { data } = await axios.post('http://localhost:8081/api/Login', {
        username,
        password
      });
 
      // Navigate based on the role
      if (data.role === 'admin') {
        navigate('/admin'); 
      } else if (data.role === 'employee') {
        navigate('/employees'); 
      } else if (data.role === 'client') {
        navigate('/client'); 
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
 };

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
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FaUser className='icon' />
            </div>

            <div className='input-box'>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className='icon'/>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
      <footer className="footer">
        <p>
          {/* Modified the About link to use navigate and scroll to the About section */}
          <a href="#about" onClick={() => navigate("/", { hash: "about" })}>About</a> | <a href="#contact">Contact</a>
        </p>
        <p>&copy; Bautista, Cabigting, Rueras, Sandiego 2024</p>
      </footer>
    </div>
  );
};

export default Login;