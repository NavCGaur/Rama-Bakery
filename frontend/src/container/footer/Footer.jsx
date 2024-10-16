import React from 'react'

import {ReactComponent as Phone} from '../../assets/phone-solid.svg'
import {ReactComponent as Email} from '../../assets/email.svg'

function Footer() {
  return (
    <div className='Footer'>
        <div className='footer__top'>
            <div className='footer__contact'>
                <div className='contact__email'>
                    <Email className='contact__email-icon'/>
                    <p contact__email-text>ramabakery@gmail.com</p>
                </div>

                <div className='contact__phone'>
                    <Phone className='contact__phone-icon'/>
                    <p> +91 9920899845</p>
        </div>
            </div>
            <div className='footer__workTime'>

            </div>
            <div className='footer__location'>

            </div>
            <div className='footer__map'>

            </div>
        </div>

        <div className='footer__bottom'>
            <p>copyright</p>
        </div>
    
    Footer</div>
  )
}

export default Footer