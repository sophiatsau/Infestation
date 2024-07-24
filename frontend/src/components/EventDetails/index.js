import React, { useEffect, useState } from 'react'
import BreadcrumbLink from '../BreadcrumbLink';
import { useDispatch, useSelector } from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';

import { fetchEventById, consumeOneEvent } from '../../store/events';
import { consumeOneGroup, fetchGroupById } from '../../store/groups';
import { thunkGetAttendees } from '../../store/attendees';

import GroupInfoBox from './GroupInfoBox'
import EventInfoBox from './EventInfoBox'
import RequestAttendanceButton from './RequestAttendanceButton';
import ViewAttendeesButton from './ViewAttendeesButton';

import './EventDetails.css'

export default function EventDetails() {
  window.scroll(0,0);
  const {eventId} = useParams();
  const dispatch = useDispatch();
  const history = useHistory()

  const event = useSelector(consumeOneEvent()) ?? {};
  const {name, groupId, EventImages, description} = event;
  const group = useSelector(consumeOneGroup());
  const currentUser = useSelector(state => state.session.user)
  const organizer = groupId && group.id === groupId ? `${group.Organizer.firstName} ${group.Organizer.lastName}` : ''
  const previewImage = EventImages && EventImages.find(image => image.preview);
  const [isOrganizer, setIsOrganizer] = useState(!!group?.Organizer)
  // const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function getGroup() {
        return await dispatch(fetchGroupById(groupId))
            .catch(async (res) => {
                const data = await res.json();
                history.push('/not-found')
                if (process.env.NODE_ENV !== "production") console.log("fetch group error: ", data)
            })
    }
    if (groupId) getGroup()

  }, [dispatch, groupId, history])

  useEffect(() => {
    (async() => {
      try {
        await dispatch(fetchEventById(eventId))
        await dispatch(thunkGetAttendees(eventId))
      } catch (e) {
        history.push('/not-found')
      }
    })()
  }, [dispatch, eventId, history])

  useEffect(() => {
    if (currentUser && group.Organizer && parseInt(group.Organizer.id)===parseInt(currentUser.id)) {
      setIsOrganizer(true);
    } else setIsOrganizer(false);
  }, [currentUser, group])

  if (event.id !== parseInt(eventId) || group.id !== parseInt(groupId)) return <>Loading...</>

  return (
    <div>
        <BreadcrumbLink to='/events' text='Events'/>
        <div className="event-details-header">
          <h2 style={{marginBottom: 0}}>{name}</h2>
          <p className="grey">Hosted by {organizer ?? null}</p>
        </div>
        <div className='grey-background'>
          <div className="event-details-top-section">
            <img src={previewImage?.url} alt="Preview not available" className='event-details-cover-img'/>
            <GroupInfoBox group={group}/>
            <EventInfoBox event={event} isOrganizer={isOrganizer}/>
          </div>
          <div>
            <h2>Description</h2>
            <p>{description}</p>
          </div>
          {currentUser &&
          <>
          <RequestAttendanceButton />
          </>}
          <ViewAttendeesButton />
        </div>
    </div>
  )
}
