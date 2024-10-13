import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../data-context/DataContext';

import axios from 'axios';
import './Logout.css';



const Logout = () => {
  const navigate = useNavigate();
  const {setIsAuthenticated} = useAuthentication()

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://rama-bakery.vercel.app/api/auth/logout', {}, {
        withCredentials: true // Necessary for cookies to be sent with the request
      });

      if (response.status === 200) {
        setIsAuthenticated(false);
        // Redirect to login page
        navigate('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return { handleLogout }; // Export the function

};

export default Logout;