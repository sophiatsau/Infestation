import React, { useEffect } from 'react'
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
  const event = useSelector(consumeOneEvent(eventId)) ?? {}
  const {name, groupId, EventImages, description} = event;
  const group = useSelector(consumeOneGroup(groupId)) ?? {};
  const organizer = `${group.Organizer?.firstName} ${group.Organizer?.lastName}`
  const previewImage = EventImages && EventImages.find(image => image.preview);

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

  }, [dispatch, groupId])

  useEffect(() => {
    (async() => {
      try {
        await dispatch(fetchEventById(eventId))
      } catch (e) {
        history.push('/not-found')
      }
    })()
  }, [dispatch])

  if (!group || !event) return null;

  return (
    <div>
        <BreadcrumbLink to='/events' text='Events'/>
        <div>
          <h1>{name}</h1>
          <p>Hosted by {organizer}</p>
        </div>
        <div className="event-details-top-section">
          <img src={previewImage?.url} alt="Preview not available"/>
          <div>
            <GroupInfoBox group={group}/>
            <EventInfoBox event={event}/>
          </div>
        </div>
        <div>
          <h2>Description</h2>
          <p>{description}</p>
        </div>
    </div>
  )
}
