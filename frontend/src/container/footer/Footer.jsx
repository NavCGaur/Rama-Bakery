import React from 'react'

import './Footer.css'

import { Link } from 'react-router-dom';


import GoogleMap from './GoogleMap'

import {ReactComponent as Phone} from '../../assets/phone-solid.svg'
import {ReactComponent as Email} from '../../assets/email.svg'
import {ReactComponent as Location} from '../../assets/location.svg'
import {ReactComponent as Instagram} from '../../assets/instagram.svg'
import {ReactComponent as Facebook} from '../../assets/facebook.svg'
import {ReactComponent as Whatsapp} from '../../assets/whatsapp.svg'



function Footer() {
  return (
    <div className='Footer'>
        <div className='footer__top'>

            <div className='footer__contact-group'>
                <h3>Contact</h3>
                <div className='footer__contact'>
                    <Email className='footer__contact-icon'/>
                    <Link to='mailto:naveencg070@gmail.com'><p contact__email-text>ramabakery@gmail.com</p></Link>
                </div>

                <div className='footer__contact'>
                    <Phone className='footer__contact-icon'/>
                    <Link to='tel:+919920899845'><p> +91 9920899845</p></Link>
                </div>

                <div className='footer__contact'>
                    <Location className='footer__contact-icon'/>
                    <div className='footer__contact-location'>
                        <p>54, High Street, Borivali East  </p>
                        <p>Mumbai - 401107  </p>
                    </div>

                </div>

            </div>
            <div className='footer__workTime'>
                <h3>Work Time</h3>
                <p>Our Work Timing are:</p>
                <p>Monday - Friday : 8 AM to 8 PM </p>
                <p>Saturday : 10 AM to 10 PM </p>
                <p>Sunday : Closed </p>
            </div>


            <div className='footer__social'>
                <div className='footer__social-icons'>
                    <Link to='https://www.facebook.com/' target='_blank'><Facebook className="footer__social-icons"/></Link>        
                </div>
                <div className='footer__social-icons'>
                    <Link to='https://www.instagram.com/' target='_blank'><Instagram className="footer__social-icons"/></Link>     
                </div>
                <div className='footer__social-icons'>
                    <Link to='https://wa.me/919920899845' target='_blank'><Whatsapp className="footer__social-icons"/></Link>        
                </div>

             </div>


        
            <div className='footer__map'>
                <GoogleMap />
            </div>
        
        </div>

        

        <div className='footer__bottom'>
            <p>2024 © All Rights Reserved. Designed and Developed by Naveen Gaur.</p>
        </div>



    </div>
  )
}

export default Footer