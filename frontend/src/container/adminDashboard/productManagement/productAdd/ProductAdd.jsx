import {React, useState, useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { useProducts } from '../../../../data-context/DataContext';

import './ProductAdd.css';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../firebase'; 



const ProductAdd = ({handleProductAdd}) => {
  

  const [image, setImage] = useState(null);
  const [uploadResponse, setUploadResponse] = useState('')
  const [error, setError] = useState('');
  const [lastProductId, setLastProductId] = useState(0);
  const [categories, setCategories] = useState([]);
  const {setProducts} = useProducts(); // Get products from context


  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null); // Reference for file input


  const [formData, setFormData] = useState({
    id: 0,
    category: '',
    name: '',
    price: '',
    weight: '',
  });


  // Fetch lastProductID from MongoDB when the component mounts
  useEffect(() => {
  async function fetchData() {
    try {
      const productResponse = await axios.get('https://rama-bakery-k92f.vercel.app/api/products');

      const newLastProductId = productResponse.data.length;
        setLastProductId(newLastProductId);
        setFormData(prevData => ({ ...prevData, id: newLastProductId + 1 }));

      // Fetch categories
      const categoryResponse = await axios.get('https://rama-bakery-k92f.vercel.app/api/category');
      setCategories(categoryResponse.data);
      

    } catch (error) {
      console.error('Error fetching last product ID :', error);
    }
  }
  
  fetchData();
}, []);

function capitalizeInput(input) {
  return input.replace(/\b\w/g, char => char.toUpperCase());
}


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 500 * 1024) {
      setImage(file);
      setError('');
    } else {
      setImage(null);
      setError('Error: Please select image with size less than 500KB');
    }
  };

  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload failed:', error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch(reject);
        }
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploadProgress(0);

    if (!image) {
      setError('Please select an image');
      return;
    }

  try {
      // Upload image to Firebase
      const imageUrl = await uploadImage(image);

     // Prepare product data
      const productData = {
        ...formData,
        image: imageUrl,
      }

      const uploadResponse = await axios.post('http://localhost:5000/api/auth/addproduct',productData);
      setUploadResponse(uploadResponse.data);

      // Handle success (e.g., show success message, clear form)
      setFormData({
        id: '',
        category: '',
        name: '',
        price: '',
        weight: '',
      });

      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input if it exists
      }
      setUploadProgress(0);

      //Updated product list after adding product
      const updatedProducts = await axios.get('http://localhost:5000/api/products')
      setProducts(updatedProducts.data);


    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while adding the product');

      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input if it exists
      }

      setImage(null);
      setUploadProgress(0);
    }
  };

  function handleUploadResponse(){
    setUploadResponse(false);
  }

 

  return (
    <div className="productAdd">
      <form onSubmit={handleSubmit} className="productAdd-form">
        <div className="productAdd-form__group">
          <label htmlFor="id" className="productAdd-form__label">New Product ID : {lastProductId+1}</label>
          
        </div>
        <div className="productAdd-form__group">
          <label htmlFor="category" className="productAdd-form__label">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange} className="productAdd-form__input" required >
            <option value="">Select a category</option> {/* Default option */}
                {categories.map((category, index) => (
                                       category!=='All Products'?<option key={index} value={category}>{category}</option>:''

            ))}       
          </select>
        </div>
        <div className="productAdd-form__group">
          <label htmlFor="name" className="productAdd-form__label">Name</label>
          <input type="text" id="name" name="name" value={capitalizeInput(formData.name)} onChange={handleChange} className="productAdd-form__input" required />
        </div>
        <div className="productAdd-form__group">
          <label htmlFor="price" className="productAdd-form__label">Price</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} className="productAdd-form__input"  min="0" required />
        </div>
        <div className="productAdd-form__group">
          <label htmlFor="weight" className="productAdd-form__label">Weight</label>
          <input type="number" id="weight" name="weight" value={formData.weight} onChange={handleChange} className="productAdd-form__input" min="0"   placeholder="Weight in Kg" required />
        </div>
        <div className="productAdd-form__group">
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="file-input" ref={fileInputRef} required />
        </div>
        {uploadProgress > 0 && <progress value={uploadProgress} max="100" className='upload__progress'/>}
        {uploadResponse && 
          <div className='success-message' > 
            <p>Product successfully added</p>
            <div className='success-message-links'>
              <a href='#addProduct'onClick={handleUploadResponse}>Add more Products</a>
              <Link to='/admin' onClick={handleProductAdd}>Go to Dashboard</Link>
              </div>
          </div>}
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">Add Product</button>
      </form>
    </div>
  );
};

export default ProductAdd;