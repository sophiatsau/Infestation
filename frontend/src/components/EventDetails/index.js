import React from 'react'
import BreadcrumbLink from '../BreadcrumbLink';
import { useDispatch, useSelector } from 'react-redux';
import {useParams} from 'react-router-dom';

export default function EventDetails() {
  const {eventId} = useParams();
  const dispatch = useDispatch();
  const event = useSelector(console.log) ?? {}

  return (
    <div>
        <BreadcrumbLink to='/events' text='Events'/>
        event name
        event host
        image
        event info box
        group info box
    </div>
  )
}
