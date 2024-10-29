import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import validatePassword from '../utils/validatePassword';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [message, setMessage] = useState('');
  const [counter, setCounter] = useState(10);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submit button clicked');
    console.log('Password:', password, 'Confirm Password:', confirmPassword);
    
    const validationErrors = validatePassword(password, confirmPassword);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(`https://rama-bakery-k92f.vercel.app/api/auth/reset-password/${token}`, { password });
      setMessage('Your password has been reset successfully.');
      console.log('API Response:', response.data);
      setCounter(10);
    } catch (error) {
      console.error('Error resetting password:', error.response ? error.response.data : error.message);
      setErrors([ 'Error resetting password. Please try again.' ]);
    }
  };

  useEffect(() => {
    if (message && counter > 0) {
      const timer = setInterval(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);
  
      return () => clearInterval(timer);
    } else if (counter === 0) {
      navigate('/login');
    }
  }, [message, counter, navigate]);

  return (
    <div className="resetpassword__container">
      <div className="resetpassword__formwrapper">
        <h2 className="resetpassword__title">Reset Password</h2>
        {!message ? (
          <form className="resetpassword__form" onSubmit={handleSubmit}>
            <div className="resetpassword__input-group">
              <label htmlFor="password" className="resetpassword__inputgroup-label">New Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="resetpassword__forminput"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />    
            </div>
            <div className="resetpassword__input-group">
              <label htmlFor="confirmPassword" className="resetpassword__inputgroup-label">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="resetpassword__forminput"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="resetpassword__submit-button">Reset Password</button>
            </div>
          </form>
        ) : (
          <div className="info-message">
            {message} <br />
            Redirecting to <Link to="/login">Login</Link> in {counter} seconds.
          </div>
        )}
        {errors.length > 0 && (
          <div className="error-messages">
            {errors.map((error, index) => (
              <div key={index} className="error-message">{error}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;