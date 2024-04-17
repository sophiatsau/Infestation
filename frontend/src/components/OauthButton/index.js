import React from 'react'

import './OauthButton.css'

export default function OauthButton() {
  const BASE_URL = process.env.NODE_ENV !== "production" ?
    "http://localhost:5000" : "https://infestation.onrender.com"

  //clicking link --> redirect url
  return (
    <a className="oauth-link" href={`${BASE_URL}/api/session/oauth_login`}>
        <button>
            {/* Google logo here */}
            Log In with Google Account
        </button>
    </a>
  )
}
