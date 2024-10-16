import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './data-context/DataContext';
import axios from 'axios';


import './App.css';

import Main from '../src/container/main/Main';
import About from '../src/container/about/About';
import Products from '../src/container/products/Products';
import Testimonials from './container/testimonials/Testimonials';
import AdminMain from './container/adminDashboard/adminMain/AdminMain';
import Login from './auth/login/Login'
import Register from './auth/register/Register'
import ForgotPassword from './auth/forgotPassword/ForgotPassword';
import ResetPassword from './auth/resetPassword/ResetPassword';
import ProtectedRoute from './auth/protected/ProtectedRoute';
import ProductDetails from './container/products/productDetails/productDetails';
import Footer from './container/footer/Footer';


axios.defaults.withCredentials = true;


function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <Routes>
          {/* Isolated login and admin routes */}
          <Route path="/admin" element={<ProtectedRoute><AdminMain /></ProtectedRoute>} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          
          {/* Public routes under main layout */}
          <Route path="*" element={<MainLayout />} />
        </Routes>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;

// Public layout for home, about, products, etc.
function MainLayout() {
  return (
    <div>
      <Main />
      <About />
      <Products />
      <Login />
      <Testimonials />
      <Footer />
    </div>
  );
}
