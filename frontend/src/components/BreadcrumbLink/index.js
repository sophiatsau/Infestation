import React from 'react'
import {useParams, Link} from 'react-router-dom'


export default function BreadcrumbLink({text, to}) {
  return (
    <div className="breadcrumb-link">
        <i className="fa-solid fa-angle-left"></i>
        <Link to={to}>{text}</Link>
    </div>
  )
}
