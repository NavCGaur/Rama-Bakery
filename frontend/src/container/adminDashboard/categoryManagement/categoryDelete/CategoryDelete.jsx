import React from 'react';
import axios from 'axios';

function CategoryDelete({ idsToDelete, onDeleteSuccess, onCancel }) {
  const handleConfirm = async () => {
    try {
      await axios.delete('https://rama-bakery-k92f.vercel.app/api/auth/categories', { 
        data: { ids: idsToDelete } 
      });
      alert("Categories deleted successfully");
      onDeleteSuccess(idsToDelete);
    } catch (error) {
      console.error("Error deleting categories:", error);
      alert("Failed to delete categories");
    }
  };

  return (
    <div className="delete-confirmation-modal">
      <div className="delete-confirmation-content">
        <h3>Confirm Deletion</h3>
        <p>Are you sure you want to delete {idsToDelete.length} selected categories?</p>
        <div className="delete-confirmation-buttons">
          <button onClick={handleConfirm}>Yes, Delete</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default CategoryDelete;