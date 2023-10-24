import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';

import EventCard from './EventCard';
import { fetchEventsByGroup } from '../../store/groups';
import { useDispatch, useSelector } from 'react-redux';

export default function GroupEvents({numberEvents}) {
  const {groupId} = useParams();
  const dispatch = useDispatch();

  let events = useSelector((state) => Object.values(state.groups.events))

  events = events.sort((a,b) => {
    const x = new Date(a.startDate).getTime()
    const y = new Date(b.startDate).getTime()
    return x > y ? 1 : -1;
  })

  useEffect(() => {
    (async () => {
      await dispatch(fetchEventsByGroup(groupId));
    })()
  }, [dispatch])

  return (
    <>
    <h2>Events ({numberEvents || 0})</h2>
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
