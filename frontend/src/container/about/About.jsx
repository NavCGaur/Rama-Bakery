import React from 'react';
import './About.css';
import image1 from '../../assets/about-image-1.jpg';
import image2 from '../../assets/about-image-2.jpg';
import image3 from '../../assets/about-image-3.jpg';
import image4 from '../../assets/about-image-4.png';

function About() {
  return (
    <div className='about' id='about'>
      <div className='about__leftSection'>
        <p>Made For You </p>
        <p>With Love</p>
        <p>Welcome to Rama Bakery, <br />
          where we turn your sweetest dreams
          into reality! <br /> <br />
          Established with a passion
          for baking and a love for creating delightful
          treats, we are a family-owned bakery
          committed to crafting the freshest and most delicious baked goods.
          <br /><br />At Rama Bakery, we believe that every bite should be a memorable experience.
          That’s why we use only the finest ingredients.
        </p>
      </div>
      <div className='about__rightSection'>
        <div className='about__images'>
          <img src={image1} alt="Delicious cake from Rama Bakery" />
          <img src={image2} alt="Variety of pastries available at Rama Bakery" />
        </div>
        <div className='about__images'>
          <img src={image3} alt="Cookies and biscuits from Rama Bakery" />
          <img src={image4} alt="Special occasion cake from Rama Bakery" />
        </div>
      </div>
    </div>
  );
}

export default About;
