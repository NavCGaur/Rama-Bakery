import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../../../data-context/DataContext';

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from the URL
  const { products } = useProducts();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const selectedProduct = products.find(p => p.id === id);
    setProduct(selectedProduct);
  }, [id, products]);

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
      <p>Category: {product.category}</p>
    </div>
  );
};

export default ProductDetails;
