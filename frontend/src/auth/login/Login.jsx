import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';
import { useAuthentication } from '../../data-context/DataContext';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const {setIsAuthenticated} = useAuthentication()


  // Set the message from location state if available
  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);

      // Automatically clear the message after 3 seconds
      const timer = setTimeout(() => {
        setMessage('');
        navigate('/login', { replace: true }); // Clear the message from location state
      }, 6000);

      // Cleanup the timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, [location, navigate]);

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://rama-bakery-k92f.vercel.app/api/auth/login', {
        email,
        password,
      });

      if (response.status === 200) {

        setIsAuthenticated(true);
        navigate('/admin');

      } 
    }catch (error) {
      console.error('Full error object:', error);
      if (error.response) {
        console.error('Error response:', error.response);
        setError(error.response.data.message || 'Login failed');
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response from server. Please try again.');
      } else {
        console.error('Error message:', error.message);
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h2 className="login-title">Sign in to your account</h2>
        {message && <div className="success-message">{message}</div>}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email-address" className="sr-only">Email address</label>
            <input
              id="email-address"
              name="email"
              type="email"
              required
              className="form-input"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="button-group">
            <button type="submit" className="submit-button">Sign in</button>
          </div>
        </form>
        <p className="forgot-password-link">
          <a href="/forgot-password">Forgot Password ?</a>
        </p>
        <p className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </p>

      </div>
    </div>
  );
};

export default Login;
