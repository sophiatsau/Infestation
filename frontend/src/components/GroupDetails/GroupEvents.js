import React from 'react'

import EventCard from '../EventCard';

export default function GroupEvents({type, events}) {
  if (!events.length) return null;

  return (
    <div className='grey-bg'>
    <h2>{type} Events ({events.length})</h2>
    <ul style={{padding:0, margin:0}}>
      {events.map(event => {
        return (
          <EventCard event={event} key={event.id}/>
        )
      })}
    </ul>
    </div>
  )
}
