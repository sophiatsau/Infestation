import React from 'react'
import { Link } from 'react-router-dom';

import EventCard from './EventCard';

export default function GroupEvents({type, events}) {

  return (
    <>
    <h2>{type} Events ({events.length})</h2>
    <ul>
      {events.map(event => {
        return (
          <Link to={`/events/${event.id}`} key={event.id}>
            <EventCard event={event}/>
          </Link>
        )
      })}
    </ul>
    </>
  )
}
