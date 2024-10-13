import React, { useState } from 'react';
import { useCategory } from '../../data-context/DataContext';

// Style import
import './DropDown.css';

function DropDown({ dropDownData, title, loading }) {
  const { setCategory } = useCategory();
  const [mouseOver, setMouseOver] = useState(false);

  function handleMouseEnter() {
    setMouseOver(true);
  }

  function handleMouseOut() {
    setMouseOver(false);
  }

  return (
    <div
      className='dropdown-container'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseOut}
    >
      <p className='header__products' tabIndex={0}>
        {title}
      </p>

      {/* Show loading state or render dropdown items */}
      <div
        className={mouseOver ? 'dropdown__visible' : 'dropdown__hidden'}
        onClick={handleMouseOut}
      >
        {loading ? (
          <p>Loading...</p> // Show loading message
        ) : (
          dropDownData.map((listItem, index) => (
            <li key={index}>
              <a href='#products' onClick={() => setCategory(listItem)}>
                {listItem}
              </a>
            </li>
          ))
        )}
      </div>
    </div>
  );
}

export default DropDown;
