import React from 'react'

import EventCard from '../EventCard';

export default function GroupEvents({type, events}) {
  if (!events.length) return null;

  return (
    <>
    <h2>{type} Events ({events.length})</h2>
    <ul>
      {events.map(event => {
        return (
          <EventCard event={event} key={event.id}/>
        )
      })}
    </ul>
    </>
  )
}
