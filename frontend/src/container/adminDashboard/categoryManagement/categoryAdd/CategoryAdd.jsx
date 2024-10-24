import { React, useState, useEffect } from 'react';
import axios from 'axios';
import './CategoryAdd.css';

const CategoryAdd = ({ handleCategoryAdd }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch existing categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get('https://rama-bakery-k92f.vercel.app/api/category');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.categoryName.trim()) {
      setError('Category name cannot be empty');
      return;
    }

    try {
      // Add category
       await axios.post('https://rama-bakery-k92f.vercel.app/api/auth/category', {
        categoryName: formData.categoryName,
      });

      setSuccessMessage('Category added successfully!');
      setCategories([...categories, formData.categoryName]);
      setFormData({ categoryName: '' });

      handleCategoryAdd(); // Callback to parent component if needed
    } catch (error) {
      setError('An error occurred while adding the category');
      console.error('Error adding category:', error);
    }
  };

  return (
    <div className="categoryAdd">
      <form onSubmit={handleSubmit} className="categoryAdd-form">
        <div className="categoryAdd-form__group">
          <label htmlFor="categoryName" className="categoryAdd-form__label">Category Name</label>
          <input
            type="text"
            id="categoryName"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            className="categoryAdd-form__input"
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <button type="submit" className="submit-button">Add Category</button>
      </form>

      {/* Display existing categories */}
      <div className="category-list">
        <h3>Existing Categories</h3>
        <ul>
          {categories.map((category, index) => (
            <li key={index}>{category}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryAdd;
