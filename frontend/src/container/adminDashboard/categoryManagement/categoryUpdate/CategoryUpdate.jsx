import React, { useState } from 'react';
import './CategoryUpdate.css'

function CategoryUpdate({ id, category, isEditing, onEdit, onSave, onCancel }) {
    const [editedName, setEditedName] = useState(category);


  const handleChange = (e) => {
    setEditedName(e.target.value);

  };

  if (!isEditing) {
    return (

      <tr className='categoryManagement__table-data'>
                
        <td >
          <input 
            className='categoryUpdate__checkbox'
            type="checkbox" 
            checked={category.isSelected} 
            onChange={() => onEdit(id)}
          />
        </td>
        <td>{id+1}</td>
        <td>{category}</td>
      </tr>
    );
  }

  return (
    <tr className='categoryManagement__table-data '>
      <td >
        <input 
            className='categoryUpdate__checkbox' 
            type="checkbox" 
            checked={true} 
            readOnly />
      </td>
      <td>{id+1}</td>
      <td>{category}</td>

      <td>
        <input
          className='categoryUpdate__table-data--editfield'
          type='text'
          name="name"
          placeholder="Enter New Category Name"
          value={editedName}
          onChange={handleChange}
        />
      </td>
      
      
      <td className='categoryUpdate__table-data--buttons'>
        <button onClick={() => onSave(id, editedName)}>Save</button>
        <button onClick={() => onCancel(id)}>Cancel</button>
      </td>
    </tr>
  );
}

export default CategoryUpdate;