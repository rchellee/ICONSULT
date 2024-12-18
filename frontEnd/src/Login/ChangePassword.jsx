import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './ChangePassword.css'; // Make sure to include your CSS file for styling

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { clientId } = location.state;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isPasswordStrong = (password) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-])[A-Za-z\d@$!%*?&_\-]{8,}$/;
        return strongPasswordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isPasswordStrong(newPassword)) {
            setError('Password must be at least 8 characters long, include uppercase, lowercase, number, and a special character.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8081/updatePassword', {
                clientId,
                newPassword,
            });
            if (response.data.message) {
                navigate('/clientdashboard');
            }
        } catch (error) {
            setError('Failed to update password. Try again.');
        }
    };

    return (
        <div className="wrapper">
            <form onSubmit={handleSubmit}>
                <h2>Change Password</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className="pass-field">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <i
                        className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        onClick={togglePasswordVisibility}
                    ></i>
                </div>
                <div className="pass-field">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <i
                        className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}
                        onClick={togglePasswordVisibility}
                    ></i>
                </div>
                <div className="content">
                    <p>Password must contain:</p>
                    <ul className="requirement-list">
                        <li>
                            <i className={`fa-solid fa-circle ${newPassword.length >= 8 ? 'valid' : ''}`}></i>
                            <span>At least 8 characters</span>
                        </li>
                        <li>
                            <i className={`fa-solid fa-circle ${/\d/.test(newPassword) ? 'valid' : ''}`}></i>
                            <span>At least 1 number (0–9)</span>
                        </li>
                        <li>
                            <i className={`fa-solid fa-circle ${/[a-z]/.test(newPassword) ? 'valid' : ''}`}></i>
                            <span>At least 1 lowercase letter (a–z)</span>
                        </li>
                        <li>
                            <i className={`fa-solid fa-circle ${/[A-Z]/.test(newPassword) ? 'valid' : ''}`}></i>
                            <span>At least 1 uppercase letter (A–Z)</span>
                        </li>
                        <li>
                            <i className={`fa-solid fa-circle ${/[@$!%*?&]/.test(newPassword) ? 'valid' : ''}`}></i>
                            <span>At least 1 special character (!...$)</span>
                        </li>
                    </ul>
                </div>
                <button type="submit">Update Password</button>
            </form>
        </div>
    );
};

export default ChangePassword;
