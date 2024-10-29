import {React, useState} from 'react'

import {useNavigate,  Link } from 'react-router-dom';


import { useAuthentication } from '../../../data-context/DataContext';

import {ReactComponent as HomeIcon} from '../../../assets/homeicon.svg'
import {ReactComponent as DashboardIcon} from '../../../assets/dashboardicon.svg'
import {ReactComponent as ProductIcon} from '../../../assets/producticon.svg'
import {ReactComponent as LogoutIcon} from '../../../assets/leftlogouticon.svg'
import { ReactComponent as CategoryIcon } from '../../../assets/categoryicon.svg';


import Dashboard from '../dashboard/Dashboard';
import ProductManagement from '../productManagement/ProductManagement';
import CategoryManagement from '../categoryManagement/CategoryManagement';




import './AdminMain.css'

function AdminMain() {  

  const [handleOption, setHandleOption] = useState(1);
  const {isAuthenticated} = useAuthentication()
  const navigate = useNavigate();




  function changeHandleOption(option){
    setHandleOption(option);
  } 

   // Render the component based on the current handleOption value
   function renderContent() {

    if (!isAuthenticated) {

      return <div className='adminmain__notAuthenticated'>
                  Not authenticated. Please&nbsp; 
                  <Link to='/login' className='adminmain__notAuthenticated-link'> login.</Link>
              </div>;
    }
    else{
    switch (handleOption) {
      case 1:
        return <Dashboard />;
      case 2:
        return <ProductManagement />;
      case 3:
        return <CategoryManagement />;
      case 4:
        return navigate('/login');
        ;
      default:
        return <Dashboard />; // Default to Dashboard if no match
    }}
  }

 
  return (
    <div className='adminmain'>

        <div className='adminmain__top'>
        
        </div>
        <div className='adminmain__main'>
            <div className='adminmain__left'>
                <div className='adminmain__left-Icon'>
                    <HomeIcon className='adminmain__icon'/>
                    <Link to="/">Back to Main Site</Link>

                    </div>
                <div className={handleOption===1?'adminmain__left-Icon active':'adminmain__left-Icon'} onClick={() => changeHandleOption(1)}>
                    <DashboardIcon className='adminmain__icon'  />
                    Dashboard
                </div>
                <div className={handleOption===2?'adminmain__left-Icon active':'adminmain__left-Icon'} onClick={() => changeHandleOption(2)}>
                    <ProductIcon className='adminmain__icon' />
                    Product Management
                </div>
                <div className={handleOption===3?'adminmain__left-Icon active':'adminmain__left-Icon'} onClick={() => changeHandleOption(3)}>
                    <CategoryIcon className='adminmain__icon' />
                    Category Management
                </div>
                <div className='adminmain__left-Icon' onClick={() => changeHandleOption(4)}>
                    <LogoutIcon className='adminmain__icon'/>
                    Logout
                </div>
            </div>
            <div className='adminmain__right'>
                {renderContent()}
            </div>

        </div>

    </div>
  )
}

export default AdminMain