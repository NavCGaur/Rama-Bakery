import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import validatePassword from '../utils/validatePassword';
import './Register.css';

const Register = () => {
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
    // Clear the error for this field when the user starts typing
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Client-side password validation
    const passwordErrors = validatePassword(formData.password, formData.confirmPassword);
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }

    try {
        await axios.post('https://rama-bakery-k92f.vercel.app/api/auth/register',formData );
      
      setMessage('Registration successful. Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          // Handle validation errors from the server
          setErrors(error.response.data);
        } else if (error.response.data.message) {
          // Handle other server errors with messages
          setErrors({ submitError: error.response.data.message });
        }
      } else if (error.request) {
        setErrors({ submitError: 'No response from server. Please try again.' });
      } else {
        setErrors({ submitError: 'Error during registration. Please try again.' });
      }
      console.error('Registration error:', error);
    }
  };

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
          Already have an account? <Link to="/login" className="register__login-redirectLink">Login here</Link>.
        </div>
      </div>
    </div>
  );
};

export default Register;