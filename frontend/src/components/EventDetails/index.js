import React, { useEffect } from 'react'
import BreadcrumbLink from '../BreadcrumbLink';
import { useDispatch, useSelector } from 'react-redux';
import {useParams} from 'react-router-dom';

import { fetchEventById, consumeOneEvent } from '../../store/events';

export default function EventDetails() {
  const {eventId} = useParams();
  const dispatch = useDispatch();
  const event = useSelector(consumeOneEvent(eventId)) ?? {}

  useEffect(() => {
    (async() => {
      try {
        await dispatch(fetchEventById(eventId))
      } catch (e) {
        console.log("404 error")
      }
    })()
  }, [dispatch])

  return (
    <div>
        <BreadcrumbLink to='/events' text='Events'/>
        <div>
          <h1>{event.name}</h1>
          <p>Hosted by </p>
        </div>
        <div>
          image
          <div>
            group info box
            event info box
          </div>
        </div>
        <div>
          Event details
        </div>
    </div>
  )
}
