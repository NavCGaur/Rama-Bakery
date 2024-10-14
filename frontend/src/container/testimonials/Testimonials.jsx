import {useState, React} from 'react'
import './Testimonials.css'

import {ReactComponent as ArrowLeft} from '../assets/arrow-left.svg'
import {ReactComponent as ArrowRight} from '../assets/arrow-right.svg'
import {ReactComponent as Circle} from '../assets/circle.svg'
import {ReactComponent as CircleDot} from '../assets/circle-dot.svg'


import testimonialsData from './data';


function Testimonials() {

    const testimonials = testimonialsData;
    const length = testimonials.length ;


    const [testimonialIndex, SetTestimonialIndex] = useState(0);

    function nextTestimonialHandler(){

        testimonialIndex < (length-1)? SetTestimonialIndex(prevIndex=>prevIndex+1): SetTestimonialIndex(0);
        
    }

    function previousTestimonialHandler(){

        testimonialIndex === 0? SetTestimonialIndex(length-1) : SetTestimonialIndex(prevIndex=>prevIndex-1);

    }


  return (
    <div className='testimonials' id='testimonials'>

        <ArrowLeft className='testimonials__arrowLeft' onClick={previousTestimonialHandler}/>
        <ArrowRight className='testimonials__arrowRight' onClick={nextTestimonialHandler}/>

        
        <h1 className='testimonials__title'>Testimonials</h1>
        <div className='testimonials__cardWrapper'  >
            <div className='testimonials__cardInnerWrapper'style={{translate:`${-testimonialIndex*(100/length)}%`}}>
                {testimonials.map((testimonial, index) =>
                    <div className='testimonials__card' key={index} >

                        <img src={testimonial.image} className='testimonials__image' alt='testimonial' ></img>       

                        <div className='testimonials__text'>
                          

                            <p >{testimonial.review}</p>

                        </div>
                </div>)}
            </div>
        </div>    


        <div className='testimonials__circleWrapper'>
            {testimonials.map((_, index)=> index===testimonialIndex?  <CircleDot className = 'testimonials__circleDot' />
                                            : <Circle className = 'testimonials__circle' />

             )}
        </div>
    


       
    </div>
  )
}

export default Testimonials
