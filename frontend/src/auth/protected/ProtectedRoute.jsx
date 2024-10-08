import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import axios from 'axios';


const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const checkAuth = async () => {
      try { 
        await axios.get('https://rama-bakery.vercel.app/api/auth/admin', { withCredentials: true });
        setLoading(false);

      } catch (error) {
        navigate('/login');

      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>; // This displays while the check is in progress
  }

  return React.cloneElement(children);
};

export default ProtectedRoute;
