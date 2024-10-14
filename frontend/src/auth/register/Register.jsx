import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import validatePassword from '../utils/validatePassword'; // Import password validation function
import './Register.css';

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords using the utility function
    const validationErrors = validatePassword(formData.password, formData.confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('https://rama-bakery-k92f.vercel.app/api/auth/register', formData);
      setMessage('Registration successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 400) {
          // Validation errors
          setErrors(error.response.data.errors || { submitError: error.response.data.message });
        } else {
          setErrors({ submitError: error.response.data.message || 'An error occurred during registration.' });
        }
      } else if (error.request) {
        // The request was made but no response was received
        setErrors({ submitError: 'No response from server. Please try again.' });
      } else {
        // Something happened in setting up the request that triggered an Error
        setErrors({ submitError: 'Error during registration. Please try again.' });
      }
      console.error('Registration error:', error);
    }
  }
  return (
    <div className="register__container">
      <div className="register__formwrapper">
        <h2 className="register__title">Register</h2>
        {message && <div className="register__info-message">{message}</div>}
        {errors.submitError && <div className="register__error-message">{errors.submitError}</div>}
        <form className="register__form" onSubmit={handleSubmit}>
          <div className="register__input-group">
            <label htmlFor="username" className="register__inputgroup-label">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="register__forminput"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
            />
            {errors.username && <span className="register__error-message">{errors.username}</span>}
          </div>
          <div className="register__inputgroup">
            <label htmlFor="email" className="register__inputgroup-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="register__forminput"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="register__error-message">{errors.email}</span>}
          </div>
          <div className="register__inputgroup">
            <label htmlFor="password" className="register__inputgroup-label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="register__forminput"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && <span className="register__error-message">{errors.password}</span>}
          </div>
          <div className="register__input-group">
            <label htmlFor="confirmPassword" className="register__inputgroup-label">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="register__forminput"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && <span className="register__error-message">{errors.confirmPassword}</span>}
          </div>
          <div className="button-group">
            <button type="submit" className="register__submit-button">Register</button>
          </div>
        </form>
        <div className="register__login-redirect">
          Already have an account? <Link to="/login" className="register__login-redirectLink" >Login here</Link>.
        </div>
      </div>
    </div>
  );
};

export default Registration;
