import React from 'react'

import './OauthButton.css'

export default function OauthButton() {
  const BASE_URL = process.env.NODE_ENV !== "production" ?
    "http://localhost:8000" : "https://infestation.onrender.com"

  //clicking link --> redirect url
  return (
    <a className="oauth-button" href={`${BASE_URL}/api/session/oauth_login`}>
        {/* Google logo here */}
        <img src="https://crittr-images.s3.us-west-1.amazonaws.com/google-logo.png" className='oauth-button-icon' alt="google icon"/>
        Log In with Google Account
    </a>
  )
}
