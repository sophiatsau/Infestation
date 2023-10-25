import React from 'react'
import { NavLink } from 'react-router-dom'

export default function FeaturesNav() {
  return (
        <div className="feature-nav-container">
        <NavLink className="feature-header" to='/events'>Events</NavLink>
        <NavLink className="feature-header" to='/groups'>Groups</NavLink>
    </div>
  )
}
