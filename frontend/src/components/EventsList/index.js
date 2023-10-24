import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import EventCard from '../EventCard';
import { fetchAllEvents, consumeAllEvents, sortEvents } from '../../store/events';

import FeaturesNav from '../FeaturesNav';

export default function EventsList() {
    const dispatch = useDispatch();
    let events = useSelector(consumeAllEvents()) || [];
    const [upcomingEvents, pastEvents] = events ? sortEvents(events) : [[],[]]

    useEffect(() => {
        const getEvents = async () => {
            events = await dispatch(fetchAllEvents());
        };
        getEvents();
    }, [dispatch])

  return (
    <>
    <FeaturesNav />
    <p className="feature-caption">Events in Infestation</p>
    <ul className="">
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
