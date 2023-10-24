import React from 'react'
import { Link } from 'react-router-dom';

export default function EventCard({event}) {
  const {previewImage, startDate, name, Venue, description} = event;
  const dateTime = new Date(startDate);
  const location = Venue ? `${Venue.city}, ${Venue.state}` : null;

  return (
    <Link to={`/events/${event.id}`} >
        <img src={previewImage} alt="No preview image available"/>
        <div>
            <p>{`${dateTime.toLocaleDateString()} · ${dateTime.toLocaleTimeString()}`}</p>
            <h3>{name}</h3>
            <p>{location}</p>
        </div>
        <p>
            {description}
        </p>
    </Link>
  )
}
