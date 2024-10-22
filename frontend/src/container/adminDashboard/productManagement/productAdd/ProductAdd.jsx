import { React, useState, useEffect, useRef } from 'react'; // Import necessary React hooks
import { Link } from 'react-router-dom'; // Link component for navigation
import axios from 'axios'; // Axios for making HTTP requests
import { useAuthentication } from '../../../../data-context/DataContext'; // useAuthentication for Firebase Authentication

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Firebase storage imports
import { storage } from '../../../../firebase'; // Firebase storage reference
import './ProductAdd.css'; // Importing styles

// ProductAdd component receives a prop "handleProductAdd" for handling post-submit behavior
const ProductAdd = ({ handleProductAdd }) => {

  // State variables
  const [image, setImage] = useState(null); // For storing the selected image
  const [uploadResponse, setUploadResponse] = useState(''); // To handle the response after adding a product
  const [error, setError] = useState(''); // To store error messages
  const [lastProductId, setLastProductId] = useState(0); // To store the last product's ID fetched from the backend
  const [categories, setCategories] = useState([]); // To store available categories fetched from the backend

 
  const { isAuthenticated } = useAuthentication(); //Authentication status from useAuthentication
  const [uploadProgress, setUploadProgress] = useState(0); // For tracking upload progress
  const fileInputRef = useRef(null); // Reference for the file input field

  // State for form data fields (Product details)
  const [formData, setFormData] = useState({
    id: 0, // Product ID
    category: '', // Product category
    name: '', // Product name
    price: '', // Product price
    weight: '', // Product weight
  });

  // Fetch last product ID and categories from the server when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch products to get the last product ID
        const productResponse = await axios.get('https://rama-bakery-k92f.vercel.app/api/products');
        const newLastProductId = productResponse.data.length; // Calculate the last product ID
        setLastProductId(newLastProductId); // Set last product ID in state
        setFormData(prevData => ({ ...prevData, id: newLastProductId + 1 })); // Increment ID for the new product

        // Fetch categories
        const categoryResponse = await axios.get('https://rama-bakery-k92f.vercel.app/api/category');
        setCategories(categoryResponse.data); // Set available categories in state
      } catch (error) {
        console.error('Error fetching last product ID:', error);
      }
    }
    fetchData(); // Invoke fetchData when the component mounts
  }, []);

  // Function to capitalize the first letter of each word in the product name
  function capitalizeInput(input) {
    return input.replace(/\b\w/g, char => char.toUpperCase());
  }

  // Handle input change in form fields (category, name, price, weight)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form data state on input change
  };

  // Handle image selection and validate the size (must be less than 500KB)
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the first file from the file input
    if (file && file.size <= 500 * 1024) { // Check if the file size is less than 500KB
      setImage(file); // Set the selected image in state
      setError(''); // Clear any previous error messages
    } else {
      setImage(null); // Reset image state if file is too large
      setError('Error: Please select an image with size less than 500KB'); // Set error message
    }
  };

  // Function to upload image to Firebase
  const uploadImage = (file) => {



    if (!isAuthenticated) {
      return Promise.reject(new Error('User not authenticated'));
    }

    const metadata = {
      customMetadata: {
        isAuthenticated: 'true'
      }
    };

    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${file.name}`); // Reference to Firebase storage with file name
      const uploadTask = uploadBytesResumable(storageRef, file, metadata); // Start the upload task

      // Track the upload progress
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100; // Calculate upload progress percentage
          setUploadProgress(progress); // Update the progress in state
        },
        (error) => {
          console.error('Upload failed:', error); // Handle errors during the upload
          reject(error); // Reject the promise on error
        },
        () => {
          // Once the upload completes, get the download URL
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL); // Resolve the promise with the download URL
            })
            .catch(reject); // Handle any errors in getting the download URL
        }
      );
    });
  };

  // Handle form submission for adding the product
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear previous error messages
    setUploadProgress(0); // Reset upload progress

    
    if (!isAuthenticated) {
      setError('You must be logged in to add a product');
      return;
    }


    if (!image) {
      setError('Please select an image'); // Ensure an image is selected before submission
      return;
    }

    try {
      // Upload image to Firebase and get the URL
      const imageUrl = await uploadImage(image);

      // Prepare the product data to be submitted to the backend
      const productData = {
        ...formData,
        image: imageUrl, // Add the image URL to the product data
      };

      // Submit product data to the backend
      const uploadResponse = await axios.post('https://rama-bakery-k92f.vercel.app/api/auth/addproduct', productData);
      setUploadResponse(uploadResponse.data); // Handle the response after product is added

      // Reset the form after successful submission
      setFormData({
        id: '',
        category: '',
        name: '',
        price: '',
        weight: '',
      });

      setImage(null); // Clear the image state
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input field
      }
      setUploadProgress(0); // Reset upload progress

    } catch (error) {
      // Handle errors during submission
      setError(error.response?.data?.message || 'An error occurred while adding the product');
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input field on error
      }
      setImage(null); // Reset image state
      setUploadProgress(0); // Reset upload progress
    }
  };

  // Function to reset the upload response (e.g., for adding more products)
  function handleUploadResponse() {
    setUploadResponse(false);
  }

  return (
    <div className="productAdd">
      <form onSubmit={handleSubmit} className="productAdd-form">
        <div className="productAdd-form__group">
          <label htmlFor="id" className="productAdd-form__label">New Product ID : {lastProductId + 1}</label>
        </div>
        <div className="productAdd-form__group">
          <label htmlFor="category" className="productAdd-form__label">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="productAdd-form__input" required>
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              category !== 'All Products' ? <option key={index} value={category}>{category}</option> : '' // Display categories except 'All Products'
            ))}
          </select>
        </div>
        <div className="productAdd-form__group">
          <label htmlFor="name" className="productAdd-form__label">Name</label>
          <input type="text" id="name" name="name" value={capitalizeInput(formData.name)} onChange={handleChange} className="productAdd-form__input" required />
        </div>
        <div className="productAdd-form__group">
          <label htmlFor="price" className="productAdd-form__label">Price</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="productAdd-form__input" min="0" required />
        </div>
        <div className="productAdd-form__group">
          <label htmlFor="weight" className="productAdd-form__label">Weight</label>
          <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} className="productAdd-form__input" min="0" placeholder="Weight in Kg" required />
        </div>
        <div className="productAdd-form__group">
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="file-input" ref={fileInputRef} required />
        </div>
        {uploadProgress > 0 && <progress value={uploadProgress} max="100" className='upload__progress' />} {/* Show progress bar during image upload */}
        {error && <div className="productAdd-form__error">{error}</div>} {/* Display errors */}
        <div className="productAdd-form__group">
          <button type="submit" className="productAdd-form__submit">Add Product</button> {/* Submit button */}
          <Link to="/productlist" className="productAdd-form__submit productAdd-form__cancel">Cancel</Link> {/* Link to product list */}
        </div>
      </form>
    </div>
  );
};

export default ProductAdd; // Export the component
