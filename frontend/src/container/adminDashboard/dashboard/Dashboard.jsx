import {React} from 'react'
import { useProducts, useCategories } from '../../../data-context/DataContext';




import './Dashboard.css'

function Dashboard() {


  const { products, loading, error } = useProducts(); // Get products from context
  const { categories } = useCategories(); // Get categories from context

  if (loading) {
    return <p>Loading Products...</p>; // Show loading state
  }

  if (error) {
    return <p>Error fetching Products: {error}</p>; // Show error message
  }

  return (
    <div className='dashboard' id='dashboard'>
        <h1>Dashboard</h1>
        <div className='dashboard__wrapper'>
        <div className='dashboard__totalProducts'>
            <p>Number of Products</p>{products.length}
        </div>
        <div className='dashboard__totalCatagories'>
            <p>Number of Categaries</p>{categories.length}
        </div>
        </div>
        


    </div>
  )
}

export default Dashboard