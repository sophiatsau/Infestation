import React from 'react'
import EventCard from './EventCard';

export default function GroupEvents({numberEvents}) {
  const {image, startDate, startTime, title, location} = {};
  return (
    <>
    <h2>Events ({numberEvents || 0})</h2>
    <EventCard />
    </>
  )
}
