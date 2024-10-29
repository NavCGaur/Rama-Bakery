import React, { useState } from 'react';
import { useCategories } from '../../../data-context/DataContext';
import { ReactComponent as AddIcon } from '../../../assets/addicon.svg';
import { ReactComponent as DeleteIcon } from '../../../assets/deleteicon.svg';
import { ReactComponent as CloseIcon } from '../../../assets/closeicon.svg';
import { ReactComponent as EditIcon } from '../../../assets/editicon.svg';

import './CategoryManagement.css';
import CategoryAdd from './categoryAdd/CategoryAdd';
import CategoryDelete from './categoryDelete/CategoryDelete';
import CategoryUpdate from './categoryUpdate/CategoryUpdate';

function CategoryManagement() {
  const { categories, setCategories, loading, error, updateCategories } = useCategories();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState({});
  const [categoriesAddModal, setCategoriesAddModal] = useState(false);
  const [editingCategories, setEditingCategories] = useState({});

  if (loading) {
    return <p>Loading Categories...</p>;
  }

  if (error) {
    return <p>Error fetching Categories: {error}</p>;
  }

  const handleCategoriesAdd = () => {
    setCategoriesAddModal(!categoriesAddModal);
  };

  const handleCheckboxChange = (index) => {
    setSelectedCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleDeleteClick = () => {
    const selectedCount = Object.values(selectedCategories).filter(Boolean).length;
    if (selectedCount === 0) {
      alert('No categories selected for deletion');
    } else {
      setShowDeleteConfirmation(true);
    }
  };

  const handleDeleteSuccess = (indices) => {
    const newCategories = categories.filter((_, index) => !indices.includes(index.toString()));
    setCategories(newCategories);
    setSelectedCategories({});
    setShowDeleteConfirmation(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const handleEditClick = () => {
    const selectedIndices = Object.keys(selectedCategories).filter(
      (index) => selectedCategories[index]
    );
    if (selectedIndices.length === 0) {
      alert('No Categories selected for editing');
    } else {
      const editingCategoriesObj = {};
      selectedIndices.forEach((index) => {
        editingCategoriesObj[index] = true;
      });
      setEditingCategories(editingCategoriesObj);
    }
  };

  const handleSave = async (index, newCategoryName) => {
    try {
      const newCategories = [...categories];
      newCategories[index] = newCategoryName;
      await updateCategories(newCategories);
      setCategories(newCategories);
      setEditingCategories((prev) => ({ ...prev, [index]: false }));
      setSelectedCategories((prev) => ({ ...prev, [index]: false }));
    } catch (error) {
      console.error('Error updating Category:', error);
      alert('Failed to update Category. Please try again.');
    }
  };

  const handleCancel = (index) => {
    setEditingCategories((prev) => ({ ...prev, [index]: false }));
    setSelectedCategories((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <div className="categoryManagement">
      <h2>Category List</h2>
      <div className="categoryManagement__addDelete">
        <div className="categoryManagement__add" onClick={handleCategoriesAdd}>
          <AddIcon className="categoryManagement__icon" />
          Add New Category
        </div>
        <div className="categoryManagement__delete" onClick={handleDeleteClick}>
          <DeleteIcon className="categoryManagement__icon" />
          Delete Selected Categories
        </div>
        <div className="categoryManagement__edit" onClick={handleEditClick}>
          <EditIcon className="categoryManagement__icon" />                   
          Edit Selected Categories
        </div>

        {categoriesAddModal && (
          <div className="categoryManagement__addModal">
            <CategoryAdd handleCategoriesAdd={handleCategoriesAdd} />
            <CloseIcon
              className="categoryManagement__addmodal-closeicon"
              onClick={handleCategoriesAdd}
            />
          </div>
        )}
      </div>

      <table className="categoryManagement__table">
        <thead>
          <tr className="categoryManagement__table-headrow">
            <th>Select</th>
            <th>ID</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody className='categoryManagement__table-body'>
          {categories.map((category, index) => (
            <CategoryUpdate
              key={index}
              id={index}
              category={category}
              isEditing={editingCategories[index]}
              onEdit={handleCheckboxChange}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          ))}
        </tbody>
      </table>

      {showDeleteConfirmation && (
        <CategoryDelete
          idsToDelete={Object.keys(selectedCategories).filter(
            (id) => selectedCategories[id]
          )}
          onDeleteSuccess={handleDeleteSuccess}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
}

export default CategoryManagement;