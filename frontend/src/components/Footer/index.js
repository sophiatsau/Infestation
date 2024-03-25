import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <div id="footer">
        <div className='footer-icon-links'>
            <a href="https://github.com/sophiatsau">
                <img className="footer-icon" src="https://crittr-images.s3.us-west-1.amazonaws.com/github.png" alt="github icon"/>
            </a>
            Sophia Tsau
            <a href="https://www.linkedin.com/in/sophiatsau/">
                <img className="footer-icon" src="https://crittr-images.s3.us-west-1.amazonaws.com/LinkedIn_icon_circle.svg.png" alt="linkedin icon"/>
            </a>
        </div>
        <div>© 2023 infestation, Inc. All Rights Reserved. Terms, Privacy & Accessibility</div>
    </div>
  )
}
