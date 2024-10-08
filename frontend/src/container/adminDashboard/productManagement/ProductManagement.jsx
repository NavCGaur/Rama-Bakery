import React, { useState } from 'react';
import { useProducts } from '../../../data-context/DataContext';
import { ReactComponent as AddIcon } from '../../../assets/addicon.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/deleteicon.svg';
import { ReactComponent as CloseIcon } from '../../../assets/closeicon.svg';
import { ReactComponent as EditIcon } from '../../../assets/editicon.svg';
import { ReactComponent as SortIcon } from '../../../assets/sorticon.svg';

import './ProductManagement.css';
import ProductAdd from './productAdd/ProductAdd';
import ProductDelete from './productDelete/ProductDelete';
import ProductUpdate from './productUpdate/ProductUpdate';

function ProductManagement() {
  const { products, setProducts, loading, error, updateProducts } = useProducts();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [productAddModal, setProductAddModal] = useState(false);
  const [editingProducts, setEditingProducts] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

  const [itemsPerPage, setItemsPerPage] = useState(10); // Default is 10 products per page
  const [visibleProducts, setVisibleProducts] = useState(itemsPerPage);

  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Handle dropdown category change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setVisibleProducts(itemsPerPage); // Reset pagination when a new category is selected
  };

  // Filter products based on the selected category
  const filteredProducts =
    selectedCategory === 'All Categories'
      ? products
      : products.filter(
          (product) =>
            product.category.toLowerCase() === selectedCategory.toLowerCase()
        );



  if (loading) {
    return <p>Loading Products...</p>;
  }

  if (error) {
    return <p>Error fetching Products: {error}</p>;
  }

  const handleProductAdd = () => {
    setProductAddModal(!productAddModal);
  };

  const handleCheckboxChange = (id) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleDeleteClick = () => {
    const selectedCount = Object.values(selectedProducts).filter(Boolean).length;
    if (selectedCount === 0) {
      alert('No products selected for deletion');
    } else {
      setShowDeleteConfirmation(true);
    }
  };

  const handleDeleteSuccess = (deletedIds) => {
    setProducts(products.filter((product) => !deletedIds.includes(product.id.toString())));
    setSelectedProducts({});
    setShowDeleteConfirmation(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleEditClick = () => {
    const selectedIds = Object.keys(selectedProducts).filter((id) => selectedProducts[id]);
    if (selectedIds.length === 0) {
      alert('No products selected for editing');
    } else {
      const editingProductsObj = {};
      selectedIds.forEach((id) => {
        editingProductsObj[id] = true;
      });
      setEditingProducts(editingProductsObj);
    }
  };

  const handleSave = async (updatedProduct) => {
    try {
      await updateProducts([updatedProduct]);
      setEditingProducts((prev) => ({ ...prev, [updatedProduct.id]: false }));
      setSelectedProducts((prev) => ({ ...prev, [updatedProduct.id]: false }));
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleCancel = (id) => {
    setEditingProducts((prev) => ({ ...prev, [id]: false }));
    setSelectedProducts((prev) => ({ ...prev, [id]: false }));
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting to the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  // Handle number of products to show per page input
  const handleItemsPerPageChange = (e) => {
    const numItems = parseInt(e.target.value, 10);
    setItemsPerPage(numItems > 0 ? numItems : 10); // Ensure positive values and fallback to default
    setVisibleProducts(numItems);
  };
  

  // Pagination handler for Load More button
  const handleLoadMore = () => {
    setVisibleProducts((prev) => prev + itemsPerPage); // Load more items
  };

  return (
    <div className="productManagement">
      <h2>Product List</h2>
      <div className="productManagement__addDelete">
        <div className="productManagement__add" onClick={handleProductAdd}>
          <AddIcon className="productManagement__icon" />
          Add New Product
        </div>
        <div className="productManagement__delete" onClick={handleDeleteClick}>
          <DeleteIcon className="productManagement__icon" />
          Delete Selected Products
        </div>
        <div className="productManagement__edit" onClick={handleEditClick}>
          <EditIcon className="productManagement__icon" />
          Edit Selected Products
        </div>

        {productAddModal && (
          <div className="productManagement__addModal">
            <ProductAdd handleProductAdd={handleProductAdd} />
            <CloseIcon className="productManagement__addmodal-closeicon" onClick={handleProductAdd} />
          </div>
        )}
      </div>

      {/* Category Filter Dropdown */}
      <div className="productManagement__filter">
        <label htmlFor="categoryFilter" className='productManagement__filter-label'>Filter by Category: </label>
        <select id="categoryFilter" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="All Categories">All Categories</option>
          <option value="Cakes">Cakes</option>
          <option value="Pastries">Pastries</option>
          <option value="Biscuits and Cookies">Biscuits and Cookies</option>
          <option value="Special Occasions">Special Occasions</option>
        </select>

        <label htmlFor="itemsPerPage" className='productManagement__itemsPerPageLabel'>Products per page: </label>
          <input
            type="number"
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            min="1"
            className="productManagement__itemsPerPageInput"
          />
      </div>

      <table className="productManagement__table">
        <thead>
          <tr className="productManagement__table-headrow .productManagement__table-headrow--editing">
            <th>Select</th>
            <th>
              ID
              <SortIcon className="productManagement__table-sorticon" onClick={() => handleSort('id')} />
            </th>
            <th>
              Category
              <SortIcon className="productManagement__table-sorticon" onClick={() => handleSort('category')} />
            </th>
            <th>
              Name
              <SortIcon className="productManagement__table-sorticon" onClick={() => handleSort('name')} />
            </th>
            <th>
              Price
              <SortIcon className="productManagement__table-sorticon" onClick={() => handleSort('price')} />
            </th>
            <th>
              Weight
              <SortIcon className="productManagement__table-sorticon" onClick={() => handleSort('weight')} />
            </th>
            <th>Date</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.slice(0, visibleProducts).map((product) => (
            <ProductUpdate
              key={product.id}
              product={{
                ...product,
                isSelected: !!selectedProducts[product.id],
              }}
              isEditing={editingProducts[product.id]}
              onEdit={handleCheckboxChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ))}
        </tbody>
      </table>

      {visibleProducts < sortedProducts.length && (
        <div className="productManagement__loadMore">
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      )}

      {showDeleteConfirmation && (
        <ProductDelete
          idsToDelete={Object.keys(selectedProducts).filter((id) => selectedProducts[id])}
          onDeleteSuccess={handleDeleteSuccess}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}

export default ProductManagement;
