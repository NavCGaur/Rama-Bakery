import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const response = await axios.post('https://rama-bakery-k92f.vercel.app/api/auth/forgot-password', { email });

      if (response.status === 200) {
        setMessage(response.data.message);
      } 
    } catch (error) {
        if (error.response && error.response.status === 404) {
          setError(
            <div>
              Email not found. Please <Link to="/register" className='forgotpassword__errormessage-one'>Register</Link> or check your email address.
            </div>
          );          } else {
            setError('Unable to send reset link. Please try again.');
          }
          console.error('Error sending password reset link:', error); 
        }    
  };

  return (
    <div className="forgotpassword__container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="forgotpassword__form">
        <div className="forgotpassword__inputgroup">
          <label htmlFor="email" className="forgotpassword__inputgroup-label">Enter your email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="forgotpassword__form-input"
          />
        </div>
        {
        message && <div className="forgotpassword__successmessage">{message}&nbsp;
          <Link to="/login" className='forgotpassword__successmessage-link'>Login Again</Link>
          </div>
        }
        {error && <div className="forgotpassword__errormessage">{error}</div>}
        <button type="submit" className="forgotpassword__submit-button">Send Reset Link</button>
      </form>
    </div>                      
  );
};

export default ForgotPassword;
