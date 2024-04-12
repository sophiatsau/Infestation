import React from 'react'
import { Link } from 'react-router-dom';

import './EventCard.css'

export default function EventCard({event}) {
  const {previewImage, startDate, name, Group, description} = event;
  const dateTime = new Date(startDate);
  const location = Group ? `${Group.city}, ${Group.state}` : null;

  return (
    <div className="event-card">
    <Link to={`/events/${event.id}`} className="event-card-link">
      <img className="event-card-img" src={previewImage} alt="No preview available"/>
      <div className='event-card-text'>
          <p className="teal">{`${dateTime.toLocaleDateString()} · ${dateTime.toLocaleTimeString()}`}</p>
          <h3>{name}</h3>
          <p className="grey">{location}</p>
      </div>
      <p className='event-card-description'>
          {description}
      </p>
    </Link>
    </div>
  )
}
