import React, { useEffect, useState } from 'react'
import BreadcrumbLink from '../BreadcrumbLink';
import { useDispatch, useSelector } from 'react-redux';
import {useParams, useHistory} from 'react-router-dom';

import { fetchEventById, consumeOneEvent } from '../../store/events';
import { consumeOneGroup, fetchGroupById } from '../../store/groups';

import GroupInfoBox from './GroupInfoBox'
import EventInfoBox from './EventInfoBox'

import './EventDetails.css'

export default function EventDetails() {
  const {eventId} = useParams();
  const dispatch = useDispatch();
  const history = useHistory()

  const event = useSelector(consumeOneEvent(eventId)) ?? {};
  const {name, groupId, EventImages, description} = event;
  const group = useSelector(consumeOneGroup(groupId));
  const currentUser = useSelector(state => state.session.user)
  const organizer = `${group?.Organizer?.firstName} ${group?.Organizer?.lastName}`
  const previewImage = EventImages && EventImages.find(image => image.preview);
  const [isOrganizer, setIsOrganizer] = useState(!!group?.Organizer)

  useEffect(() => {
    if (currentUser && parseInt(group?.Organizer?.id)===parseInt(currentUser.id)) {
      setIsOrganizer(true);
    } else setIsOrganizer(false);
  }, [currentUser, group])

  useEffect(() => {
    async function getGroup() {
        return await dispatch(fetchGroupById(groupId))
            .catch(async (res) => {
                const data = await res.json();
                console.log(data.title, '-', data.message)
                history.push('/not-found')
            })
    }
    if (groupId) getGroup()

  }, [dispatch, groupId, history])

  useEffect(() => {
    (async() => {
      try {
        await dispatch(fetchEventById(eventId))
      } catch (e) {
        history.push('/not-found')
      }
    })()
  }, [dispatch, eventId, history])

  if (!group || !event) return null;

  return (
    <div>
        <BreadcrumbLink to='/events' text='Events'/>
        <div className="event-details-header">
          <h2 style={{marginBottom: 0}}>{name}</h2>
          <p className="grey">Hosted by {organizer ?? null}</p>
        </div>
        <div className='grey-background'>
          <div className="event-details-top-section">
            <img src={previewImage?.url} alt="Preview not available"/>
            <GroupInfoBox group={group}/>
            <EventInfoBox event={event} isOrganizer={isOrganizer}/>
          </div>
          <div>
            <h2>Description</h2>
            <p>{description}</p>
          </div>
        </div>
    </div>
  )
}
