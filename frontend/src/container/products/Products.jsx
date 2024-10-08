import {React, useState, useEffect} from 'react';
import './Products.css';
import { useProducts, useCategory, useCategories } from '../../data-context/DataContext';


export default function Products() {
  
  const { products, loading, error } = useProducts(); // Get products from context
  const { category, setCategory } = useCategory(); // Get category and setter from context
  const { categories } = useCategories(); // Get categories from context

  const [visibleProductsCount, setVisibleProductsCount] = useState(6); // Initially show 6 products

  // Function to handle loading more products
  function loadMoreProducts() {
    setVisibleProductsCount(prevCount => prevCount + 6); // Load 6 more products when clicked
  }

  // Use useEffect to reset visibleProductsCount when category changes
  useEffect(() => {
    setVisibleProductsCount(6); // Reset visible products count when category changes
  }, [category]);


  function handleVisibleProducts(selectedCategory) {
    setCategory(selectedCategory); // Update product category when clicked
    setVisibleProductsCount(6); // Reset visible products count when category changes

  }

  if (loading) {
    return <p>Loading Products...</p>; // Show loading state
  }

  if (error) {
    return <p>Error fetching Products: {error}</p>; // Show error message
  }

  const filteredProducts = products.filter(item => !category || category === 'All Products' || item.category === category
  );

  const visibleProducts = filteredProducts.slice(0, visibleProductsCount); // Show only a limited number of products



  return (
    <div className='products' id='products'>
      <div className='products__topSection'>
        <p>{category}</p>
      </div>
      <div className='products__bottomSection'>
        <div className='products__bottomSection-left'>
          <h2>Categories</h2>{categories && categories.map((cat) => (
            <h3
              key={cat}
              className={cat === category ? 'products__category highlight' : 'products__category'}
              onClick={() => handleVisibleProducts(cat)}
            >
              {cat}
            </h3>
          ))} 
        </div>

        <div className='products__bottomSection-right'>
          {visibleProducts.map((productItem, index) => (
              <div className='products__bottomSection-grid' key={index}>
                <img loading="lazy" src={productItem.image} alt={productItem.name} />
                <p>{productItem.name}</p>
                <p>Rs {productItem.price}/- &nbsp; {productItem.weight} pound</p>
              </div>
            ))} 

            {visibleProductsCount < filteredProducts.length && (
            <div className='products__bottomSection-loadMore'>
              <button onClick={loadMoreProducts}>Load More</button>
            </div>
            )}
        </div>


      </div>
    </div>
  );
}
