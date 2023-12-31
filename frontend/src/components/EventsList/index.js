import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import EventCard from '../EventCard';
import { fetchAllEvents, consumeAllEvents, sortEvents } from '../../store/events';

import FeaturesNav from '../FeaturesNav';
import './EventsList.css';

export default function EventsList() {
    window.scroll(0,0);
    const dispatch = useDispatch();
    let events = useSelector(consumeAllEvents());
    const [upcomingEvents, pastEvents] = events ? sortEvents(events) : [[],[]]

    useEffect(() => {
      dispatch(fetchAllEvents());
    }, [dispatch])

  if (!events) return null;

  return (
    <>
    <FeaturesNav />
    <p className="feature-caption">Events in Infestation</p>
    <ul className="events-list">
        {upcomingEvents.map((event) => {
            return (
                <li key={event.id}>
                  <EventCard event={event}/>
                </li>
            )
        })}
        {pastEvents.map((event) => {
            return (
                <li key={event.id}>
                  <EventCard event={event}/>
                </li>
            )
        })}
    </ul>
    </>
  )
}
