import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext();
const CategoryContext = createContext();
const CategoriesContext = createContext();
const AuthContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null);


  const fetchProducts = async () => {
    try {
      const productResponse = await axios.get('https://rama-bakery-k92f.vercel.app/api/products');
      const formattedProducts = productResponse.data.map(product => ({
        ...product,
        date: new Date(product.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }));
      setProducts(formattedProducts);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching products');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await fetchProducts();

        // Fetch categories
        const categoryResponse = await axios.get('https://rama-bakery-k92f.vercel.app/api/category');
        setCategories(categoryResponse.data);

        setLoading(false);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateProducts = async (updatedProducts) => {
    try {
      setLoading(true);
      // Create an array of update promises
      const updatePromises = updatedProducts.map(product => 
        axios.put(`https://rama-bakery-k92f.vercel.app/api/auth/products/${product.id}`, product)
      );  
      
      // Wait for all update requests to complete
      await Promise.all(updatePromises);
      
      // Fetch the updated product list
      await fetchProducts();
      
      setLoading(false);
    } catch (err) {
      setError('Error updating products: ' + (err.message || 'An unknown error occurred'));
      setLoading(false);
      throw err; // Re-throw the error so it can be caught in the component
    }
  };


  return (
    <ProductContext.Provider value={{ products, setProducts, loading, error, updateProducts }}>
      <CategoryContext.Provider value={{ category, setCategory }}>
        <CategoriesContext.Provider value={{ categories, setCategories, loading, error }}>
          <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated}}>
          {children}
          </AuthContext.Provider>
        </CategoriesContext.Provider>
      </CategoryContext.Provider>
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
export const useCategory = () => useContext(CategoryContext);
export const useCategories = () => useContext(CategoriesContext);
export const useAuthentication =() => useContext(AuthContext)