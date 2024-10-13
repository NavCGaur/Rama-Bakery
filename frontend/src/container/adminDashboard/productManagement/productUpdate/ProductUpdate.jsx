import React, { useState } from 'react';
import {useCategories} from '../../../../data-context/DataContext'
import './ProductUpdate.css'

function ProductUpdate({ product, isEditing, onEdit, onSave, onCancel }) {
  const {categories} = useCategories()
  const [editedProduct, setEditedProduct] = useState(product);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prev => ({ ...prev, [name]: value }));
  };

  if (!isEditing) {
    return (
      <tr className='productManagement__table-data'>
        <td >
          <input 
            className='ProductUpdate__checkbox'
            type="checkbox" 
            checked={product.isSelected} 
            onChange={() => onEdit(product.id)}
          />
        </td>
        <td>{product.id}</td>
        <td>{product.category}</td>
        <td>{product.name}</td>
        <td>Rs {product.price}</td>
        <td>{product.weight} kg</td>
        <td >{product.date}</td>
        <td><img className='ProductUpdate__image' src={product.image} alt={product.name} /></td>
      </tr>
    );
  }

  return (
    <tr className='productManagement__table-data productManagement__table-data--editing'>
      <td >
        <input className='ProductUpdate__checkbox' type="checkbox" checked={true} readOnly />
      </td>
      <td>{product.id}</td>
      <td>
          <select id="category" name="category" value={editedProduct.category} onChange={handleChange} className='ProductUpdate__table-data--editfield category' required >
                {categories.map((category, index) => (
                category!=='All Products'?<option className='category' key={index} value={category}>{category}
            </option>:''
            ))}
          </select>
      </td>
      <td>
        <input
          className='ProductUpdate__table-data--editfield'
          name="name"
          value={editedProduct.name}
          onChange={handleChange}
        />
      </td>
      <td>
        <input
          className='ProductUpdate__table-data--editfield'
          name="price"
          type="number"
          value={editedProduct.price}
          onChange={handleChange}
          min="0"
        />
      </td>
      <td>
        <input
          className='ProductUpdate__table-data--editfield'
          name="weight"
          type="number"
          value={editedProduct.weight}
          onChange={handleChange}
          min="0"

        />
      </td>
      <td>{product.date}</td>
      <td><img src={product.image} alt={product.name} /></td>
      <td className='ProductUpdate__table-data--buttons'>
        <button onClick={() => onSave(editedProduct)}>Save</button>
        <button onClick={() => onCancel(product.id)}>Cancel</button>
      </td>
    </tr>
  );
}

export default ProductUpdate;